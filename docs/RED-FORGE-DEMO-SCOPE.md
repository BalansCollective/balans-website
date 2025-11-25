# Red Forge Demo - Scope for Jonatan Korpi Meeting

## ✅ What's Working (100%)

### 1. Classification-Aware File Viewing
- Swedish classification levels (O, B, K, H)
- Color-coded UI (green → yellow → orange → red)
- File tree with classification badges

### 2. AI Service Security Levels
- **Claude Cloud** (O only)
- **SaaS Lumen** (O, B)
- **Red Forge Local** (O, B, K)
- **Red Forge Air-Gap** (All levels)

### 3. Classification Enforcement
- Blocks sending K files to Claude Cloud
- Shows enforcement modal with suggested upgrade
- Audit log tracks all attempts

### 4. Weaver AI Assistant (Chat)
- Chat with AI about loaded files
- Streaming responses with MDX rendering
- Mermaid diagram support
- Context management (explicitly add files)

### 5. Audit Trail
- All AI interactions logged
- Classification compliance tracking
- Export Chronicle (JSON)

---

## 🚧 Deferred for Later (Not in Demo)

### File Editing / Declassification
**Why deferred:**
- Cline's V4A patch format is complex to get 100% right
- AI needs careful prompting to avoid over-editing
- Diff viewer works, but edge cases remain
- Want ALL features working 100%, not 80%

**Future implementation:**
1. Right-click → "Declassify to B"
2. AI rewrites content (removes K-level details)
3. Shows diff for human approval
4. Downloads declassified version

**Work done (ready to continue):**
- ✅ Extracted Cline's patch parser to `weaver/typescript/patch-parser/`
- ✅ Integrated into `BrowserWeaverAssistant`
- ✅ Created `FileModificationModal` with Monaco diff viewer
- ✅ System prompt based on Cline's tool description
- 🚧 Needs more testing and edge case handling

---

## 📊 Demo Flow for Jonatan

### Scenario: BirdTurret V3.5 Technical Specs

1. **Show file tree**
   - "Here's our classified document repository"
   - Point out color-coded classifications

2. **Try to send K file to Claude**
   - Click "Skicka till AI" on BirdTurret V3.5 (K)
   - Enforcement modal pops up: "Cannot send K to Claude Cloud"
   - Shows suggestion: "Upgrade to Red Forge Local"

3. **Switch to Red Forge Local**
   - Select from AI service dropdown
   - Now can send K files
   - Audit log shows: "Allowed (Red Forge Local)"

4. **Chat with AI about specs**
   - "What weapon system does V3.5 use?"
   - AI reads file content and answers
   - Streaming response with Mermaid diagram

5. **Show Audit Log**
   - All interactions tracked
   - Classification compliance visible
   - Export Chronicle for regulatory review

---

## 🎯 Key Message

**"Classification-aware AI routing with human-in-the-loop governance"**

- AI can't accidentally leak secrets (enforcement)
- Every interaction logged (audit)
- Flexible (upgrade service when needed)
- Transparent (show what AI sees)

---

## 🔮 Future: Declassification Workflow

*Not in this demo, but architecture supports it:*

1. Right-click file → "Declassify to B"
2. AI analyzes K-level content
3. Proposes redacted version (diff view)
4. Human approves → Downloads B-classified version
5. Audit logs: "K → B declassification by [user], approved [timestamp]"

**Uses Cline's V4A patch format** (already integrated, needs polish)

---

## 📦 What's Been Built

### Weaver Patch Parser (`weaver/typescript/patch-parser/`)
- Extracted from Cline (Apache 2.0)
- Browser-compatible TypeScript
- Fuzzy matching (handles whitespace diffs)
- Context-based patching (no brittle line numbers)
- Ready for declassification use case

### Integration
- `BrowserWeaverAssistant.proposeFileModifications()`
- `FileModificationModal` (diff viewer)
- `DiffViewer` (Monaco side-by-side)
- Classification upgrade/downgrade detection

---

## ✅ Commit Status

All core demo features committed to `balans-website` (main branch).
Patch parser in `weaver/typescript/patch-parser/` (reusable for other projects).

**Ready for meeting! 🚀**

