/**
 * Compliance Context - React context for compliance engine and user state
 * 
 * This hook provides access to:
 * - ComplianceEngine for validation
 * - ZenohClient for file operations
 * - Current user context (clearance, network zone)
 * - Helper functions for common operations
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ComplianceEngine } from '../lib/red-forge/compliance';
import { ZenohClient } from '../lib/red-forge/zenoh-client';
import { MockStorage, getStorage } from '../lib/red-forge/mock-storage';
import { AuditDatabase, getAuditDB } from '../lib/red-forge/audit-storage';
import { ContextManager } from '../lib/red-forge/context-manager';
import { openRouterClient } from '../lib/red-forge/openrouter-client';
import { UserContext, SecurityLevel, ClassifiedFile, AIService, ContextBlock, ChatMessage } from '../lib/red-forge/types';
import { getAIServicesForNetworkZone } from '../lib/red-forge/ai-service-config';

interface ComplianceContextValue {
  // Core services
  complianceEngine: ComplianceEngine | null;
  zenohClient: ZenohClient | null;
  auditDB: AuditDatabase | null;
  contextManager: ContextManager;
  
  // User state
  userContext: UserContext;
  setUserContext: (context: UserContext) => void;
  
  // AI service state
  selectedAIService: AIService;
  setSelectedAIService: (service: AIService) => Promise<{ success: boolean; message?: string }>;
  availableAIServices: AIService[];
  
  // AI review toggle
  skipAIReview: boolean;
  setSkipAIReview: (skip: boolean) => void;
  
  // Helper functions
  validateAndExecute: <T>(
    operation: string,
    resource: string,
    fn: () => Promise<T>
  ) => Promise<T>;
  
  // File operations
  getFile: (filename: string) => Promise<string>;
  saveFile: (filename: string, content: string) => Promise<void>;
  listFiles: () => Promise<ClassifiedFile[]>;
  
  // AI operations
  sendMessage: (message: string) => Promise<string>;
  exportForAI: (filename: string) => Promise<{ whatContent: string; warnings: any[] }>;
  
  // Context operations
  getMessages: () => ChatMessage[];
  getContextStats: () => any;
  resetContext: () => void;
}

const ComplianceContext = createContext<ComplianceContextValue | null>(null);

interface ComplianceProviderProps {
  children: ReactNode;
}

export function ComplianceProvider({ children }: ComplianceProviderProps) {
  // Initialize core services
  const [complianceEngine, setComplianceEngine] = useState<ComplianceEngine | null>(null);
  const [zenohClient, setZenohClient] = useState<ZenohClient | null>(null);
  const [auditDB, setAuditDB] = useState<AuditDatabase | null>(null);
  const [storage] = useState<MockStorage>(getStorage());
  const [contextManager] = useState<ContextManager>(new ContextManager()); // Welcome message added in constructor

  // User context state (default: Yellow network, CONFIDENTIAL clearance)
  const [userContext, setUserContext] = useState<UserContext>({
    id: 'user-1',
    name: 'Demo User',
    clearance: 'CONFIDENTIAL',
    networkZone: 'yellow',
  });
  
  // AI service state
  const [selectedAIService, setSelectedAIServiceInternal] = useState<AIService>('redforge-saas');
  const [availableAIServices, setAvailableAIServices] = useState<AIService[]>([]);
  
  // AI review toggle
  const [skipAIReview, setSkipAIReview] = useState(false);

  // Initialize services on mount
  useEffect(() => {
    async function initServices() {
      const db = await getAuditDB();
      setAuditDB(db);

      const compliance = new ComplianceEngine(db);
      setComplianceEngine(compliance);

      const client = new ZenohClient(compliance, storage, userContext);
      setZenohClient(client);
    }

    initServices();
  }, [storage, contextManager]);

  // Update ZenohClient when user context changes
  useEffect(() => {
    if (zenohClient) {
      zenohClient.setUserContext(userContext);
    }
  }, [userContext, zenohClient]);
  
  // Update available AI services when network zone changes
  useEffect(() => {
    const services = getAIServicesForNetworkZone(userContext.networkZone);
    setAvailableAIServices(services.map(s => s.service));
    
    // If current AI service is no longer available, switch to first available
    const currentAvailable = services.some(s => s.service === selectedAIService);
    if (!currentAvailable && services.length > 0) {
      setSelectedAIServiceInternal(services[0].service);
    }
  }, [userContext.networkZone]);

  // Helper: switch AI service with block hiding/revealing
  const setSelectedAIService = async (newService: AIService): Promise<{ success: boolean; message?: string }> => {
    // Check if service is available in current network zone
    if (!availableAIServices.includes(newService)) {
      return {
        success: false,
        message: `${newService} is not available in ${userContext.networkZone} network zone`
      };
    }
    
    // Get blocks that would be hidden
    const blocksToHide = contextManager.getBlocksToHide(newService);
    
    if (blocksToHide.length > 0) {
      // Return info about what would be hidden (caller can show confirmation modal)
      return {
        success: false,
        message: `Switching to ${newService} would hide ${blocksToHide.length} blocks with higher classification. Confirm to proceed.`
      };
    }
    
    // Safe to switch
    const result = contextManager.switchAIService(newService);
    setSelectedAIServiceInternal(newService);
    
    if (result.chatReset) {
      return { 
        success: true, 
        message: 'Chat reset for security. Previous classified content cleared.' 
      };
    }
    
    return { success: true };
  };

  // Helper: validate and execute an operation
  const validateAndExecute = async <T,>(
    operation: string,
    resource: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    if (!complianceEngine) {
      throw new Error('ComplianceEngine not initialized');
    }

    const decision = await complianceEngine.validateOperation({
      type: operation as any,
      resource,
      user: userContext,
    });

    if (!decision.allowed) {
      throw new Error(decision.reason || 'Operation not allowed');
    }

    return await fn();
  };

  // File operations
  const getFile = async (filename: string): Promise<string> => {
    if (!zenohClient) {
      throw new Error('ZenohClient not initialized');
    }
    return await zenohClient.get(`weaver://fs/${filename}`);
  };

  const saveFile = async (filename: string, content: string): Promise<void> => {
    if (!zenohClient) {
      throw new Error('ZenohClient not initialized');
    }
    await zenohClient.put(`weaver://fs/${filename}`, content);
  };

  const listFiles = async (): Promise<ClassifiedFile[]> => {
    if (!zenohClient) {
      throw new Error('ZenohClient not initialized');
    }
    return await zenohClient.listFiles();
  };

  // AI operations
  const sendMessage = async (message: string): Promise<string> => {
    // Determine classification level of user message (for demo, assume UNCLASSIFIED unless proven otherwise)
    const classificationLevel: SecurityLevel = 'UNCLASSIFIED';
    
    // Add user message to context
    contextManager.addUserMessage(message, classificationLevel, selectedAIService);
    
    // Get visible blocks for current AI service
    const visibleBlocks = contextManager.getVisibleBlocks(selectedAIService);
    
    // Build context summary for AI response prefix
    const fileBlocks = visibleBlocks.filter(b => b.source === 'file_read');
    let contextPrefix = '';
    
    if (fileBlocks.length > 0) {
      contextPrefix = '📎 **Använder kontext från:**\n';
      fileBlocks.forEach(block => {
        contextPrefix += `• ${block.fileReference} [${block.classificationLevel}]\n`;
      });
      contextPrefix += '\n---\n\n';
    }
    
    // Call OpenRouter
    const response = await openRouterClient.chat(
      message,
      selectedAIService,
      visibleBlocks,
      userContext.clearance,
      userContext.networkZone
    );
    
    // Determine response classification (highest of any blocks used)
    const responseClassification = visibleBlocks.length > 0
      ? contextManager.getHighestClassification()
      : classificationLevel;
    
    // Add AI response to context (with context prefix)
    contextManager.addAIResponse(
      contextPrefix + response,
      responseClassification,
      selectedAIService,
      visibleBlocks.map(b => b.id)
    );
    
    return response;
  };
  
  const exportForAI = async (filename: string) => {
    if (!zenohClient) {
      throw new Error('ZenohClient not initialized');
    }
    return await zenohClient.exportForAI(`weaver://fs/${filename}`);
  };
  
  // Context operations
  const getMessages = (): ChatMessage[] => {
    return contextManager.getMessages();
  };
  
  const getContextStats = () => {
    return contextManager.getStats();
  };
  
  const [forceUpdate, setForceUpdate] = useState(0);
  
  const resetContext = () => {
    contextManager.reset();
    setForceUpdate(prev => prev + 1); // Force re-render
  };

  const value: ComplianceContextValue = {
    complianceEngine,
    zenohClient,
    auditDB,
    contextManager,
    userContext,
    setUserContext,
    selectedAIService,
    setSelectedAIService,
    availableAIServices,
    skipAIReview,
    setSkipAIReview,
    validateAndExecute,
    getFile,
    saveFile,
    listFiles,
    sendMessage,
    exportForAI,
    getMessages,
    getContextStats,
    resetContext,
  };

  return (
    <ComplianceContext.Provider value={value}>
      {children}
    </ComplianceContext.Provider>
  );
}

/**
 * Hook to access compliance context
 */
export function useCompliance() {
  const context = useContext(ComplianceContext);
  if (!context) {
    throw new Error('useCompliance must be used within ComplianceProvider');
  }
  return context;
}

