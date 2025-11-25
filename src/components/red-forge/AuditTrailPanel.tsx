/**
 * Audit Trail Panel - Live stream of compliance events
 * 
 * Displays recent audit entries in the right panel tab.
 * Features:
 * - Real-time updates from IndexedDB
 * - Color-coded by decision (allowed/blocked)
 * - Expandable details
 * - Export to JSON
 */

import React, { useState, useEffect } from 'react';
import { useCompliance } from '../../hooks/useComplianceContext';
import { AuditEntry } from '../../lib/red-forge/types';

export function AuditTrailPanel() {
  const { auditDB } = useCompliance();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Load recent entries
  useEffect(() => {
    if (!auditDB) return;

    const loadEntries = async () => {
      const recent = await auditDB.getRecent(50);
      setEntries(recent);
    };

    loadEntries();

    // Subscribe to real-time updates
    const unsubscribe = auditDB.onChange((entry) => {
      setEntries((prev) => [entry, ...prev].slice(0, 50));
    });

    return unsubscribe;
  }, [auditDB]);

  const handleExport = async () => {
    if (!auditDB) return;
    
    const json = await auditDB.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!auditDB) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Loading audit trail...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0e14]">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm font-semibold text-gray-300">Audit Trail</div>
            <div className="text-xs text-gray-500">{entries.length} recent events</div>
          </div>
          <button
            onClick={handleExport}
            className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-xs hover:bg-gray-700"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            No audit entries yet
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-3 hover:bg-gray-800/30 cursor-pointer transition-colors"
                onClick={() => setExpandedId(expandedId === entry.id ? null : (entry.id || null))}
              >
                {/* Summary */}
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      entry.decision === 'allowed' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`text-xs font-medium ${
                          entry.decision === 'allowed' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {entry.decision.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400">{entry.operation}</span>
                    </div>
                    
                    <div className="text-xs text-gray-300 truncate">
                      {entry.resource.replace('weaver://fs/', '')}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {expandedId === entry.id && (
                  <div className="mt-3 pl-5 border-l-2 border-gray-700 space-y-2">
                    {entry.reason && (
                      <div>
                        <div className="text-xs font-semibold text-gray-400">Reason:</div>
                        <div className="text-xs text-gray-300">{entry.reason}</div>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-xs font-semibold text-gray-400">User:</div>
                      <div className="text-xs text-gray-300">
                        {entry.user.name || entry.user.id} (Clearance: {entry.user.clearance}, Network: {entry.user.networkZone})
                      </div>
                    </div>
                    
                    {entry.warnings && entry.warnings.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-yellow-400">Warnings:</div>
                        <div className="text-xs text-yellow-300 space-y-1 mt-1">
                          {entry.warnings.map((warning, idx) => (
                            <div key={idx}>• {warning.message}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

