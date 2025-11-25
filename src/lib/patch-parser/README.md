# @weaver/patch-parser

**Cline V4A Patch Format** - Browser-compatible TypeScript implementation for AI-assisted file editing.

Extracted from [Cline](https://github.com/cline/cline) (Apache 2.0 License) and made reusable.

---

## Why This Exists

**Problem:** User says "change shotgun to lidar in line 42"  
**Bad AI behavior:** Changes ALL shotguns, upgrades classification unnecessarily, loses user intent  
**Cline's solution:** AI generates precise diff patches with context, only changes what's specified

---

## V4A Patch Format

```bash
apply_patch <<"EOF"
*** Begin Patch
*** Update File: path/to/file.md
@@ section context (optional)
 line before (context)
 line before (context)
-old line (to delete)
+new line (to insert)
 line after (context)
 line after (context)
*** End Patch
EOF
```

### Features:
- ✅ **Context-based matching** (no brittle line numbers)
- ✅ **Fuzzy matching** (tolerates whitespace differences)
- ✅ **Multiple chunks** (several edits in one file)
- ✅ **Add/Update/Delete/Move** operations
- ✅ **@@ section markers** for disambiguation
- ✅ **Warning system** (skips bad chunks, reports similarity scores)

---

## Usage

### 1. Ask AI to generate patch

**System Prompt:**
```typescript
const systemPrompt = `Generate a V4A diff patch for user request: "${userRequest}"

*** Update File: ${filename}
@@ relevant section (if needed)
 ... context lines (3 before/after) ...
- exact line to change
+ replacement line
 ... context lines ...

RULES:
1. ONLY change lines user explicitly mentioned
2. Use 3 lines of context before/after each change
3. If ambiguous, use @@ markers (class/function names)
4. Multiple changes = multiple chunks in ONE patch
5. NEVER change classification unless user explicitly asked

OUTPUT: Return ONLY the patch (no explanation).
`;
```

### 2. Parse AI response

```typescript
import { PatchParser, applyPatch } from '@weaver/patch-parser';

// AI returns patch text
const patchText = aiResponse;

// Parse it
const lines = patchText.split('\n');
const parser = new PatchParser(lines, { [filename]: originalContent });
const { patch, fuzz } = parser.parse();

// Apply it
const results = applyPatch(patch, { [filename]: originalContent });

// Get modified content
const newContent = results.find(r => r.path === filename)?.newContent;
```

### 3. Show diff to user for approval

```typescript
// Use Monaco DiffEditor or similar
<DiffViewer
  original={originalContent}
  modified={newContent}
  language="markdown"
/>
```

---

## API

### `PatchParser`

```typescript
constructor(lines: string[], currentFiles: Record<string, string>)

parse(): { patch: Patch; fuzz: number }
```

- `lines`: Patch text split by `\n`
- `currentFiles`: Map of filename → content
- Returns: `patch` (parsed structure) + `fuzz` (match quality score)

### `applyPatch`

```typescript
applyPatch(patch: Patch, originalFiles: Record<string, string>): ApplyResult[]
```

- Returns array of `{ path, newContent }` or `{ path, deleted: true }`

### Types

```typescript
interface Patch {
  actions: Record<string, PatchAction>;
  warnings?: PatchWarning[]; // Skipped chunks with similarity scores
}

interface PatchAction {
  type: 'add' | 'update' | 'delete';
  chunks: PatchChunk[];
  newFile?: string; // For ADD
  movePath?: string; // For MOVE
}

interface PatchChunk {
  origIndex: number; // Line number in original
  delLines: string[]; // Lines to remove
  insLines: string[]; // Lines to insert
}
```

---

## Why Not Simple Search-Replace?

| Feature | Search-Replace | V4A Patch |
|---------|---------------|-----------|
| **Precision** | Replaces ALL matches | Only specified context |
| **Ambiguity** | Can't handle duplicates | @@ markers disambiguate |
| **Multi-edit** | One replacement at a time | Multiple chunks in one patch |
| **Robustness** | Whitespace-sensitive | Fuzzy matching tolerates diffs |
| **AI Control** | AI picks what to change | Human specifies context |

**Example:**
```
File has "shotgun turret" 50 times.
User: "Change shotgun to lidar in the BirdTurret V3 specs"

Search-Replace: Changes ALL 50 instances ❌
V4A Patch: Changes ONLY the one in "BirdTurret V3" context ✅
```

---

## License

Apache 2.0 (same as Cline)

**Attribution:** Extracted from [Cline by Cline Team](https://github.com/cline/cline)

---

## Integration Example (Red Forge)

```typescript
// balans-website/src/lib/weaver/browser-weaver-assistant.ts
import { PatchParser, applyPatch } from '@weaver/patch-parser';

async proposeFileModifications(file: FileMetadata, request: string) {
  // 1. Ask AI for patch
  const patch = await this.openrouter.chat([{
    role: 'system',
    content: buildPatchSystemPrompt(file, request)
  }]);

  // 2. Parse patch
  const parser = new PatchParser(
    patch.split('\n'),
    { [file.name]: file.content }
  );
  const { patch: parsed, fuzz } = parser.parse();

  // 3. Apply patch
  const results = applyPatch(parsed, { [file.name]: file.content });

  // 4. Return for user approval
  return {
    originalContent: file.content,
    modifiedContent: results[0].newContent,
    warnings: parsed.warnings
  };
}
```

---

## Development

```bash
# Build
cd weaver/typescript/patch-parser
pnpm install
pnpm build

# Use in balans-website
cd ../../../balans-website
pnpm add @weaver/patch-parser@file:../../weaver/typescript/patch-parser
```

---

**Status:** ✅ Extracted, 🚧 Integrating into Red Forge

