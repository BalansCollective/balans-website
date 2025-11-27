import React, { useState, useMemo, useEffect } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { Download, Save } from 'lucide-react';
import { loadDemoFiles } from '@/components/red-forge/DemoDataLoader';
import type { DemoFile, DemoFileTree } from '@/components/red-forge/DemoDataLoader';
import { MDXRenderer } from '@/components/red-forge/MDXRenderer';
import { WeaverAssistant } from '@/components/red-forge/WeaverAssistant';
import { FileTreeItem } from '@/components/red-forge/FileTreeItem';
import { DemoSafetyModal } from '@/components/red-forge/DemoSafetyModal';
import { convertToFileTree } from '@/components/red-forge/DemoData';
import { Layout, Model, TabNode, IJsonModel } from 'flexlayout-react';
import { BrowserWeaverAssistant } from '@/lib/weaver';
import { CLASSIFICATION_LEVELS, AI_SERVICE_LEVELS, type Classification, type AIService } from '@/components/red-forge/classification-constants';
import { validateFrontmatter, extractClassification, type ValidationContext } from '@/components/red-forge/frontmatter-validator';
import 'flexlayout-react/style/dark.css';
import './RedForgeDemoPage.css';

type ViewMode = 'code' | 'preview';

// Toast notification interface
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

// Simple file interface for demo
interface SimpleFile {
  id: string;
  name: string;
  content: string; // Full content WITH frontmatter (for Code view)
  contentWithoutFrontmatter: string; // Parsed content WITHOUT frontmatter (for Preview view)
  classification: Classification;
  language?: string;
}

function RedForgeDemoContent() {
  // Demo safety modal state
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [demoFiles, setDemoFiles] = useState<DemoFileTree>({} as DemoFileTree);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Shared Weaver instance for both chat and declassification
  const [weaver] = useState(() => new BrowserWeaverAssistant({
    openrouterKey: import.meta.env.VITE_OPENROUTER_KEY || 'DEMO_KEY_NOT_SET',
    userClearance: 'hemlig'
  }));
  
  // AI service state
  const [selectedAIService, setSelectedAIService] = useState<'claude-cloud' | 'saas-lumen' | 'forge-local' | 'forge-airgap'>('claude-cloud');
  
  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Right panel tab state
  const [rightPanelTab, setRightPanelTab] = useState<'weaver' | 'audit'>('weaver');
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    fileId: string;
    classification: Classification;
  } | null>(null);
  
  // Declassification state (embedded in center panel, not modal)
  const [declassificationData, setDeclassificationData] = useState<{
    fileId: string;
    fileName: string;
    originalContent: string;
    originalClassification: Classification;
    targetClassification: Classification;
    modifiedContent: string;
    approved: boolean;
  } | null>(null);
  
  // AI processing state
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  
  // Split-pane collapse state for declassification
  const [showOriginal, setShowOriginal] = useState(true);
  const [showModified, setShowModified] = useState(true);
  
  // Auto-detect if center panel is too narrow for split view
  const [centerPanelWidth, setCenterPanelWidth] = useState(1200);
  
  // Smart mode: Switch to target-only before DiffEditor's inline mode kicks in
  const effectiveDiffMode = centerPanelWidth < 1000 ? 'target' : 'split';
  
  // Context tracking: files currently in AI context
  const [filesInContext, setFilesInContext] = useState<Set<string>>(new Set());
  
  // Simple audit log
  const [auditLog, setAuditLog] = useState<Array<{
    timestamp: Date;
    filename: string;
    classification: Classification;
    aiService: string;
    result: 'allowed' | 'blocked';
  }>>([]);
  
  // Enforcement modal state
  const [showEnforcementModal, setShowEnforcementModal] = useState(false);
  const [enforcementData, setEnforcementData] = useState<{
    filename: string;
    fileClassification: Classification;
    currentService: string;
    suggestedService: 'saas-lumen' | 'forge-local' | 'forge-airgap';
  } | null>(null);
  
  // Responsive layout detection
  const [isMobile, setIsMobile] = useState(false);
  
  // Panel visibility state
  const [showFiles, setShowFiles] = useState(true);
  const [showWeaver, setShowWeaver] = useState(true);
  
  // Convert to flat array of files - MUST be before file state that uses it
  const allFiles = useMemo((): SimpleFile[] => {
    const files: SimpleFile[] = [];
    Object.entries(demoFiles).forEach(([classification, demoFileList]: [string, DemoFile[]]) => {
      demoFileList.forEach(file => {
        files.push({
          id: file.path,
          name: file.title,
          content: file.content, // Full content WITH frontmatter
          contentWithoutFrontmatter: file.contentWithoutFrontmatter, // Parsed content WITHOUT frontmatter
          classification: classification as Classification,
          language: 'markdown'
        });
      });
    });
    return files;
  }, [demoFiles]);
  
  // File state and edits - MUST be before useEffects that depend on them
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [fileEdits, setFileEdits] = useState<Record<string, string>>({});
  
  // Derived values from file state - MUST be after fileEdits but before useEffects
  const activeFile = allFiles.find((f) => f.id === activeFileId);
  
  const getCurrentContent = (file: SimpleFile) => {
    return fileEdits[file.id] ?? file.content;
  };
  
  const activeFileContent = activeFile ? getCurrentContent(activeFile) : '';
  const hasUnsavedChanges = activeFile ? !!fileEdits[activeFile.id] : false;
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Only close if clicking outside the context menu
      const target = e.target as HTMLElement;
      if (!target.closest('.context-menu')) {
        setContextMenu(null);
      }
    };
    if (contextMenu) {
      // Use mousedown to catch before onClick handlers
      window.addEventListener('mousedown', handleClick);
      return () => window.removeEventListener('mousedown', handleClick);
    }
  }, [contextMenu]);
  
  // Keyboard shortcut: Cmd+S / Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+S (Mac) or Ctrl+S (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges) {
          handleSave();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, activeFile, activeFileContent]);
  
  useEffect(() => {
    const hasSeenSafetyModal = localStorage.getItem('red-forge-safety-accepted');
    if (!hasSeenSafetyModal) {
      setShowSafetyModal(true);
    }
  }, []);
  
  useEffect(() => {
    loadDemoFiles()
      .then(files => {
        setDemoFiles(files);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load demo files:', err);
        setLoadError(err.message);
        setLoading(false);
      });
  }, []);
  
  // Toast notification helper
  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };
  
  const handleAcceptSafety = () => {
    localStorage.setItem('red-forge-safety-accepted', 'true');
    setShowSafetyModal(false);
  };
  
  // Handle declassification request (show split-pane in center panel)
  const handleDeclassifyRequest = (targetClassification: Classification) => {
    if (!contextMenu) return;
    
    const file = allFiles.find(f => f.id === contextMenu.fileId);
    if (!file) return;
    
    // Log declassification start to audit trail
    setAuditLog(prev => [{
      timestamp: new Date(),
      filename: file.name,
      classification: file.classification,
      aiService: `Deklassificering startad: ${file.classification.toUpperCase()} → ${targetClassification.toUpperCase()}`,
      result: 'allowed' as const
    }, ...prev].slice(0, 50));
    
    // Set declassification data (will render split-pane in center)
    setDeclassificationData({
      fileId: file.id,
      fileName: file.name,
      originalContent: file.content,
      originalClassification: file.classification,
      targetClassification,
      modifiedContent: file.content, // Start with copy of original
      approved: false,
    });
    setContextMenu(null);
  };
  
  // Handle AI-assisted declassification (called from "AI-hjälp" button)
  const handleAIAssistDeclassify = async () => {
    if (!declassificationData || isAIProcessing) return;
    
    setIsAIProcessing(true);
    
    try {
      // Get service name for logging
      const serviceNames = {
        'claude-cloud': 'Claude Cloud',
        'saas-lumen': 'SaaS Lumen',
        'forge-local': 'Red Forge Local',
        'forge-airgap': 'Red Forge Air-Gap'
      };
      
      // Verify the selected AI service can handle the source classification
      const classLevels = {
        'oklassificerad': 0,
        'begransad-hemlig': 1,
        'konfidentiell': 2,
        'hemlig': 3
      };
      
      const requiredLevel = classLevels[declassificationData.originalClassification];
      const currentLevel = classLevels[
        selectedAIService === 'claude-cloud' ? 'oklassificerad' :
        selectedAIService === 'saas-lumen' ? 'begransad-hemlig' :
        selectedAIService === 'forge-local' ? 'konfidentiell' : 'hemlig'
      ];
      
      // Safety check: Prevent using a service with insufficient clearance
      if (currentLevel < requiredLevel) {
        showToast(`${serviceNames[selectedAIService]} kan inte läsa ${declassificationData.originalClassification.toUpperCase()}-filer. Välj en högre AI-tjänst.`, 'error');
        setIsAIProcessing(false);
        return;
      }
      
      // Call BrowserWeaverAssistant for AI declassification
      const request = `Deklassificera denna fil från ${declassificationData.originalClassification.toUpperCase()} till ${declassificationData.targetClassification.toUpperCase()}. Redigera eller ta bort känslig information så att filen är lämplig för den lägre klassificeringsnivån.`;
      
      console.log('🤖 Calling AI for declassification...', {
        file: declassificationData.fileName,
        from: declassificationData.originalClassification,
        to: declassificationData.targetClassification,
        aiService: selectedAIService
      });
      
      const result = await weaver.proposeFileModifications(
        {
          name: declassificationData.fileName,
          classification: declassificationData.originalClassification,
          content: declassificationData.originalContent
        },
        request,
        selectedAIService
      );
      
      console.log('🤖 AI result:', result);
      
      // FileModification always returns originalFile/modifiedFile structure
      if (result.modifiedFile) {
        // Update declassification data with AI suggestions
        setDeclassificationData(prev => prev ? {
          ...prev,
          modifiedContent: result.modifiedFile.content
        } : null);
        
        // Log AI assistance to audit trail
        setAuditLog(prev => [{
          timestamp: new Date(),
          filename: declassificationData.fileName,
          classification: declassificationData.originalClassification,
          aiService: `AI förslag mottaget (${serviceNames[selectedAIService]})`,
          result: 'allowed' as const
        }, ...prev].slice(0, 50));
      } else {
        showToast('AI-hjälp misslyckades: Ingen modifierad innehåll returnerad', 'error');
      }
      
    } catch (error: any) {
      console.error('AI declassification error:', error);
      showToast(`AI-hjälp misslyckades: ${error.message || 'Okänt fel'}. Kontrollera att OpenRouter API-nyckel är konfigurerad.`, 'error');
    } finally {
      setIsAIProcessing(false);
    }
  };
  
  // Handle download declassified file
  
  // Handle save to workspace (create new file in target classification folder)
  const handleSaveToWorkspace = () => {
    if (!declassificationData || !declassificationData.approved) return;
    
    // Generate new filename with suffix
    const baseName = declassificationData.fileName.replace('.md', '');
    const newFileName = `${baseName}-deklassificerad.md`;
    
    // Determine target folder based on classification
    const targetFolder = declassificationData.targetClassification === 'oklassificerad' ? 'oklassificerad' :
                        declassificationData.targetClassification === 'begransad-hemlig' ? 'begransad-hemlig' :
                        declassificationData.targetClassification === 'konfidentiell' ? 'konfidentiell' : 'hemlig';
    
    const newFilePath = `${targetFolder}/${newFileName}`;
    
    // Check if file already exists
    const existingFileIndex = demoFiles[targetFolder]?.findIndex(f => f.path === newFilePath);
    const fileExists = existingFileIndex !== undefined && existingFileIndex >= 0;
    
    // Map classification to level string
    const classificationLevels: Record<Classification, string> = {
      'oklassificerad': 'O',
      'begransad-hemlig': 'BH',
      'eu-restricted': 'EU-R',  // 🇪🇺
      'konfidentiell': 'K',
      'hemlig': 'H'
    };
    
    // Add classification frontmatter to content
    const frontmatterLines = [
      '---',
      `classification: ${declassificationData.targetClassification}`,
      `classification_level: ${classificationLevels[declassificationData.targetClassification]}`,
      `declassified_from: ${declassificationData.originalClassification}`,
      `declassified_date: ${new Date().toISOString().split('T')[0]}`,
      `original_file: ${declassificationData.fileName}`,
      '---',
      ''
    ];
    
    const contentWithFrontmatter = frontmatterLines.join('\n') + declassificationData.modifiedContent;
    
    // Create new file object matching DemoFile structure
    const newFile: DemoFile = {
      path: newFilePath,
      name: newFileName,
      classification: declassificationData.targetClassification,
      classificationLevel: classificationLevels[declassificationData.targetClassification],
      title: newFileName,
      summary: `Deklassificerad version av ${declassificationData.fileName}`,
      content: contentWithFrontmatter, // Use content with frontmatter
      frontmatter: {
        classification: declassificationData.targetClassification,
        classification_level: classificationLevels[declassificationData.targetClassification],
        declassified_from: declassificationData.originalClassification,
        declassified_date: new Date().toISOString().split('T')[0],
        original_file: declassificationData.fileName
      }
    };
    
    // Add or update file in demoFiles state
    setDemoFiles(prev => {
      const folderFiles = prev[targetFolder] || [];
      
      if (fileExists) {
        // Replace existing file
        return {
          ...prev,
          [targetFolder]: folderFiles.map((f, i) => 
            i === existingFileIndex ? newFile : f
          )
        };
      } else {
        // Add new file
        return {
          ...prev,
          [targetFolder]: [...folderFiles, newFile]
        };
      }
    });
    
    // Show success toast
    showToast(
      fileExists 
        ? `Fil uppdaterad: ${targetFolder}/${newFileName}` 
        : `Fil sparad: ${targetFolder}/${newFileName}`, 
      'success'
    );
    
    // Log save to audit trail
    setAuditLog(prev => [{
      timestamp: new Date(),
      filename: newFileName,
      classification: declassificationData.targetClassification,
      aiService: fileExists 
        ? `Deklassificerad fil uppdaterad i ${targetFolder}/`
        : `Deklassificerad fil skapad i ${targetFolder}/`,
      result: 'allowed' as const
    }, ...prev].slice(0, 50));
    
    // Close declassification view and open the new file
    setDeclassificationData(null);
    setActiveFileId(newFilePath);
  };
  
  // Downgrade block modal state
  const [showDowngradeBlockModal, setShowDowngradeBlockModal] = useState<{
    from: Classification;
    to: Classification;
    fileName: string;
  } | null>(null);
  
  useEffect(() => {
    if (allFiles.length > 0 && !activeFileId) {
      setActiveFileId(allFiles[0].id);
    }
  }, [allFiles, activeFileId]);
  
  const defaultViewMode: ViewMode = activeFile?.language === 'markdown' ? 'preview' : 'code';
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  
  // FlexLayout model - Desktop: Dynamic 1-3 panels based on visibility | Mobile: Vertical stack
  const layoutModel = useMemo(() => {
    const json: IJsonModel = isMobile ? {
      // MOBILE: Single tabset with Files/Editor/Weaver tabs
      global: {
        tabEnableClose: false,
        tabSetEnableMaximize: false,
        tabSetEnableDrag: false,
        tabSetEnableDrop: false,
        tabSetHeaderHeight: 44, // Larger touch target
        tabSetTabStripHeight: 44,
        splitterSize: 2,
      },
      borders: [],
      layout: {
        type: 'row',
        weight: 100,
        children: [
          {
            type: 'tabset',
            weight: 100,
            enableDeleteWhenEmpty: false,
            children: [
              {
                type: 'tab',
                name: '📁 Files',
                component: 'fileTree',
                enableClose: false,
              },
              {
                type: 'tab',
                name: '📝 Editor',
                component: 'editor',
                enableClose: false,
              },
              {
                type: 'tab',
                name: '🤖 Weaver',
                component: 'assistant',
                enableClose: false,
              }
            ]
          }
        ]
      }
    } : {
      // DESKTOP: Dynamic panels (only include visible ones)
      global: {
        tabEnableClose: false,
        tabSetEnableMaximize: false,
        tabSetEnableDrag: false,
        tabSetEnableDrop: false,
        tabSetHeaderHeight: 0, // Remove tab header height
        tabSetTabStripHeight: 0, // Remove tab strip height
        splitterSize: 4,
      },
      borders: [],
      layout: {
        type: 'row',
        weight: 100,
        children: [
          // Conditionally add left panel (Files)
          ...(showFiles ? [{
            type: 'tabset' as const,
            weight: 20,
            enableDeleteWhenEmpty: false,
            enableTabStrip: false, // Hide tab header completely
            children: [
              {
                type: 'tab' as const,
                name: 'FILES',
                component: 'fileTree',
                enableClose: false,
              }
            ]
          }] : []),
          // Center panel (Editor) - always visible
          {
            type: 'tabset' as const,
            weight: 50,
            enableDeleteWhenEmpty: false,
            enableTabStrip: false, // Hide tab header completely
            children: [
              {
                type: 'tab' as const,
                name: 'Editor',
                component: 'editor',
                enableClose: false,
              }
            ]
          },
          // Conditionally add right panel (Weaver)
          ...(showWeaver ? [{
            type: 'tabset' as const,
            weight: 30,
            enableDeleteWhenEmpty: false,
            enableTabStrip: false, // Hide tab header completely
            children: [
              {
                type: 'tab' as const,
                name: 'WEAVER',
                component: 'assistant',
                enableClose: false,
              }
            ]
          }] : [])
        ]
      }
    };
    return Model.fromJson(json);
  }, [isMobile, showFiles, showWeaver]);
  
  const handleEditorChange = (value: string | undefined) => {
    if (!activeFile || value === undefined) return;
    setFileEdits(prev => ({ ...prev, [activeFile.id]: value }));
  };
  
  const handleFileSelect = (fileId: string) => {
    setActiveFileId(fileId);
    // Don't auto-switch view mode - let user keep their preference
  };
  
  // Save file with frontmatter validation
  const handleSave = () => {
    if (!activeFile) return;
    
    const currentContent = activeFileContent;
    const originalFile = allFiles.find(f => f.id === activeFile.id);
    const originalClassification = originalFile ? extractClassification(originalFile.content) : null;
    
    // Validate frontmatter
    const validation = validateFrontmatter({
      content: currentContent,
      filePath: activeFile.id,
      originalClassification: originalClassification || undefined,
      isNewFile: false
    });
    
    // If validation failed
    if (!validation.valid) {
      // Check for downgrade attempt
      if (validation.suggestedAction?.type === 'declassify') {
        setShowDowngradeBlockModal({
          from: validation.suggestedAction.from,
          to: validation.suggestedAction.to,
          fileName: activeFile.name
        });
        
        // Log blocked downgrade
        setAuditLog(prev => [{
          timestamp: new Date(),
          filename: activeFile.name,
          classification: validation.suggestedAction.from,
          aiService: 'SYSTEM',
          result: 'blocked' as const
        }, ...prev].slice(0, 50));
        
        return;
      }
      
      // Other validation errors
      showToast(
        `Validering misslyckades:\n${validation.errors.join('\n')}`,
        'error'
      );
      return;
    }
    
    // Show warnings if any (but allow save)
    if (validation.warnings.length > 0) {
      showToast(
        `Varningar:\n${validation.warnings.slice(0, 3).join('\n')}`,
        'warning'
      );
    }
    
    // Log classification upgrade if detected
    if (originalClassification) {
      const newClassification = extractClassification(currentContent);
      if (newClassification && newClassification !== originalClassification) {
        const originalLevel = CLASSIFICATION_LEVELS[originalClassification];
        const newLevel = CLASSIFICATION_LEVELS[newClassification];
        
        if (newLevel > originalLevel) {
          setAuditLog(prev => [{
            timestamp: new Date(),
            filename: activeFile.name,
            classification: newClassification,
            aiService: 'SYSTEM',
            result: 'allowed' as const
          }, ...prev].slice(0, 50));
        }
      }
    }
    
    // Clear unsaved changes for this file
    setFileEdits(prev => {
      const { [activeFile.id]: _, ...rest } = prev;
      return rest;
    });
    
    showToast('Fil sparad (endast i browser-session)', 'success');
  };
  
  // FlexLayout factory - renders components for each tab
  const factory = (node: TabNode) => {
    const component = node.getComponent();
    
    if (component === 'fileTree') {
      return (
        <div className="h-full flex flex-col bg-[#0d1117] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-2">
            {Object.entries(demoFiles).map(([folderName, files]) => (
              <div key={folderName} className="mb-2">
                <div className="text-xs font-semibold text-gray-400 mb-1 px-2 flex items-center gap-1">
                  📁 {folderName}/
                </div>
                <div className="pl-4">
                  {files.map((file: DemoFile) => {
                    const classification = file.classification;
                    const badgeColor = 
                      classification === 'hemlig' ? 'bg-red-900/30 text-red-400 border-red-700' :
                      classification === 'konfidentiell' ? 'bg-red-900/20 text-red-400 border-red-500' :
                      classification === 'begransad-hemlig' ? 'bg-orange-900/20 text-orange-400 border-orange-500' :
                      classification === 'eu-restricted' ? 'bg-blue-900/20 text-blue-400 border-blue-500' : // 🇪🇺
                      'bg-green-900/20 text-green-400 border-green-500';
                    
                    const badgeLabel = 
                      classification === 'hemlig' ? 'H' :
                      classification === 'konfidentiell' ? 'K' :
                      classification === 'begransad-hemlig' ? 'BH' :
                      classification === 'eu-restricted' ? '🇪🇺 EU-R' :
                      'O';
                    
                    return (
                      <button
                        key={file.path}
                        onClick={() => handleFileSelect(file.path)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation(); // Prevent bubbling
                          // Show context menu for BH, K, or H files (all except O)
                          if (file.classification !== 'oklassificerad') {
                            setContextMenu({
                              x: e.clientX,
                              y: e.clientY,
                              fileId: file.path,
                              classification: file.classification
                            });
                          }
                        }}
                        className={`
                          w-full text-left px-2 py-1 rounded text-xs flex items-center justify-between gap-2
                          ${activeFileId === file.path 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'text-gray-400 hover:bg-[#161b22]'}
                        `}
                      >
                        <span className="flex items-center gap-1 flex-1 min-w-0">
                          <span>📄</span>
                          <span className="truncate">{file.title}</span>
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border flex-shrink-0 ${badgeColor}`}>
                          {badgeLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (component === 'editor') {
      // If declassification is active, show split-pane editor
      if (declassificationData) {
        return (
          <div className="h-full flex flex-col bg-[#0d1117] overflow-hidden">
            {/* Toolbar for Declassification */}
            <div className="h-10 bg-[#161b22] border-b border-gray-700 flex items-center px-3 flex-shrink-0">
              {/* Left: Files toggle */}
              {!isMobile && (
                <button
                  onClick={() => setShowFiles(!showFiles)}
                  className={`w-8 h-8 rounded flex items-center justify-center text-base transition-colors mr-3 ${
                    showFiles
                      ? 'bg-red-500/20 text-red-400'
                      : 'text-gray-500 hover:bg-[#1f2937] hover:text-gray-300'
                  }`}
                  title={showFiles ? 'Dölj filer' : 'Visa filer'}
                >
                  📁
                </button>
              )}
              
              {/* Center: Title */}
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm text-white font-medium">📝 Deklassificering</span>
                <span className="text-xs text-gray-400">
                  {declassificationData.fileName}: 
                  <span className="text-red-400 ml-1">{declassificationData.originalClassification.toUpperCase()}</span>
                  <span className="mx-1">→</span>
                  <span className="text-green-400">{declassificationData.targetClassification.toUpperCase()}</span>
                </span>
                
                {/* AI Service Selector for Declassification */}
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-xs text-gray-500">AI-tjänst:</span>
                  <select
                    value={selectedAIService}
                    onChange={(e) => setSelectedAIService(e.target.value as AIService)}
                    className="bg-[#161b22] border border-gray-700 rounded px-2 py-0.5 text-xs text-gray-300 hover:border-red-500 transition-colors"
                    disabled={isAIProcessing}
                  >
                    {Object.entries(AI_SERVICE_LEVELS)
                      .filter(([_, info]) => {
                        // Only show services that can handle the source classification
                        const sourceLevel = CLASSIFICATION_LEVELS[declassificationData.originalClassification];
                        return info.level >= sourceLevel;
                      })
                      .map(([key, info]) => (
                        <option key={key} value={key}>
                          {info.name}
                        </option>
                      ))}
                  </select>
                </div>
                
                {/* Auto mode indicator */}
                {centerPanelWidth < 1000 && (
                  <span className="text-xs text-yellow-400 ml-2">
                    (Kompakt läge)
                  </span>
                )}
              </div>
              
              {/* Right: Weaver toggle + Close */}
              <div className="flex items-center gap-1">
                {!isMobile && (
                  <button
                    onClick={() => setShowWeaver(!showWeaver)}
                    className={`w-8 h-8 rounded flex items-center justify-center text-base transition-colors ${
                      showWeaver
                        ? 'bg-red-500/20 text-red-400'
                        : 'text-gray-500 hover:bg-[#1f2937] hover:text-gray-300'
                    }`}
                    title={showWeaver ? 'Dölj Weaver' : 'Visa Weaver'}
                  >
                    🤖
                  </button>
                )}
                <button
                  onClick={() => setDeclassificationData(null)}
                  className="text-gray-400 hover:text-white px-2"
                  title="Stäng deklassificering"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Editor: DiffEditor (split) or normal Editor (target-only) */}
            <div 
              className="flex-1 overflow-hidden"
              ref={(el) => {
                if (el) {
                  // Measure panel width for smart layout
                  const observer = new ResizeObserver((entries) => {
                    for (const entry of entries) {
                      setCenterPanelWidth(entry.contentRect.width);
                    }
                  });
                  observer.observe(el);
                  return () => observer.disconnect();
                }
              }}
            >
              {effectiveDiffMode === 'split' ? (
                <DiffEditor
                  key={`diff-${declassificationData.originalContent.length}-${declassificationData.modifiedContent.length}`} // Force remount on content change
                  height="100%"
                  language="markdown"
                  theme="vs-dark"
                  original={declassificationData.originalContent}
                  modified={declassificationData.modifiedContent}
                  onMount={(editor) => {
                    // Make modified (right) side editable
                    const modifiedEditor = editor.getModifiedEditor();
                    modifiedEditor.onDidChangeModelContent(() => {
                      const value = modifiedEditor.getValue();
                      setDeclassificationData(prev => prev ? { ...prev, modifiedContent: value } : null);
                    });
                  }}
                  options={{
                    readOnly: false, // Modified side is editable
                    originalEditable: false, // Original side is read-only
                    renderSideBySide: true,
                    enableSplitViewResizing: false, // Force 50/50 split, no user resize
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    renderOverviewRuler: false,
                    // Better split sizing
                    diffWordWrap: 'on',
                    wordWrap: 'on',
                    // Allow more space for modified side
                    renderIndicators: true,
                    ignoreTrimWhitespace: true,
                  }}
                />
              ) : (
                // Target-only view: Just the modified file
                <Editor
                  key={`editor-${declassificationData.modifiedContent.length}`} // Force remount on content change
                  height="100%"
                  language="markdown"
                  theme="vs-dark"
                  value={declassificationData.modifiedContent}
                  onChange={(value) => {
                    if (value !== undefined) {
                      setDeclassificationData(prev => prev ? { ...prev, modifiedContent: value } : null);
                    }
                  }}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                  }}
                />
              )}
            </div>
            
            {/* Footer with Actions */}
            <div className="h-12 bg-[#161b22] border-t border-gray-700 px-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAIAssistDeclassify}
                  disabled={isAIProcessing}
                  className={`px-3 py-1.5 rounded transition-colors text-sm font-medium ${
                    isAIProcessing
                      ? 'bg-purple-800 text-purple-300 cursor-wait'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isAIProcessing ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⚙️</span>
                      Arbetar...
                    </>
                  ) : (
                    '🤖 AI-hjälp'
                  )}
                </button>
                {declassificationData.approved && (
                  <span className="text-green-400 text-sm">✓ Godkänd</span>
                )}
                {isAIProcessing && (
                  <span className="text-purple-400 text-xs animate-pulse">
                    AI analyserar och föreslår redaktioner...
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                {!declassificationData.approved ? (
                  <button
                    onClick={() => {
                      setDeclassificationData(prev => prev ? { ...prev, approved: true } : null);
                      
                      // Log approval to audit trail
                      if (declassificationData) {
                        setAuditLog(prevLog => [{
                          timestamp: new Date(),
                          filename: declassificationData.fileName,
                          classification: declassificationData.originalClassification,
                          aiService: `Redigeringar godkända av användare`,
                          result: 'allowed' as const
                        }, ...prevLog].slice(0, 50));
                      }
                    }}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm font-medium"
                  >
                    Godkänn Redigeringar
                  </button>
                ) : (
                  <button
                    onClick={handleSaveToWorkspace}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm font-medium"
                  >
                    💾 Spara till Workspace
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }
      
      // Normal editor view (when not declassifying)
      return (
        <div className="h-full flex flex-col bg-[#0d1117] overflow-hidden">
          {/* Toolbar */}
          <div className="h-10 bg-[#161b22] border-b border-gray-700 flex items-center px-3 flex-shrink-0">
            {/* Left: Files toggle */}
            {!isMobile && (
              <button
                onClick={() => setShowFiles(!showFiles)}
                className={`w-8 h-8 rounded flex items-center justify-center text-base transition-colors mr-2 ${
                  showFiles
                    ? 'bg-red-500/20 text-red-400'
                    : 'text-gray-500 hover:bg-[#1f2937] hover:text-gray-300'
                }`}
                title={showFiles ? 'Hide Files Panel' : 'Show Files Panel'}
              >
                📁
              </button>
            )}
            
            {/* Center: File info + view modes */}
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              {activeFile && (
                <>
                  <span className="text-xs md:text-sm text-gray-300 truncate">{activeFile.name}</span>
                  <span className={`
                    px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-medium border flex-shrink-0
                    ${activeFile.classification === 'hemlig' ? 'bg-red-900/30 text-red-400 border-red-700' : ''}
                    ${activeFile.classification === 'konfidentiell' ? 'bg-red-900/20 text-red-400 border-red-500' : ''}
                    ${activeFile.classification === 'begransad-hemlig' ? 'bg-orange-900/20 text-orange-400 border-orange-500' : ''}
                    ${activeFile.classification === 'oklassificerad' ? 'bg-green-900/20 text-green-400 border-green-500' : ''}
                  `}>
                    <span className="hidden sm:inline">{activeFile.classification.toUpperCase()}</span>
                    <span className="sm:hidden">
                      {activeFile.classification === 'oklassificerad' ? 'O' :
                       activeFile.classification === 'begransad-hemlig' ? 'BH' :
                       activeFile.classification === 'konfidentiell' ? 'K' : 'H'}
                    </span>
                  </span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-1 md:gap-2">
              {/* Save button (shows when file has unsaved changes) */}
              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded flex items-center gap-1 transition-colors border ${
                  hasUnsavedChanges
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
                    : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                }`}
                title={hasUnsavedChanges ? "Spara (⌘S)" : "Inga ändringar att spara"}
              >
                <Save className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline">Spara</span>
                {hasUnsavedChanges && <span className="text-[10px] opacity-70">⌘S</span>}
              </button>
              
              {/* Download button (only for Oklassificerad files) */}
              {activeFile && activeFile.classification === 'oklassificerad' && (
                <button
                  onClick={() => {
                    const blob = new Blob([activeFile.content], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = activeFile.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-2 md:px-3 py-1 text-xs md:text-sm text-green-400 hover:text-white hover:bg-green-900/30 rounded flex items-center gap-1 transition-colors border border-green-500/30"
                  title="Ladda ner oklassificerad fil"
                >
                  <Download className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden md:inline">Ladda ner</span>
                </button>
              )}
              
              <button
                onClick={() => setViewMode('code')}
                className={`px-2 md:px-3 py-1 rounded text-xs mobile-toolbar-btn ${
                  viewMode === 'code'
                    ? 'bg-red-500/20 text-red-400 border border-red-500'
                    : 'text-gray-400 hover:bg-[#1f2937]'
                }`}
              >
                Code
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-2 md:px-3 py-1 rounded text-xs mobile-toolbar-btn ${
                  viewMode === 'preview'
                    ? 'bg-red-500/20 text-red-400 border border-red-500'
                    : 'text-gray-400 hover:bg-[#1f2937]'
                }`}
              >
                Preview
              </button>
              
              {activeFile && (
                <div className="ml-1 md:ml-2 pl-1 md:pl-2 border-l border-gray-700">
                  {!filesInContext.has(activeFile.id) ? (
                    <button
                      onClick={() => {
                        const AI_LEVELS = {
                          'claude-cloud': 0,
                          'saas-lumen': 1,
                          'forge-local': 2,
                          'forge-airgap': 3
                        };
                        const CLASS_LEVELS = {
                          'oklassificerad': 0,
                          'begransad-hemlig': 1,
                          'konfidentiell': 2,
                          'hemlig': 3
                        };
                        
                        const aiLevel = AI_LEVELS[selectedAIService];
                        const fileLevel = CLASS_LEVELS[activeFile.classification];
                        
                        if (aiLevel < fileLevel) {
                          const suggestedService = 
                            fileLevel === 1 ? 'saas-lumen' :
                            fileLevel === 2 ? 'forge-local' : 'forge-airgap';
                          
                          setEnforcementData({
                            filename: activeFile.name,
                            fileClassification: activeFile.classification,
                            currentService: selectedAIService === 'claude-cloud' ? 'Claude Cloud (O)' :
                                           selectedAIService === 'saas-lumen' ? 'SaaS Lumen (BH)' :
                                           selectedAIService === 'forge-local' ? 'Red Forge Local (K)' : 'Red Forge Air-Gap (H)',
                            suggestedService
                          });
                          setShowEnforcementModal(true);
                          
                          setAuditLog(prev => [{
                            timestamp: new Date(),
                            filename: activeFile.name,
                            classification: activeFile.classification,
                            aiService: selectedAIService === 'claude-cloud' ? 'Claude Cloud' :
                                       selectedAIService === 'saas-lumen' ? 'SaaS Lumen' :
                                       selectedAIService === 'forge-local' ? 'Red Forge Local' : 'Red Forge Air-Gap',
                            result: 'blocked' as const
                          }, ...prev].slice(0, 50));
                          return;
                        }
                        
                        setFilesInContext(prev => new Set(prev).add(activeFile.id));
                        
                        setAuditLog(prev => [{
                          timestamp: new Date(),
                          filename: activeFile.name,
                          classification: activeFile.classification,
                          aiService: selectedAIService === 'claude-cloud' ? 'Claude Cloud' :
                                     selectedAIService === 'saas-lumen' ? 'SaaS Lumen' :
                                     selectedAIService === 'forge-local' ? 'Red Forge Local' : 'Red Forge Air-Gap',
                          result: 'allowed' as const
                        }, ...prev].slice(0, 50));
                      }}
                      className="px-2 md:px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors flex items-center gap-1 mobile-toolbar-btn"
                    >
                      <span className="hidden sm:inline">Skicka till AI</span>
                      <span className="sm:hidden">AI</span>
                      <span>→</span>
                    </button>
                  ) : (
                    <span className="text-xs text-green-400 px-2 flex items-center gap-1">
                      <span>✓</span>
                      <span className="hidden sm:inline">I AI-kontext</span>
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* Right: Weaver toggle */}
            {!isMobile && (
              <button
                onClick={() => setShowWeaver(!showWeaver)}
                className={`w-8 h-8 rounded flex items-center justify-center text-base transition-colors ml-2 ${
                  showWeaver
                    ? 'bg-red-500/20 text-red-400'
                    : 'text-gray-500 hover:bg-[#1f2937] hover:text-gray-300'
                }`}
                title={showWeaver ? 'Hide Weaver Panel' : 'Show Weaver Panel'}
              >
                🤖
              </button>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {viewMode === 'code' && (
              <Editor
                height="100%"
                language={activeFile?.language || 'markdown'}
                value={activeFileContent}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  readOnly: false,
                }}
              />
            )}
            
            {viewMode === 'preview' && activeFile && (
              <div className="h-full bg-[#0d1117]">
                <MDXRenderer 
                  content={activeFile.contentWithoutFrontmatter} 
                  classification={activeFile.classification}
                />
              </div>
            )}
          </div>
        </div>
      );
    }
    
    if (component === 'assistant') {
      return (
        <div className="h-full flex flex-col bg-[#0d1117] overflow-hidden">
          {/* Tabs for Weaver/Audit */}
          <div className="flex border-b border-gray-700 bg-[#161b22] flex-shrink-0">
            <button
              onClick={() => setRightPanelTab('weaver')}
              className={`flex-1 py-2 px-4 text-xs font-medium transition-colors ${
                rightPanelTab === 'weaver'
                  ? 'bg-[#0d1117] text-red-400 border-b-2 border-red-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Weaver
            </button>
            <button
              onClick={() => setRightPanelTab('audit')}
              className={`flex-1 py-2 px-4 text-xs font-medium transition-colors ${
                rightPanelTab === 'audit'
                  ? 'bg-[#0d1117] text-red-400 border-b-2 border-red-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Audit Log
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden min-h-0">
            {rightPanelTab === 'weaver' ? (
              activeFile ? (
                <WeaverAssistant
                  file={{
                    classification: activeFile.classification,
                    title: activeFile.name,
                    content: activeFile.content // Send file content!
                  }}
                  selectedService={selectedAIService}
                  onServiceChange={(newService) => {
                    const oldLevel = selectedAIService === 'claude-cloud' ? 0 : selectedAIService === 'saas-lumen' ? 1 : selectedAIService === 'forge-local' ? 2 : 3;
                    const newLevel = newService === 'claude-cloud' ? 0 : newService === 'saas-lumen' ? 1 : newService === 'forge-local' ? 2 : 3;
                    
                    if (newLevel < oldLevel) {
                      setFilesInContext(new Set());
                      setAuditLog(prev => [{
                        timestamp: new Date(),
                        filename: '[SYSTEM]',
                        classification: 'hemlig' as Classification,
                        aiService: `Context cleared (downgrade detected)`,
                        result: 'blocked' as const
                      }, ...prev].slice(0, 50));
                    }
                    
                    setSelectedAIService(newService);
                  }}
                  filesInContext={Array.from(filesInContext).map(id => {
                    const file = allFiles.find(f => f.id === id);
                    return file ? {
                      name: file.name,
                      content: file.content,
                      classification: file.classification
                    } : null;
                  }).filter((f): f is { name: string; content: string; classification: Classification } => f !== null)}
                  onClearContext={() => {
                    setFilesInContext(new Set());
                    setAuditLog(prev => [{
                      timestamp: new Date(),
                      filename: '[SYSTEM]',
                      classification: 'oklassificerad' as Classification,
                      aiService: 'Context manually cleared',
                      result: 'allowed' as const
                    }, ...prev].slice(0, 50));
                  }}
                  weaver={weaver}
                />
              ) : (
                <div className="p-4 text-gray-500 text-sm text-center">
                  Välj en fil för att aktivera Weaver
                </div>
              )
            ) : (
              <div className="h-full flex flex-col bg-[#0d1117] overflow-hidden">
                {/* Audit log header with export button */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
                  <span className="text-xs text-gray-400">Audit Log</span>
                  <button
                    onClick={() => {
                      try {
                        const chronicleData = localStorage.getItem('weaver-chronicle');
                        if (!chronicleData) {
                          showToast('Inga Chronicle-loggar att exportera', 'info');
                          return;
                        }
                        
                        const blob = new Blob([chronicleData], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `chronicle-${new Date().toISOString().split('T')[0]}.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error('Failed to export chronicle:', error);
                        showToast('Kunde inte exportera Chronicle-loggar', 'error');
                      }
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-800"
                    title="Exportera Audit Log"
                  >
                    <Download className="w-3 h-3" />
                    Exportera
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 text-xs space-y-1">
                  {auditLog.length === 0 ? (
                    <div className="text-gray-600 text-center py-4">Inga händelser ännu</div>
                  ) : (
                    auditLog.map((entry, idx) => (
                      <div
                        key={idx}
                        className={`px-2 py-1 rounded ${
                          entry.result === 'blocked' 
                            ? 'bg-red-900/20 text-red-400' 
                            : 'bg-green-900/20 text-green-400'
                        }`}
                      >
                        <span className="text-gray-500">
                          {entry.timestamp.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        {' '}
                        <span className="text-gray-400">{entry.filename}</span>
                        {' → '}
                        <span className="text-gray-300">{entry.aiService}</span>
                        {' '}
                        <span className={entry.result === 'blocked' ? 'text-red-400' : 'text-green-400'}>
                          {entry.result === 'blocked' ? '✗ BLOCKERAD' : '✓ TILLÅTEN'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  if (loading) {
    return (
      <div className="h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">⚒️ Loading Red Forge Demo...</div>
          <div className="text-gray-500 text-sm">Loading demo files...</div>
        </div>
      </div>
    );
  }
  
  if (loadError) {
    return (
      <div className="h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">❌ Failed to load demo</div>
          <div className="text-gray-500 text-sm">{loadError}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-gray-300">
      <DemoSafetyModal isOpen={showSafetyModal} onAccept={handleAcceptSafety} />
      
      {/* Enforcement Modal */}
      {showEnforcementModal && enforcementData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-red-500 rounded-lg p-4 md:p-6 max-w-md mx-auto w-full">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-400 text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-white mb-1">Säkerhetsblockering</h3>
                <p className="text-xs md:text-sm text-gray-400">
                  {enforcementData.fileClassification.toUpperCase()} innehåll kan inte skickas till {enforcementData.currentService}
                </p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded p-3 md:p-4 mb-4 space-y-2 md:space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Fil:</div>
                <div className="text-xs md:text-sm text-gray-300 font-medium truncate">{enforcementData.filename}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Klassificering:</div>
                <div className="text-xs md:text-sm text-red-400 font-semibold">{enforcementData.fileClassification.toUpperCase()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Rekommenderad AI-tjänst:</div>
                <div className="text-xs md:text-sm text-green-400 font-semibold">
                  {enforcementData.suggestedService === 'saas-lumen' ? 'SaaS Lumen (BH)' :
                   enforcementData.suggestedService === 'forge-local' ? 'Red Forge Local (K)' :
                   'Red Forge Air-Gap (H)'}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setShowEnforcementModal(false);
                  setEnforcementData(null);
                }}
                className="flex-1 py-2 md:py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors text-xs md:text-sm min-h-[44px] sm:min-h-0"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  const oldLevel = selectedAIService === 'claude-cloud' ? 0 : selectedAIService === 'saas-lumen' ? 1 : selectedAIService === 'forge-local' ? 2 : 3;
                  const newService = enforcementData.suggestedService;
                  const newLevel = newService === 'saas-lumen' ? 1 : newService === 'forge-local' ? 2 : 3;
                  
                  if (newLevel < oldLevel) {
                    setFilesInContext(new Set());
                    setAuditLog(prev => [{
                      timestamp: new Date(),
                      filename: '[SYSTEM]',
                      classification: 'hemlig' as Classification,
                      aiService: `Context cleared (downgrade detected)`,
                      result: 'blocked' as const
                    }, ...prev].slice(0, 50));
                  }
                  
                  setSelectedAIService(newService);
                  
                  if (activeFile) {
                    setFilesInContext(prev => new Set(prev).add(activeFile.id));
                    
                    setAuditLog(prev => [{
                      timestamp: new Date(),
                      filename: activeFile.name,
                      classification: activeFile.classification,
                      aiService: newService === 'saas-lumen' ? 'SaaS Lumen' :
                                 newService === 'forge-local' ? 'Red Forge Local' : 'Red Forge Air-Gap',
                      result: 'allowed' as const
                    }, ...prev].slice(0, 50));
                  }
                  
                  setShowEnforcementModal(false);
                  setRightPanelTab('weaver');
                }}
                className="flex-1 py-2 md:py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-xs md:text-sm font-medium min-h-[44px] sm:min-h-0"
              >
                Byt AI-tjänst & Skicka
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Top Bar */}
      <div className="h-10 md:h-12 bg-[#161b22] border-b border-gray-700 flex items-center px-2 md:px-4 gap-2 md:gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-red-400 font-bold text-base md:text-lg">RED FORGE</span>
        </div>
      </div>
      
      {/* FlexLayout */}
      <div className="flex-1 overflow-hidden">
        <Layout model={layoutModel} factory={factory} />
      </div>
      
      {/* Context Menu for Declassification */}
      {contextMenu && (
        <div
          className="context-menu fixed bg-[#1f2937] border border-gray-700 rounded shadow-lg py-1 z-[10000]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <div className="px-3 py-1 text-xs text-gray-400 border-b border-gray-700">
            Deklassificera till:
          </div>
          {contextMenu.classification === 'hemlig' && (
            <button
              onClick={() => handleDeclassifyRequest('konfidentiell')}
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
            >
              <span className="text-orange-400">K</span> Konfidentiell
            </button>
          )}
          {(contextMenu.classification === 'hemlig' || contextMenu.classification === 'konfidentiell') && (
            <button
              onClick={() => handleDeclassifyRequest('begransad-hemlig')}
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
            >
              <span className="text-yellow-400">BH</span> Begränsad Hemlig
            </button>
          )}
          <button
            onClick={() => handleDeclassifyRequest('oklassificerad')}
            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
          >
            <span className="text-green-400">O</span> Oklassificerad
          </button>
        </div>
      )}
      
      {/* Downgrade Block Modal */}
      {showDowngradeBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0d1117] border border-red-500 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              🚨 Säkerhetsvarning
            </h2>
            
            <p className="text-gray-300 mb-4">
              Du försöker sänka klassificeringen från{' '}
              <strong className="text-red-400">
                {showDowngradeBlockModal.from.toUpperCase()}
              </strong>
              {' '}till{' '}
              <strong className="text-yellow-400">
                {showDowngradeBlockModal.to.toUpperCase()}
              </strong>
            </p>
            
            <div className="bg-gray-900 border border-gray-700 rounded p-3 mb-4">
              <p className="text-sm text-gray-400 mb-2">
                ✅ <strong>Rätt metod:</strong>
              </p>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Stäng denna dialog</li>
                <li>Högerklicka på filen i filträdet</li>
                <li>Välj "Deklassificera till {showDowngradeBlockModal.to.toUpperCase()}"</li>
                <li>Granska AI-föreslagna redigeringar</li>
                <li>Godkänn ändringar</li>
              </ol>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const targetFile = allFiles.find(f => f.name === showDowngradeBlockModal.fileName);
                  if (targetFile) {
                    setShowDowngradeBlockModal(null);
                    handleDeclassifyRequest(
                      { id: targetFile.id, name: targetFile.name, content: targetFile.content, classification: targetFile.classification },
                      showDowngradeBlockModal.to
                    );
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                🤖 Starta Deklassificering
              </button>
              <button
                onClick={() => setShowDowngradeBlockModal(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-[10001] flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm
              transform transition-all duration-300 ease-in-out
              animate-in slide-in-from-right
              ${toast.type === 'success' ? 'bg-green-900/90 border-green-500/50 text-green-100' : ''}
              ${toast.type === 'info' ? 'bg-blue-900/90 border-blue-500/50 text-blue-100' : ''}
              ${toast.type === 'warning' ? 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100' : ''}
              ${toast.type === 'error' ? 'bg-red-900/90 border-red-500/50 text-red-100' : ''}
            `}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <span className="text-xl">✅</span>}
              {toast.type === 'info' && <span className="text-xl">ℹ️</span>}
              {toast.type === 'warning' && <span className="text-xl">⚠️</span>}
              {toast.type === 'error' && <span className="text-xl">❌</span>}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RedForgeDemoPage() {
  return <RedForgeDemoContent />;
}
