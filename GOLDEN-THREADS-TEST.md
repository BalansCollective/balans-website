# Golden Threads Test Page - Quick Start

## 🚀 How to Run

```bash
cd /Users/samuellindgren/Dev/weavermesh/weaver/weaver-ui

# Install dependencies (if not already done)
pnpm install

# Run the Tauri app in dev mode
pnpm tauri dev
```

## 🎨 What You'll See

The app will launch with a new **"✨ Golden Threads"** tab (set as default).

### Test Page Features

1. **Live Demo Input**
   - Type in the input field to see threads react in real-time
   - Threads pulse and flow as you type
   - Color transitions from Gold → Purple

2. **Manual Controls**
   - Toggle "Human Typing" to simulate typing
   - Toggle "AI Processing" to simulate AI response
   - Adjust intensity slider for animation speed
   - Quick presets: Idle, Human Typing, AI Processing, Full Collaboration

3. **Color Reference**
   - Visual guide showing Gold → Purple transition
   - Archetypal meanings explained

4. **Documentation**
   - Touch progress system details
   - Sacred Alliance archetype explanation
   - Performance metrics

## 🎯 What to Experiment With

### Basic Flow
1. Click "✨ Golden Threads" tab
2. Type in the input field → watch threads turn gold and pulse
3. Toggle "AI Processing" → threads turn purple faster
4. Let it idle → threads fade back to gold

### Advanced Testing
- **Intensity slider**: See how thread motion changes
- **Dark mode toggle** (top right): Watch threads adapt colors
- **Preset buttons**: Quickly test different states
- **Manual toggles**: Fine control over typing/processing states

## 🎨 Design Details

**Color Transitions**:
- **Gold** (`#c9a96e` light, `#daa545` dark): Creative conjecture (human)
- **Purple** (`#6b5b95` light, `#8b7bc8` dark): Collaborative emergence (human + AI)

**Touch Progress**:
- Human typing: +0.15/sec
- AI processing: +0.30/sec (faster!)
- Idle: -0.10/sec (fades back)
- Threshold: >0.5 = purple

**Performance**:
- 60fps smooth animation
- ~1-2% CPU usage
- Canvas-based rendering

## 📝 Notes for Iteration

Things to try/adjust:
- Thread count (currently 5)
- Wave amplitude (currently 8-12px)
- Touch speed rates
- Color transition threshold
- Glow intensity

Edit these in:
- `src/components/GoldenThreads.tsx`

## 🐛 If Something's Wrong

**Threads not showing?**
- Check browser console for errors
- Verify Tailwind colors are loaded
- Try toggling dark mode

**App won't start?**
- Run `pnpm install` again
- Check that Tauri CLI is installed: `cargo install tauri-cli`
- Make sure Rust is up to date: `rustup update`

**Colors look wrong?**
- Dark mode might need manual toggle (top right)
- Check `tailwind.config.js` for color definitions

---

**Happy experimenting!** ✨

The threads represent the actual weaving of knowledge between human and AI—not just decoration, but a visual representation of collaborative emergence.

