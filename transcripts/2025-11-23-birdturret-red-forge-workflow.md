# Design Group Session: Red Forge IDE for Deployed BirdTurret CONOPS Development

**Date:** 2025-11-23  
**Session Type:** Workflow Design - Defense R&D in Production Environment  
**Participants:** Bruce Schneier (Security), Susan Kare (UX), Morgan (Systems), Thorne (Implementation), Samuel (User/Operator)  
**Context:** Samuel deployed in Ukraine with BirdTurret V3.5, needs to iterate on V4 CONOPS documentation using Red Forge IDE + AI assistance

---

## 🎯 Problem Statement

**Real-World Scenario:**
> Samuel is in FOB with deployed BirdTurret V3.5 system. He's writing V4 CONOPS documentation based on field observations. The CONOPS files (v1-micro-assist.md through v4-guardian-protocol.md) contain mixed classification:
> - **WHAT: UNCLASSIFIED** - System capabilities, engagement scenarios, Guardian Protocol rules
> - **HOW: CONFIDENTIAL** - Ballistic data, detection algorithms, Jetson CV specifics

**Problem:**
Samuel wants Claude/GPT-4 to help improve the UNCLASSIFIED portions (engagement scenarios, Guardian Protocol explanations, strategic analysis) but can't send the CONFIDENTIAL ballistic algorithms and sensor fusion details.

**Current Pain Points:**
1. **Multi-file references** - v4 references v1, v2, v3, v3.5 (cross-document context needed)
2. **Iterative refinement** - Need multiple AI conversations to polish narrative flow
3. **On-prem vs remote LLM** - Should use Yellow Network (on-prem) or White Network (Claude API)?
4. **Deployment constraints** - Limited bandwidth (Ukraine field deployment), need efficient workflow

---

## 🗣️ Session Transcript

### Opening: The Deployed Engineer Use Case

**Samuel:** *in FOB, Ukraine* I'm sitting here with 72 hours of field test data from V3.5. I need to write the V4 CONOPS document that explains what we learned and what V4 should do next. The problem: half of what I know is CONFIDENTIAL (shotgun ballistics, Jetson detection algorithms) and half is UNCLASSIFIED (engagement scenarios, Guardian Protocol compliance). I want Claude to help me write the UNCLASSIFIED strategic analysis, but I can't just send the whole file.

**Bruce Schneier:** Classic operational problem. You're in a deployment environment with classified material, but you need external expertise (AI) to help with the unclassified portions. This is exactly what Red Forge is built for.

**Morgan:** Let's map the workflow step-by-step. What does Samuel actually need to do?

**Samuel:** 
1. Finish drafting v3.5-shotgun-integration.md (currently 437 lines, ~50% CONFIDENTIAL)
2. Use AI to improve the UNCLASSIFIED sections (engagement scenarios, lessons learned, strategic assessment)
3. Reference findings from v1-v4 to maintain continuity
4. Iterate 3-4 times with AI to polish narrative flow
5. Final deliverable: Publication-ready CONOPS for HELM pitch + NATO briefing

---

### Challenge 1: Multi-File Context (Cross-Document References)

**Morgan:** Samuel's CONOPS files reference each other heavily. v3.5 says "improved over v2 nets" - that requires v2 context. v4 will reference v3.5 findings. How do we give Claude the right context without sending CONFIDENTIAL data from v1-v4?

**Thorne:** We need **selective multi-file extraction**. Not just "send this file" but "send UNCLASSIFIED sections from v1, v2, v3, v3.5, AND v4."

**Workflow Proposal:**

```
Step 1: Select Files for Context
────────────────────────────────
Samuel right-clicks v3.5-shotgun-integration.md
→ "Extract Unclassified for AI"
→ Modal: "Include context from related files?"
  [×] v1-micro-assist.md (WHAT only)
  [×] v2-anti-drone.md (WHAT only)
  [×] v3-autonomous-shorad.md (WHAT only)
  [ ] v4-guardian-protocol.md (skip - not referenced yet)

Step 2: Preview Extraction
───────────────────────────
┌─────────────────────────────────────────────────┐
│ 🔓 Declassification Preview                     │
│                                                 │
│ Files selected: 4 (v1, v2, v3, v3.5)            │
│ Total content: 2,847 lines                      │
│                                                 │
│ ✅ SAFE TO SEND (3,200 tokens):                │
│ ┌─────────────────────────────────────────────┐│
│ │ v1: System overview, mission objectives     ││
│ │ v2: Net launcher capabilities, success rates││
│ │ v3: SHORAD concept, engagement ranges       ││
│ │ v3.5: Shotgun integration, field test results││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ 🔒 EXCLUDED (8,100 tokens CONFIDENTIAL):       │
│ ┌─────────────────────────────────────────────┐│
│ │ - Jetson CV detection algorithms            ││
│ │ - Shotgun ballistic tables (pellet spread)  ││
│ │ - RF jammer frequency ranges                ││
│ │ - Gimbal control PID tuning parameters      ││
│ └─────────────────────────────────────────────┘│
│                                                 │
│ [ Cancel ]  [ Send to Claude (White Network) ] │
└─────────────────────────────────────────────────┘
```

**Susan Kare:** The multi-file checkbox list is key UX. Samuel needs to see which files contribute context without reading all 2,847 lines himself.

**Bruce Schneier:** And the EXCLUDED section must show **what categories** were filtered (not the actual data). "Jetson CV detection algorithms" tells Samuel "yes, that was removed" without leaking the algorithm itself.

---

### Challenge 2: Iterative Refinement with AI

**Samuel:** Once Claude sees the UNCLASSIFIED content, I need to iterate. Claude suggests rewrites, I accept some, reject others, ask follow-ups. This isn't one-shot - it's a conversation.

**Morgan:** This is where **Chronicle logging** becomes critical. Each AI interaction must be logged:
- What was sent (token count, classification level)
- What Claude suggested
- What Samuel accepted/rejected
- Why (Samuel's notes)

**Workflow: Multi-Turn AI Conversation**

```
Turn 1: Initial Request
───────────────────────
Samuel: "Improve the 'Lessons Learned' section. Make it more compelling for NATO audience."

Claude: "Here's a rewrite emphasizing cost advantage (€0.50 vs €50K) and Guardian Protocol compliance..."

Samuel: [Reviews] "Good, but add more about fiber-optic bypass success."

Turn 2: Follow-Up
──────────────────
Samuel: "Expand fiber-optic bypass section. Emphasize 100% success (3/3) vs V2's 50% (1/2)."

Claude: "Revised section:
'V3.5 shotgun integration solved V2's critical weakness: fiber-optic drone bypass. Where V2 nets achieved only 50% success (1/2 engagements), V3.5 demonstrated 100% success (3/3 kinetic intercepts at 60-70m)...'

Samuel: [Accepts] "Perfect. Import this."

Turn 3: Final Polish
────────────────────
Samuel: "Now review the entire 'Strategic Assessment' section. Make sure cost comparison (847,458× cheaper) is prominent."

Claude: [Reviews full section] "Suggested edits: Move economic comparison to opening paragraph, add NATO market growth data..."

Samuel: [Accepts 70%, rejects 30%] "Import accepted changes."
```

**Chronicle Audit Log (After 3 Turns):**

```json
{
  "session": "v3.5-conops-refinement",
  "duration_minutes": 42,
  "turns": 3,
  "files_accessed": ["v1", "v2", "v3", "v3.5"],
  "tokens_sent": {
    "turn_1": 3200,
    "turn_2": 450,
    "turn_3": 890,
    "total": 4540
  },
  "classification": "UNCLASSIFIED",
  "ai_provider": "anthropic_claude_3.5_sonnet",
  "network": "white",
  "changes_accepted": 12,
  "changes_rejected": 5,
  "operator_notes": "Emphasized fiber-optic success and cost advantage for NATO pitch"
}
```

**Thorne:** This log is the **compliance artifact**. If someone asks "How was this CONOPS written?", Samuel can export this and show: "AI assisted on UNCLASSIFIED sections only, all CONFIDENTIAL content excluded, human reviewed every change."

---

### Challenge 3: On-Prem (Yellow) vs Remote (White) LLM Choice

**Samuel:** Red Forge IDE gives me two LLM options:
1. **Yellow Network (on-prem LLM)** - Hosted in FOB, slower responses (15-30s), CONFIDENTIAL content allowed
2. **White Network (Claude API)** - Anthropic cloud, fast responses (2-5s), UNCLASSIFIED only

Which should I use for CONOPS writing?

**Morgan:** Depends on **latency tolerance** vs **security need**.

**Decision Matrix:**

| Factor | Yellow (On-Prem) | White (Claude API) |
|--------|------------------|--------------------|
| **Latency** | 15-30s | 2-5s |
| **Classification** | CONFIDENTIAL OK | UNCLASSIFIED only |
| **Quality** | Good (self-hosted Llama 3.1 70B) | Excellent (Claude 3.5) |
| **Bandwidth** | 5 KB/request (local) | 200 KB/request (API) |
| **Audit trail** | Chronicle local | Chronicle + Anthropic logs |
| **Cost** | Free (sunk cost) | €0.02/1K tokens |

**Samuel's Use Case: Writing v3.5 CONOPS (mostly UNCLASSIFIED strategic analysis)**

**Recommendation: White Network (Claude API)**

**Rationale:**
- v3.5 CONOPS strategic sections are UNCLASSIFIED (can send safely)
- Claude 3.5 better at narrative flow + NATO-style writing
- Fast iteration (2-5s responses) = better workflow
- Bandwidth acceptable (Ukraine FOB has Starlink, ~50 Mbps down)

**When to use Yellow Network:**
- Working on CONFIDENTIAL ballistic calculations
- Need AI help with Jetson CV code (can't send to external API)
- Low bandwidth environment (rural deployment, <1 Mbps)

---

### Challenge 4: Bandwidth Optimization (Deployment Constraints)

**Samuel:** Ukraine FOB has Starlink, but it's shared by 50 people. I can't hog bandwidth with massive AI requests. How do I optimize?

**Thorne:** **Token-efficient workflows**.

**Anti-Pattern (Wasteful):**
```
Samuel sends entire v3.5 CONOPS (437 lines, 11,200 tokens) to Claude for every iteration.
Result: 11,200 tokens × 3 turns = 33,600 tokens sent
Bandwidth: ~200 KB × 3 = 600 KB
Time: 12 seconds (Starlink upload)
```

**Optimized Pattern:**
```
Turn 1: Send full context (3,200 tokens UNCLASSIFIED from v1-v3.5)
Turn 2: Send only "Lessons Learned" section (450 tokens) + reference to Turn 1
Turn 3: Send only "Strategic Assessment" section (890 tokens) + reference to Turn 1
Result: 3,200 + 450 + 890 = 4,540 tokens total
Bandwidth: ~110 KB total
Time: 2-3 seconds per turn
```

**How Red Forge Implements This:**

```typescript
// Red Forge IDE tracks conversation state
interface AISession {
  contextSent: string[];  // ["v1-WHAT", "v2-WHAT", "v3-WHAT", "v3.5-WHAT"]
  tokensUsed: number;     // 3200 (initial context)
  turns: Turn[];
}

// On Turn 2, only send delta
const turn2Request = {
  context_ref: "session_xyz_turn1",  // Reference to Turn 1 context
  new_content: "Lessons Learned section (450 tokens)",
  instruction: "Improve this section, emphasize fiber-optic success"
};

// Claude sees: Turn 1 context + new 450 tokens
// Samuel sends: Only 450 tokens (not 3,200 again)
```

**Bruce Schneier:** This is why **session management** is critical. Without it, every turn re-sends full context (bandwidth waste + cost waste).

---

### Challenge 5: Cross-Document Consistency Checking

**Morgan:** Samuel is writing v4 CONOPS that references v3.5 findings. How does he ensure consistency? E.g., v4 says "v3.5 achieved 100% shotgun success" but what if v3.5 actually said "6/6 engagements"? (Those are equivalent, but AI might not know.)

**Proposed Feature: Cross-Document Fact Checking**

**Workflow:**

```
Samuel writes in v4-guardian-protocol.md:
"Building on v3.5's 100% shotgun success rate..."

Red Forge IDE:
1. Detects cross-reference: "v3.5's 100% shotgun success"
2. Queries v3.5 file: "What was shotgun success rate?"
3. Finds: "Shells Fired: 6, Hits: 6/6 (100% success rate)"
4. Validates: ✅ "100% success rate" confirmed in v3.5
5. No warning shown (fact is accurate)

If Samuel wrote "v3.5's 90% success":
1. Queries v3.5
2. Finds 6/6 (100%)
3. Warns: ⚠️ "v3.5 reported 6/6 (100%), not 90%. Update?"
```

**Susan Kare:** This is **inline validation** - like spell check, but for cross-document facts. Prevents accidental inconsistencies.

**Thorne:** Technically feasible:
- Red Forge parses all CONOPS files in workspace
- Builds fact database: "v2 nets: 12 capacity", "v3.5 shotgun: 6/6 success", etc.
- On new text, checks if cross-references match known facts
- If mismatch, underline + tooltip

**Implementation Complexity:** Medium (requires fact extraction NLP, but GPT-4 can do this)

---

## 🎯 Decisions Made

### ✅ Agreed Upon: Red Forge Workflow for BirdTurret CONOPS Development

**1. Multi-File Selective Extraction**
- Checkbox UI: Select related files (v1, v2, v3, v3.5, v4)
- Extract UNCLASSIFIED sections from all selected files
- Preview shows combined safe content + excluded categories
- Send to AI as unified context

**2. Iterative Multi-Turn Conversations**
- Session state tracked (what context was sent, which turn)
- Subsequent turns send only deltas (not full context re-send)
- Chronicle logs every turn (tokens, changes, operator notes)
- Export audit trail for compliance reporting

**3. LLM Selection Strategy**
- **Yellow Network (on-prem)**: Use for CONFIDENTIAL content, low bandwidth
- **White Network (Claude API)**: Use for UNCLASSIFIED content, fast iteration
- Red Forge IDE shows recommendation: "This content is UNCLASSIFIED. Recommend: White Network (faster)."
- User can override

**4. Bandwidth Optimization**
- Session-based context (send once, reference in subsequent turns)
- Token usage displayed in real-time: "3,200 tokens sent (initial), 450 tokens (Turn 2)"
- Warning if session exceeds 10K tokens: "Consider splitting into multiple sessions"

**5. Cross-Document Fact Validation** (Future feature)
- Parse CONOPS files for facts (success rates, costs, dates)
- Validate cross-references in real-time
- Warn on inconsistencies ("v4 says 90%, but v3.5 says 100%")

---

## 📋 Samuel's Complete Workflow (End-to-End)

### Scenario: Improving v3.5 CONOPS with AI Assistance

**Starting Point:** v3.5-shotgun-integration.md (437 lines, 50% CONFIDENTIAL)

**Step 1: Extract UNCLASSIFIED for AI Review**
```
1. Samuel opens v3.5-shotgun-integration.md in Red Forge IDE
2. Right-click → "Extract Unclassified for AI"
3. Modal shows:
   - "Include context from related files?"
   - [×] v1-micro-assist.md
   - [×] v2-anti-drone.md
   - [×] v3-autonomous-shorad.md
4. Preview shows:
   - ✅ SAFE: 3,200 tokens (engagement scenarios, Guardian Protocol, lessons learned)
   - 🔒 EXCLUDED: 8,100 tokens (ballistics, algorithms, sensor fusion)
5. Samuel reviews, confirms: "Send to Claude (White Network)"
```

**Step 2: AI Conversation (3 Turns)**
```
Turn 1: "Improve 'Lessons Learned' section for NATO audience"
→ Claude suggests rewrite emphasizing cost advantage
→ Samuel accepts 80%, rejects 20%

Turn 2: "Expand fiber-optic bypass success, compare to V2"
→ Claude adds comparison table (V2 50% vs V3.5 100%)
→ Samuel accepts all changes

Turn 3: "Polish 'Strategic Assessment', make cost comparison prominent"
→ Claude moves economic data to opening paragraph
→ Samuel accepts
```

**Step 3: Import AI Suggestions**
```
1. Red Forge shows import preview:
   - "12 changes suggested, 11 accepted, 1 rejected"
   - Diff view: green (added), red (removed), yellow (modified)
2. Samuel reviews diffs
3. Clicks "Import Changes"
4. Content merged into v3.5-shotgun-integration.md with proper classification tags
```

**Step 4: Export Audit Trail**
```
1. Samuel right-clicks file → "Export Chronicle Log"
2. System generates:
   - v3.5-conops-audit-2025-11-23.json
   - Contains: session metadata, turns, tokens, changes, operator notes
3. Attach to HELM pitch deck / NATO briefing as compliance proof
```

**Total Time:** 42 minutes  
**Total Cost:** €0.09 (4,540 tokens × €0.02/1K)  
**Bandwidth Used:** ~110 KB  
**Compliance Status:** ✅ Logged, auditable, CONFIDENTIAL content never sent

---

## 💡 Key Insights

**Bruce Schneier's Contribution:**
> "The audit trail is the product. Samuel's not just writing a CONOPS - he's producing a compliance artifact. Every AI interaction must be logged, reviewable, and exportable. This transforms 'AI-assisted writing' from a risk into a defensible process."

**Susan Kare's Contribution:**
> "Multi-file checkbox list is the UX breakthrough. Without it, Samuel has to mentally track which files contain which context. Showing 'v1: System overview, v2: Net launcher capabilities' makes the workflow transparent."

**Morgan's Contribution:**
> "Session-based context management is critical for bandwidth efficiency. Re-sending 3,200 tokens on every turn wastes bandwidth and money. Reference Turn 1 context, send only deltas. Simple concept, huge impact."

**Thorne's Contribution:**
> "Cross-document fact validation is technically feasible and high-value. GPT-4 can extract facts (success rates, costs, dates) and check consistency. This prevents 'telephone game' errors where v4 misquotes v3.5."

**Samuel's Contribution:**
> "I need fast iteration. If every AI response takes 30 seconds (Yellow Network), I lose flow. White Network (Claude API) at 2-5s keeps me in the zone. Worth the €0.02/1K token cost."

---

## 🚧 Implementation Priorities

### Phase 1: MVP (Week 1-2)
1. ✅ Single-file UNCLASSIFIED extraction
2. ✅ Preview modal (safe content + excluded categories)
3. ✅ Send to Claude API (White Network)
4. ✅ Import AI response with classification tags
5. ✅ Basic Chronicle logging (what sent, what received)

### Phase 2: Multi-File Context (Week 3-4)
6. Multi-file checkbox selection UI
7. Combined extraction preview (show which files contribute what)
8. Session-based context management (send once, reference in turns)
9. Token usage display + bandwidth optimization warnings

### Phase 3: Advanced Features (Month 2-3)
10. Cross-document fact validation (inline warnings for inconsistencies)
11. Yellow Network integration (on-prem LLM for CONFIDENTIAL content)
12. Export audit trail (compliance reporting format)
13. Bulk operations (extract from multiple files simultaneously)

---

## 📊 Success Metrics

**For Samuel's Use Case (v3.5 CONOPS Improvement):**

| Metric | Target | Achieved | Status |
|--------|--------|----------|--------|
| **Time to iterate 3 turns** | <60 min | 42 min | ✅ |
| **Bandwidth used** | <500 KB | 110 KB | ✅ |
| **Cost per session** | <€0.20 | €0.09 | ✅ |
| **CONFIDENTIAL leaks** | 0 | 0 | ✅ |
| **Audit trail completeness** | 100% | 100% | ✅ |

**For General BirdTurret Development:**
- ✅ Enable AI-assisted CONOPS writing in deployment environment
- ✅ Maintain CONFIDENTIAL classification integrity (no leaks)
- ✅ Produce compliance artifacts (audit trails for FMV/NATO)
- ✅ Bandwidth-efficient (viable on Starlink in Ukraine FOB)
- ✅ Fast iteration (2-5s AI responses keep operator in flow)

---

## 🔗 References

- `compression/1-sources/birdturret/conops/v1-micro-assist.md` - Baseline system
- `compression/1-sources/birdturret/conops/v2-anti-drone.md` - Net launcher field test
- `compression/1-sources/birdturret/conops/v3-autonomous-shorad.md` - SHORAD concept
- `compression/1-sources/birdturret/conops/v3.5-shotgun-integration.md` - Shotgun integration (this session's focus)
- `compression/1-sources/birdturret/conops/v4-guardian-protocol.md` - Next evolution (not yet written)
- `balans-website/transcripts/2025-11-23-declassification-workflow-session.md` - Original declassification workflow design
- `balans-website/transcripts/2025-11-23-red-forge-llm-value-prop.md` - LLM selection strategy

---

## 🚧 Next Session Topics

1. **V4 CONOPS Development** - Use this workflow to write v4-guardian-protocol.md from scratch
2. **Multi-Operator Workflows** - What happens when Samuel + William both edit CONOPS simultaneously?
3. **Offline Mode** - What if Starlink goes down? Can Red Forge queue AI requests for later?
4. **Export Formats** - Generate NATO briefing slides directly from CONOPS files

---

**Session End: 2025-11-23 23:45**  
**Next Session: V4 CONOPS Development (using this workflow)**

---

**End of Design Session**

