# Deep Research Prompt: EU Defense Project Compliance for AI-Powered Counter-UAS Systems

## Context: Project Overview

**Company:** Balans AI AB (Swedish SME)  
**Product:** Red Forge - AI-powered browser-based decision support system for counter-UAS (unmanned aircraft systems) defense  
**Technology Stack:** TypeScript, React, AI/LLM integration (Claude, Gemini), real-time threat classification  
**Current Status:** MVP demo complete, seeking EU project compatibility for European Defence Fund (EDF) applications  

### System Capabilities:
- **AI Threat Classification:** Real-time identification of hostile/friendly drones using computer vision + ML
- **Guardian Protocol:** Dual-perspective ethical AI decision framework (Magician + Guardian archetypes)
- **Classification-Aware Routing:** Automatically routes AI requests to appropriate service based on data classification level
- **Declassification Workflow:** AI-assisted content redaction with human-in-the-loop approval
- **Multi-Level Security:** Supports Swedish national classifications (Oklassificerad, Begränsad Hemlig, Konfidentiell, Hemlig) + EU classifications

### Current Implementation:
```typescript
// Classification levels currently supported
type Classification = 
  | 'oklassificerad'        // Swedish: Unclassified
  | 'begransad-hemlig'      // Swedish: Restricted (≈ EU RESTRICTED handling)
  | 'eu-restricted'         // NEW: EU RESTRICTED (legally distinct from BH)
  | 'konfidentiell'         // Swedish: Confidential
  | 'hemlig';               // Swedish: Secret

// AI service routing (security levels)
const AI_SERVICE_LEVELS = {
  'claude-cloud': { level: 0, maxClass: 'oklassificerad' },      // Public LLMs
  'saas-lumen': { level: 1, maxClass: 'begransad-hemlig' },      // Domain SaaS (also handles EU-RESTRICTED)
  'forge-local': { level: 2, maxClass: 'konfidentiell' },        // On-premises classified
  'forge-airgap': { level: 3, maxClass: 'hemlig' }               // Air-gapped highest security
};

// Audit trail structure (current implementation)
interface AuditEntry {
  timestamp: Date;
  filename: string;
  classification: Classification;
  aiService: string;
  result: 'allowed' | 'blocked' | 'declassified';
  operatorId?: string;
}
```

### Key Design Decision:
**EU RESTRICTED is handled under "same regulatory framework" as Swedish Begränsad Hemlig (BH) but is legally distinct.**  
- Same access control level (SaaS Lumen)
- Same encryption requirements
- But: Different audit trail jurisdictions, different declassification authority

---

## Research Objectives

### 1. **Legal Framework Deep Dive**

**Question:** What are the exact legal requirements for handling EU RESTRICTED information in Sweden, and how do they differ from Swedish Begränsad Hemlig?

**Specific sub-questions:**
- What is the **exact citation** in Council Decision 2013/488/EU that defines EU RESTRICTED?
- Does Sweden have **national implementing legislation** for EU security classifications beyond Säkerhetsskyddslagen (2018:585)?
- Are there **MSB (Myndigheten för samhällsskydd och beredskap) guidelines** on EU vs. national classification equivalencies?
- What happens if a file is **dual-classified** (e.g., "EU RESTRICTED / Begränsad Hemlig") - which regulations take precedence?
- Can **Swedish operators with BH clearance automatically access EU RESTRICTED**, or is separate EU clearance required?
- What are the **declassification authorities** for EU RESTRICTED (EU Council Secretariat only? Or can Swedish FMV declassify?)

**Background context:**
- Swedish Security Protection Act (Säkerhetsskyddslagen 2018:585) governs national classifications
- Council Decision 2013/488/EU governs EU classifications
- User stated: "EU RESTRICTED är i Sverige hanterat med samma regelverk som BH, men är inte samma sak"

---

### 2. **Multi-Jurisdiction Classification Architecture**

**Question:** How should a software system architecturally support files that are classified under MULTIPLE jurisdictions simultaneously?

**Real-world scenario:**
A joint Sweden-Finland defense exercise produces a document marked:
- **Primary:** EU RESTRICTED (per EU Council)
- **Secondary:** Begränsad Hemlig (per Swedish FMV)
- **Tertiary:** NATO RESTRICTED (per SHAPE liaison officer)

**Specific sub-questions:**
- Is **dual/triple classification common** in EU defense projects?
- Which classification level **wins for access control**? (Highest? All must be satisfied?)
- How should **audit trails differentiate** between EU vs. national access?
- Can a file be declassified **partially** (EU RESTRICTED → UNCLASSIFIED, but still Swedish BH)?
- Are there **standard data models** for multi-jurisdiction classification in defense systems (e.g., NATO standards)?
- What are **best practices** from existing EU collaborative defense projects?

**Current architecture options being considered:**
```typescript
// Option A: Flat (simple but can't represent dual classification)
type Classification = 'oklassificerad' | 'eu-restricted' | 'begransad-hemlig' | ...;

// Option B: Multi-dimensional (complex but accurate)
interface FileClassification {
  national?: { jurisdiction: 'SE', level: 'begransad-hemlig' };
  eu?: { jurisdiction: 'EU', level: 'eu-restricted' };
  nato?: { jurisdiction: 'NATO', level: 'nato-restricted' };
}

// Option C: Primary + Secondary (hybrid)
interface FileClassification {
  primary: Classification;
  secondary?: Classification;
}
```

**Which approach aligns with EU defense standards?**

---

### 3. **Technical Standards for Audit Trails**

**Question:** What are the exact technical requirements for audit trails in EU defense systems, specifically for AI-powered decision support?

**Specific sub-questions:**
- Does **STANAG 4586** (NATO standard) apply to EU-only projects?
- What fields are **mandatory** in audit log entries per EU defense standards?
- Are **cryptographic signatures** required for each audit entry? (ECDSA? RSA? What key size?)
- What is the **minimum retention period** for EU RESTRICTED audit logs? (We assume 7 years - is this correct?)
- Must audit logs be **immutable** (append-only)? Hash-chained? Blockchain-based?
- Are there **query/search requirements** (e.g., must support search by operator, time range, classification)?
- What **export formats** are required for external audits (JSON? XML? CSV)?
- How must **personal data in audit logs** be handled per GDPR (pseudonymization required)?

**Current implementation:**
```typescript
interface AuditEntry {
  timestamp: Date;
  filename: string;
  classification: Classification;
  aiService: string;
  result: 'allowed' | 'blocked' | 'declassified';
}
```

**Is this sufficient, or are we missing critical fields?**

**Reference standards to check:**
- STANAG 4586 (NATO UAV interoperability)
- ISO/IEC 27001 (Information security management)
- CIS (Communication and Information Systems) NATO standards
- Any EU-specific defense logging standards?

---

### 4. **EU AI Act Compliance for High-Risk Defense AI**

**Question:** What are the practical steps to achieve EU AI Act conformity assessment for a high-risk defense AI system like Red Forge?

**Background:** Red Forge qualifies as **High-Risk AI** under EU AI Act Annex III because:
- Used in **critical infrastructure** (defense systems)
- Provides **decision support for weapon systems** (counter-UAS)
- Involves **autonomous/semi-autonomous operation**

**Specific sub-questions:**
- Which **notified bodies** can perform conformity assessment for defense AI in Sweden/Nordics? (Names of organizations?)
- What is the **typical timeline** for conformity assessment (months? years?)
- What is the **typical cost** for SME like Balans AI (~10 employees, €500k revenue)? (€10k? €100k? €1M?)
- What **technical documentation** is required? (We know Annex IV exists, but what specifically?)
- How **detailed must explainability** be? (LIME/SHAP sufficient? Or formal verification required?)
- What **performance metrics** are required? (We target 95% accuracy - is this sufficient? What about adversarial robustness?)
- How are **bias/fairness** requirements verified for threat classification? (Equal performance across drone types/weather/time-of-day)
- What **cybersecurity testing** is required? (Penetration testing? Red team? OWASP ASVS level?)
- Can **self-assessment** suffice for any components, or is everything third-party audited?

**Reference:** 
- EU AI Act Annex III (High-risk AI systems)
- EU AI Act Annex IV (Technical documentation requirements)
- ISO/IEC 42001 (AI management system)

---

### 5. **European Defence Fund (EDF) Compliance**

**Question:** What are the practical requirements for a Swedish SME (Balans AI) to participate in EDF-funded projects?

**Specific sub-questions:**
- **Consortium structure:** 
  - We know minimum 3 entities from 3 member states - can Sweden, Finland, Estonia consortium work?
  - Can **one entity be from outside EU** (e.g., Norwegian partner) with approval?
  - What role can **universities/research institutes** play (e.g., KTH Royal Institute of Technology)?
  
- **Ownership & control:**
  - Balans AI has Swedish owners only - this is compliant, correct?
  - If we take **VC investment from US/UK**, does this trigger "non-EU control" concerns?
  - What is the exact threshold for "control"? (25% ownership? 50%? Voting rights?)
  
- **Intellectual Property:**
  - What is **"background IP"** vs. **"foreground IP"** in EDF context?
  - If Balans brings existing Guardian Protocol (developed pre-EDF), is this background IP?
  - Can background IP be **kept proprietary**, or must it be shared with consortium?
  - Foreground IP (developed during EDF project) - who owns it? (Joint? Lead partner? EU?)
  - Can foreground IP be **commercialized** outside EU after project ends?
  
- **Subcontracting:**
  - We know max 30% to non-EU - does this include **cloud providers** (AWS, Google)?
  - If we use **OpenRouter API** (US company) for LLM access, is this "subcontracting to non-EU"?
  - Can we use **open source libraries** from non-EU maintainers (e.g., React.js from Meta)?
  
- **Budget & reporting:**
  - What is typical EDF grant size for **Category B** (capability development) vs. **Category C** (prototypes)?
  - How **detailed must budget breakdowns** be (per work package? per person-month?)
  - What **deliverables format** is expected (technical reports? working prototypes? both?)
  - How **frequent are progress reviews** (quarterly? annually?)

**Reference:**
- EDF Regulation (EU) 2021/697
- EDF Work Programme 2025 (latest)

---

### 6. **Cyber Resilience Act (CRA) Compliance**

**Question:** How does CRA apply to browser-based AI defense software, and what are the practical compliance steps?

**Specific sub-questions:**
- Is Red Forge (browser-based web app) considered a **"product with digital elements"** under CRA?
- Does **SaaS model** reduce CRA obligations (since updates are automatic)?
- What are the **vulnerability disclosure requirements**?
  - 24-hour reporting to **whom**? (ENISA? National CERT? EU-CERT?)
  - What constitutes an **"actively exploited vulnerability"** (CVE with public PoC? Or actual attacks?)
- What **security testing** is required before deployment?
  - Penetration testing frequency? (Annual? After each major release?)
  - Static/dynamic analysis? (SAST/DAST tools required?)
  - Third-party security audit, or self-assessment sufficient?
- What **documentation** is required?
  - Security architecture diagram?
  - Threat model (STRIDE/DREAD)?
  - Vulnerability management plan?
- What is the **support lifecycle** obligation?
  - We know minimum 5 years for many product categories - does this apply to defense software?
  - Can support lifecycle be **shorter for classified systems** (due to obsolescence)?

**Special consideration:** Red Forge uses **third-party LLMs** (Anthropic Claude, Google Gemini) via APIs.
- Are we **responsible for vulnerabilities in Claude/Gemini**, or does liability stay with provider?
- Must we verify **LLM safety** (jailbreaking, prompt injection) per CRA?

**Reference:**
- Cyber Resilience Act (final text, 2024)
- ENISA guidelines on CRA implementation

---

### 7. **GDPR in Defense Context**

**Question:** How does GDPR apply to classified defense systems that process personal data of military operators?

**Specific sub-questions:**
- Does **Article 23 GDPR** (national security exemption) apply to Red Forge?
  - If yes, can we **skip consent requirements** for operators?
  - If no, how do we obtain **GDPR consent** in a classified environment?
- What **personal data** do we process?
  - Operator IDs (pseudonymized) - is this personal data?
  - Session logs (timestamps, actions) - personal data if linkable to individual?
  - AI decision history (which operator accepted/rejected AI suggestion) - personal data?
- What are **data subject rights** in defense context?
  - Can operator request **right to erasure** of their action logs? (Or does 7-year audit retention override?)
  - Can operator request **right to access** their own AI interaction history?
- What **data protection impact assessment (DPIA)** is required?
  - Is DPIA mandatory for "high-risk processing" like defense AI?
  - What template should we use (CNIL? ICO? Swedish IMY?)
- What **data processor agreements** are needed?
  - If we use OpenRouter (US company) for LLM API, is this a **data transfer to third country**?
  - Does **Standard Contractual Clauses (SCCs)** suffice, or is EU-only hosting required?

**Current approach:**
- Pseudonymize operator IDs (no real names in system)
- Encrypt personal data at rest (AES-256)
- 7-year audit retention (per defense regulations)
- No explicit GDPR consent (relying on Article 23 exemption)

**Is this compliant, or are we missing something?**

**Reference:**
- GDPR Article 6 (Lawful basis for processing)
- GDPR Article 23 (Restrictions on data subject rights)
- Swedish DPA (IMY) guidelines on defense sector GDPR compliance

---

### 8. **Export Control & Technology Transfer**

**Question:** What export control regulations apply to Red Forge, and can we freely share with all EU member states?

**Specific sub-questions:**
- Is Red Forge subject to **Wassenaar Arrangement**? (Dual-use technology list)
  - We use **AI/ML for threat classification** - is this controlled tech?
  - We use **cryptography** (AES-256, TLS 1.3) - above Wassenaar thresholds?
- Does **US ITAR** apply even though we're Swedish?
  - If we use any US-origin components (React.js, Node.js, cloud services), does this trigger ITAR?
  - Can we sell to **non-NATO EU countries** (Cyprus, Malta, Ireland, Austria) without US approval?
- What is **EU dual-use regulation** (EU 2021/821)?
  - Is AI for C-UAS on EU dual-use list?
  - If yes, do we need **export license** for each EU member state transfer?
- Can we share with **Norway** (EFTA but not EU member)?
- Can we share with **UK** (post-Brexit)?
- What about **non-military use cases**?
  - If Red Forge is used for **civilian airport security**, do export controls still apply?

**Reference:**
- Wassenaar Arrangement Munitions List (Category 4: Computers)
- EU Dual-Use Regulation (EU) 2021/821
- US EAR (Export Administration Regulations)

---

### 9. **Open Source Strategy**

**Question:** Can we open source parts of Red Forge while maintaining EU defense project compatibility?

**Specific sub-questions:**
- Which **license** is EU-friendly for defense projects?
  - Apache 2.0? (Permissive, patent grant)
  - MIT? (Very permissive)
  - GPL v3? (Copyleft - might conflict with proprietary defense integrations?)
- Can we open source **AI models** (trained on classified data)?
  - If model trained on EU RESTRICTED data, can weights be published?
  - If model trained on unclassified data, but used for classified inference, can we publish?
- What about **dependencies**?
  - We use React, TypeScript, Monaco Editor (all open source) - any license conflicts?
  - If we use GPL library, does entire system become GPL?
- Does **CRA impose obligations** on "open source software stewards"?
  - If we publish on GitHub and actively maintain, are we "steward"?
  - What are steward obligations (24-hour vuln reporting, security policy, etc.)?
- What **documentation must be public** vs. classified?
  - API documentation - public?
  - Deployment guides for classified environments - restricted?
  - Threat model - public or restricted?

**Reference:**
- CRA Article 16 (Obligations for open source software stewards)
- EU policies on open source in public sector

---

### 10. **Competitive Intelligence & Market Positioning**

**Question:** What is the current EU defense tech landscape for AI-powered C-UAS, and where does Balans AI fit?

**Specific sub-questions:**
- Who are **competitors** in EU C-UAS AI space?
  - DroneShield (Australia, but EU presence)?
  - Rohde & Schwarz (Germany) - ARDRONIS system?
  - Thales (France) - various EW solutions?
  - Any Nordic/Swedish competitors?
- What **EDF projects** currently exist in C-UAS domain?
  - PESCO project on counter-UAS?
  - Any Horizon Europe calls for C-UAS?
- What is the **typical funding size** for SME-led vs. industry-led EDF projects?
- What are **success stories** of SMEs winning EDF funding?
  - Can you find examples of Swedish SMEs in EDF?
  - What was their consortium structure?
- What **partnerships** are valuable?
  - FMV (Swedish Defence Materiel Administration) - do they partner with SMEs?
  - FOI (Swedish Defence Research Agency) - collaborative opportunities?
  - SAAB (prime contractor) - subcontracting opportunities?
- Is **"EU-compliant by design"** a competitive advantage?
  - Do procurement notices mention CRA/AI Act compliance?
  - Do buyers value pre-certified solutions?

**Reference:**
- EDF Work Programme 2025
- Horizon Europe Work Programme 2025 (Cluster 3: Civil Security for Society)
- PESCO projects database

---

### 11. **Practical Implementation Guidance**

**Question:** What are the most common mistakes/pitfalls when implementing EU compliance for defense AI, and what are best practices?

**Specific sub-questions:**
- What **compliance mistakes** do defense startups commonly make?
  - Underestimating audit trail complexity?
  - Not documenting AI training data provenance?
  - Assuming GDPR Article 23 exemption applies too broadly?
- What **tooling/services** exist for compliance?
  - Audit trail solutions (commercial products? Open source?)
  - AI explainability libraries (LIME, SHAP - sufficient? Better alternatives?)
  - GDPR compliance platforms (OneTrust, TrustArc - defense-compatible?)
  - CRA vulnerability management (Snyk, Dependabot - adequate?)
- What **consultants specialize** in EU defense compliance?
  - Swedish consultancies with defense + tech expertise?
  - EU-level consultancies for EDF proposal writing?
- What **timeline** should we expect?
  - From MVP to fully compliant: 6 months? 12 months? 24 months?
  - From EDF proposal submission to contract: 6 months? 12 months?
- What **internal processes** should we establish?
  - Security review board?
  - Compliance champion role?
  - Quarterly compliance audits?

---

### 12. **Nordic Collaboration Specifics**

**Question:** What are the specific opportunities and requirements for Nordic (Sweden-Finland-Estonia) defense collaboration?

**Specific sub-questions:**
- What **bilateral defense agreements** exist between Sweden-Finland?
  - Can Swedish BH be shared with Finland automatically?
  - Does Finland use equivalent classification system?
- What is **NORDEFCO** (Nordic Defence Cooperation)?
  - Does it have procurement implications?
  - Are there NORDEFCO-specific compliance requirements?
- What about **Baltic cooperation** (Sweden-Estonia-Latvia-Lithuania)?
  - Joint procurement opportunities?
  - Tallinn-Stockholm defense tech corridor?
- Are there **Nordic EDF consortia** we could join?
  - Existing networks of defense SMEs?
  - FOI-VTT Finland collaboration opportunities?

---

## Deliverables Requested

Please provide:

1. **Executive Summary** (2-3 pages)
   - Key findings
   - Critical compliance gaps in current Red Forge implementation
   - Top 3 priorities for next 6 months

2. **Detailed Report** (20-30 pages)
   - Answers to all 12 research objective sections above
   - Specific citations (EU regulations, articles, paragraphs)
   - Real-world examples where available
   - Comparison tables (e.g., Swedish vs. EU vs. NATO classifications)

3. **Actionable Checklist** (1-2 pages)
   - Specific tasks with estimated effort (days/weeks)
   - Dependencies (what must be done first)
   - External dependencies (requires consultant, requires notified body, etc.)

4. **Resource Directory** (1 page)
   - Contacts: Swedish consultancies, notified bodies, EDF coordinators
   - Tools: Recommended compliance platforms, audit trail solutions
   - References: Links to all cited regulations, guidelines, standards

---

## Research Methodology Preferences

- **Prioritize EU official sources**: EUR-Lex, EDPB, ENISA, European Defence Agency
- **Include Swedish sources**: MSB, FMV, IMY (Swedish DPA), FOI
- **Seek practical examples**: Case studies, real project examples (even if anonymized)
- **Verify across sources**: If conflicting info, note it and explain why
- **Note gaps**: If information is not publicly available, state so explicitly
- **Provide cost estimates**: Where possible, include ballpark figures (even if wide range)

---

## Timeline

**Urgency:** Moderate-High  
**Reason:** Preparing EDF proposal for Q1 2026 submission (3 months away)  
**Ideal delivery:** Within 1 week (allows time for follow-up questions)

---

## Background: Why This Matters

Red Forge is being developed as **open, EU-compliant by design** defense technology. We believe that transparency, human oversight, and ethical AI are competitive advantages in EU defense market. By building compliance into architecture from day one (rather than bolting it on later), we can:

1. Reduce time-to-market for EU projects
2. Lower compliance costs (no major refactoring needed)
3. Attract EU defense buyers who value compliance
4. Enable participation in collaborative EU projects (EDF, PESCO)
5. Demonstrate responsible AI for defense use cases

This research will directly inform:
- System architecture decisions (multi-jurisdiction classification model)
- Compliance roadmap (what to do when, with what resources)
- EDF proposal strategy (which calls to target, which partners to recruit)
- Product positioning (how to market "EU-compliant by design")

Thank you for this comprehensive research!

