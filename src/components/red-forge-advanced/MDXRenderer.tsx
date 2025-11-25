import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { CLASSIFICATION_COLORS } from '../../lib/red-forge/design-tokens';
import type { SecurityLevel } from '../../lib/red-forge/types';

interface MDXRendererProps {
  content: string;
}

interface ClassificationBlock {
  type: 'what' | 'how' | 'untagged' | 'classification';
  level: SecurityLevel; // The actual classification level for THIS block
  content: string;
  isDefault: boolean; // True if using frontmatter defaults, false if explicit tag
}

export function MDXRenderer({ content }: MDXRendererProps) {
  const [blocks, setBlocks] = useState<ClassificationBlock[]>([]);
  const [defaultClassification, setDefaultClassification] = useState<{
    what: SecurityLevel;
    how: SecurityLevel;
  }>({ what: 'UNCLASSIFIED', how: 'UNCLASSIFIED' });

  useEffect(() => {
    parseContent(content);
  }, [content]);

  const parseContent = (text: string) => {
    // Parse frontmatter for default classification
    const frontmatterMatch = /^---\n([\s\S]*?)\n---/m.exec(text);
    let defaultWhat: SecurityLevel = 'UNCLASSIFIED';
    let defaultHow: SecurityLevel = 'UNCLASSIFIED';
    let frontmatterEndIndex = 0;
    let isSingleClassification = false;

    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      
      // Check for dual classification (what: / how:)
      const whatMatch = /what:\s*(\w+)/i.exec(frontmatter);
      const howMatch = /how:\s*(\w+)/i.exec(frontmatter);
      
      // Check for single classification
      const singleMatch = /^classification:\s*(\w+)/im.exec(frontmatter);

      if (whatMatch && howMatch) {
        // Dual classification (advanced mode)
        defaultWhat = whatMatch[1].toUpperCase() as SecurityLevel;
        defaultHow = howMatch[1].toUpperCase() as SecurityLevel;
        isSingleClassification = false;
      } else if (singleMatch) {
        // Single classification (baseline mode) - both dimensions get same level
        const level = singleMatch[1].toUpperCase() as SecurityLevel;
        defaultWhat = level;
        defaultHow = level;
        isSingleClassification = true;
      }
      
      frontmatterEndIndex = frontmatterMatch[0].length;
    }
    setDefaultClassification({ what: defaultWhat, how: defaultHow });

    const parsed: ClassificationBlock[] = [];

    // Security-first: Untagged content defaults to STRICTEST (max of what/how)
    const levels: SecurityLevel[] = ['UNCLASSIFIED', 'CONFIDENTIAL', 'SECRET', 'TOP_SECRET'];
    const strictestLevel = levels[Math.max(levels.indexOf(defaultWhat), levels.indexOf(defaultHow))];

    // Regex for inline <What> and <How> tags
    const whatRegex = /<What>([\s\S]*?)<\/What>/gi;
    const howRegex = /<How>([\s\S]*?)<\/How>/gi;

    // Regex for legacy <Classification> tags
    const classificationRegex = /<Classification\s+([^>]+)>([\s\S]*?)<\/Classification>/gi;

    let lastIndex = frontmatterEndIndex;
    const allMatches: Array<{ type: 'what' | 'how' | 'classification'; start: number; end: number; content: string; attrs?: any }> = [];

    // Find all <What> tags
    let match;
    while ((match = whatRegex.exec(text)) !== null) {
      allMatches.push({ type: 'what', start: match.index, end: whatRegex.lastIndex, content: match[1].trim() });
    }

    // Find all <How> tags
    while ((match = howRegex.exec(text)) !== null) {
      allMatches.push({ type: 'how', start: match.index, end: howRegex.lastIndex, content: match[1].trim() });
    }

    // Find all legacy <Classification> tags
    while ((match = classificationRegex.exec(text)) !== null) {
      const attrs = match[1];
      const whatMatch = /what="(\w+)"/i.exec(attrs);
      const howMatch = /how="(\w+)"/i.exec(attrs);
      const levelMatch = /level="(\w+)"/i.exec(attrs);

      let what: SecurityLevel = 'UNCLASSIFIED';
      let how: SecurityLevel = 'UNCLASSIFIED';

      if (whatMatch && howMatch) {
        what = whatMatch[1].toUpperCase() as SecurityLevel;
        how = howMatch[1].toUpperCase() as SecurityLevel;
      } else if (levelMatch) {
        // Single classification - apply to both
        what = levelMatch[1].toUpperCase() as SecurityLevel;
        how = levelMatch[1].toUpperCase() as SecurityLevel;
      }

      allMatches.push({
        type: 'classification',
        start: match.index,
        end: classificationRegex.lastIndex,
        content: match[2].trim(),
        attrs: { what, how }
      });
    }

    // Sort matches by position
    allMatches.sort((a, b) => a.start - b.start);

    // Process matches
    allMatches.forEach((m) => {
      // Add untagged content before this match (if any)
      if (m.start > lastIndex) {
        const beforeContent = text.substring(lastIndex, m.start).trim();
        if (beforeContent) {
          parsed.push({
            type: 'untagged',
            level: strictestLevel,
            content: beforeContent,
            isDefault: true,
          });
        }
      }

      // Add the matched content
      if (m.type === 'what') {
        parsed.push({
          type: 'what',
          level: defaultWhat, // Use WHAT classification
          content: m.content,
          isDefault: false,
        });
      } else if (m.type === 'how') {
        parsed.push({
          type: 'how',
          level: defaultHow, // Use HOW classification
          content: m.content,
          isDefault: false,
        });
      } else if (m.type === 'classification' && m.attrs) {
        // For legacy classification, use the higher of what/how
        const levels: SecurityLevel[] = ['UNCLASSIFIED', 'CONFIDENTIAL', 'SECRET', 'TOP_SECRET'];
        const classLevel = levels[Math.max(levels.indexOf(m.attrs.what), levels.indexOf(m.attrs.how))] as SecurityLevel;
        parsed.push({
          type: 'classification',
          level: classLevel,
          content: m.content,
          isDefault: false,
        });
      }

      lastIndex = m.end;
    });

    // Add remaining untagged content (if any)
    if (lastIndex < text.length) {
      const remaining = text.substring(lastIndex).trim();
      if (remaining) {
        parsed.push({
          type: 'untagged',
          level: strictestLevel,
          content: remaining,
          isDefault: true,
        });
      }
    }

    // If no tags found at all, treat entire content as default
    if (parsed.length === 0 && text.substring(frontmatterEndIndex).trim()) {
      parsed.push({
        type: 'untagged',
        level: strictestLevel,
        content: text.substring(frontmatterEndIndex).trim(),
        isDefault: true,
      });
    }

    setBlocks(parsed);
  };

  const getClassificationStyle = (level: SecurityLevel) => {
    return CLASSIFICATION_COLORS[level] || CLASSIFICATION_COLORS.UNCLASSIFIED;
  };

  const getBlockStyle = (block: ClassificationBlock) => {
    const classStyle = getClassificationStyle(block.level);
    
    // Line color represents WHICH AI can access this content:
    // Blue = OpenAI (cloud) - UNCLASSIFIED only
    // Yellow = Red Forge SaaS (on-prem) - CONFIDENTIAL OK
    // Red = Red Forge on-site (air-gapped, aspirational) - SECRET
    let aiService: string;
    let lineColor: string;
    
    if (block.level === 'UNCLASSIFIED') {
      aiService = 'OpenAI (cloud)';
      lineColor = '#60a5fa'; // Blue
    } else if (block.level === 'CONFIDENTIAL') {
      aiService = 'Red Forge SaaS';
      lineColor = '#fb923c'; // Orange (Red Forge theme)
    } else if (block.level === 'SECRET') {
      aiService = 'Red Forge on-site';
      lineColor = '#f87171'; // Red
    } else { // TOP_SECRET
      aiService = 'No AI';
      lineColor = '#dc2626'; // Dark red
    }
    
    if (block.type === 'what') {
      return { label: 'WHAT', textColor: classStyle.text, description: 'Public interface', lineColor, aiService };
    } else if (block.type === 'how') {
      return { label: 'HOW', textColor: classStyle.text, description: 'Implementation', lineColor, aiService };
    } else if (block.type === 'untagged') {
      return { label: 'UNTAGGED', textColor: classStyle.text, description: 'Needs explicit tag', lineColor, aiService };
    } else {
      return { label: 'LEGACY', textColor: classStyle.text, description: 'Single classification', lineColor, aiService };
    }
  };

  return (
    <div
      className="h-full overflow-y-auto bg-[#0a0e14]"
      style={{ scrollbarWidth: 'thin', scrollbarColor: '#4b5563 #1f2937' }}
    >
      <div className="prose prose-invert max-w-none p-6">
        {blocks.map((block, idx) => {
          const blockStyle = getBlockStyle(block);
          const isClassified = block.level !== 'UNCLASSIFIED';
          const opacity = block.isDefault ? 0.6 : 1.0; // Dimmed for defaults, bright for explicit

          return (
            <div
              key={idx}
              className="relative my-4 pl-6"
              style={{
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                opacity: block.isDefault ? 0.7 : 1.0,
              }}
            >
              {/* Colored line on the left - hoverable for tooltip */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 group cursor-help"
                style={{ backgroundColor: blockStyle.lineColor }}
              >
                {/* Tooltip shows on line hover */}
                <div className="absolute -top-8 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-xs font-medium whitespace-nowrap z-10 pointer-events-none">
                  <span className={blockStyle.textColor}>
                    {blockStyle.label}: {blockStyle.description}
                  </span>
                  <span className="text-gray-400 mx-2">→</span>
                  <span style={{ color: blockStyle.lineColor }}>
                    {blockStyle.aiService}
                  </span>
                  {block.isDefault && <span className="text-gray-500 ml-2">(inherited)</span>}
                </div>
              </div>

              {/* Content with syntax highlighting */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : 'text';
                    const inline = props.inline;

                    return !inline ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={language}
                        PreTag="div"
                        className="rounded-md my-2"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  },
                  h1: ({ children }) => <h1 className="text-3xl font-bold text-red-400 mt-6 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-semibold text-red-300 mt-5 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-semibold text-gray-200 mt-4 mb-2">{children}</h3>,
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
                {block.content}
              </ReactMarkdown>
            </div>
          );
        })}
      </div>
    </div>
  );
}

