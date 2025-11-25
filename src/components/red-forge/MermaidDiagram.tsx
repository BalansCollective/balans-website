import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Copy, Maximize2, X, Check, ZoomIn, ZoomOut, Minimize2 } from 'lucide-react';

interface MermaidDiagramProps {
  chart: string;
  id: string;
}

// Initialize Mermaid once globally
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#ef4444',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#dc2626',
    lineColor: '#6b7280',
    secondaryColor: '#1f2937',
    tertiaryColor: '#374151',
    background: '#0d1117',
    mainBkg: '#161b22',
    textColor: '#e6edf3',
    fontSize: '14px'
  }
});

export function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(100); // Zoom percentage

  const handleCopy = () => {
    // Copy as Markdown code block
    const markdown = `\`\`\`mermaid\n${chart}\n\`\`\``;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
    setZoom(300); // Start at 300% for better visibility
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  // ESC key to close fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        console.log('🎨 Rendering Mermaid:', id);
        console.log('📊 Chart preview:', chart.substring(0, 100));
        
        // Validate chart is not empty
        if (!chart || chart.trim().length === 0) {
          throw new Error('Empty chart');
        }
        
        // Force unique ID by appending random string
        const uniqueId = `${id}-${Math.random().toString(36).substring(7)}`;
        const result = await mermaid.render(uniqueId, chart);
        console.log('✅ Mermaid success:', uniqueId);
        
        // Keep SVG as-is (Mermaid handles sizing)
        setSvg(result.svg);
      } catch (err) {
        console.error('❌ Mermaid error:', id, err);
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        
        // Show the raw chart for debugging
        console.log('📝 Failed chart content:', chart);
      }
    };

    renderDiagram();
  }, [chart, id]);

  if (error) {
    return (
      <div className="bg-[#161b22] border border-red-700 rounded p-4 my-4">
        <div className="text-red-400 text-sm mb-2">
          ❌ Mermaid rendering error: {error}
        </div>
        <details className="text-xs text-gray-500">
          <summary className="cursor-pointer">Show chart code</summary>
          <pre className="mt-2 whitespace-pre-wrap overflow-x-auto">{chart}</pre>
        </details>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="bg-[#161b22] border border-gray-700 rounded p-4 my-4 flex items-center justify-center">
        <div className="text-gray-500 text-sm">
          ⏳ Rendering diagram...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative group bg-[#161b22] border border-gray-700 rounded p-4 my-4 overflow-x-auto">
        {/* Action buttons - appear on hover */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={handleCopy}
            className="p-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            title="Copy Mermaid code"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleFullscreen}
            className="p-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            title="View fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
        
        {/* SVG Content with CSS sizing */}
        <div 
          ref={elementRef} 
          className="flex items-center justify-center mermaid-container"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        
        <style jsx>{`
          .mermaid-container svg {
            max-width: 100%;
            height: auto;
          }
        `}</style>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/95 z-[9999] flex flex-col"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Top toolbar */}
          <div className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                className="p-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-white transition-colors"
                title="Zoom ut (25%)"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleResetZoom(); }}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-white transition-colors text-sm font-mono"
                title="Återställ zoom (100%)"
              >
                {zoom}%
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                className="p-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-white transition-colors"
                title="Zoom in (25%)"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-white transition-colors"
              title="Stäng fullskärm (ESC)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Diagram container */}
          <div 
            className="flex-1 flex items-center justify-center p-8 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="transition-transform duration-200"
              style={{ transform: `scale(${zoom / 100})` }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      )}
    </>
  );
}

