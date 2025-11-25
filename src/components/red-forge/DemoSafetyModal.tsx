import React, { useState, useEffect } from 'react';

interface DemoSafetyModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export function DemoSafetyModal({ isOpen, onAccept }: DemoSafetyModalProps) {
  const [understood, setUnderstood] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-red-500 rounded-lg shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-b border-red-500 px-6 py-4">
          <h2 className="text-2xl font-bold text-red-400 flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            RED FORGE DEMO - READ BEFORE USING
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          <p className="text-lg text-gray-200 font-medium">
            This is a <span className="text-red-400 font-bold">DEMONSTRATION</span> using fictional BirdTurret data.
          </p>

          <div className="bg-red-950/30 border border-red-800 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3 text-red-300">
              <span className="text-xl flex-shrink-0">❌</span>
              <span><span className="font-semibold">DO NOT</span> paste real classified information</span>
            </div>
            <div className="flex items-start gap-3 text-red-300">
              <span className="text-xl flex-shrink-0">❌</span>
              <span><span className="font-semibold">DO NOT</span> use with actual defense projects</span>
            </div>
            <div className="flex items-start gap-3 text-red-300">
              <span className="text-xl flex-shrink-0">❌</span>
              <span><span className="font-semibold">DO NOT</span> assume demo security = production security</span>
            </div>
          </div>

          <div className="bg-orange-950/30 border border-orange-800 rounded-lg p-4">
            <p className="text-orange-200 text-sm">
              <span className="font-semibold">Security Notice:</span> This demo sends content to OpenRouter (cloud LLM) for Guardian AI review.
              Using real classified data would be a <span className="font-bold text-orange-400">serious security violation</span>.
            </p>
          </div>

          <div className="bg-blue-950/30 border border-blue-800 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              <span className="font-semibold">What you can do:</span> Explore classification-aware development with the included
              BirdTurret CONOPS examples. Learn how Red Forge helps teams manage dual classification (WHAT vs HOW).
            </p>
          </div>

          {/* Confirmation checkbox */}
          <div className="pt-4 border-t border-gray-700">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={understood}
                onChange={(e) => setUnderstood(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-800 text-red-500 focus:ring-red-500 focus:ring-offset-gray-900 cursor-pointer"
              />
              <span className="text-gray-300 group-hover:text-white transition-colors">
                I understand this is a demo with fictional data, and I will not use real classified information.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700 flex justify-end">
          <button
            onClick={onAccept}
            disabled={!understood}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              understood
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/50'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            I Understand - Show Demo
          </button>
        </div>
      </div>
    </div>
  );
}

export function DemoSafetyBanner() {
  return (
    <div className="bg-gradient-to-r from-red-900/80 to-orange-900/80 border-b border-red-700 px-4 py-2">
      <div className="flex items-center justify-center gap-3 text-sm">
        <span className="text-xl">⚠️</span>
        <span className="text-red-200 font-medium">
          DEMO ONLY - Fictional BirdTurret data - Do not use real classified information
        </span>
      </div>
    </div>
  );
}

