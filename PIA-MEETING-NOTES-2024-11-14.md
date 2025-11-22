# Pia Meeting Notes - 14 November 2024

**Meeting:** Samuel + Pia Nordanskog (JUG Linköping)  
**Date:** 2024-11-14 09:00  
**Purpose:** Demo Balans Medical prototype for bipolar episode tracking

---

## 📊 What Was Shown

### Demo URL
- **URL:** `https://balans-collective.com/demo/`
- **Password:** `pia`

### Content Shown
1. **Timeline (Juni 2025)** - Complete 16-day episode documentation
2. **Läkardashboard** - Compliance + Activation + Taper + Audit log
3. **November timeline** - Incomplete data (only Fri-Sun family observations)

### Key Message
- Juni: Complete data with Eva & Roger present = 6 days to stabilization
- November: Incomplete data when alone = gap that system needs to fill
- Ask: "What needs to exist before NEXT episode to avoid closed care?"

---

## ✅ Pia's Positive Feedback

1. **"Positiv till sidan"** - She saw value in the concept
2. **Concrete feature request:** Lithium concentration in timeline (from blood tests)
3. **Active support:** Will show UI to person responsible for "andra tracking appen" (Curego?)
4. **Understands need:** Wants to help but has constraints

---

## 🚨 Critical Issues Raised

### 1. Lithium Concentration Graph 💊
**Request:** Show lithium blood levels over time in timeline

**Technical approach:**
- Manual input first: "Lithium 0.8 mmol/L (23 nov)" → auto-plot
- Future: 1177 scraping → LLM parsing for automation
- Correlate with doses + episodes

**Priority:** 🔥 HIGH - explicit request from doctor

---

### 2. Doctor Bandwidth Problem 👩‍⚕️
**Issue:** "Läkare som har 200 patienter har inte tid att hålla koll på ett till interface"

**Implication:** 
- Doctors want ALL data in ONE system (not another dashboard to check)
- They need alerts/notifications, not dashboards to manually review

**Solution needed:**
```
ALERT-BASED SYSTEM (not dashboard-monitoring):

🔴 URGENT (call patient immediately):
- Activation >8 for 3+ days
- 0 medication for 2+ days  
- Family marks "acute concern"

🟡 WARNING (check within 24h):
- Activation 7-8 for 2+ days
- Missed lithium 2+ times/week
- Sleep <5h for 3+ nights

🟢 INFO (weekly recap):
- All following plan
- No red/yellow flags
```

**Priority:** 🔥🔥 CRITICAL - solves her "200 patients" problem

---

### 3. Integration with Existing Systems 🔗
**Insight:** Doctors want data in their EXISTING workflow

**Pia's action:** Will show to person responsible for Curego (or similar tracking app)

**Positioning:** 
- ❌ NOT: "Replace Curego"
- ✅ YES: "Complement Curego with context + family coordination"

**Potential outcome:**
- Best case: Integration as module in Curego
- Alternative: Standalone but with data export to their systems

**Question for Samuel:**
> Would you be OK with Balans Medical becoming a MODULE in Curego 
> instead of standalone app?

**Pros:**
- ✅ Distribution (all Curego users get access)
- ✅ Legitimacy (backed by established player)
- ✅ They handle GDPR/compliance/hosting

**Cons:**
- ⚠️ You don't fully own the solution
- ⚠️ They might want exclusivity
- ⚠️ Slower iteration (their release cycle)

---

### 4. Confidentiality Constraint 🔒
**Quote:** "Kunde inte tipsa om balans medical till andra patienter pga sekretess"

**NEEDS CLARIFICATION - Two possible interpretations:**

#### Scenario A: Samuel's confidentiality
- She can't tell Patient B: "Samuel built an app, try it"
- That would reveal Samuel is a patient with bipolar
- = Breaks Samuel's privacy

#### Scenario B: Healthcare regulations  
- She can't recommend external/unregulated tools to patients
- Healthcare staff can only recommend approved/regulated tools
- = Legal/compliance issue

#### Scenario C: Both A and B

**Action needed:** Ask Pia to clarify which scenario (or both)

**Email to send:**
```
Hej Pia,

Angående att du sa "kunde inte tipsa om balans medical 
pga sekretess" - kan du förtydliga vad du menade?

Alt A: Du kan inte tipsa för det avslöjar att JAG är 
patient och byggde det? (min sekretess)

Alt B: Du får inte rekommendera externa/oreglerade 
verktyg generellt? (vårdregler)

Alt C: Både A och B?

Jag försöker förstå vad som behöver lösas för att 
det ska bli "tipsbart":
- Anonymisera mig som skapare?
- Registrera som medicinteknisk produkt?
- Gå via forskning först?

Tack för hjälp att förstå!
Mvh Samuel
```

---

## 🎯 Solutions Based on Scenario

### If Scenario A (Samuel's confidentiality):
**Solutions:**
- ✅ Anonymize creator: "Developed by patient-technologist in collaboration with JUG"
- ✅ Go via Riksförbundet Balans: They promote (not Pia)
- ✅ Research framing: "JUG tests digital tool in pilot" (your name not mentioned)

**Pia could then say:**
> "JUG is testing a new tool for episode tracking. Want to participate in pilot?"

---

### If Scenario B (Healthcare regulations):
**Solutions:**
- ✅ Medical device classification: Register as "Class I medical device"
- ✅ Healthcare agreement: JUG signs contract making it "approved tool"
- ✅ Research first: Pilot study → Publish → Then becomes "evidence-based"

**Pia could then say:**
> "This tool is approved by JUG and tested in study."

---

### If Scenario C (Both):
**Combined solution:**
1. Anonymize Samuel as creator
2. Run as pilot study (research framing)
3. Go via Riksförbundet Balans for patient-driven distribution

---

## 📋 Concrete Next Steps

### Within 1 week:
- [ ] **Lithium concentration graph** - manual input first, 1177 scraping later
- [ ] **Alert system for Pia** - "Notify only when risk detected"
- [ ] **Email Pia thank you + clarification question** (about confidentiality scenario)
- [ ] **Email Pia update** when lithium graph is ready

### Within 2 weeks:
- [ ] **Curego contact** - wait for Pia to show them first
- [ ] **Riksförbundet Balans email** - patient-driven distribution
- [ ] **Build "doctor alert workflow"** - email/SMS on red/yellow flags

### Within 1 month:
- [ ] **Pilot study framing** - can Pia say "JUG is testing this in pilot"?
- [ ] **Beta test with 5-10 users** (you + Balans members)

---

## 💬 Follow-up Email to Pia (Draft)

```
Hej Pia,

Tack för mötet idag och din feedback!

Jag har börjat jobba på de konkreta punkterna du nämnde:

1. LITIUMKONCENTRATION: Bygger en graf där jag kan lägga 
   in värden från 1177 manuellt (sen automatisering via LLM). 
   Kommer visa över tid kopplat till episoder.

2. ALERT-SYSTEM: Insåg att du inte har tid att kolla 200 
   patienters dashboards. Bygger istället notis-system som 
   BARA varnar vid faktisk risk (missade doser, hög aktivering, 
   familje-oro). "No news = good news".

3. CUREGO-INTEGRATION: Spännande att du ska visa för dem! 
   Min tanke är att vi kompletterar deras sensor-data med 
   kontext + familjekoordinering. Inte konkurrera, utan 
   förbättra tillsammans.

4. SEKRETESS: Kan du förtydliga vad du menade? 
   - Kan inte tipsa pga min sekretess (patient-identitet)?
   - Kan inte rekommendera oreglerade verktyg (vårdregler)?
   - Både?
   
   Jag försöker förstå vad som behövs för att det ska bli 
   "tipsbart" - anonymisera mig, registrera som medicinprodukt, 
   eller gå via forskning?

Får jag höra av mig när litium-grafen är klar för att 
visa uppdateringen?

Tack igen för din tid och ditt stöd!

Mvh Samuel
```

---

## 🔗 Distribution Paths

### Path 1: Via Curego (if they want to integrate)
- **Pros:** Instant distribution, legitimacy, they handle compliance
- **Cons:** Less control, slower iteration, possible exclusivity demands
- **Status:** Waiting for Pia to show them

### Path 2: Via Riksförbundet Balans  
- **Pros:** Patient-driven, community trust, no healthcare regulations
- **Cons:** Smaller reach initially, need to build trust
- **Status:** Email draft ready (send next week)

### Path 3: Via JUG Pilot Study
- **Pros:** Research legitimacy, Pia CAN recommend, publishable results
- **Cons:** Ethics approval needed, slower start, more formal
- **Status:** Need to ask Pia if this is possible

### Path 4: Via 1177 messaging (UNCLEAR IF POSSIBLE)
- **Question:** Can doctors send remiss/links via 1177?
- **Needs:** Clarification on confidentiality constraints
- **Potential:** "Digital prescription" workflow

---

## 🤝 Riksförbundet Balans Connection

**Context:** Found their flyer in JUG waiting room today!

**Their mission (from website):**
- Support patients & family (matches system!)
- Influence healthcare ("feedback to clinics")
- Inform family and see them as "resources in care process"
- Increase knowledge and reduce stigma

**Overlap with Balans Medical:**
1. ✅ Digital support tool for patients
2. ✅ Family coordination (seeing them as resources!)
3. ✅ Objective data for precision care
4. ✅ Increased quality of life for members

**Email to send (next week):**
```
Ämne: Samarbete - Beta-test av medicinspårning för bipolär sjukdom

Hej Riksförbundet Balans,

Jag heter Samuel Lindgren, medlem i er organisation 
och diagnostiserad med bipolär typ 2.

Jag har utvecklat ett digitalt system som adresserar 
tre av era kärnmål:

1. STÖDJA PATIENTER: AI-stödd reglering vid tidiga 
   varningssignaler (innan vård behövs)

2. ANHÖRIGA SOM RESURS: Digital familjevy som ger 
   översikt utan att kräva 24/7-övervakning

3. BÄTTRE VÅRD: Objektiv data till läkare för 
   evidensbaserade beslut

Systemet testades i juni 2025 under en hypomanisk 
episod - resultat: 6 dagar till stabilisering (vs 
tidigare 2-3 veckor), ingen sluten vård.

Jag har precis visat systemet för min läkare på JUG 
Linköping och funderar nu på pilot-fas.

Skulle Riksförbundet Balans vara intresserad av:
- Beta-test med 5-10 frivilliga medlemmar?
- Feedback på funktioner som skulle vara mest värdefulla?
- Eventuellt samarbete om pilot visar resultat?

Detta är INTE kommersiellt än - jag bygger det för 
att JAG behöver det för att undvika sluten vård. Men 
om det fungerar för mig, kanske det fungerar för andra.

Tacksam för möjlighet att prata mer!

Mvh Samuel Lindgren
[email]
```

---

## 💰 Pricing Strategy (Future)

**Not decided yet, but discussed sustainability:**

### Option 1: Tiered pricing
- **Tier 1 (Gratis):** Local data only, no cloud sync
- **Tier 2 (100 kr/mån):** Full features, cloud backup, family view
- **Tier 3 (300 kr/mån):** Priority support, early access

**Special tiers:**
- Riksförbundet Balans members: 50% discount
- Beta testers: Lifetime 75% discount  
- Students/low income: Sliding scale

### Option 2: Beta phases
- **Fase 1: Beta (3-6 mån) - GRATIS** for testing
- **Fase 2: Pilot (6-12 mån) - 50 kr/mån** (covers hosting partially)
- **Fase 3: Launch - 200 kr/mån** for new users, 100 kr for Balans members

**Comparison context:**
- Curego: ~500 kr/month + hardware
- Netflix: 179 kr/month (entertainment)
- Balans Medical: 200 kr/month (avoid closed care!)

**Philosophy:** Not free forever (unsustainable), but affordable and transparent about costs.

---

## 🎯 Key Insights from Meeting

### What Worked:
1. ✅ **Evidence from Juni** - 6 days vs 2-3 weeks is compelling
2. ✅ **Family observation log** - Professional documentation impressed her
3. ✅ **Honest about gaps** - Showing November's incomplete data built credibility
4. ✅ **Personal framing** - "Tool I need to survive" not "startup pitch"

### What Needs Work:
1. ⚠️ **Alert system** - Critical for doctor adoption (200 patients problem)
2. ⚠️ **Lithium concentration** - Requested feature, shows practical thinking
3. ⚠️ **Integration strategy** - Needs to fit existing workflows
4. ⚠️ **Distribution path** - Confidentiality constraint needs solving

### Surprising Learnings:
1. 💡 **Curego connection** - She'll show them! Opens integration path
2. 💡 **Doctor bandwidth** - They need alerts, not dashboards
3. 💡 **Confidentiality complexity** - More nuanced than expected
4. 💡 **She wants to help** - Active support despite constraints

---

## 🚀 Overall Assessment

**RESULT: WIN! 🏆**

- ✅ Validation (she liked it)
- ✅ Concrete feedback (not vague)  
- ✅ Active support (showing to Curego)
- ✅ Clear next steps (lithium graph, alerts, clarify confidentiality)

**This is NOT a rejection - it's a "yes, but we need to solve X, Y, Z first"**

Now build based on clear direction from actual doctor!

---

## 📅 Timeline

**Today (14 Nov):** Demo meeting ✅  
**This week (Nov 14-17):** Build lithium graph + alert system  
**Mon 18 Nov:** Christine meeting (samtalsstöd) - **USE AS CHANNEL TO PIA**  
**Next week (Nov 18-22):** Email Riksförbundet Balans  
**Week 3 (Nov 25-29):** Wait for Christine/Pia response on pilot  
**2 weeks:** Curego contact (after Pia shows them)  
**1 month:** Pilot decision + Balans response  
**3 months:** Beta test with 5-10 users (pilot OR Balans OR both)

---

## ❓ Open Questions (Need Answers)

1. **Confidentiality:** Scenario A, B, or C? (ask Pia)
2. **Curego integration:** Would Samuel accept becoming a module?
3. **Alert thresholds:** Agreed on red/yellow/green levels?
4. **Pilot study:** Can JUG frame this as research?
5. **1177 distribution:** Possible to send links via 1177 messaging?
6. **Medical device:** Need Class I registration or research exemption?

---

---

## 🔄 Communication Strategy Update (14 Nov - Evening)

### Problem: No Direct Contact with Pia

**Solution:** Use Christine (litiumsköterska) as communication channel!

**Meeting scheduled:** Nov 18 (samtalsstöd)

---

### What to Bring to Christine Meeting:

#### 1. Verbal Update (2 min):
> "Träffade Pia förra veckan, visade verktyg för episodspårning. Hon var positiv, bad om litiumkoncentration-graf. Hon ska visa för Curego-ansvarig."

#### 2. The Ask (1 min):
> "Undrar om det kan testas som pilot på JUG - 3 månader, 5-10 patienter. Kan du förmedla frågan till Pia? Jag har inget direkt sätt att nå henne."

#### 3. One-Pager to Give Christine:

```
=== PILOT-FÖRSLAG: Digital Episodspårning ===

BAKGRUND:
Juni 2025: hypomanisk episod, 6 dagar till stabilisering 
(tidigare 2-3 veckor), tack vare familjeobservationer + 
digitalt protokoll. Visat för Pia 14 nov - positiv feedback.

VERKTYG:
- Daglig medicin-loggning (med kontext)
- Aktiverings-spårning (0-10 skala)
- Familjevy (Eva & Roger ser status)
- Automatiska varningar till läkare vid risk

PILOT-FÖRSLAG:
- 3 månader
- 5-10 patienter på JUG
- Mät: episodfrekvens, compliance, familje-nöjdhet
- Kvalitetsförbättring (inte formell forskning först)

FRÅGA TILL PIA:
Kan detta köras som pilot via JUG? 
Behöver det gå via forskningsansvarig?
Eller kvalitetsförbättring?

KONTAKT:
Samuel Lindgren
[email/telefon]

Demo: balans-collective.com/demo (lösen: pia)
```

---

### Why Christine is Perfect Channel:

1. ✅ **Official communication path** - litiumsköterskor ↔ läkare
2. ✅ **Patient advocate role** - hennes jobb att hjälpa
3. ✅ **Knows your case** - context om episoder
4. ✅ **Regular contact with Pia** - träffas regelbundet
5. ✅ **Can filter urgency** - vet vad som behöver Pias uppmärksamhet

---

### Bonus: Ask Christine for Her Input!

> "Från ditt perspektiv som litiumsköterska - vilka patienter skulle gynnas mest av det här? Vad saknas i befintliga verktyg?"

Frontline insights = GOLD! 🏆

---

## 🎯 JUG Pilot Study - How to Apply

### Study Types (Easiest to Hardest):

#### Option A: Kvalitetsförbättring (QI Project) ⚡ RECOMMENDED
- **No ethics approval needed** (internal quality improvement)
- **Pia can drive it** as clinical improvement
- **Timeline:** Can start within weeks
- **Format:** "Testing new clinical tool"

**Ask via Christine:**
> "Kan detta köras som kvalitetsförbättring? Då slipper vi etikprövning."

---

#### Option B: Observational Study 🔬
- **Ethics approval needed** (Etikprövningsmyndigheten)
- **Timeline:** 2-3 months for approval
- **Requires:** Protocol + consent forms + GDPR plan

---

#### Option C: Clinical Trial 🏥 (OVERKILL - skip this)
- Too formal/complex for this stage

---

### What YOU Prepare (While Waiting):

#### 1. One-Page Study Proposal ✅ (in one-pager above)

#### 2. Patient Consent Form (Draft):

```markdown
# Information om deltagande i pilot-studie

## Vad handlar studien om?
Vi testar ett digitalt verktyg för att spåra medicin, 
aktivering och tidiga varningssignaler vid bipolär sjukdom.

## Vad innebär det för dig?
- Logga medicin dagligen (2 min/dag)
- Rapportera aktivering 1x/dag (1 min)
- Din familj kan se översikt (om du vill)
- Vi får automatiska varningar vid risk

## Hur länge?
3 månader (kan avsluta när som helst)

## Vad händer med data?
- Lagras säkert (GDPR-compliant)
- Används för att förbättra verktyget
- Kan anonymiseras för forskningspublikation
- Du äger din data (kan begära radering)

## Frivilligt
Du kan sluta när som helst utan att påverka din vård.

## Kontakt
Pia Nordanskog, JUG Linköping
[email/phone]
```

---

## 🔄 Parallel Paths - Don't Wait!

### Path 1: JUG Pilot (via Christine → Pia)
- **Timeline:** Response by end Nov?
- **Channel:** Christine forwards to Pia
- **Format:** Medical/formal

### Path 2: Riksförbundet Balans (direct contact)
- **Timeline:** Contact next week (Nov 18-22)
- **Channel:** Direct email to organization
- **Format:** Patient/community

**BOTH ARE VALUABLE!** Don't wait for one to start the other!

---

## ✅ Updated Action Items

### This Week (Nov 14-17):
- [ ] Build lithium concentration graph (manual input)
- [ ] Write alert system spec (red/yellow/green thresholds)
- [ ] Print one-pager for Christine
- [ ] Prepare verbal pitch (2 min)
- [ ] Update demo with lithium graph (if time)

### Mon Nov 18 (Christine Meeting):
- [ ] Show demo (with lithium graph if ready)
- [ ] Give one-pager
- [ ] Ask to forward pilot question to Pia
- [ ] Ask Christine for her frontline insights

### Week of Nov 18-22:
- [ ] Email Riksförbundet Balans (don't wait for pilot response)
- [ ] Continue building alert system
- [ ] Wait for Christine/Pia response

### Week of Nov 25-29:
- [ ] Christine should have återkopplat by now
- [ ] If pilot YES → prepare recruitment materials
- [ ] If pilot NO → full focus on Balans path
- [ ] If Balans responds → schedule meeting

---

**END OF NOTES**

*Continue from here when ready to build next features!*

*Next major milestone: Christine meeting Nov 18!*

