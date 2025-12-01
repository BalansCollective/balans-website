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
import { BrowserWeaverAssistant } from '../../lib/weaver';
import { CLASSIFICATION_LEVELS, AI_SERVICE_LEVELS, type Classification, type AIService } from './classification-constants';

interface WeaverAssistantProps {
  file?: {
    classification: Classification;
    title: string;
    content: string;
  };
  selectedService: AIService;
  onServiceChange: (service: AIService) => void;
  filesInContext: Array<{ name: string; content: string; classification: Classification }>; // Full file data!
  onClearContext: () => void;
  weaver?: BrowserWeaverAssistant; // Pass weaver instance for declassification
}

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

export function WeaverAssistant({ file, selectedService, onServiceChange, filesInContext = [], onClearContext, weaver: externalWeaver }: WeaverAssistantProps) {
  const [showEnforcementModal, setShowEnforcementModal] = useState(false);
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [proposedModification, setProposedModification] = useState<any | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>(() => [{
    role: 'assistant',
    content: `Hej! Jag är Weaver, din AI-assistent för Red Forge.

📝 **Audit Log:** Aktiv (alla AI-interaktioner loggas)

${filesInContext.length > 0 
  ? `Jag har åtkomst till ${filesInContext.length} fil${filesInContext.length > 1 ? 'er' : ''}:\n\n${filesInContext.map(f => `• ${f.name}`).join('\n')}\n\nVad vill du veta?`
  : file 
    ? `Du kan chatta med mig direkt, eller klicka på "Skicka till AI" för att ge mig åtkomst till **${file.title}**.`
    : `Du kan chatta med mig direkt, eller öppna en fil och klicka "Skicka till AI" för att ge mig åtkomst.`
}`
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize Weaver Assistant (use external if provided, otherwise create local)
  const [weaver] = useState(() => externalWeaver || new BrowserWeaverAssistant({
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

  // Check if AI service can access files IN CONTEXT (not just open file!)
  const serviceLevel = AI_SERVICE_LEVELS[selectedService]?.level ?? 0;
  
  // Find highest classification in context
  const highestClassInContext = filesInContext.length > 0
    ? Math.max(...filesInContext.map(f => CLASSIFICATION_LEVELS[f.classification]))
    : -1; // No files in context
  
  const canAccess = highestClassInContext === -1 || serviceLevel >= highestClassInContext;
  
  // Find minimum required AI service for files in context
  const getRequiredService = (): AIService | null => {
    if (filesInContext.length === 0) return null;
    
    const services = Object.entries(AI_SERVICE_LEVELS)
      .sort((a, b) => a[1].level - b[1].level);
    
    for (const [key, info] of services) {
      if (info.level >= highestClassInContext) {
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
    
    // Normal chat flow - just answer questions about files
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
  
  const handleApproveModification = (modifiedContent: string, newFilename: string, newClassification: Classification) => {
    // In browser demo, we'll just download the file
    const blob = new Blob([modifiedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = newFilename;
    a.click();
    URL.revokeObjectURL(url);
    
    // Log to audit
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `✅ File modification approved and saved as **${newFilename}** (${newClassification})`
    }]);
    
    // Close modal
    setShowModificationModal(false);
    setProposedModification(null);
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
                // Filter based on HIGHEST classification IN CONTEXT, not open file
                .filter(([_, info]) => filesInContext.length === 0 || info.level >= highestClassInContext)
                .map(([key, info]) => (
                  <option key={key} value={key}>{info.name}</option>
                ))}
            </select>
            
            {/* Single "Rensa" button - clears both chat AND context */}
            <button
              onClick={() => {
                // Step 1: Clear AI context (files) FIRST
                onClearContext();
                
                // Step 2: Clear chat history
                setMessages([{
                  role: 'assistant',
                  content: `Hej! Jag är Weaver, din AI-assistent för Red Forge.

📝 **Audit Log:** Aktiv (alla AI-interaktioner loggas)

Du kan chatta med mig direkt${file ? `, eller klicka på "Skicka till AI" för att ge mig åtkomst till **${file.title}**` : ''}.`
                }]);
                setStreamingContent('');
                
                // Step 3: Reset to Claude Cloud (now that context is cleared)
                // Use setTimeout to ensure parent state has updated
                setTimeout(() => {
                  onServiceChange('forge-llama-3.3-70b');
                }, 0);
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
            {filesInContext.length > 0 && (
              <span className={`text-xs font-mono font-semibold ${getClassificationColor(
                // Show highest classification in context
                filesInContext.reduce((highest, f) => {
                  const levels: Classification[] = ['oklassificerad', 'begransad-hemlig', 'konfidentiell', 'hemlig'];
                  return levels.indexOf(f.classification) > levels.indexOf(highest) ? f.classification : highest;
                }, filesInContext[0].classification)
              )}`}>
                {filesInContext.reduce((highest, f) => {
                  const levels: Classification[] = ['oklassificerad', 'begransad-hemlig', 'konfidentiell', 'hemlig'];
                  return levels.indexOf(f.classification) > levels.indexOf(highest) ? f.classification : highest;
                }, filesInContext[0].classification).toUpperCase()}
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
        {!canAccess && file && (
          <div className="px-4 pb-2">
            <div className="bg-red-900/20 border border-red-500/30 rounded p-2 text-xs text-red-300 flex items-start gap-2">
              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Begränsad åtkomst:</strong> {AI_SERVICE_LEVELS[selectedService]?.name ?? 'AI-tjänst'} kan inte komma åt {file.classification} innehåll.
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
                <strong>{AI_SERVICE_LEVELS[selectedService]?.name ?? 'AI-tjänst'}</strong> kan inte komma åt filer med{' '}
                <strong className="text-red-400">
                  {filesInContext.length > 0 
                    ? filesInContext.map(f => f.classification).join(', ')
                    : 'högre'
                  }
                </strong> klassificering i AI-kontext.
              </p>

              <div className="bg-gray-900 border border-gray-700 rounded p-3">
                <div className="text-xs text-gray-400 mb-2">Filer i AI-kontext:</div>
                {filesInContext.map(f => (
                  <div key={f.name} className="text-red-400 font-semibold uppercase text-xs">
                    {f.name}: {f.classification}
                  </div>
                ))}

                <div className="text-xs text-gray-400 mt-3 mb-2">Nuvarande AI-tjänst:</div>
                <div className="text-yellow-400 font-semibold">
                  {AI_SERVICE_LEVELS[selectedService]?.name ?? 'Okänd'} (max: {AI_SERVICE_LEVELS[selectedService]?.maxClass ?? 'oklassificerad'})
                </div>
                
                {requiredService && (
                  <>
                    <div className="text-xs text-gray-400 mt-3 mb-2">Minsta tillåtna AI-tjänst:</div>
                    <div className="text-green-400 font-semibold">
                      {AI_SERVICE_LEVELS[requiredService]?.name ?? 'Okänd'}
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
      
      {/* File Modification Modal - Removed, not used in current version */}
    </>
  );
}
