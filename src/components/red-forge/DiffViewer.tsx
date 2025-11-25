import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

interface DiffViewerProps {
  original: string;
  modified: string;
  language?: string;
  onModifiedChange?: (content: string) => void;
}

export function DiffViewer({ 
  original, 
  modified, 
  language = 'markdown',
  onModifiedChange 
}: DiffViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create diff editor
    const diffEditor = monaco.editor.createDiffEditor(containerRef.current, {
      theme: 'vs-dark',
      readOnly: false,
      renderSideBySide: true,
      enableSplitViewResizing: true,
      originalEditable: false,
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 13,
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      wordWrap: 'on'
    });

    editorRef.current = diffEditor;

    // Set models
    const originalModel = monaco.editor.createModel(original, language);
    const modifiedModel = monaco.editor.createModel(modified, language);

    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel
    });

    // Listen to changes in modified editor
    if (onModifiedChange) {
      modifiedModel.onDidChangeContent(() => {
        onModifiedChange(modifiedModel.getValue());
      });
    }

    // Cleanup
    return () => {
      diffEditor.dispose();
      originalModel.dispose();
      modifiedModel.dispose();
    };
  }, [original, modified, language, onModifiedChange]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}

