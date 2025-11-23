import React, { useState } from 'react';
import { ClassifiedFile } from '../lib/red-forge/types';
import { DEMO_FILES } from '../components/red-forge/DemoData';
import { CLASSIFICATION_COLORS, NETWORK_ZONE_COLORS } from '../lib/red-forge/design-tokens';

type ViewMode = 'code' | 'preview' | 'split';

export function RedForgeIDEPage() {
  const [files] = useState<ClassifiedFile[]>(DEMO_FILES);
  const [activeFileId, setActiveFileId] = useState<string>(DEMO_FILES[0].id);
  const [networkZone] = useState<'white' | 'yellow' | 'red'>('yellow'); // Default to Yellow Network
  
  // Default to preview for markdown, code for other files
  const activeFile = files.find((f) => f.id === activeFileId);
  const defaultViewMode: ViewMode = activeFile?.language === 'markdown' ? 'preview' : 'code';
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);

  // Update view mode when switching files
  const handleFileSelect = (fileId: string) => {
    setActiveFileId(fileId);
    const newFile = files.find((f) => f.id === fileId);
    if (newFile?.language === 'markdown') {
      setViewMode('preview');
    } else {
      setViewMode('code');
    }
  };

  const isMarkdown = activeFile?.language === 'markdown';

  const getClassificationStyle = (level: string) => {
    const styles = {
      UNCLASSIFIED: {
        bg: 'bg-blue-500/30',
        border: 'border-blue-400',
        borderColor: '#60a5fa',
        text: 'text-blue-300',
      },
      CONFIDENTIAL: {
        bg: 'bg-yellow-500/30',
        border: 'border-yellow-400',
        borderColor: '#facc15',
        text: 'text-yellow-300',
      },
      SECRET: {
        bg: 'bg-red-500/30',
        border: 'border-red-400',
        borderColor: '#f87171',
        text: 'text-red-300',
      },
      TOP_SECRET: {
        bg: 'bg-red-900/40',
        border: 'border-red-600',
        borderColor: '#dc2626',
        text: 'text-red-400',
      },
    };
    return (
      styles[level as keyof typeof styles] || {
        bg: 'bg-gray-700',
        border: 'border-gray-600',
        borderColor: '#6b7280',
        text: 'text-gray-400',
      }
    );
  };

  return (
    <div className="h-screen bg-[#0a0e14] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-12 bg-[#0d1117] border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-red-400">🔥 Red Forge IDE</h1>
          <span className="text-sm text-gray-500">Classification-Aware Development</span>
        </div>
        
        {/* Network Zone Indicator */}
        <div className="flex items-center space-x-2">
          <span className={`text-2xl ${NETWORK_ZONE_COLORS[networkZone].color}`}>
            {NETWORK_ZONE_COLORS[networkZone].icon}
          </span>
          <span className={`text-sm font-medium ${NETWORK_ZONE_COLORS[networkZone].color}`}>
            {NETWORK_ZONE_COLORS[networkZone].label}
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - File Tree */}
        <div className="w-64 bg-[#0d1117] border-r border-gray-800 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Files
            </h2>
            <div className="space-y-1">
              {files.map((file) => {
                const isActive = file.id === activeFileId;
                const classification = file.dualClassification 
                  ? `${file.dualClassification.what.charAt(0)}/${file.dualClassification.how.charAt(0)}`
                  : file.classification?.charAt(0) || 'U';
                
                return (
                  <button
                    key={file.id}
                    onClick={() => handleFileSelect(file.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between group transition-colors ${
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{file.name}</span>
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      file.dualClassification
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {classification}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* File Tabs */}
          <div className="h-10 bg-[#0d1117] border-b border-gray-800 flex items-center px-2 space-x-1">
            {activeFile && (
              <div className="px-3 py-1.5 bg-[#0a0e14] border border-gray-700 rounded-t text-sm text-gray-200 flex items-center space-x-2">
                <span>{activeFile.name}</span>
                {activeFile.dualClassification && (
                  <span className="text-xs text-yellow-400">
                    W:{activeFile.dualClassification.what.charAt(0)} / H:{activeFile.dualClassification.how.charAt(0)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* View Mode Tabs (for markdown files) */}
          {isMarkdown && (
            <div className="h-10 bg-[#0d1117] border-b border-gray-800 flex items-center px-4 space-x-2">
              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === 'code'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                📝 Code
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === 'split'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                ⚡ Split
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === 'preview'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                📄 Preview
              </button>
            </div>
          )}

          {/* Editor/Preview Area */}
          <div className="flex-1 flex min-h-0">
            {viewMode !== 'preview' && (
              <div className={`flex-1 ${viewMode === 'split' ? 'border-r border-gray-700' : ''} min-h-0`}>
                <div className="h-full overflow-auto bg-[#0a0e14] p-4">
                  <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                    {activeFile?.content || ''}
                  </pre>
                </div>
              </div>
            )}
            
            {viewMode !== 'code' && activeFile?.language === 'markdown' && (
              <div className="flex-1 min-h-0">
                <div className="h-full overflow-auto bg-[#0a0e14] p-6">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-400 text-sm italic">
                      MDX Renderer will go here (with classification line visualization)
                    </p>
                    <pre className="text-sm text-gray-400 whitespace-pre-wrap mt-4">
                      {activeFile.content}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="h-8 bg-[#0d1117] border-t border-gray-800 flex items-center justify-between px-4 text-xs">
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">
                {activeFile?.language.toUpperCase() || 'TEXT'}
              </span>
              {activeFile?.dualClassification && (
                <span className="text-yellow-400">
                  WHAT: {activeFile.dualClassification.what} / HOW: {activeFile.dualClassification.how}
                </span>
              )}
              {activeFile?.classification && (
                <span className="text-blue-400">
                  {activeFile.classification}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">
                Red Forge v0.1.0 | Browser Demo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RedForgeIDEPage;

