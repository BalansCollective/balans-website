import React, { useState, useMemo, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Download } from 'lucide-react';
import { loadDemoFiles } from '@/components/red-forge/DemoDataLoader';
import type { DemoFile, DemoFileTree } from '@/components/red-forge/DemoDataLoader';
import { MDXRenderer } from '@/components/red-forge/MDXRenderer';
import { WeaverAssistant } from '@/components/red-forge/WeaverAssistant';
import { FileTreeItem } from '@/components/red-forge/FileTreeItem';
import { DemoSafetyModal } from '@/components/red-forge/DemoSafetyModal';
import { convertToFileTree } from '@/components/red-forge/DemoData';
import { Layout, Model, TabNode, IJsonModel } from 'flexlayout-react';
import 'flexlayout-react/style/dark.css';
import './RedForgeDemoPage.css';

type ViewMode = 'code' | 'preview';
type Classification = 'oklassificerad' | 'begransad-hemlig' | 'konfidentiell' | 'hemlig';

// Simple file interface for demo
interface SimpleFile {
  id: string;
  name: string;
  content: string;
  classification: Classification;
  language?: string;
}

function RedForgeDemoContent() {
  // Demo safety modal state
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [demoFiles, setDemoFiles] = useState<DemoFileTree>({} as DemoFileTree);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // AI service state
  const [selectedAIService, setSelectedAIService] = useState<'claude-cloud' | 'saas-lumen' | 'forge-local' | 'forge-airgap'>('claude-cloud');
  
  // Right panel tab state
  const [rightPanelTab, setRightPanelTab] = useState<'weaver' | 'audit'>('weaver');
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    fileId: string;
    classification: Classification;
  } | null>(null);
  
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
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [contextMenu]);
  
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
  
  const handleAcceptSafety = () => {
    localStorage.setItem('red-forge-safety-accepted', 'true');
    setShowSafetyModal(false);
  };
  
  // Convert to flat array of files
  const allFiles = useMemo((): SimpleFile[] => {
    const files: SimpleFile[] = [];
    Object.entries(demoFiles).forEach(([classification, demoFileList]: [string, DemoFile[]]) => {
      demoFileList.forEach(file => {
        files.push({
          id: file.path,
          name: file.title,
          content: file.content,
          classification: classification as Classification,
          language: 'markdown'
        });
      });
    });
    return files;
  }, [demoFiles]);
  
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [fileEdits, setFileEdits] = useState<Record<string, string>>({}); 
  
  useEffect(() => {
    if (allFiles.length > 0 && !activeFileId) {
      setActiveFileId(allFiles[0].id);
    }
  }, [allFiles, activeFileId]);
  
  const activeFile = allFiles.find((f) => f.id === activeFileId);
  
  const getCurrentContent = (file: SimpleFile) => {
    return fileEdits[file.id] ?? file.content;
  };
  
  const activeFileContent = activeFile ? getCurrentContent(activeFile) : '';
  
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
    const file = allFiles.find(f => f.id === fileId);
    if (file) {
      setViewMode(file.language === 'markdown' ? 'preview' : 'code');
    }
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
                      'bg-green-900/20 text-green-400 border-green-500';
                    
                    return (
                      <button
                        key={file.path}
                        onClick={() => handleFileSelect(file.path)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          // Only show context menu for K or H files
                          if (file.classification === 'konfidentiell' || file.classification === 'hemlig') {
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
                          {classification === 'oklassificerad' ? 'O' :
                           classification === 'begransad-hemlig' ? 'BH' :
                           classification === 'konfidentiell' ? 'K' : 'H'}
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
              {/* Download button (only for O and B files) */}
              {activeFile && (activeFile.classification === 'oklassificerad' || activeFile.classification === 'begransad-hemlig') && (
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
                  className="px-2 md:px-3 py-1 text-xs md:text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded flex items-center gap-1 transition-colors"
                  title="Download file"
                >
                  <Download className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden md:inline">Download</span>
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
                  content={activeFileContent} 
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
                          alert('Inga Chronicle-loggar att exportera');
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
                        alert('Kunde inte exportera Chronicle-loggar');
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
          className="fixed bg-[#1f2937] border border-gray-700 rounded shadow-lg py-1 z-[10000]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1 text-xs text-gray-400 border-b border-gray-700">
            Declassify to:
          </div>
          {contextMenu.classification === 'hemlig' && (
            <button
              onClick={() => {
                // TODO: Trigger declassification to K
                console.log('Declassify H → K:', contextMenu.fileId);
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
            >
              <span className="text-orange-400">K</span> Konfidentiell
            </button>
          )}
          {(contextMenu.classification === 'hemlig' || contextMenu.classification === 'konfidentiell') && (
            <button
              onClick={() => {
                // TODO: Trigger declassification to B
                console.log('Declassify → B:', contextMenu.fileId);
                setContextMenu(null);
              }}
              className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
            >
              <span className="text-yellow-400">B</span> Begränsad
            </button>
          )}
          <button
            onClick={() => {
              // TODO: Trigger declassification to O
              console.log('Declassify → O:', contextMenu.fileId);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
          >
            <span className="text-green-400">O</span> Oklassificerad
          </button>
        </div>
      )}
    </div>
  );
}

export function RedForgeDemoPage() {
  return <RedForgeDemoContent />;
}
