/**
 * Remark plugin to transform ```mermaid blocks into JSX <Mermaid /> components
 * This runs BEFORE MDX compilation
 * 
 * Based on MDX guides: https://mdxjs.com/guides/syntax-highlighting/
 */
import { visit } from 'unist-util-visit';
import type { Root, Code } from 'mdast';

export function remarkMermaid() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code, index, parent) => {
      if (node.lang === 'mermaid' && node.value) {
        console.log('remarkMermaid: Found mermaid block!', node.value.substring(0, 50));
        
        // Create MDX JSX element
        const jsxNode: any = {
          type: 'mdxJsxFlowElement',
          name: 'Mermaid',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'chart',
              value: node.value
            }
          ],
          children: [],
          data: { _mdxExplicitJsx: true }
        };
        
        // Replace the code node with JSX node
        if (parent && typeof index === 'number') {
          parent.children[index] = jsxNode;
        }
      }
    });
  };
}

