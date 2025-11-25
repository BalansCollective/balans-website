/**
 * Weaver AI Assistant - Phase 1 Integration
 * 
 * Now powered by BrowserWeaverAssistant with:
 * - @weaver/guards for anti-bureaucratic protection
 * - OpenRouter streaming for real AI chat
 * - Chronicle logging for audit trail
 */

import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Shield, X, Send, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';
import { MermaidDiagram } from './MermaidDiagram';
import { BrowserWeaverAssistant, type AIService, type Classification } from '../../lib/weaver';

interface WeaverAssistantProps {
  file: {
    classification: Classification;
    title: string;
    content: string;
  };
  selectedService: AIService;
  onServiceChange: (service: AIService) => void;
  filesInContext: Array<{ name: string; content: string; classification: Classification }>; // Full file data!
  onClearContext: () => void;
}

// AI service security levels
const AI_SERVICE_LEVELS = {
  'claude-cloud': { level: 0, name: 'Claude Cloud', maxClass: 'oklassificerad' },
  'saas-lumen': { level: 1, name: 'SaaS Lumen', maxClass: 'begransad-hemlig' },
  'forge-local': { level: 2, name: 'Red Forge Local', maxClass: 'konfidentiell' },
  'forge-airgap': { level: 3, name: 'Red Forge Air-Gap', maxClass: 'hemlig' }
};
  
const CLASSIFICATION_LEVELS = {
  'oklassificerad': 0,
  'begransad-hemlig': 1,
  'konfidentiell': 2,
  'hemlig': 3
};

// Get classification color
const getClassificationColor = (classification: Classification): string => {
  switch (classification) {
    case 'hemlig': return 'text-red-400';
    case 'konfidentiell': return 'text-orange-400';
    case 'begransad-hemlig': return 'text-yellow-400';
    case 'oklassificerad': return 'text-green-400';
    default: return 'text-gray-400';
  }
};

export function WeaverAssistant({ file, selectedService, onServiceChange, filesInContext, onClearContext }: WeaverAssistantProps) {
  const [showEnforcementModal, setShowEnforcementModal] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>(() => [{
    role: 'assistant',
    content: `Hej! Jag är Weaver, din AI-assistent för Red Forge.

📝 **Audit Log:** Aktiv (alla AI-interaktioner loggas)

${filesInContext.length > 0 
  ? `Jag har åtkomst till ${filesInContext.length} fil${filesInContext.length > 1 ? 'er' : ''}:\n\n${filesInContext.map(f => `• ${f}`).join('\n')}\n\nVad vill du veta?`
  : `Du kan chatta med mig direkt, eller klicka på "Skicka till AI" för att ge mig åtkomst till **${file.title}**.`
}`
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize Weaver Assistant (DEMO: using placeholder API key - won't work without real key)
  const [weaver] = useState(() => new BrowserWeaverAssistant({
    openrouterKey: import.meta.env.VITE_OPENROUTER_KEY || 'DEMO_KEY_NOT_SET',
    userClearance: 'hemlig' // Demo: full clearance
  }));
  
  // Auto-scroll only when message count changes, not during streaming
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: isStreaming ? 'auto' : 'smooth' 
    });
  }, [messages.length, isStreaming]);
  
  // Track files added to context and send to Weaver (ONLY files explicitly sent!)
  const prevFilesInContext = useRef<string[]>([]);
  useEffect(() => {
    const currentFileNames = filesInContext.map(f => f.name);
    const newFiles = filesInContext.filter(f => !prevFilesInContext.current.includes(f.name));
    
    if (newFiles.length > 0) {
      // Add compact system message with timestamp
      const timestamp = new Date().toLocaleTimeString('sv-SE', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: newFiles.map(f => 
            `[${timestamp}] ✅ **${f.name}** → AI-kontext`
          ).join('\n')
        }
      ]);
      
      // Send ALL files in context to Weaver (not just new ones)
      weaver.clearContext(); // Clear first
      filesInContext.forEach(file => {
        weaver.addFileToContext({
          path: file.name,
          classification: file.classification,
          title: file.name,
          content: file.content
        });
      });
    }
    
    prevFilesInContext.current = currentFileNames;
  }, [filesInContext, weaver]);

  // Check if AI service can access this file
  const serviceLevel = AI_SERVICE_LEVELS[selectedService].level;
  const fileLevel = CLASSIFICATION_LEVELS[file.classification];
  const canAccess = serviceLevel >= fileLevel;
  
  // Find minimum required AI service for this file
  const getRequiredService = (): AIService | null => {
    const services = Object.entries(AI_SERVICE_LEVELS)
      .sort((a, b) => a[1].level - b[1].level);
    
    for (const [key, info] of services) {
      if (info.level >= fileLevel) {
        return key as AIService;
      }
    }
    return null;
  };
  
  const requiredService = getRequiredService();

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isStreaming) return;

    if (!canAccess) {
      setShowEnforcementModal(true);
      return;
    }

    // Add user message
    const userMessage = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    setIsStreaming(true);
    
    // Stream AI response - buffer in streamingContent
    let accumulatedContent = '';
    
    try {
      // Files are already in Weaver context (from useEffect above)
      // Just send the message
      
      // Stream response
      for await (const chunk of weaver.sendMessage(userMessage, selectedService)) {
        if (chunk.type === 'text') {
          accumulatedContent += chunk.content;
          
          // Update streaming state (doesn't trigger scroll)
          setStreamingContent(accumulatedContent);
          
        } else if (chunk.type === 'error') {
          setMessages(prev => [...prev, { role: 'assistant', content: chunk.content }]);
          break;
        }
      }
      
      // Commit completed message (triggers scroll ONCE)
      if (accumulatedContent) {
        setMessages(prev => [...prev, { role: 'assistant', content: accumulatedContent }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ **Error:** ${error instanceof Error ? error.message : 'Unknown error'}\n\n*Tip: Check if VITE_OPENROUTER_KEY is set in .env*`
      }]);
    } finally {
      setStreamingContent(''); // Clear streaming buffer
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    // Shift+Enter just creates new line (default textarea behavior)
  };
  
  // Chronicle export handler
  const handleExportChronicle = async () => {
    try {
      const json = await weaver.getChronicleExport();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chronicle-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export chronicle:', error);
    }
  };

  return (
    <>
      {/* Chat Interface - FIXED: header outside scroll container */}
      <div className="h-full w-full flex flex-col bg-[#0d1117]">
        {/* Chat header - STAYS VISIBLE (not in scroll area) */}
        <div className="p-3 border-b border-gray-700 bg-[#0d1117] z-10">
          <div className="flex items-center justify-between mb-2">
            {/* AI Service dropdown - only show services that can access this file */}
            <select
              value={selectedService}
              onChange={(e) => onServiceChange(e.target.value as AIService)}
              className="bg-[#161b22] border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 hover:border-red-500 transition-colors"
            >
              {Object.entries(AI_SERVICE_LEVELS)
                .filter(([_, info]) => info.level >= CLASSIFICATION_LEVELS[file.classification])
                .map(([key, info]) => (
                  <option key={key} value={key}>{info.name}</option>
                ))}
            </select>
            
            {/* Single "Rensa" button - clears both chat AND context */}
            <button
              onClick={() => {
                // Clear chat history
                setMessages([{
                  role: 'assistant',
                  content: `Hej! Jag är Weaver, din AI-assistent för Red Forge.

📝 **Audit Log:** Aktiv (alla AI-interaktioner loggas)

Du kan chatta med mig direkt, eller klicka på "Skicka till AI" för att ge mig åtkomst till **${file.title}**.`
                }]);
                setStreamingContent('');
                
                // Clear AI context (files)
                onClearContext();
              }}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
              title="Rensa chat och AI-kontext"
            >
              <X className="w-3 h-3" />
              Rensa
            </button>
          </div>
          
          <div className="text-xs text-gray-500 flex items-center justify-between">
            <span>
              {filesInContext.length > 0 
                ? `${filesInContext.length} fil${filesInContext.length > 1 ? 'er' : ''} i AI-kontext: ${filesInContext.map(f => f.name).join(', ')}` 
                : 'Ingen fil skickad ännu'}
            </span>
            {file.classification && (
              <span className={`text-xs font-mono font-semibold ${getClassificationColor(file.classification)}`}>
                {file.classification.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        
        {/* Scrollable messages area - ONLY MESSAGES SCROLL */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 space-y-6">
            {messages.map((msg, idx) => (
            <div key={idx} className="w-full">
              {/* Message header (role label) */}
              <div className={`text-xs font-semibold mb-2 ${
                msg.role === 'user' ? 'text-blue-400' : 'text-gray-500'
              }`}>
                {msg.role === 'user' ? 'User' : 'Assistant'}
              </div>
              
              {/* Message content (full width, no bubble) */}
              <div className="text-sm text-gray-300 prose prose-invert prose-sm max-w-none">
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';
                        const code = String(children).replace(/\n$/, '');
                        
                        // Handle Mermaid diagrams
                        if (language === 'mermaid') {
                          // Use hash of code for stable ID across re-renders
                          const codeHash = code.split('').reduce((acc, char) => {
                            return ((acc << 5) - acc) + char.charCodeAt(0);
                          }, 0);
                          const diagramId = `mermaid-msg-${Math.abs(codeHash)}`;
                          return <MermaidDiagram chart={code} id={diagramId} />;
                        }
                        
                        // Handle other code blocks
                        return match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={language}
                            PreTag="div"
                            className="text-xs rounded"
                            {...props}
                          >
                            {code}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-gray-800 px-1 py-0.5 rounded text-xs" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
            </div>
          ))}
          
          {/* Streaming content (separate) */}
          {isStreaming && streamingContent && (
            <div className="w-full">
              <div className="text-xs font-semibold mb-2 text-gray-500">
                Assistant
              </div>
              <div className="text-sm text-gray-300 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const language = match ? match[1] : '';
                      const code = String(children).replace(/\n$/, '');
                      
                      // Handle Mermaid diagrams (streaming) - just show placeholder
                      if (language === 'mermaid') {
                        return (
                          <div className="bg-[#161b22] border border-gray-700 rounded p-8 my-4 flex items-center justify-center">
                            <div className="text-gray-500 text-sm">
                              Rendering diagram...
                            </div>
                          </div>
                        );
                      }
                      
                      // Handle other code blocks
                      return match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={language}
                          PreTag="div"
                          className="text-xs rounded"
                          {...props}
                        >
                          {code}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-gray-800 px-1 py-0.5 rounded text-xs" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {streamingContent}
                </ReactMarkdown>
                <span className="inline-block w-2 h-4 bg-red-500 animate-pulse ml-1" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Access warning if blocked - OUTSIDE SCROLL */}
        {!canAccess && (
          <div className="px-4 pb-2">
            <div className="bg-red-900/20 border border-red-500/30 rounded p-2 text-xs text-red-300 flex items-start gap-2">
              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Begränsad åtkomst:</strong> {AI_SERVICE_LEVELS[selectedService].name} kan inte komma åt {file.classification} innehåll.
              </div>
            </div>
          </div>
        )}
        
        {/* Input area - OUTSIDE SCROLL, STAYS AT BOTTOM */}
        <div className="p-3 border-t border-gray-700 bg-[#0d1117]">
          <div className="flex gap-2 items-end">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={canAccess ? "Skriv ditt meddelande..." : "Åtkomst nekad"}
            disabled={!canAccess}
            rows={3}
            className="flex-1 bg-[#161b22] border border-gray-700 rounded px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          />
          <button
              onClick={handleSendMessage}
              disabled={!canAccess || !inputValue.trim() || isStreaming}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded transition-colors flex items-center gap-1"
          >
              {isStreaming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </>
              ) : (
                <Send className="w-4 h-4" />
              )}
          </button>
          </div>
        </div>
      </div>
      
      {/* Enforcement Modal */}
      {showEnforcementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-red-500 rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-bold text-white">Säkerhetsblockering</h3>
            </div>
              <button
                onClick={() => setShowEnforcementModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-300">
              <p>
                <strong>{AI_SERVICE_LEVELS[selectedService].name}</strong> kan inte komma åt{' '}
                <strong className="text-red-400">{file.classification}</strong> innehåll.
              </p>

              <div className="bg-gray-900 border border-gray-700 rounded p-3">
                <div className="text-xs text-gray-400 mb-2">Filklassificering:</div>
                <div className="text-red-400 font-semibold uppercase">{file.classification}</div>

                <div className="text-xs text-gray-400 mt-3 mb-2">Nuvarande AI-tjänst:</div>
                <div className="text-yellow-400 font-semibold">
                  {AI_SERVICE_LEVELS[selectedService].name} (max: {AI_SERVICE_LEVELS[selectedService].maxClass})
                </div>
                
                {requiredService && (
                  <>
                    <div className="text-xs text-gray-400 mt-3 mb-2">Minsta tillåtna AI-tjänst:</div>
                    <div className="text-green-400 font-semibold">
                      {AI_SERVICE_LEVELS[requiredService].name}
                    </div>
                  </>
                )}
              </div>

              <p className="text-gray-400">
                {requiredService 
                  ? `Vill du byta till ${AI_SERVICE_LEVELS[requiredService].name}?`
                  : 'Ingen AI-tjänst kan komma åt denna fil.'}
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              {requiredService && (
                <button
                  onClick={() => {
                    onServiceChange(requiredService);
                    setShowEnforcementModal(false);
                  }}
                  className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded transition-colors font-semibold"
                >
                  Byt till {AI_SERVICE_LEVELS[requiredService].name}
                </button>
              )}
              <button
                onClick={() => setShowEnforcementModal(false)}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
