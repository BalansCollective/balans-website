import React, { useState } from 'react';
import { X, Save, Edit, AlertTriangle } from 'lucide-react';
import { DiffViewer } from './DiffViewer';
import type { Classification } from './DemoDataLoader';

interface FileModification {
  originalFile: {
    name: string;
    content: string;
    classification: Classification;
  };
  modifiedFile: {
    name: string;
    content: string;
    classification: Classification;
  };
  changes: Array<{
    line: number;
    oldContent: string;
    newContent: string;
    reason: string;
  }>;
  classificationImpact?: {
    original: Classification;
    proposed: Classification;
    reasoning: string;
  };
}

interface FileModificationModalProps {
  modification: FileModification;
  onApprove: (modifiedContent: string, newFilename: string, newClassification: Classification) => void;
  onCancel: () => void;
}

const CLASSIFICATION_COLORS = {
  oklassificerad: 'text-green-400 bg-green-900/20 border-green-700',
  'begransad-hemlig': 'text-yellow-400 bg-yellow-900/20 border-yellow-700',
  konfidentiell: 'text-orange-400 bg-orange-900/20 border-orange-700',
  hemlig: 'text-red-400 bg-red-900/20 border-red-700'
};

export function FileModificationModal({ modification, onApprove, onCancel }: FileModificationModalProps) {
  const [modifiedContent, setModifiedContent] = useState(modification.modifiedFile.content);
  const [newFilename, setNewFilename] = useState(modification.modifiedFile.name);
  const [newClassification, setNewClassification] = useState<Classification>(
    modification.classificationImpact?.proposed || modification.modifiedFile.classification
  );
  const [viewMode, setViewMode] = useState<'changes' | 'diff'>('diff'); // Default to diff view

  const handleApprove = () => {
    onApprove(modifiedContent, newFilename, newClassification);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center">
      <div className="bg-[#0d1117] border border-gray-700 rounded-lg w-[98vw] h-[98vh] flex flex-col m-2">
        {/* Compact Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 bg-[#161b22] flex-shrink-0">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">AI-Proposed Modifications</span>
            <span className="sm:hidden">AI Modifications</span>
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Compact File Info Row */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700 bg-gray-900/50 flex-shrink-0 overflow-x-auto">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              className="w-full bg-[#0d1117] border border-gray-700 rounded px-2 py-1 text-white text-xs sm:text-sm"
              placeholder="Filename"
            />
          </div>
          <select
            value={newClassification}
            onChange={(e) => setNewClassification(e.target.value as Classification)}
            className="bg-[#0d1117] border border-gray-700 rounded px-2 py-1 text-white text-xs whitespace-nowrap"
          >
            <option value="oklassificerad">U</option>
            <option value="begransad-hemlig">B</option>
            <option value="konfidentiell">K</option>
            <option value="hemlig">H</option>
          </select>
          {modification.classificationImpact && (
            <div 
              className="flex items-center gap-1 text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded border border-red-700/50 whitespace-nowrap" 
              title={modification.classificationImpact.reasoning}
            >
              <AlertTriangle className="w-3 h-3 hidden sm:inline" />
              <span>{modification.classificationImpact.original.charAt(0).toUpperCase()} → {modification.classificationImpact.proposed.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Compact Tabs */}
        <div className="flex border-b border-gray-700 flex-shrink-0">
          <button
            onClick={() => setViewMode('diff')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === 'diff'
                ? 'text-white border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Diff
          </button>
          <button
            onClick={() => setViewMode('changes')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === 'changes'
                ? 'text-white border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="hidden sm:inline">Summary ({modification.changes.length})</span>
            <span className="sm:hidden">({modification.changes.length})</span>
          </button>
        </div>

        {/* MAXIMIZED Content Area - FULL HEIGHT */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {viewMode === 'changes' ? (
            <div className="h-full overflow-auto p-3 space-y-2">
              {modification.changes.map((change, idx) => (
                <div key={idx} className="bg-[#161b22] border border-gray-700 rounded p-2">
                  <div className="text-xs text-gray-500 mb-1">Line {change.line}</div>
                  <div className="space-y-1">
                    <div className="flex items-start gap-1">
                      <span className="text-red-400 text-xs font-mono">-</span>
                      <code className="text-xs text-red-400 bg-red-900/20 px-1 py-0.5 rounded flex-1 font-mono break-all">
                        {change.oldContent}
                      </code>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-green-400 text-xs font-mono">+</span>
                      <code className="text-xs text-green-400 bg-green-900/20 px-1 py-0.5 rounded flex-1 font-mono break-all">
                        {change.newContent}
                      </code>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 italic">
                    {change.reason}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DiffViewer
              original={modification.originalFile.content}
              modified={modifiedContent}
              language="markdown"
              onModifiedChange={setModifiedContent}
            />
          )}
        </div>

        {/* Compact Footer */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-700 bg-[#161b22] flex-shrink-0">
          <span className="text-xs text-gray-500 hidden sm:inline">Original preserved</span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={onCancel}
              className="px-3 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-1 transition-colors"
            >
              <Save className="w-3 h-3" />
              <span className="hidden sm:inline">Approve</span>
              <span className="sm:hidden">OK</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

