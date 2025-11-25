# Red Forge Baseline (KISS) - Designsession

**Datum:** 2025-11-24  
**Kontext:** Designa den enkla versionen av Red Forge för SAAB-demo och försvarsindustri  
**Deltagare:** Sam (Vision), Thorne (Utveckling), Morgan (Compliance), Raven (Arkitektur)  
**Status:** ✅ Klar - KISS-version definierad för implementation

---

## Sessionens Mål

1. Definiera den ENKLASTE versionen av Red Forge som löser SAAB:s problem
2. Ta bort all komplexitet från "advanced mode" (VAD/HUR, `declassify`, etc)
3. Fokusera på: **Stoppa Shadow IT, ge synlighet, logga allt**

---

## Problem vi Löser (SAAB:s Verklighet)

**Sam:** "Vad är det FAKTISKA problemet på SAAB?"

**Morgan:** "De har policy: 'Ingen moln-AI'. Men 80% av ingenjörerna använder ChatGPT ändå. De kopierar klassificerad kod, får svar, ingen vet vad som läckt."

**Thorne:** "Klassisk Shadow IT. De försöker stoppa det genom att blockera, men det skapar bara osynlig risk."

**Raven:** "Så vi behöver inte VAD/HUR-separation. Vi behöver bara: 
1. Blockera klassificerat från moln-AI
2. Tillåta oklassificerat synligt
3. Logga allt för FMV-compliance"

---

## KISS-Version: En Klassificering Per Fil

### **Frontmatter (Enkel Variant):**

```yaml
---
classification: KONFIDENTIELL
---

# BirdTurret V3.5 Implementation

Denna fil innehåller klassificerad implementation...
```

**Inte:**
```yaml
---
classification:
  what: EJ_SEKRETESS
  how: KONFIDENTIELL
---
```

**Motivering:**
- ✅ Enklare att förstå (en nivå = en fil)
- ✅ Tydligare policy (KONFIDENTIELL fil går INTE till Claude)
- ✅ Lättare att implementera (ingen block-parsing)
- ✅ Matchar hur SAAB faktiskt klassificerar (de sätter klassificering på dokument, inte stycken)

---

## KISS AI-Routing

### **Tre AI-Tjänster (Svenska Namn):**

```
1. Claude Sonnet 4.5 (Offentligt moln)
   - Max: Ej sekretess
   - Nätverk: Internet
   
2. Red Forge SaaS (FMV Nivå 2)
   - Max: KONFIDENTIELL
   - Nätverk: On-prem
   - Hanterar: BH + K
   
3. Red Forge On-Prem (FMV Nivå 3)
   - Max: HEMLIG
   - Nätverk: Luftgapat
   - Hanterar: BH + K + H
```

**KVALIFICERAT HEMLIG:**
- Ingen AI tillåts
- Hårdblockering
- Meddelande: "KVALIFICERAT HEMLIG kräver FMV Del 9-godkännande. Kontakta säkerhetsskyddschef."

---

## KISS Guardian (Blockering & Varningar)

### **Tre Allvarlighetsgrader:**

**1. Information (🔵 Blå):**
```
💡 Tips: Denna fil är Ej sekretess. Du kan använda Claude för snabbare svar.
```

**2. Varning (🟡 Gul):**
```
⚠️ Varning: Du försöker skicka BEGRÄNSAT HEMLIG till Claude (offentligt moln).

Alternativ:
- Byt till Red Forge SaaS (FMV Nivå 2-godkänd)
- Ändra klassificering till Ej sekretess (om lämpligt)

[Byt AI] [Behåll Claude och ändra klassificering]
```

**3. Blockerad (🔴 Röd):**
```
🚫 BLOCKERAD: KONFIDENTIELL-innehåll kan inte skickas till Claude.

Claude (offentligt moln) max: Ej sekretess
Din fil: KONFIDENTIELL

Du måste byta AI-tjänst:
→ Red Forge SaaS (hanterar KONFIDENTIELL)

[Byt till Red Forge SaaS]
```

**4. Kritisk Blockering (⛔ Mörkröd):**
```
⛔ KRITISK BLOCKERING: KVALIFICERAT HEMLIG upptäckt.

KVALIFICERAT HEMLIG kräver specialhantering enligt FMV Del 9.
Ingen AI får användas utan FMV-godkännande.

Ta bort KH-innehåll eller kontakta säkerhetsskyddschef.

[Stäng] [Kontakta support för FMV-lösning]
```

---

## KISS UI (Inga Finesser)

### **Filträd (Enkel):**
```
📁 birdturret/
  📄 README.md (ES)
  📄 v2-public.md (ES)
  🔒 v3-implementation.md (K)
  🔒 v3.5-shotgun.md (K)
  🔐 sensor-calibration.md (H)
```

**Färgkodning:**
- 📄 Blå = Ej sekretess
- 🔒 Orange = BH/K
- 🔐 Röd = H
- ⛔ Mörkröd = KH (sällsynt)

### **Filhuvud (Enkel):**
```
┌─────────────────────────────────────────────┐
│ 🔒 v3.5-shotgun.md                         │
│ KONFIDENTIELL (K)                           │
│                                             │
│ AI-tjänst: [Red Forge SaaS (FMV Nivå 2) ▼]│
└─────────────────────────────────────────────┘
```

**Inte:**
- ❌ Inga VAD/HUR-fält
- ❌ Ingen `declassify`-knapp
- ❌ Inga block-level indikationer

### **Chat (Enkel):**
```
┌─────────────────────────────────────────────┐
│ Weaver                                      │
├─────────────────────────────────────────────┤
│ User: Kan du hjälpa mig optimera denna     │
│       sensor-kod?                           │
│                                             │
│ 🚫 Guardian: BLOCKERAD                     │
│                                             │
│ KONFIDENTIELL-innehåll kan inte skickas    │
│ till Claude (offentligt moln).             │
│                                             │
│ [Byt till Red Forge SaaS]                  │
└─────────────────────────────────────────────┘
```

---

## KISS Audit Trail

### **Logg Allt (Enkelt Format):**

```
Tidsstämpel | Operation | Resurs | Beslut | AI-Tjänst | Användare
------------|-----------|---------|--------|-----------|----------
14:23:45    | chat      | v3.md   | blocked| Claude    | sam@dyno (K-clearance)
14:24:12    | chat      | v3.md   | allowed| RF SaaS   | sam@dyno (K-clearance)
14:25:33    | read      | v2.md   | allowed| Claude    | sam@dyno (K-clearance)
```

**Export till JSON:**
```json
{
  "timestamp": "2025-11-24T14:23:45Z",
  "operation": "chat",
  "resource": "birdturret/v3-implementation.md",
  "decision": "blocked",
  "reason": "File classification (KONFIDENTIELL) exceeds AI max (Ej sekretess)",
  "aiService": "Claude Sonnet 4.5 (Cloud)",
  "user": {
    "id": "sam@dyno",
    "clearance": "KONFIDENTIELL",
    "networkZone": "yellow"
  }
}
```

**För FMV-inspektioner.**

---

## Vad Vi Tar BORT (från Advanced Mode)

### **❌ Borttaget:**

1. **VAD/HUR-separation**
   - För komplicerat för SAAB-demo
   - Kan läggas till senare som "Advanced Mode"
   - Baseline: En klassificering per fil

2. **`declassify`-attribut**
   - Kräver för mycket UI (border, ikon, tooltip)
   - Kräver Guardian-validering (8+ tecken, 2+ ord, etc)
   - Kan läggas till senare som "Declassification Workflow"

3. **Block-level klassificering**
   - Komplicerad parsing (`<What>`, `<How>`)
   - Svårt att visa i UI
   - Baseline: Hela filen har en klassificering

4. **"Advanced Mode"-toggle**
   - Inte nödvändigt för baseline
   - Kan läggas till när vi faktiskt HAR advanced features

5. **Multi-land klassificering**
   - Börja med bara Sverige (BH/K/H/KH)
   - Lägg till Norge/Finland/Tyskland senare

6. **"Skip AI Review"-toggle**
   - Guardian ska ALLTID köra
   - Inget sätt att bypassa (för riskabelt)

---

## Vad Vi Behåller

### **✅ Kvar i Baseline:**

1. **En klassificering per fil** (ES/BH/K/H/KH)
2. **Guardian AI-säkerhetsgranskning** (blockerar klassificerat)
3. **Audit trail** (loggar allt, export till JSON)
4. **Chat-reset vid nedgradering** (rensar kontext om AI byts)
5. **Svenska terminologi** (FMV Nivå 2/3, BH/K/H/KH)
6. **Tre AI-tjänster** (Claude, RF SaaS, RF On-Prem)
7. **Secret scanner** (blockerar riktiga hemligheter: API-nycklar, personnummer)

---

## Implementation Plan (KISS)

### **Steg 1: Frontmatter (Enkel)**
```typescript
// Parse simple classification
interface FileMetadata {
  classification: SwedishSecurityLevel; // Just one level
}

// Example:
// ---
// classification: KONFIDENTIELL
// ---
```

### **Steg 2: Guardian (Enkel Logik)**
```typescript
function canSendToAI(
  fileClassification: SwedishSecurityLevel,
  aiService: string
): boolean {
  const aiConfig = getSwedishAIServiceConfig(aiService);
  const aiMaxIndex = SWEDISH_SECURITY_LEVEL_ORDER.indexOf(aiConfig.maxClassification);
  const fileIndex = SWEDISH_SECURITY_LEVEL_ORDER.indexOf(fileClassification);
  
  return fileIndex <= aiMaxIndex; // Simple comparison
}
```

### **Steg 3: UI (Minimalistisk)**
- Filträd med färgkodade ikoner (📄🔒🔐⛔)
- En klassificerings-badge per fil
- AI-dropdown (3 alternativ)
- Chat med Guardian-blockering
- Audit trail-panel

### **Steg 4: Audit Trail (JSON Export)**
- Logga varje operation (read, chat, etc)
- Spara i IndexedDB
- Export-knapp → JSON-fil för FMV

---

## Demo Flow för SAAB

### **Scenario: Ingenjör försöker använda ChatGPT**

**Steg 1:** Öppna `v3-implementation.md` (KONFIDENTIELL)

**Steg 2:** Skriv i chat: "Optimera denna sensor-kod"

**Steg 3:** Guardian blockerar:
```
🚫 BLOCKERAD: KONFIDENTIELL-innehåll kan inte skickas till Claude.

[Byt till Red Forge SaaS]
```

**Steg 4:** Byt till Red Forge SaaS

**Steg 5:** Guardian tillåter:
```
✅ Skickat till Red Forge SaaS (FMV Nivå 2-godkänd)

3 sections sent (full content)
```

**Steg 6:** AI svarar med optimeringsförslag

**Steg 7:** Öppna Audit Trail:
```
14:23:45 | chat | v3.md | blocked | Claude    | sam (K)
14:24:12 | chat | v3.md | allowed | RF SaaS   | sam (K)
```

**Steg 8:** Exportera audit trail (JSON) för FMV-inspektion

---

## Framtida Features (Inte i Baseline)

**Phase 2 (Efter SAAB-demo):**
- AI-assisterad deklassificering
- VAD/HUR-separation (Advanced Mode)
- `declassify`-attribut
- Weaver-aktiverad Advanced Mode (easter egg)

**Phase 3 (Efter första kunder):**
- Multi-land klassificering (Norge, Finland)
- Multi-nationella projekt (visa ekvivalenser)
- RegPilot-integration (för oklassificerad trafik)

---

## Tekniska Förenklingar

### **Borttaget från Kod:**

1. **MDX `<What>` / `<How>` parsing** → Bara frontmatter
2. **`declassify` validation** → Tas bort
3. **Block-level context tracking** → Fil-level är nog
4. **"Skip AI Review" toggle** → Guardian körs alltid
5. **Multi-språk-stöd (US/SE toggle)** → Bara svenska för nu

### **Behållet i Kod:**

1. **Secret scanner** (regex för API-nycklar, personnummer)
2. **Guardian AI-granskning** (OpenRouter Llama 3.3)
3. **Audit trail DB** (IndexedDB)
4. **Chat context manager** (reset vid nedgradering)
5. **Svenska klassificeringsnivåer** (ES/BH/K/H/KH)

---

## Success Criteria (Definition of Done)

**Baseline är klar när:**
1. ✅ User kan öppna fil med `classification: KONFIDENTIELL`
2. ✅ Guardian blockerar om AI är Claude (offentligt moln)
3. ✅ Guardian tillåter om AI är Red Forge SaaS
4. ✅ Audit trail loggar båda försöken
5. ✅ User kan exportera audit trail till JSON
6. ✅ Inga buggar i demo (kan visa för SAAB utan att krascha)

---

## Nyckelcitat

**Sam:** "SAAB bryr sig inte om VAD/HUR-separation. De vill bara stoppa ingenjörer från att använda ChatGPT på klassificerad kod."

**Morgan:** "En klassificering per fil är HUR SAAB FAKTISKT JOBBAR. De sätter inte olika klassificering på olika stycken."

**Thorne:** "Om vi tar bort VAD/HUR, `declassify`, och block-parsing, är detta typ 1-2 veckors jobb istället för 2 månader."

**Raven:** "KISS-versionen löser 80% av problemet med 20% av koden. Perfekt för MVP."

---

## Sessionens Varaktighet

~60 minuter

---

## Relaterade Dokument

- `balans-website/transcripts/2025-11-24-advanced-mode-simplification-and-weaver-activation.md` (Advanced mode reference - fryst)
- `balans-website/transcripts/2025-11-24-swedish-classification-levels-for-red-forge.md` (Svenska nivåer)
- `balans-website/src/lib/red-forge/swedish-ai-service-config.ts` (Implementation)

