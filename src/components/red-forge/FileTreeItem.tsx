import React, { useState } from 'react';
import { ClassifiedFile } from '../../lib/red-forge/types';
import { ChevronRight, ChevronDown, Folder, File } from 'lucide-react';
import { FileTreeFolder } from './DemoData';

interface FileTreeItemProps {
  folder: FileTreeFolder;
  level: number;
  activeFileId: string;
  onFileSelect: (fileId: string) => void;
  visibleFiles: ClassifiedFile[];
}

export function FileTreeItem({ folder, level, activeFileId, onFileSelect, visibleFiles }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0 || folder.name === 'birdturret'); // Root and birdturret expanded by default
  
  const indent = level * 12; // 12px per level
  
  // Get classification color for file
  const getClassificationColor = (file: ClassifiedFile) => {
    if (!file.dualClassification) {
      const level = file.classification || 'UNCLASSIFIED';
      return level === 'TOP_SECRET' ? 'red' :
             level === 'SECRET' ? 'red' :
             level === 'CONFIDENTIAL' ? 'yellow' : 'blue';
    }
    
    const highestLevel = 
      file.dualClassification.how === 'SECRET' || file.dualClassification.what === 'SECRET' ? 'red' :
      file.dualClassification.how === 'CONFIDENTIAL' || file.dualClassification.what === 'CONFIDENTIAL' ? 'yellow' :
      'green';
    
    return highestLevel;
  };
  
  const colorClasses = {
    green: 'border-l-2 border-green-500 pl-2',
    orange: 'border-l-2 border-orange-500 pl-2', // Ember for RED FORGE
    red: 'border-l-2 border-red-500 pl-2',
    blue: 'border-l-2 border-blue-500 pl-2'
  };
  
  const badgeClasses = {
    green: 'bg-green-500/20 text-green-300',
    orange: 'bg-orange-500/20 text-orange-300', // Ember for RED FORGE
    red: 'bg-red-500/20 text-red-300',
    blue: 'bg-blue-500/20 text-blue-300'
  };
  
  return (
    <>
      {/* Folder header (skip for root) */}
      {level > 0 && (
        <div
          style={{ paddingLeft: `${indent}px` }}
          className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-400 hover:bg-gray-800/50 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          )}
          <Folder className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{folder.name}</span>
        </div>
      )}
      
      {/* Folder contents (when expanded) */}
      {isExpanded && (
        <>
          {/* Files in this folder */}
          {folder.files.map((file) => {
            // Find visible version of file (might be redacted)
            const visibleFile = visibleFiles.find(vf => vf.id === file.id) || file;
            const isActive = visibleFile.id === activeFileId;
            const color = getClassificationColor(visibleFile);
            const classification = visibleFile.dualClassification 
              ? `${visibleFile.dualClassification.what.charAt(0)}/${visibleFile.dualClassification.how.charAt(0)}`
              : visibleFile.classification?.charAt(0) || 'U';
            
            return (
              <button
                key={visibleFile.id}
                onClick={() => onFileSelect(visibleFile.id)}
                style={{ paddingLeft: `${indent + 24}px` }}
                className={`w-full text-left px-2 py-1 text-sm flex items-center justify-between group transition-colors ${
                  isActive
                    ? `bg-gray-800 text-white ${colorClasses[color]}`
                    : `text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 ${isActive ? '' : 'border-l-2 border-transparent pl-2'}`
                }`}
              >
                <span className="flex items-center space-x-2 truncate flex-1">
                  <File className="w-3 h-3 flex-shrink-0" />
                  <span className="text-xs truncate">{visibleFile.name}</span>
                </span>
                <span className={`text-xs px-1.5 py-0.5 rounded ml-2 flex-shrink-0 ${badgeClasses[color]}`}>
                  {classification}
                </span>
              </button>
            );
          })}
          
          {/* Subfolders */}
          {folder.subfolders?.map((subfolder) => (
            <FileTreeItem
              key={subfolder.path}
              folder={subfolder}
              level={level + 1}
              activeFileId={activeFileId}
              onFileSelect={onFileSelect}
              visibleFiles={visibleFiles}
            />
          ))}
        </>
      )}
    </>
  );
}

