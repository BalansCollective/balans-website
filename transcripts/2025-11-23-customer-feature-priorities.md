# Design Session: Customer Feature Priorities (Startup vs Enterprise)

**Date:** 2025-11-23  
**Session Type:** Product-Market Fit Discovery  
**Trigger:** Sam wants to prioritize demo features based on what customers ACTUALLY want (not just cool tech)  
**Goal:** Put demo in front of customers, measure pull, implement what gets traction  
**Participants:** Sam (Product Owner), Thorne (Implementation), Raven (Marketing), Morgan (UX), External Advisors (Swedish Defense Startup Founder, SAAB Engineer, FOI Researcher)

---

## 🎯 The Question

**Sam:**
> "What features should we demo to get PULL from customers? We want to know what to implement for real, not just build a web mock/tracer."

**Translation:**
- Build minimal demo
- Show to real customers (startups, SAAB, FOI)
- Measure which features get "When can I have this?" reaction
- Implement those FIRST (not what we think is cool)

---

## 👥 Customer Segments

### 1. Swedish Defense Startups (3-15 people)

**Example:** 8-person team building drone software for FMV project

**Pain points:**
- Can't use ChatGPT (GDPR violation)
- On-prem AI too expensive (€50K setup)
- Need AI help but scared of leaks
- FMV audit coming up (need compliance proof)

**Budget:** €100-500/month (tight, early-stage)

**Decision maker:** CTO or technical co-founder

**Key question:** "Will this help me ship faster without violating FMV policy?"

---

### 2. SAAB Engineers (Large Organization)

**Example:** Senior engineer with SECRET clearance working on weapons system

**Pain points:**
- Existing SCIF is annoying (slow access, outdated hardware)
- Can't use AI at all (security policy)
- Copy-pasting code is tedious
- Need compliance for everything (audit trail required)

**Budget:** €500-5,000/month per team (10-50 engineers)

**Decision maker:** Engineering manager + security team approval

**Key question:** "Is this more secure than what we have? Can we prove it to security?"

---

### 3. FOI Researchers (Government Research)

**Example:** Research team studying AI security, want to test classification systems

**Pain points:**
- Need to evaluate classification-aware tools
- Want to publish research papers (need access to internals)
- Academic mindset (open-source preferred)
- Budget constraints (government funding)

**Budget:** €0-200/month (prefer free/open-source)

**Decision maker:** Research lead + procurement

**Key question:** "Can we study this system? Will you publish the approach?"

---

## 🎨 Feature Priority Matrix

### Startup Founder's Perspective (External Advisor)

**Name:** Erik (fictional composite - 5-person defense startup)

**"Must Have" (Would Pay €149/month For):**
1. **BankID authentication** - "I already use this for everything. Zero friction."
2. **Classification-aware editor** - "Show me what's safe to share vs secret. I'm paranoid."
3. **AI that understands FMV** - "ChatGPT suggests npm packages. I need defense-appropriate advice."
4. **Audit trail export** - "FMV audit in 3 months. I need proof I didn't leak to OpenAI."

**"Nice to Have" (Might Pay Extra):**
5. **Keyword detection** - "Warn me if I put 'AES-256' in public docs. I make mistakes."
6. **Declassification wizard** - "Extract public API from internal code. Save me time."

**"Don't Care" (Won't Pay For):**
7. ❌ OTP USB - "Too complex. BankID is good enough for CONFIDENTIAL work."
8. ❌ Air-gapped mode - "We don't have SECRET clearance. Don't need this."
9. ❌ Multi-platform support - "We're all on Mac. Don't care about Windows."

**Key insight:** Startups want SIMPLE + COMPLIANT. Not maximum security, just "good enough for FMV."

---

### SAAB Engineer's Perspective (External Advisor)

**Name:** Anna (fictional composite - SAAB engineer, SECRET clearance)

**"Must Have" (Company Would Pay €5K/month For Team):**
1. **Air-gapped mode** - "We work in SCIF. No internet. USB + Zenoh is brilliant."
2. **OTP encryption** - "Security team will love this. Theoretically unbreakable = easy approval."
3. **Chronicle audit trail** - "We need immutable logs. Export to our compliance system."
4. **Multi-user teams** - "10 engineers share project. Need role-based access."

**"Nice to Have" (Would Use If Available):**
5. **Declassification workflow** - "We constantly need to extract public docs from classified code."
6. **BankID fallback** - "For non-classified work outside SCIF, BankID is convenient."

**"Don't Care" (Not Relevant):**
7. ❌ Cheap pricing - "€500/month is nothing. We spend €5K/month on GPU for worse AI."
8. ❌ Startup branding - "Don't care if it's 'lagom' or 'ironic'. Care if it's FMV-certified."

**Key insight:** Enterprise wants MAXIMUM SECURITY + COMPLIANCE. Cost is irrelevant, approval process is critical.

---

### FOI Researcher's Perspective (External Advisor)

**Name:** Dr. Lisa (fictional composite - AI security researcher)

**"Must Have" (For Research Value):**
1. **Open-source IDE** - "I need to study the classification logic. Publish code on GitHub."
2. **Published papers** - "Classification-aware AI is novel. Let's co-author a paper."
3. **Academic license** - "Free for research. We'll cite you in publications."
4. **Extensible architecture** - "I want to experiment with different classification models."

**"Nice to Have" (For Practical Use):**
5. **BankID authentication** - "Convenient for Swedish researchers."
6. **Audit trail** - "Good for studying classification behavior over time."

**"Don't Care" (Not Research-Relevant):**
7. ❌ Commercial pricing - "We have no budget for SaaS tools."
8. ❌ Enterprise features - "Air-gapped mode is cool but not research priority."
9. ❌ Marketing fluff - "Don't care about 'lagom' branding. Care about technical merit."

**Key insight:** Academics want OPEN + NOVEL. Revenue opportunity is low, but credibility/research value is high.

---

## 🎯 Raven's Market Analysis

### Segment Size & Revenue Potential

| Segment | # Orgs (Sweden) | Avg Team Size | Monthly Price | TAM (Sweden) |
|---------|----------------|---------------|---------------|--------------|
| **Defense Startups** | ~30 | 8 | €149 | €4,470/month |
| **SAAB Teams** | ~50 teams | 20 | €500 | €25,000/month |
| **FOI Research** | ~10 labs | 5 | €0 (academic) | €0 |
| **Total** | 90 | - | - | **€29,470/month** |

**TAM = Total Addressable Market (Sweden only)**

**Expansion potential:**
- Norway, Finland, Denmark: 3x market (€88K/month)
- Germany, Poland, France: 10x market (€295K/month)
- US defense contractors: 100x market (€2.9M/month) - but requires ITAR compliance

---

### Go-to-Market Strategy (Revised)

**Phase 1: Land Startups (Month 1-3)**
- Target 10 startups (easy to reach via LinkedIn, FMV events)
- Message: "ChatGPT but GDPR-compliant, €149/month"
- Demo: BankID + classification editor + audit trail
- Goal: 5 paying customers (€745/month MRR)

**Phase 2: Pilot with SAAB (Month 4-6)**
- Approach 2-3 SAAB teams via connections
- Message: "Air-gapped AI with OTP encryption, cheaper than your SCIF"
- Demo: USB + Zenoh + Chronicle audit
- Goal: 1 pilot (€500/month), expansion to 5 teams (€2,500/month)

**Phase 3: Academic Validation (Month 6-12)**
- Partner with FOI on research paper
- Open-source the IDE (keep LLM backend proprietary)
- Present at Swedish defense conferences
- Goal: Credibility + "FOI uses Red Forge" testimonial

---

## 🧪 Morgan's Demo Feature Test

**Question:** What should we show in the demo to get PULL?

**Hypothesis:** Different segments care about different features.

### Demo Scenario 1: Startup (Minimal Viable Demo)

**Show:**
1. ✅ Open file with RESTRICTED content
2. ✅ BankID authentication popup (mock)
3. ✅ Right-click → "Ask Red Forge AI"
4. ✅ AI suggests declassification ("Remove AES-256, say 'industry-standard'")
5. ✅ Export audit log (JSON file with timestamps)

**DON'T show:**
- ❌ OTP USB (too complex, startups don't need it)
- ❌ Air-gapped mode (not relevant for CONFIDENTIAL work)
- ❌ Multi-user teams (startups are small, single-user is fine)

**Ask after demo:**
> "If this cost €149/month and was available today, would you sign up?"

**Expected reaction:**
- ✅ Positive: "Yes! When can I get this?"
- ⚠️ Neutral: "Interesting, but I need [feature X]"
- ❌ Negative: "Not worth €149/month"

**If positive → Implement for real (not just mock)**

---

### Demo Scenario 2: SAAB (Maximum Security Demo)

**Show:**
1. ✅ Air-gapped mode (no internet indicator)
2. ✅ Insert USB with OTP pad
3. ✅ Query encrypted with OTP (show hex output)
4. ✅ Sent via Zenoh (show pub/sub topics)
5. ✅ Response decrypted (show plaintext)
6. ✅ Chronicle audit trail (immutable log, exportable)

**DON'T show:**
- ❌ BankID (SAAB already has smart cards)
- ❌ Startup pricing (irrelevant for enterprise)
- ❌ "Lagom" marketing (SAAB wants serious security)

**Ask after demo:**
> "Would your security team approve this for CONFIDENTIAL work? What would they ask about?"

**Expected reaction:**
- ✅ Positive: "This is more secure than our SCIF. How do we pilot?"
- ⚠️ Neutral: "Interesting, but we need FMV certification first"
- ❌ Negative: "Our security team will never approve external AI"

**If positive → Focus on enterprise features (OTP, Zenoh, Chronicle)**

---

### Demo Scenario 3: FOI (Research Demo)

**Show:**
1. ✅ Open-source IDE code (GitHub link)
2. ✅ Classification algorithm explanation (how it works)
3. ✅ Extensible architecture (plugin system for custom classification)
4. ✅ Research collaboration offer (co-author paper)

**DON'T show:**
- ❌ Commercial pricing (academics have no budget)
- ❌ Enterprise features (not research-relevant)
- ❌ Sales pitch (focus on technical merit)

**Ask after demo:**
> "Is this novel enough for a research paper? Would you want to collaborate?"

**Expected reaction:**
- ✅ Positive: "Yes, let's write a paper. Can I study the code?"
- ⚠️ Neutral: "Interesting, but not novel enough for publication"
- ❌ Negative: "This is just applying existing classification to AI"

**If positive → Open-source IDE, co-author paper, get FOI credibility**

---

## 📊 Feature Priority (By Customer Pull)

### Tier 1: Core Features (All Segments Want)

1. **Classification-aware editor** - Visual indicators (🌐🏢🔒), tag content
2. **AI chat interface** - Ask questions, get answers
3. **Audit trail** - Chronicle logs, exportable for compliance

**Implementation priority:** HIGH (build first, demo to everyone)

---

### Tier 2: Startup Features (Highest Revenue Potential)

4. **BankID authentication** - Zero friction for Swedish users
5. **Keyword detection** - Warn if HOW keywords in PUBLIC section
6. **Declassification wizard** - Extract public docs from classified code

**Implementation priority:** MEDIUM (demo to startups, implement if they sign up)

---

### Tier 3: Enterprise Features (High Revenue, Long Sales Cycle)

7. **OTP USB encryption** - Air-gapped mode, maximum security
8. **Zenoh pub/sub** - Data diode architecture
9. **Multi-user teams** - Role-based access, shared projects

**Implementation priority:** LOW (demo to SAAB, implement if they pilot)

---

### Tier 4: Academic Features (Low Revenue, High Credibility)

10. **Open-source IDE** - GitHub repo, MIT license
11. **Research collaboration** - Co-author papers, conferences
12. **Extensible architecture** - Plugin system for custom models

**Implementation priority:** BACKLOG (do after revenue-generating features)

---

## ✅ Recommendation: Demo Strategy

### Week 1: Build Minimal Demo

**Features:**
- [✅] Classification-aware editor (already have)
- [✅] MDX renderer with filtering (already have)
- [ ] BankID authentication (mockup)
- [ ] AI chat interface (hardcoded responses)
- [ ] Audit trail export (JSON download)

**Estimated time:** 8-10 hours

---

### Week 2: Customer Interviews (3 Segments)

**Startup:**
- Show: BankID + classification editor + audit trail
- Ask: "€149/month - would you sign up?"
- Measure: Yes/No/Maybe + feature requests

**SAAB:**
- Show: OTP USB + Zenoh + Chronicle (slides + mockup)
- Ask: "Would security approve? What's missing?"
- Measure: Pilot interest + certification requirements

**FOI:**
- Show: Open-source pitch + research collaboration
- Ask: "Novel enough for paper? Want to collaborate?"
- Measure: Research interest + publication potential

---

### Week 3: Implement Based on Pull

**If startups say "YES":**
- ✅ Implement BankID (real integration)
- ✅ Implement OpenRouter AI (real backend)
- ✅ Implement Chronicle (real database)
- 🚀 Launch Starter tier (€49/month)

**If SAAB says "YES":**
- ✅ Build OTP USB prototype
- ✅ Set up Zenoh router
- ✅ Security whitepaper for approval
- 🚀 Pilot with 1 SAAB team (€500/month)

**If FOI says "YES":**
- ✅ Open-source IDE on GitHub
- ✅ Write research paper draft
- ✅ Present at Swedish defense conference
- 🎓 Academic credibility achieved

**If everyone says "NO":**
- ⚠️ Pivot: Find out WHY (price? features? trust?)
- ⚠️ Iterate: Fix blocking issues, re-demo
- ⚠️ Worst case: Kill project (no market)

---

## 🎯 Success Metrics (After Demos)

**Startup Success:**
- 3+ say "I would sign up today" → BUILD IT
- 1-2 say "Maybe" → ITERATE (find blocking issues)
- 0 say "Yes" → PIVOT or KILL

**SAAB Success:**
- 1+ pilot agreement → BUILD ENTERPRISE FEATURES
- Security questions but interest → ANSWER OBJECTIONS, RE-PITCH
- Hard "No" → FOCUS ON STARTUPS ONLY

**FOI Success:**
- Research collaboration agreement → OPEN-SOURCE + CO-AUTHOR
- Interest but no commitment → SHARE DRAFT, REVISIT LATER
- No interest → SKIP ACADEMIC ROUTE

---

## 📋 Action Items (This Week)

**Monday-Tuesday: Finish Demo**
- [ ] Add BankID mockup (authentication popup)
- [ ] Add AI chat (hardcoded responses)
- [ ] Add audit trail export (download JSON)
- [ ] Record 2-min demo video

**Wednesday-Friday: Customer Interviews**
- [ ] Reach out to 3 startups (LinkedIn, email)
- [ ] Reach out to 2 SAAB contacts (personal network)
- [ ] Reach out to 1 FOI researcher (email, cold)
- [ ] Schedule 30-min demos (Zoom)

**Next Week: Implement Based on Pull**
- [ ] If positive: Start real implementation
- [ ] If neutral: Iterate, re-demo
- [ ] If negative: Pivot or kill

---

## 🎭 The Meta-Question (Raven)

**Sam's real question:**
> "Should we build cool tech (OTP, Zenoh, air-gap) or useful features (BankID, audit logs, keyword detection)?"

**Answer:** **TEST, DON'T GUESS.**

- Cool tech (OTP) = Enterprise want, Startups don't
- Useful features (BankID) = Startups want, Enterprise don't care
- **Both** have markets, but DIFFERENT segments

**Strategy:**
1. Demo minimal to ALL segments
2. See who pulls HARDEST
3. Build for that segment FIRST
4. Expand to other segments LATER

**Don't build everything hoping someone wants it. Build what ONE customer desperately needs, then expand.**

---

**Design Group: APPROVED ✅**  
**Next: Finish demo → Interview customers → Implement based on pull.**


