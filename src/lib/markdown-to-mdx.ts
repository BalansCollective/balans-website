/**
 * Markdown to MDX Preprocessor
 * 
 * Transforms standard markdown (written by agents) into MDX that can render components.
 * 
 * Transformations:
 * - ```mermaid blocks → <Mermaid chart={`...`} />
 * - Preserves all other markdown syntax
 */

export function preprocessMarkdownToMDX(markdown: string): string {
  // Transform mermaid code blocks to Mermaid component
  const mermaidPattern = /```mermaid\n([\s\S]*?)```/g;
  
  let processed = markdown.replace(mermaidPattern, (match, code) => {
    // Escape backticks in the mermaid code
    const escapedCode = code.trim();
    return `<Mermaid chart={\`${escapedCode}\`} />`;
  });
  
  return processed;
}

/**
 * Example usage:
 * 
 * const agentMarkdown = `
 * # System Flow
 * 
 * ```mermaid
 * graph TD
 *     A[Start] --> B[End]
 * ```
 * `;
 * 
 * const mdx = preprocessMarkdownToMDX(agentMarkdown);
 * // Result:
 * // # System Flow
 * //
 * // <Mermaid chart={`graph TD
 * //     A[Start] --> B[End]`} />
 */

