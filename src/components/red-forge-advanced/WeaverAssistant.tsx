/**
 * Weaver AI - AI chat panel with block-based context management
 * 
 * Features:
 * - OpenRouter integration (Claude 4.5 / Llama 3.3 70B)
 * - Block-level classification tracking
 * - Context downgrade warnings
 * - AI service switching with block filtering
 */

import React, { useState, useRef, useEffect } from 'react';
import { useCompliance } from '../../hooks/useComplianceContext';
import { AIService } from '../../lib/red-forge/types';
import { getAIServiceConfig } from '../../lib/red-forge/ai-service-config';
import { ChevronDown } from 'lucide-react';

interface WeaverAssistantProps {
  currentFile?: string;
}

export function WeaverAssistant({ currentFile }: WeaverAssistantProps) {
  const {
    userContext,
    selectedAIService,
    setSelectedAIService,
    availableAIServices,
    sendMessage,
    getMessages,
    getContextStats,
    resetContext,
    contextManager
  } = useCompliance();
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(contextManager.getIsTyping());
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [pendingServiceChange, setPendingServiceChange] = useState<AIService | null>(null);
  const [messageUpdateTrigger, setMessageUpdateTrigger] = useState(0); // Force re-render on message changes
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get messages/stats reactively (will update when messageUpdateTrigger changes)
  const messages = getMessages();
  const stats = getContextStats();
  const currentConfig = getAIServiceConfig(selectedAIService);

  // Subscribe to message changes
  useEffect(() => {
    const unsubscribe = contextManager.onMessageChange(() => {
      setMessageUpdateTrigger(prev => prev + 1); // Trigger re-render
    });
    return unsubscribe;
  }, [contextManager]);

  // Subscribe to typing state changes
  useEffect(() => {
    const unsubscribe = contextManager.onTypingChange((typing) => {
      setIsTyping(typing);
    });
    return unsubscribe;
  }, [contextManager]);

  // Auto-scroll to bottom when messages change or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await sendMessage(input);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Error message will be added by context manager
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleServiceChange = async (newService: AIService) => {
    const result = await setSelectedAIService(newService);
    
    if (!result.success && result.message) {
      // Show confirmation modal
      setPendingServiceChange(newService);
    } else {
      setShowServiceSelector(false);
    }
  };
  
  const confirmServiceChange = async () => {
    if (!pendingServiceChange) return;
    
    // Force the change with chat rewind if needed
    const contextManager = useCompliance().contextManager;
    contextManager.switchAIService(pendingServiceChange);
    
    setPendingServiceChange(null);
    setShowServiceSelector(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0e14]">
      {/* Header - AI Service Selector & Context Stats */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          {/* AI Service Selector (moved up to replace redundant title) */}
          <div className="flex-1 mr-2">
            <div className="relative">
              <button
                onClick={() => setShowServiceSelector(!showServiceSelector)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-800 rounded text-sm text-gray-300 hover:bg-gray-700"
              >
                <span>{currentConfig?.displayName || 'Select AI'}</span>
                <ChevronDown size={16} />
              </button>
              
              {showServiceSelector && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-50">
                  {availableAIServices.map(service => {
                    const config = getAIServiceConfig(service);
                    if (!config) return null;
                    
                    return (
                      <button
                        key={service}
                        onClick={() => handleServiceChange(service)}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-700 ${
                          service === selectedAIService ? 'bg-gray-700 text-red-400' : 'text-gray-300'
                        }`}
                      >
                        <div className="font-medium">{config.displayName}</div>
                        <div className="text-xs text-gray-500">{config.description}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Max: {config.maxClassification}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={resetContext}
            className="px-2 py-1 text-xs rounded bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-300 hover:border-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
        
        {/* Context Stats */}
        <div className="mt-2 text-xs text-gray-500">
          Context: {stats.visibleBlocks} blocks visible
          {stats.hiddenBlocks > 0 && ` (${stats.hiddenBlocks} hidden)`}
          {stats.highestClassification !== 'UNCLASSIFIED' && (
            <span className="ml-2 text-red-400">
              • Highest: {stats.highestClassification}
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-8">
            <p className="mb-2">Welcome to Weaver AI</p>
            <p className="text-xs">
              {currentConfig?.displayName} • {currentConfig?.maxClassification} clearance
            </p>
          </div>
        )}
        
        {messages.map((message, index) => {
          // First system message gets smoldering effect
          const isFirstSystemMessage = index === 0 && message.role === 'system';
          
          return (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : message.role === 'system' ? 'justify-center' : 'justify-start'}`}
            >
              {/* Outer wrapper for glow effects (like DefensePage) */}
              <div className={`relative ${isFirstSystemMessage ? 'group' : ''} max-w-[80%]`}>
                {/* Smoldering backside glow (behind card) */}
                {isFirstSystemMessage && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/60 via-orange-500/80 to-yellow-600/70 rounded-lg blur-3xl opacity-70 scale-95 animate-pulse"></div>
                    <div 
                      className="absolute inset-0 rounded-lg blur-2xl opacity-60"
                      style={{
                        background: 'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.8), rgba(255, 69, 0, 0.4), transparent 70%)',
                        animation: 'smolder 3s ease-in-out infinite'
                      }}
                    ></div>
                  </>
                )}
                
                {/* Message card */}
                <div
                  className={`relative z-10 rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-red-500/20 text-gray-200'
                      : message.role === 'system'
                      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-blue-300 border border-blue-600 text-left'
                      : 'bg-gray-800 text-gray-300'
                  } ${isFirstSystemMessage ? 'shadow-[0_8px_60px_rgba(239,68,68,0.4)]' : ''}`}
                >
                  <div className={`text-sm whitespace-pre-wrap relative z-10 ${isFirstSystemMessage ? 'font-medium' : ''}`}>
                    {message.content}
                  </div>
                  {message.role !== 'system' && (
                    <div className="text-xs text-gray-600 mt-1 flex items-center space-x-2">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      <span>•</span>
                      <span>{message.classificationLevel}</span>
                      {message.role === 'assistant' && (
                        <>
                          <span>•</span>
                          <span>{getAIServiceConfig(message.aiService)?.displayName}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Typing indicator (when AI is typing) */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-xs text-gray-400 ml-2">Weaver skriver...</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Loading indicator (when waiting for AI response) */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="animate-pulse text-gray-400">●</div>
                <div className="animate-pulse text-gray-400" style={{ animationDelay: '0.2s' }}>●</div>
                <div className="animate-pulse text-gray-400" style={{ animationDelay: '0.4s' }}>●</div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={`Ask ${currentConfig?.displayName || 'AI'}...`}
            className="flex-1 bg-gray-800 text-gray-200 px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            disabled={isLoading || selectedAIService === 'none'}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || selectedAIService === 'none'}
            className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
      
      {/* Chat Reset Confirmation Modal */}
      {pendingServiceChange && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-gray-900 border border-red-700 rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              ⚠️ Chat Will Be Cleared
            </h3>
            <p className="text-sm text-gray-300 mb-3">
              Switching to <strong>{getAIServiceConfig(pendingServiceChange)?.displayName}</strong> requires clearing chat history.
            </p>
            <div className="bg-red-950/30 border border-red-800 rounded p-3 mb-4">
              <p className="text-xs text-red-300 mb-2">
                <strong>Security:</strong> Chat contains content that the new AI service cannot access.
              </p>
              <p className="text-xs text-red-300">
                The entire conversation will be cleared before switching.
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-4 italic">
              "A chat becomes infected with secrets the moment classified content enters it."
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setPendingServiceChange(null)}
                className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded text-sm hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmServiceChange}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Clear & Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
