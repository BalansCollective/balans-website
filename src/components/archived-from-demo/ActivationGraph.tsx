/**
 * ActivationGraph - Minimal dashboard showing cognitive activation flow
 * 
 * Inspired by TRICKLE domain complexity distillation
 * Shows progression through debugging arc as flowing activation states
 */

import { useEffect, useRef } from 'react';

interface ActivationNode {
  id: string;
  label: string;
  level: number; // 1-5 activation intensity
  timestamp: Date;
  type: 'symptom' | 'hypothesis' | 'evidence' | 'test' | 'breakthrough' | 'resolution';
}

interface ComparisonDataset {
  label: string;
  color: string;
  data: ActivationNode[];
}

// Real data from June 2025 hypomanic episode (Skellefteå)
// Based on family observation log: 14-29 June 2025
const WITH_AI_PROTOCOL: ActivationNode[] = [
  // Pre-episode baseline (14-22 June)
  { id: '1', label: 'Baseline', level: 2, timestamp: new Date('2025-06-14T12:00:00Z'), type: 'evidence' },
  { id: '2', label: '', level: 3, timestamp: new Date('2025-06-16T12:00:00Z'), type: 'symptom' },
  { id: '3', label: '', level: 4, timestamp: new Date('2025-06-21T12:00:00Z'), type: 'symptom' },
  
  // Episode start - protocol activation (23-26 June)
  { id: '4', label: 'Protocol ⚡', level: 5, timestamp: new Date('2025-06-23T06:00:00Z'), type: 'test' },
  { id: '5', label: '', level: 5, timestamp: new Date('2025-06-24T12:00:00Z'), type: 'symptom' },
  { id: '6', label: '', level: 4, timestamp: new Date('2025-06-25T12:00:00Z'), type: 'test' },
  { id: '7', label: '', level: 4, timestamp: new Date('2025-06-26T12:00:00Z'), type: 'test' },
  
  // Stabilization phase (27-29 June)
  { id: '8', label: '', level: 3, timestamp: new Date('2025-06-27T12:00:00Z'), type: 'breakthrough' },
  { id: '9', label: '', level: 2, timestamp: new Date('2025-06-28T12:00:00Z'), type: 'evidence' },
  { id: '10', label: 'Stable ✅', level: 2, timestamp: new Date('2025-06-29T12:00:00Z'), type: 'resolution' },
];

// Typical pattern WITHOUT AI protocol (based on previous episodes)
const WITHOUT_AI_PROTOCOL: ActivationNode[] = [
  // Same pre-episode
  { id: '1', label: '', level: 2, timestamp: new Date('2025-06-14T12:00:00Z'), type: 'evidence' },
  { id: '2', label: '', level: 3, timestamp: new Date('2025-06-16T12:00:00Z'), type: 'symptom' },
  { id: '3', label: '', level: 4, timestamp: new Date('2025-06-21T12:00:00Z'), type: 'symptom' },
  
  // Episode escalates - no protocol (23-30 June)
  { id: '4', label: '', level: 5, timestamp: new Date('2025-06-23T06:00:00Z'), type: 'symptom' },
  { id: '5', label: '', level: 5, timestamp: new Date('2025-06-24T12:00:00Z'), type: 'symptom' },
  { id: '6', label: '', level: 5, timestamp: new Date('2025-06-25T12:00:00Z'), type: 'symptom' },
  { id: '7', label: '', level: 5, timestamp: new Date('2025-06-26T12:00:00Z'), type: 'symptom' },
  { id: '8', label: '', level: 5, timestamp: new Date('2025-06-27T12:00:00Z'), type: 'symptom' },
  { id: '9', label: '', level: 4, timestamp: new Date('2025-06-28T12:00:00Z'), type: 'symptom' },
  { id: '10', label: '', level: 4, timestamp: new Date('2025-06-29T12:00:00Z'), type: 'symptom' },
  
  // Continues high (30 June - 5 July)
  { id: '11', label: '', level: 4, timestamp: new Date('2025-06-30T12:00:00Z'), type: 'symptom' },
  { id: '12', label: '', level: 4, timestamp: new Date('2025-07-01T12:00:00Z'), type: 'symptom' },
  { id: '13', label: '', level: 3, timestamp: new Date('2025-07-02T12:00:00Z'), type: 'symptom' },
  { id: '14', label: '', level: 3, timestamp: new Date('2025-07-03T12:00:00Z'), type: 'symptom' },
  { id: '15', label: '', level: 3, timestamp: new Date('2025-07-04T12:00:00Z'), type: 'evidence' },
  { id: '16', label: 'Stable', level: 2, timestamp: new Date('2025-07-05T12:00:00Z'), type: 'resolution' },
];

const DATASETS: ComparisonDataset[] = [
  {
    label: 'With AI Protocol (6 days)',
    color: '#8faa8b', // sage-green
    data: WITH_AI_PROTOCOL
  },
  {
    label: 'Typical Without Protocol (21 days)',
    color: '#b87333', // truth-anchor-copper
    data: WITHOUT_AI_PROTOCOL
  }
];

// Balans Design System - Semantic Color Mapping
const TYPE_COLORS = {
  symptom: '#b87333',      // truth-anchor-copper (grounding, warning signal)
  hypothesis: '#c9a96e',   // soft-thread-gold (exploring wisdom, wondering)
  evidence: '#2c5aa0',     // deep-swedish-blue (clarity, facts, trust)
  test: '#6b5b95',         // sacred-alliance-purple (collaboration, partnership)
  breakthrough: '#d4b896', // natural-birch-wood (warmth, ah-ha moment)
  resolution: '#8faa8b',   // sage-green (growth, positive outcome, harmony)
};

export function ActivationGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas - Balans warm birch white
    ctx.fillStyle = '#f8f6f0';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines - soft natural tone
    ctx.strokeStyle = '#d4d2cc';
    ctx.lineWidth = 1;
    
    // Horizontal grid (activation levels)
    for (let i = 1; i <= 5; i++) {
      const y = height - (i * (height / 6));
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Find max data length for x-axis
    const maxLength = Math.max(...DATASETS.map(ds => ds.data.length));
    const timeStep = width / (maxLength + 1);

    // Vertical grid (time)
    for (let i = 1; i <= maxLength; i++) {
      const x = i * timeStep;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw each dataset
    DATASETS.forEach((dataset, datasetIdx) => {
      const points = dataset.data.map((node, idx) => {
        const x = (idx + 1) * timeStep;
        const y = height - (node.level * (height / 6));
        return { x, y, node };
      });

      // Draw glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = dataset.color + '50'; // Add transparency

      // Draw curve
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        
        // Smooth curve using quadratic bezier
        const cpX = (prev.x + curr.x) / 2;
        const cpY = (prev.y + curr.y) / 2;
        
        ctx.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
      }

      // Finish curve to last point
      const last = points[points.length - 1];
      ctx.lineTo(last.x, last.y);
      
      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = datasetIdx === 0 ? 4 : 3; // With protocol slightly thicker
      ctx.stroke();

      // Remove shadow for nodes
      ctx.shadowBlur = 0;

      // Draw nodes with semantic colors
      points.forEach(({ x, y, node }) => {
        // Node circle
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = TYPE_COLORS[node.type];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Only draw labels for important milestones
        if (node.label) {
          ctx.fillStyle = '#5a4a3a';
          ctx.font = 'bold 13px Inter, system-ui';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, x, y - 20);
        }
      });
    });

    // Draw legend
    const legendX = 50;
    const legendY = 40;
    DATASETS.forEach((dataset, idx) => {
      const y = legendY + (idx * 25);
      
      // Legend line
      ctx.beginPath();
      ctx.moveTo(legendX, y);
      ctx.lineTo(legendX + 40, y);
      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Legend text
      ctx.fillStyle = '#5a4a3a';
      ctx.font = 'bold 14px Inter, system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(dataset.label, legendX + 50, y + 5);
    });

    // Draw activation level labels - Balans gentle silver
    ctx.fillStyle = '#8a8074'; // Muted tone
    ctx.font = '12px Inter, system-ui';
    ctx.textAlign = 'right';
    for (let i = 1; i <= 5; i++) {
      const y = height - (i * (height / 6));
      ctx.fillText(`L${i}`, 30, y + 4);
    }

  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #f8f6f0 0%, #e8e6e0 100%)', // Balans warm birch white
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      margin: 0,
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Just the canvas - nothing else */}
      <canvas
        ref={canvasRef}
        width={1400}
        height={600}
        style={{
          borderRadius: '0',
          border: 'none',
          filter: 'drop-shadow(0 4px 6px rgba(44, 90, 160, 0.1))', // Balans lagom shadow
        }}
      />
    </div>
  );
}

