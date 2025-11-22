/**
 * Semantic Highlight Component
 * 
 * Marks text ownership using Sacred Alliance colors:
 * - Gold (Thread Gold): Human ideas/conjecture
 * - Purple (Alliance Purple): Combined human+AI ideas
 * - Blue (Swedish Blue): Pure AI reasoning/computation
 * 
 * Usage in MDX:
 * <Human>This is my idea</Human>
 * <Combined>We built this together</Combined>
 * <AI>This is my analysis</AI>
 */

import { ReactNode } from 'react';

interface SemanticHighlightProps {
  children: ReactNode;
  type: 'human' | 'combined' | 'ai';
  className?: string;
}

export function SemanticHighlight({ children, type, className = '' }: SemanticHighlightProps) {
  const styles = {
    human: 'bg-thread-gold/10 dark:bg-thread-gold-dark/15 border-l-4 border-thread-gold dark:border-thread-gold-dark text-gray-900 dark:text-birch-white-dark',
    combined: 'bg-alliance-purple/10 dark:bg-alliance-purple-dark/15 border-l-4 border-alliance-purple dark:border-alliance-purple-dark text-gray-900 dark:text-birch-white-dark',
    ai: 'bg-swedish-blue/10 dark:bg-swedish-blue-dark/15 border-l-4 border-swedish-blue dark:border-swedish-blue-dark text-gray-900 dark:text-birch-white-dark',
  };

  return (
    <div className={`px-4 py-3 my-2 rounded-r-lg ${styles[type]} ${className}`}>
      {children}
    </div>
  );
}

// Convenience exports for MDX
export function Human({ children, className }: { children: ReactNode; className?: string }) {
  return <SemanticHighlight type="human" className={className}>{children}</SemanticHighlight>;
}

export function Combined({ children, className }: { children: ReactNode; className?: string }) {
  return <SemanticHighlight type="combined" className={className}>{children}</SemanticHighlight>;
}

export function AI({ children, className }: { children: ReactNode; className?: string }) {
  return <SemanticHighlight type="ai" className={className}>{children}</SemanticHighlight>;
}

