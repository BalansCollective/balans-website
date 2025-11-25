# Red Forge Context Loading Modes - Design Session

**Date:** 2025-11-24  
**Participants:** Sam (Product), Alex (Security), Jordan (UX), Morgan (AI/ML)  
**Topic:** How should Red Forge handle AI file access for different classification levels?

---

## Context

**Sam:** "Vi har ett problem. Om AI:n måste fråga om tillåtelse för VARJE fil den läser, blir det som att jobba med handbromsen på. Men om den läser allt automatiskt, har vi ett säkerhetsproblem. Hur hittar vi balansen?"

**Alex (Security):** "Det här är kritiskt. Vi kan inte ha implicit access till klassificerad data. Audit trail måste visa exakt vad AI:n läst och varför."

**Jordan (UX):** "Fast om jag jobbar med öppen källkod 80% av tiden och måste klicka 'Ja' för varje README.md, kommer jag använda vanlig Cursor istället."

**Morgan (AI/ML):** "Plus att context management är dyrt. En 50KB fil = ~12,000 tokens = $0.15 per request. Vi vill inte auto-load allt."

---

## Problem Statement

**Hur gör vi Red Forge användbart för dagligt arbete utan att kompromissa säkerhet?**

### Constraints:
1. **Security:** Klassificerad data kräver explicit consent
2. **UX:** Öppen kod måste kännas som Cursor (friktionsfritt)
3. **Cost:** Stora filer kostar pengar, auto-load allt är ohållbart
4. **Audit:** FMV/SAAB kräver logg över all klassificerad data access
5. **Trust:** Användaren måste veta vad AI:n har tillgång till

---

## Proposal 1: "Clearance-Based Auto-Load"

**Morgan:** "Vad om vi matchar användarens clearance? Om Sam har K-clearance, auto-load allt upp till K, blockera H och KH helt."

```
User clearance: KONFIDENTIELL (K)

Auto-load rules:
✅ ES (Ej sekretess) → implicit access
✅ BH (Begränsat hemlig) → implicit access  
⚠️  K (Konfidentiell) → fråga först
❌ H (Hemlig) → redacted, syns ej
❌ KH (Kvalificerat hemlig) → redacted, syns ej
```

**Alex:** "Nej, vänta. Om Sam har K-clearance betyder inte det att AI:n får läsa allt på K-nivå automatiskt. Vi måste skilja på *human access* och *AI access*. Sam kanske har clearance, men det betyder inte att varje AI-request är godkänd."

**Jordan:** "Fast då är vi tillbaka på att klicka 'Ja' hundra gånger per dag. Ingen kommer använda det."

---

## Proposal 2: "Mode-Based Loading"

**Sam:** "Vad om vi har olika modes? När jag jobbar med öppen källkod vill jag 'Unrestricted Mode' där ES auto-loads. När jag jobbar med klassificerat byter jag till 'Strict Mode' där allt kräver godkännande."

### Mode 1: Unrestricted (Default för ES-arbete)
```
✅ ES → auto-load (implicit)
❌ BH/K/H/KH → explicit request varje gång
```

**Jordan:** "Det här känns bra! 80% av min tid är öppen kod, då vill jag ingen friktion."

### Mode 2: Strict (När du jobbar med klassificerat)
```
⚠️  ES → auto-load men audit trail
❌ BH/K/H → explicit request varje gång
```

**Alex:** "Jag gillar det här. Audit trail fångar fortfarande allt, men användaren kan välja UX baserat på vad de jobbar med."

### Mode 3: Paranoid (För KH eller extremt känsligt)
```
❌ ALLA filer → explicit request varje gång
❌ KH → inte ens AI-access, endast manuell copy-paste
```

**Morgan:** "Mode 3 känns overkill för 99% av användare, men FMV kommer kräva det för KH. Bra att ha som option."

---

## Proposal 3: "Smart Default + Override"

**Jordan:** "Vad om vi gör mode-bytet automatiskt baserat på vilken fil som är öppen?"

```
User öppnar: README.md (ES)
→ Red Forge: Unrestricted Mode aktiverad automatiskt
→ AI kan läsa alla ES-filer implicit

User öppnar: sensor-calibration.md (K)
→ Red Forge: "⚠️  Du öppnade en KONFIDENTIELL fil. Byter till Strict Mode."
→ AI måste fråga innan den läser K-filer
```

**Sam:** "Det här är smart! Automatic mode switching baserat på kontext."

**Alex:** "Men vad händer om jag växlar mellan ES och K filer snabbt? Blir det inte jobbigt att modes byter hela tiden?"

**Jordan:** "Bra poäng. Vi behöver hysteresis - om du öppnat en K-fil, stanna i Strict Mode tills du explicit säger 'Jag är klar med klassificerat arbete nu'."

**Morgan:** "Eller en timer? 'Strict Mode active i 30 min sedan auto-return till Unrestricted om ingen K-fil öppnats på ett tag.'"

**Alex:** "Nej, för känsligt. Explicit mode-switch är säkrare. Ingen auto-downgrade från Strict till Unrestricted."

---

## Deep Dive: What Happens When AI Requests File Access?

**Sam:** "Låt oss gå igenom ett exempel. Jag är i Strict Mode, jobbar med en K-fil, och AI:n vill läsa en annan K-fil."

### Scenario 1: AI ber om access till fil på samma nivå
```
User: "Compare this implementation with v2-implementation.md"
Context: Current file is v3-implementation.md (K)
         Requested file is v2-implementation.md (K)

AI: "⚠️  Jag behöver läsa v2-implementation.md (KONFIDENTIELL)
     
     Fil: v2-implementation.md
     Klassificering: KONFIDENTIELL (K)
     Din clearance: KONFIDENTIELL (K) ✅
     AI service: Red Forge SaaS (max K) ✅
     Storlek: 15KB (~3,750 tokens, $0.05)
     
     [Läs fil] [Visa preview först] [Avbryt]"
```

**Jordan:** "Den här dialogen är bra. Transparent, visar cost, ger preview option."

**Alex:** "Och audit trail loggar user decision?"

**Morgan:** "Ja, loggar allt:
- Timestamp
- User ID  
- AI request reason ('Compare implementations')
- File classification
- User decision (approved/denied)
- If approved, log token count and cost"

### Scenario 2: AI ber om access till högre klassificering
```
User: "Compare with classified-specs.md"
Context: Current file is v3-implementation.md (K)
         Requested file is classified-specs.md (H - HEMLIG)

AI: "❌ Jag kan inte läsa classified-specs.md
     
     Fil: classified-specs.md
     Klassificering: HEMLIG (H)
     Din clearance: KONFIDENTIELL (K) ❌
     
     Du har inte tillgång till denna fil.
     Filen är redacted i file tree."
```

**Alex:** "Perfekt. Hard block om clearance inte matchar."

### Scenario 3: AI ber om access till lägre klassificering i Unrestricted Mode
```
User: "Read README.md"
Context: Unrestricted Mode
         Requested file is README.md (ES)

AI: [Läser fil direkt, ingen prompt]
     "README.md contents: ..."
     
Audit Trail (background):
- Auto-loaded README.md (ES)
- Mode: Unrestricted
- No user prompt (implicit consent)
```

**Jordan:** "Smooth! Ingen friktion för öppen kod."

**Alex:** "Men audit trail fångar fortfarande access. Bra."

---

## Decision: Cost Control

**Morgan:** "Vi måste prata om cost. Om någon har 500 ES-filer i sitt projekt och säger 'Summarize all documentation', vad händer?"

**Sam:** "Bra poäng. Vi kan inte auto-load 500 filer."

### Proposal: Token Budget per Mode

**Mode 1 (Unrestricted):**
```
Auto-load budget: 50,000 tokens (~$0.60 per request)
- Om AI vill läsa fler filer, fråga användaren
- "⚠️  Denna operation kommer läsa 15 filer (120KB, ~$1.80). Fortsätt?"
```

**Mode 2 (Strict):**
```
Auto-load budget: 0 tokens (allt är explicit)
- Visa kostnad för varje fil innan load
- User godkänner varje fil individuellt
```

**Alex:** "Token budget är smart. Förhindrar cost explosion utan att vara överdrivet restriktivt."

**Jordan:** "Och användaren ser alltid cost innan stora operationer. Transparent."

---

## Decision: File Preview Option

**Jordan:** "Kan vi lägga till en 'Preview' option innan AI läser filen? Ibland vill jag se första 50 raderna först."

```
AI: "Jag behöver läsa sensor-calibration.md (K)
     
     [Läs hel fil (15KB, $0.05)] 
     [Visa preview (5KB, $0.01)] 
     [Avbryt]"

User: [Visa preview]

AI: "Preview av sensor-calibration.md (första 50 rader):
     ---
     classification: KONFIDENTIELL_SE
     ---
     # Sensor Calibration Protocol
     ...
     
     Vill du att jag läser hela filen?"
```

**Morgan:** "Preview är gratis (eller billig) och låter användaren verifiera att det är rätt fil."

**Alex:** "Och preview räknas som 'partial access' i audit trail."

**Sam:** "Perfekt. Ger kontroll utan att vara jobbigt."

---

## Decision: Redaction for Higher Classifications

**Sam:** "Vad händer med H-filer om jag bara har K-clearance? Ska de synas i file tree?"

**Alex:** "Två options:

### Option A: Completely Hidden
```
File Tree (för K-clearance user):
├── README.md (ES)
├── v2-implementation.md (K)
├── v3-implementation.md (K)
└── [3 filer ej tillgängliga]
```

**Alex:** "Minimerar info leakage. Du vet att H-filer existerar men inte vilka."

### Option B: Visible but Redacted
```
File Tree (för K-clearance user):
├── README.md (ES)
├── v2-implementation.md (K)
├── v3-implementation.md (K)
├── 🔒 classified-specs.md (H) [Kräver högre clearance]
├── 🔒 tactical-guide.md (H) [Kräver högre clearance]
```

**Jordan:** "Option B är mer transparent. Du vet vilka filer du inte har access till."

**Sam:** "Men om filnamnet självt är klassificerat?"

**Alex:** "Då måste vi redacta namnet också:
```
├── 🔒 [REDACTED].md (H) [Kräver högre clearance]
```

**Morgan:** "Det blir komplicerat. Hur vet systemet om filnamnet är känsligt?"

**Sam:** "Vi kan ha en meta-field i frontmatter:
```yaml
---
classification: HEMLIG_SE
filename_classification: HEMLIG_SE  # Filnamnet självt är känsligt
---
```

**Alex:** "Bra. Default är att filnamn är publik metadata, men kan overridas."

**Jordan:** "Jag röstar för Option B med redacted filenames när nödvändigt. Mer transparent."

---

## Decision: Mode Switching UX

**Sam:** "Hur byter användaren mode? Dropdown? Shortcut?"

### UI Mock:
```
┌─────────────────────────────────────────────────┐
│ Red Forge                                       │
├─────────────────────────────────────────────────┤
│ 🔓 Context Mode: Unrestricted (ES only)    [▼] │ <- Dropdown
└─────────────────────────────────────────────────┘

Dropdown options:
- 🔓 Unrestricted (ES auto-load, allt annat explicit)
- ⚠️  Strict (Allt explicit utom audit-loggad ES)
- 🔒 Paranoid (Allt explicit, inklusive ES)
```

**Jordan:** "Enkelt. Synligt. Keyboard shortcut: `Cmd+Shift+M` för Mode."

**Sam:** "Och AI kan föreslå mode-switch:
```
AI: "⚠️  Du försöker diskutera en KONFIDENTIELL fil men är i Unrestricted Mode.
     
     Vill du byta till Strict Mode? [Ja] [Nej, fortsätt ändå]"
```

**Alex:** "AI-suggested mode switch är smart. Proaktiv security."

---

## Decision: Audit Trail Detail Level

**Morgan:** "Hur detaljerad ska audit trail vara?"

### Minimal Logging (ES/Unrestricted):
```json
{
  "timestamp": "2025-11-24T20:45:12Z",
  "user_id": "samuel@dynorobotics.se",
  "mode": "unrestricted",
  "operation": "auto_load",
  "file": "README.md",
  "classification": "EJ_SEKRETESS",
  "tokens": 2500,
  "cost_usd": 0.03
}
```

### Detailed Logging (K/H/Strict):
```json
{
  "timestamp": "2025-11-24T20:47:33Z",
  "user_id": "samuel@dynorobotics.se",
  "mode": "strict",
  "operation": "explicit_load",
  "file": "sensor-calibration.md",
  "classification": "KONFIDENTIELL_SE",
  "user_decision": "approved",
  "ai_request_reason": "User asked to fix calibration bug",
  "tokens": 3750,
  "cost_usd": 0.05,
  "ai_service": "red_forge_saas",
  "ai_max_clearance": "KONFIDENTIELL_SE",
  "preview_used": false
}
```

**Alex:** "Detailed logging för allt klassificerat. GDPR-compliant eftersom det är audit, inte content."

**Sam:** "Och export till JSON för FMV compliance."

---

## Final Decisions

### 1. **Three Context Modes**
- **Unrestricted:** ES auto-load, allt annat explicit (default för öppen kod-arbete)
- **Strict:** ES audit-loggad auto-load, allt klassificerat explicit (default för klassificerat arbete)
- **Paranoid:** Allt explicit, inklusive ES (för KH eller extremt känsligt)

### 2. **Mode Switching**
- Manual via dropdown/shortcut (Cmd+Shift+M)
- AI kan föreslå mode-switch proaktivt
- **No auto-downgrade** från Strict → Unrestricted (måste vara explicit)

### 3. **File Access Flow (Strict Mode)**
```
AI requests file → 
  Check user clearance → 
    If insufficient → Hard block
    If sufficient → Prompt user with:
      - File name & classification
      - Cost estimate (tokens + USD)
      - Options: [Read full] [Preview] [Cancel]
    
User approves → 
  Log to audit trail →
    Load file into context →
      AI processes
```

### 4. **Cost Control**
- Token budget per mode (50K for Unrestricted, unlimited but explicit for Strict)
- Show cost estimate before loading large files
- Preview option for verifying correct file (cheap/free)

### 5. **Redaction**
- Files above user clearance: Hidden in file tree by default
- Option to show as `🔒 [REDACTED].md (H)` if transparency preferred
- Filenames can be classified via `filename_classification` frontmatter field

### 6. **Audit Trail**
- Minimal logging for ES in Unrestricted Mode (timestamp, file, tokens, cost)
- Detailed logging for all classified access (user decision, AI reason, preview usage, etc.)
- Export to JSON for FMV/SAAB compliance

---

## Open Questions

**Jordan:** "Vad händer när AI:n redan har en K-fil i context och användaren byter från Red Forge SaaS (K) till Claude (ES)? Måste vi clear context?"

**Alex:** "Ja! Om AI-service downgrade sker, måste vi clear allt som överstiger den nya AI:ns clearance. Annot har vi data leakage."

**Sam:** "Så samma context downgrade rewind/clear som vi diskuterade tidigare. Det hänger ihop."

**Morgan:** "Och vi måste varna användaren:
```
⚠️  Switching to Claude (ES only) will clear all KONFIDENTIELL content from context.
    
    Files that will be removed:
    - v3-implementation.md (K)
    - sensor-calibration.md (K)
    
    [Clear & Switch] [Cancel]
```

**Alex:** "Exakt. Transparent och säker."

---

## Implementation Priority

**Sam:** "Vad bygger vi först för SAAB-demon vs din egen MVP?"

### SAAB Demo (Minimal):
1. ✅ Strict Mode only (inga modes, bara explicit access)
2. ✅ Show cost estimate before load
3. ✅ Audit trail med export JSON
4. ❌ No preview (för simpelt)
5. ❌ No redaction (bara 3 demo-filer, alla synliga)

### MVP for Sam (Full):
1. ✅ All three modes (Unrestricted, Strict, Paranoid)
2. ✅ Mode switching (manual + AI-suggested)
3. ✅ Preview option
4. ✅ Cost control with token budget
5. ✅ Redaction för higher classifications
6. ✅ Full audit trail

**Jordan:** "SAAB-demon kan vi göra på 2 dagar. MVP:n kanske 1-2 veckor."

**Morgan:** "Håller med. SAAB-demon är proof-of-concept, MVP:n är vad Sam faktiskt använder."

---

## Conclusion

**Sam:** "Okej, så sammanfattning:

- **SAAB-demon:** Enkel Strict Mode, visa concept, validera behov
- **MVP:** Fullfjädrad med modes, preview, cost control, redaction
- **Filosofi:** Friktionsfritt för öppen kod, explicit consent för klassificerat
- **Security:** Audit trail fångar allt, clearance enforcement hårt, AI-service downgrade clearar context

Vi kör?"

**All:** "✅ Vi kör!"

---

## Next Steps

1. **Build SAAB demo** (Strict Mode only, 3 demo files, audit trail)
2. **RegPilot meeting** (validate need, get feedback)
3. **Build MVP** (all modes, real file system, full features)
4. **Dogfood** (Sam använder MVP på riktiga projekt)
5. **Iterate** based on real usage

**End of session.**



