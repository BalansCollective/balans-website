import { useState, useEffect, useRef } from 'react';
import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
// TODO: Fix weaver-core package import
// import { weaverLLM } from '@weavermesh/weaver-core';
import { GoldenThreads } from './GoldenThreads';
import { Human, Combined, AI } from './SemanticHighlight';
import { Mermaid } from './Mermaid';
import { preprocessMarkdownToMDX } from '../lib/markdown-to-mdx';

export function WeaverStream() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [renderMode, setRenderMode] = useState<'raw' | 'mdx'>('mdx');
  const [isTyping, setIsTyping] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Compile and render MDX with semantic components
  const [RenderedMDX, setRenderedMDX] = useState<React.ComponentType | null>(null);
  const [mdxError, setMdxError] = useState<string | null>(null);

  useEffect(() => {
    if (!output || renderMode === 'raw') {
      setRenderedMDX(null);
      return;
    }

    // Compile MDX asynchronously
    compile(output, { 
      outputFormat: 'function-body',
    })
      .then((code) => {
        const { default: Component } = run(code, {
          ...runtime,
          // Make semantic components available in MDX
          Human,
          Combined,
          AI,
          // Make Mermaid available in MDX
          Mermaid,
        });
        setRenderedMDX(() => Component);
        setMdxError(null);
      })
      .catch((err) => {
        console.error('MDX compile error:', err);
        setMdxError(err.message);
        setRenderedMDX(null);
      });
  }, [output, renderMode]);

  const runWeaver = async () => {
    if (!prompt.trim() || isRunning) return;

    setIsRunning(true);
    setOutput('');

    try {
      // TODO: Restore weaver-core LLM streaming when package is fixed
      // Temporary mock for demo
      setOutput('Demo mode: weaver-core package not available. Medical Timeline component is working with real data.');
      setIsRunning(false);
      
      // Original code (commented out):
      // for await (const chunk of weaverLLM.stream(prompt)) {
      //   setOutput(prev => prev + chunk);
      // }
      // setIsRunning(false);
    } catch (error) {
      console.error('Failed to stream from LLM:', error);
      setOutput(`Error: ${error}`);
      setIsRunning(false);
    }
  };

  // Track typing activity for golden threads
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
    
    // Activate golden threads
    setIsTyping(true);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Deactivate after 500ms of no typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 500);
  };

  // Auto-scroll to bottom as output streams
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen p-4 bg-birch-white dark:bg-bg-main text-gray-900 dark:text-birch-white-dark transition-colors duration-300">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-swedish-blue dark:text-swedish-blue-dark">Weaver Stream</h1>
          <p className="text-gray-600 dark:text-birch-white-dark/70">Interactive CLI with MDX rendering</p>
        </div>
        
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setRenderMode('mdx')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              renderMode === 'mdx'
                ? 'bg-swedish-blue dark:bg-swedish-blue-dark text-white shadow-glow-sm'
                : 'bg-gray-100 dark:bg-bg-surface text-gray-600 dark:text-birch-white-dark/70 hover:bg-gray-200 dark:hover:bg-bg-elevated'
            }`}
          >
            MDX
          </button>
          <button
            onClick={() => setRenderMode('raw')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              renderMode === 'raw'
                ? 'bg-swedish-blue dark:bg-swedish-blue-dark text-white shadow-glow-sm'
                : 'bg-gray-100 dark:bg-bg-surface text-gray-600 dark:text-birch-white-dark/70 hover:bg-gray-200 dark:hover:bg-bg-elevated'
            }`}
          >
            Raw
          </button>
        </div>
      </div>

      {/* Output (now first) */}
      <div 
        ref={outputRef}
        className="flex-1 p-6 bg-white dark:bg-bg-surface border border-gentle-silver/30 dark:border-border-medium rounded-lg overflow-auto mb-4"
      >
        {output ? (
          renderMode === 'mdx' ? (
            <article className="prose prose-gray dark:prose-invert prose-swedish-blue max-w-none">
              {mdxError ? (
                <div className="text-red-500 dark:text-red-400">
                  <p className="font-semibold">MDX Compilation Error:</p>
                  <pre className="text-sm mt-2">{mdxError}</pre>
                </div>
              ) : RenderedMDX ? (
                <RenderedMDX />
              ) : (
                <div className="text-gray-500 dark:text-birch-white-dark/50">Compiling MDX...</div>
              )}
            </article>
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 dark:text-birch-white-dark">{output}</pre>
          )
        ) : (
          <div className="text-gray-500 dark:text-birch-white-dark/50 italic">
            Run a weaver command to see output...
            <div className="mt-4 text-sm">
              <p className="font-semibold text-gray-600 dark:text-birch-white-dark/70">Examples:</p>
              <ul className="mt-2 space-y-1">
                <li><code className="text-swedish-blue dark:text-swedish-blue-dark">memory query "dispatcher pattern"</code></li>
                <li><code className="text-swedish-blue dark:text-swedish-blue-dark">chronicle show --since 2024-11-13</code></li>
                <li><code className="text-swedish-blue dark:text-swedish-blue-dark">patterns list</code></li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Input (now at bottom) */}
      <div className="flex gap-2 relative">
        {/* Golden Threads Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <GoldenThreads 
            isActive={isTyping}
            intensity={isTyping ? 0.8 : 0.3}
          />
        </div>

        <input
          type="text"
          value={prompt}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && runWeaver()}
          placeholder="weaver memory query 'dispatcher pattern'"
          disabled={isRunning}
          className="flex-1 px-4 py-2 bg-white/90 dark:bg-bg-surface/90 backdrop-blur-sm border border-gentle-silver/30 dark:border-border-medium rounded-lg focus:outline-none focus:border-thread-gold dark:focus:border-thread-gold-dark focus:ring-2 focus:ring-thread-gold/20 dark:focus:ring-thread-gold-dark/20 disabled:opacity-50 transition-all duration-300 relative z-10"
        />
        <button
          onClick={runWeaver}
          disabled={isRunning || !prompt.trim()}
          className="px-6 py-2 bg-swedish-blue dark:bg-swedish-blue-dark hover:bg-swedish-blue-700 dark:hover:bg-alliance-purple-dark disabled:bg-gray-300 dark:disabled:bg-bg-surface disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-300 shadow-glow-sm"
        >
          {isRunning ? 'Running...' : 'Run'}
        </button>
      </div>

      {/* Status */}
      {isRunning && (
        <div className="mt-2 flex items-center gap-2 text-thread-gold dark:text-thread-gold-dark text-sm">
          <div className="animate-spin h-4 w-4 border-2 border-thread-gold dark:border-thread-gold-dark border-t-transparent rounded-full"></div>
          <span>Streaming from weaver CLI...</span>
        </div>
      )}
    </div>
  );
}


