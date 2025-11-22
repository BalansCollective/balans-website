import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  className?: string;
}

export function Mermaid({ chart, className }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize mermaid with dark mode support
    mermaid.initialize({
      startOnLoad: true,
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
      securityLevel: 'loose',
    });

    if (containerRef.current) {
      // Generate unique ID for this diagram
      const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
      
      // Render the diagram
      mermaid.render(id, chart).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      }).catch((error) => {
        console.error('Mermaid rendering error:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre class="text-red-500">${error.message}</pre>`;
        }
      });
    }
  }, [chart]);

  return (
    <div 
      ref={containerRef} 
      className={`mermaid-container ${className || ''}`}
    />
  );
}

