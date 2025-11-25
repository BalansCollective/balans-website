import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import { MermaidDiagram } from './MermaidDiagram';
import type { Classification } from './DemoDataLoader';

interface MDXRendererProps {
  content: string;
  classification: Classification;
}

export function MDXRenderer({ content, classification }: MDXRendererProps) {
  // Get color based on classification
  const getClassificationColor = () => {
    switch (classification) {
      case 'hemlig': return 'bg-red-700';
      case 'konfidentiell': return 'bg-red-500';
      case 'begransad-hemlig': return 'bg-orange-500';
      case 'oklassificerad': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getClassificationLabel = () => {
    switch (classification) {
      case 'hemlig': return 'HEMLIG';
      case 'konfidentiell': return 'KONFIDENTIELL';
      case 'begransad-hemlig': return 'BEGRÄNSAD HEMLIG';
      case 'oklassificerad': return 'OKLASSIFICERAD';
      default: return classification.toUpperCase();
    }
  };

  return (
    <div className="relative h-full overflow-y-auto scrollbar-dark">
      {/* Static classification indicator line - left side of entire document */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getClassificationColor()}`} />
      
      {/* Content */}
      <div className="prose prose-invert max-w-none pl-6 py-6">
        
        <style jsx>{`
          .scrollbar-dark::-webkit-scrollbar {
            width: 12px;
          }
          .scrollbar-dark::-webkit-scrollbar-track {
            background: #0d1117;
          }
          .scrollbar-dark::-webkit-scrollbar-thumb {
            background: #30363d;
            border-radius: 6px;
          }
          .scrollbar-dark::-webkit-scrollbar-thumb:hover {
            background: #484f58;
          }
        `}</style>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : 'text';
                    const inline = props.inline;
                    const code = String(children).replace(/\n$/, '');
                    
                    // Handle Mermaid diagrams
                    if (!inline && language === 'mermaid') {
                      // Use hash of code for stable ID across re-renders
                      const codeHash = code.split('').reduce((acc, char) => {
                        return ((acc << 5) - acc) + char.charCodeAt(0);
                      }, 0);
                      const diagramId = `mermaid-file-${Math.abs(codeHash)}`;
                      return <MermaidDiagram chart={code} id={diagramId} />;
                    }

                    return !inline ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={language}
                        PreTag="div"
                        className="rounded-md my-2"
                        {...props}
                      >
                        {code}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  },
            h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-100 mt-6 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-semibold text-gray-200 mt-5 mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-semibold text-gray-300 mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-3">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 space-y-1 mb-3">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 space-y-1 mb-3">{children}</ol>,
                  a: ({ href, children }) => (
                    <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-red-500 pl-4 italic text-gray-400 my-3">{children}</blockquote>
                  ),
                }}
              >
          {content}
              </ReactMarkdown>
      </div>
    </div>
  );
}
