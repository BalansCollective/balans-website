import { useState, useEffect, useRef } from 'react';
import { Command } from '@tauri-apps/plugin-shell';

export function WeaverCLI() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const runWeaver = async () => {
    if (!prompt.trim() || isRunning) return;

    setIsRunning(true);
    setOutput('');

    try {
      // Spawn weaver CLI process
      const command = Command.create('weaver', ['memory', 'query', prompt]);

      // Stream stdout
      command.stdout.on('data', (data) => {
        setOutput((prev) => prev + data);
      });

      // Stream stderr
      command.stderr.on('data', (data) => {
        console.error('stderr:', data);
      });

      // Handle completion
      command.on('close', () => {
        setIsRunning(false);
      });

      await command.spawn();
    } catch (error) {
      console.error('Failed to run weaver:', error);
      setOutput(`Error: ${error}`);
      setIsRunning(false);
    }
  };

  // Auto-scroll to bottom as output streams
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-blue-400">Weaver CLI</h1>
        <p className="text-gray-400">Stream output from weaver memory queries</p>
      </div>

      {/* Input */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runWeaver()}
          placeholder="Enter weaver query..."
          disabled={isRunning}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50"
        />
        <button
          onClick={runWeaver}
          disabled={isRunning || !prompt.trim()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          {isRunning ? 'Running...' : 'Query'}
        </button>
      </div>

      {/* Output */}
      <div 
        ref={outputRef}
        className="flex-1 p-4 bg-gray-800 border border-gray-700 rounded-lg overflow-auto font-mono text-sm"
      >
        {output ? (
          <pre className="whitespace-pre-wrap">{output}</pre>
        ) : (
          <div className="text-gray-500 italic">Output will appear here...</div>
        )}
      </div>

      {/* Status */}
      {isRunning && (
        <div className="mt-4 flex items-center gap-2 text-yellow-400">
          <div className="animate-spin h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
          <span>Streaming from weaver CLI...</span>
        </div>
      )}
    </div>
  );
}


