# Weaver Stream - Interactive CLI with MDX

**Added to existing `weaver-ui` Tauri app as new tab: 🧠 Weaver CLI**

---

## What It Does

1. **Input:** Type weaver commands (e.g., `memory query "dispatch pattern"`)
2. **Execute:** Spawns `weaver` CLI process via Tauri shell plugin
3. **Stream:** Real-time stdout streaming as command runs
4. **Render:** Toggle between Raw (plain text) and MDX (formatted) output

---

## Setup Required

### 1. Enable Tauri Shell Plugin

Edit `weaver/weaver-ui/src-tauri/Cargo.toml`:

```toml
[dependencies]
tauri-plugin-shell = "2"
```

### 2. Register Plugin

Edit `weaver/weaver-ui/src-tauri/src/main.rs`:

```rust
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 3. Configure Permissions

Edit `weaver/weaver-ui/src-tauri/capabilities/default.json`:

```json
{
  "permissions": [
    "shell:allow-execute",
    "shell:allow-spawn"
  ]
}
```

---

## Usage

1. **Start Tauri app:**
   ```bash
   cd weaver/weaver-ui
   npm run tauri dev
   ```

2. **Click "🧠 Weaver CLI" tab**

3. **Enter command:**
   - `memory query "dispatch pattern"`
   - `chronicle show --since 2024-11-13`
   - `patterns list`

4. **Toggle MDX/Raw** to switch rendering modes

---

## MDX Rendering

**Raw mode:** Plain text output  
**MDX mode:** Formatted with:
- Headings
- Lists
- Code blocks
- Tables
- Custom components

---

## Next Steps

1. **Install shell plugin**
2. **Test with `weaver` CLI** (needs to be in PATH or provide full path)
3. **Iterate on MDX components** (add charts, timelines, etc.)

---

**Status:** ✅ Code complete, needs Tauri config + weaver CLI to test


