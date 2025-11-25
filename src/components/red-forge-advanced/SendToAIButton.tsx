/**
 * SendToAIButton - Smoldering backside button for sending files to AI
 * 
 * Pattern: Cold steel front, hot red glow behind when hovering
 * Inspired by DefensePage WHAT/HOW cards
 */

import React, { useState } from 'react';
import { ClassifiedFile, AIService } from '../../lib/red-forge/types';
import { getAIServiceConfig, canAIAccessClassification } from '../../lib/red-forge/ai-service-config';
import { SMOLDERING_EFFECTS } from '../../lib/red-forge/design-tokens';

interface SendToAIButtonProps {
  file: ClassifiedFile;
  selectedAIService: AIService;
  onSendToAI: (file: ClassifiedFile, skipAIReview: boolean) => void;
}

export function SendToAIButton({ file, selectedAIService, onSendToAI }: SendToAIButtonProps) {
  const [skipAIReview, setSkipAIReview] = useState(false);
  const aiConfig = getAIServiceConfig(selectedAIService);
  const fileLevel = file.classification || file.dualClassification?.what || 'UNCLASSIFIED';
  
  const canAccess = canAIAccessClassification(selectedAIService, fileLevel);
  
  // Get smoldering effect based on classification
  const getSmolderEffect = (level: string) => {
    if (level === 'UNCLASSIFIED') return null;
    if (level === 'CONFIDENTIAL') return SMOLDERING_EFFECTS['orange-ember'];
    return SMOLDERING_EFFECTS['red-smolder'];
  };
  
  const smolder = getSmolderEffect(fileLevel);
  
  if (!canAccess) {
    return (
      <button
        disabled
        className="px-3 py-1 text-xs rounded bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
        title={`${fileLevel} content requires ${aiConfig?.displayName || 'higher clearance AI'}`}
      >
        🔒 Blocked
      </button>
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      {/* AI Review Toggle - Clear visible text */}
      <button
        onClick={() => setSkipAIReview(!skipAIReview)}
        className={`px-2 py-1 text-[11px] rounded border transition-colors flex items-center space-x-1 ${
          skipAIReview 
            ? 'bg-orange-500/20 border-orange-500/50 text-orange-300' // Ember warning
            : 'bg-gray-800 border-gray-600 text-gray-400'
        }`}
      >
        <span>{skipAIReview ? '⚠️' : '🤖'}</span>
        <span className="font-medium">{skipAIReview ? 'Basic Check' : 'AI Review'}</span>
      </button>
      
      {/* Send Button */}
      <div className="relative group">
        {/* Smoldering backside glow (dual-layer from Red Forge Design Lumen) */}
        {smolder && (
          <>
            {/* Layer 1: Gradient blur */}
            <div className={`absolute inset-0 rounded ${smolder.layer1Classes} ${smolder.timing} ${smolder.scale} ${smolder.opacity}`}></div>
            
            {/* Layer 2: Radial glow */}
            <div 
              className={`absolute inset-0 rounded blur-2xl ${smolder.timing} ${smolder.opacity}`}
              style={{ background: smolder.layer2Style }}
            ></div>
          </>
        )}
        
        {/* Cold steel front */}
        <button
          onClick={() => onSendToAI(file, skipAIReview)}
          className="relative z-10 px-3 py-1 text-xs rounded bg-gray-900 text-gray-300 border border-gray-700 transition-all duration-300 group-hover:border-red-500 group-hover:-translate-y-1 group-hover:shadow-[0_4px_20px_rgba(220,20,60,0.4)] group-hover:text-white"
          title={`Send to ${aiConfig?.displayName} (${fileLevel})`}
        >
          <span className="flex items-center space-x-1">
            <span>→ AI</span>
            <span className="text-[10px] opacity-60">{fileLevel.charAt(0)}</span>
          </span>
        </button>
      </div>
    </div>
  );
}

