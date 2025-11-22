# Red Forge IDE Implementation Plan

**Status**: Active Development
**Last Updated**: November 21, 2025
**Version**: 0.1.0

---

## 🎯 **Mission Statement**

Build Red Forge IDE as a **secure AI-assisted development environment** that demonstrates classification-aware collaborative coding, starting with web demo and scaling to desktop/server architecture.

---

## 📊 **Current Status**

### **✅ Completed**
- [x] Architecture decision: Hybrid approach (shared packages in weaver, demo in balans-website)
- [x] Hardware specification: RTX 4090 demo server
- [x] LLM strategy: OpenRouter for web demo, local models for desktop
- [x] Authentication plan: OAuth first, BankID later
- [x] Declassification workflow design
- [x] Collective coordination concept (browser TS first)

### **🔄 In Progress**
- [ ] Core package structure in weaver/
- [ ] OpenRouter integration
- [ ] Monaco editor setup
- [ ] Basic IDE UI in balans-website

### **📋 Planned**
- [ ] Declassification demo workflow
- [ ] Browser Weaver collective coordination
- [ ] Classification filtering UI
- [ ] Session persistence (IndexedDB)
- [ ] User testing and feedback

---

## 🏗️ **Architecture Overview**

### **Phase 1: Web Demo (Pure TypeScript)**
```
weaver/packages/
├── red-forge-core/         # Shared core logic
│   ├── src/
│   │   ├── editor/         # Monaco wrapper
│   │   ├── llm/            # OpenRouter client
│   │   ├── weaver/         # Browser collective
│   │   └── declassification/ # Security workflow
│   └── package.json        # Publishable package

balans-website/src/
├── pages/defense/RedForgeIDE.tsx
├── components/red-forge/    # UI components
└── hooks/                   # React hooks
```

### **Phase 2: Desktop Migration (TypeScript + Rust)**
```
weaver/apps/
├── web-demo/               # Web version (Vite)
└── desktop/                # Desktop version (Tauri + Rust)
```

---

## 📅 **Detailed Timeline**

### **Week 1: Foundation (Nov 22-28)**
- [ ] Day 1: Create weaver/packages/red-forge-core/
- [ ] Day 2: Setup Monaco editor integration
- [ ] Day 3: OpenRouter API client
- [ ] Day 4: Basic IDE layout in balans-website
- [ ] Day 5: LLM query/response UI

**Milestone**: Working IDE with AI assistance

### **Week 2: Core Features (Nov 29-Dec 5)**
- [ ] Day 6: Declassification workflow mockup
- [ ] Day 7: Browser collective coordination
- [ ] Day 8: Task assignment UI
- [ ] Day 9: Classification filtering
- [ ] Day 10: Session persistence

**Milestone**: Complete web demo ready for testing

### **Week 3: Polish & Testing (Dec 6-12)**
- [ ] Day 11: UI/UX improvements
- [ ] Day 12: Error handling
- [ ] Day 13: Performance optimization
- [ ] Day 14: User testing preparation
- [ ] Day 15: Documentation updates

**Milestone**: Production-ready web demo

---

## 🚀 **Execution Plan**

### **Phase 1: Core Package (weaver)**
```bash
# Create shared package
cd weaver/packages
mkdir red-forge-core
cd red-forge-core
npm init -y
npm install monaco-editor openrouter react typescript
```

**Build core components:**
- Monaco editor wrapper
- OpenRouter LLM client
- Basic collective coordination (browser-compatible)
- Declassification workflow

### **Phase 2: Web Demo (balans-website)**
```bash
# In balans-website
npm install @weavermesh/red-forge-core
```

**Create demo page:**
- Import shared components
- Add web-specific UI
- Deploy as `/red-forge-ide`

### **Phase 3: Desktop Version (weaver)**
```bash
# In weaver/apps/desktop
npm install @weavermesh/red-forge-core
# Add Tauri + Rust backend
```

---

## 💾 **Data Persistence Strategy**

### **Browser Storage (Web Demo)**
```typescript
// IndexedDB for session persistence
const useSessionStorage = () => {
  const [sessions, setSessions] = useState([]);

  const saveSession = (sessionData) => {
    // IndexedDB persistence
    indexedDB.save('weaver-sessions', sessionData);
  };

  return { sessions, saveSession };
};
```

### **Future: Server Migration**
- Export browser sessions to server
- Maintain compatibility between web/desktop
- Cloud sync for multi-device access

---

## 🎯 **Success Metrics**

- **Day 3**: IDE loads, basic LLM queries work
- **Day 7**: Declassification workflow demonstrable
- **Day 10**: Complete web demo ready for user testing
- **Week 2 end**: Positive user feedback, clear next steps

---

## 🚧 **Risks & Mitigations**

### **High-Risk Items**
1. **OpenRouter API limits** → Have backup Claude direct integration
2. **Browser storage limits** → Implement smart data management
3. **User adoption** → Focus on clear value proposition

### **Dependencies**
- OpenRouter API key availability
- Monaco editor licensing
- Browser compatibility testing

### **Contingency Plans**
- If web demo struggles: Fall back to simpler single-assistant UI
- If API limits hit: Implement response caching and mock responses
- If user feedback poor: Iterate rapidly based on feedback

---

## 👥 **Team & Responsibilities**

### **Current Team**
- **Lead Developer**: Samuel (Full-stack implementation)
- **AI/UX Consultant**: Writing Group (Feedback & validation)
- **Future**: Additional developers for Rust backend

### **External Dependencies**
- OpenRouter API for LLM access
- GitHub for code hosting
- Netlify/Vercel for web deployment

---

## 🔄 **Next Steps**

### **Immediate (Today)**
1. Create weaver/packages/red-forge-core/ directory structure
2. Initialize package.json with dependencies
3. Setup basic TypeScript configuration

### **Short Term (This Week)**
1. Implement Monaco editor wrapper
2. Create OpenRouter API client
3. Build basic IDE page in balans-website

### **Long Term (Next Month)**
1. Add collective coordination features
2. Implement desktop version
3. Expand to multi-user support

---

## 📚 **Reference Documents**

- `compression/1-sources/balans-red-cell/README.md`: Complete feature overview
- `compression/1-sources/balans-red-cell/hardware-spec-rtx4090-demo-server.md`: Hardware requirements
- `weaver/knowledge/guides/multi-chat-coordination-workflow.md`: Weaver coordination reference
- `compression/99-output/lumens/process/planning-framework.md`: Development methodology

---

## 📝 **Change Log**

- **v0.1.0** (Nov 21): Initial plan creation
- Architecture: Hybrid weaver/balans-website approach
- Timeline: 3-week web demo completion
- Focus: Single assistant with declassification demo

---

*This plan will be updated weekly based on progress and feedback.*

---

## 🔗 **Related Files**
- **Weaver Components**: `weaver/packages/red-forge-core/`
- **Web Demo**: `balans-website/src/pages/defense/RedForgeIDE.tsx`
- **Previous Plan**: `compression/1-sources/balans-red-cell/RED-FORGE-IMPLEMENTATION-PLAN.md`
