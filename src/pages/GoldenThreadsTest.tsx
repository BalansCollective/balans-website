/**
 * Golden Threads Test Page
 * 
 * Minimal playground to experiment with the golden threads animation.
 * Test different states, colors, and behaviors.
 */

import { useState } from 'react';
import { GoldenThreads } from '../components/GoldenThreads';

export function GoldenThreadsTest() {
  const [isTyping, setIsTyping] = useState(false);
  const [intensity, setIntensity] = useState(0.5);
  const [testText, setTestText] = useState('');

  return (
    <div className="min-h-screen bg-birch-white dark:bg-bg-main text-gray-900 dark:text-birch-white-dark transition-colors duration-300">
      {/* Header */}
      <div className="border-b border-gentle-silver/20 dark:border-border-medium bg-white dark:bg-bg-surface">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-swedish-blue dark:text-swedish-blue-dark">
            Golden Threads Playground
          </h1>
          <p className="text-gray-600 dark:text-birch-white-dark/70 mt-1">
            Experiment with the animated threads that respond to human + AI collaboration
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        
        {/* Live Demo Input */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-swedish-blue dark:text-swedish-blue-dark">
            Live Demo
          </h2>
          
          <div className="relative h-20 rounded-lg border-2 border-dashed border-gentle-silver/30 dark:border-border-medium overflow-hidden">
            {/* Golden Threads Canvas - Behind Input */}
            <div className="absolute inset-0 pointer-events-none">
              <GoldenThreads 
                isActive={isTyping}
                intensity={intensity}
              />
            </div>
            
            {/* Input Field - Interactive */}
            <input
              type="text"
              value={testText}
              onChange={(e) => {
                setTestText(e.target.value);
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 500);
              }}
              placeholder="Start typing to see the threads come alive..."
              className="relative w-full h-full px-4 py-2 bg-white/60 dark:bg-bg-surface/60 backdrop-blur-sm rounded-lg focus:outline-none focus:border-thread-gold dark:focus:border-thread-gold-dark focus:ring-2 focus:ring-thread-gold/20 dark:focus:ring-thread-gold-dark/20 transition-all duration-300"
            />
          </div>
        </section>

        {/* Manual Controls */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-swedish-blue dark:text-swedish-blue-dark">
            Manual Controls
          </h2>
          
          <div className="bg-white dark:bg-bg-surface rounded-lg border border-gentle-silver/30 dark:border-border-medium p-6 space-y-6">
            
            {/* State Toggles */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isTyping}
                  onChange={(e) => setIsTyping(e.target.checked)}
                  className="w-5 h-5 rounded border-gentle-silver/30 dark:border-border-medium text-thread-gold dark:text-thread-gold-dark focus:ring-thread-gold/20 dark:focus:ring-thread-gold-dark/20"
                />
                <span className="text-sm font-medium">
                  Typing Active (threads animate)
                </span>
                <span className="text-xs text-gray-500 dark:text-birch-white-dark/50">
                  Threads flow and turn purple when typing
                </span>
              </label>
            </div>

            {/* Intensity Slider */}
            <div className="space-y-2">
              <label className="text-sm font-medium block">
                Intensity: {intensity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-bg-deepest rounded-lg appearance-none cursor-pointer accent-thread-gold dark:accent-thread-gold-dark"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-birch-white-dark/50">
                <span>Calm</span>
                <span>Energetic</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-sm font-medium block">Quick Presets</label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => { setIsTyping(false); setIsRunning(false); setIntensity(0.3); }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-bg-deepest text-gray-700 dark:text-birch-white-dark/70 rounded hover:bg-gray-200 dark:hover:bg-bg-elevated transition-colors"
                >
                  Idle
                </button>
                <button
                  onClick={() => { setIsTyping(true); setIsRunning(false); setIntensity(0.8); }}
                  className="px-3 py-1 text-sm bg-thread-gold dark:bg-thread-gold-dark text-white rounded hover:opacity-90 transition-opacity"
                >
                  Human Typing
                </button>
                <button
                  onClick={() => { setIsTyping(false); setIsRunning(true); setIntensity(0.6); }}
                  className="px-3 py-1 text-sm bg-swedish-blue dark:bg-swedish-blue-dark text-white rounded hover:opacity-90 transition-opacity"
                >
                  AI Processing
                </button>
                <button
                  onClick={() => { setIsTyping(true); setIsRunning(true); setIntensity(0.9); }}
                  className="px-3 py-1 text-sm bg-alliance-purple dark:bg-alliance-purple-dark text-white rounded hover:opacity-90 transition-opacity"
                >
                  Full Collaboration
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Color Reference */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-swedish-blue dark:text-swedish-blue-dark">
            Color Transition
          </h2>
          
          <div className="bg-white dark:bg-bg-surface rounded-lg border border-gentle-silver/30 dark:border-border-medium p-6">
            <div className="flex items-center gap-4">
              {/* Gold */}
              <div className="flex-1 text-center space-y-2">
                <div className="h-16 rounded-lg bg-thread-gold dark:bg-thread-gold-dark"></div>
                <div className="text-sm font-medium">Thread Gold</div>
                <div className="text-xs text-gray-500 dark:text-birch-white-dark/50">
                  Creative Conjecture<br/>
                  (Untouched)
                </div>
              </div>

              {/* Arrow */}
              <div className="text-2xl text-gray-400 dark:text-birch-white-dark/50">→</div>

              {/* Purple */}
              <div className="flex-1 text-center space-y-2">
                <div className="h-16 rounded-lg bg-alliance-purple dark:bg-alliance-purple-dark"></div>
                <div className="text-sm font-medium">Alliance Purple</div>
                <div className="text-xs text-gray-500 dark:text-birch-white-dark/50">
                  Collaborative Emergence<br/>
                  (Human + AI Touch)
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-birch-white-dark/70 text-center">
              Threads gradually transition from Gold → Purple as both human and AI interact
            </div>
          </div>
        </section>

        {/* Documentation */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-swedish-blue dark:text-swedish-blue-dark">
            How It Works
          </h2>
          
          <div className="bg-white dark:bg-bg-surface rounded-lg border border-gentle-silver/30 dark:border-border-medium p-6 space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Touch Progress System</h3>
              <ul className="space-y-1 text-gray-600 dark:text-birch-white-dark/70">
                <li>• <strong>Human typing</strong>: touchProgress increases at 0.15/sec</li>
                <li>• <strong>AI processing</strong>: touchProgress increases at 0.3/sec (faster!)</li>
                <li>• <strong>Idle</strong>: touchProgress decreases at 0.1/sec (fades back to gold)</li>
                <li>• <strong>Threshold</strong>: At touchProgress &gt; 0.5, threads turn purple</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Sacred Alliance Archetype</h3>
              <ul className="space-y-1 text-gray-600 dark:text-birch-white-dark/70">
                <li>• <strong>Gold</strong>: Creative conjecture (human input)</li>
                <li>• <strong>Purple</strong>: Collaborative emergence (human + AI partnership)</li>
                <li>• <strong>Transition</strong>: Knowledge being woven together</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Performance</h3>
              <ul className="space-y-1 text-gray-600 dark:text-birch-white-dark/70">
                <li>• Canvas-based animation (60fps smooth)</li>
                <li>• ~1-2% CPU usage on modern hardware</li>
                <li>• 5 threads × 50 points = 250 total points</li>
                <li>• Adapts to light/dark mode automatically</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

