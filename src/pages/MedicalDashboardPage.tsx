import { useState } from 'react'
import { MedicalTimeline } from '../components/MedicalTimeline'
import { Vardplan } from '../components/Vardplan'
import { PiaDashboard } from '../components/PiaDashboard'
import FamilyDashboard from '../components/FamilyDashboard'
import { SamMedicineLog } from '../components/SamMedicineLog'
import { PasswordGate } from '../components/PasswordGate'
import { WeaverStream } from '../components/WeaverStream'
import { ThemeToggle } from '../components/ThemeToggle'
import { GoldenThreadsTest } from './GoldenThreadsTest'

export function MedicalDashboardPage() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'vardplan' | 'pia' | 'family' | 'sam' | 'weaver' | 'threads'>('threads');
  
  return (
    <PasswordGate>
      <div className="w-full h-screen flex flex-col bg-birch-white dark:bg-bg-main transition-colors duration-300">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-bg-surface border-b border-gentle-silver/20 dark:border-border-medium">
        <nav className="flex flex-wrap px-2 sm:px-6 items-center">
          <button
            onClick={() => setActiveTab('sam')}
            className={`px-2 sm:px-4 py-3 text-sm sm:text-base font-medium transition-colors relative ${
              activeTab === 'sam'
                ? 'text-swedish-blue dark:text-swedish-blue-dark'
                : 'text-gray-600 dark:text-birch-white-dark/70 hover:text-gray-900 dark:hover:text-birch-white-dark'
            }`}
          >
            📟 Min Medicin
            {activeTab === 'sam' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-swedish-blue dark:bg-swedish-blue-dark" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-2 sm:px-4 py-3 text-sm sm:text-base font-medium transition-colors relative ${
              activeTab === 'timeline'
                ? 'text-swedish-blue dark:text-swedish-blue-dark'
                : 'text-gray-600 dark:text-birch-white-dark/70 hover:text-gray-900 dark:hover:text-birch-white-dark'
            }`}
          >
            📊 Tidslinje
            {activeTab === 'timeline' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-swedish-blue dark:bg-swedish-blue-dark" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('vardplan')}
            className={`px-2 sm:px-4 py-3 text-sm sm:text-base font-medium transition-colors relative ${
              activeTab === 'vardplan'
                ? 'text-swedish-blue dark:text-swedish-blue-dark'
                : 'text-gray-600 dark:text-birch-white-dark/70 hover:text-gray-900 dark:hover:text-birch-white-dark'
            }`}
          >
            📋 Vårdplan
            {activeTab === 'vardplan' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-swedish-blue dark:bg-swedish-blue-dark" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('pia')}
            className={`px-2 sm:px-4 py-3 text-sm sm:text-base font-medium transition-colors relative ${
              activeTab === 'pia'
                ? 'text-swedish-blue dark:text-swedish-blue-dark'
                : 'text-gray-600 dark:text-birch-white-dark/70 hover:text-gray-900 dark:hover:text-birch-white-dark'
            }`}
          >
            👩‍⚕️ Läkardashboard
            {activeTab === 'pia' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-swedish-blue dark:bg-swedish-blue-dark" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('family')}
            className={`px-2 sm:px-4 py-3 text-sm sm:text-base font-medium transition-colors relative ${
              activeTab === 'family'
                ? 'text-swedish-blue dark:text-swedish-blue-dark'
                : 'text-gray-600 dark:text-birch-white-dark/70 hover:text-gray-900 dark:hover:text-birch-white-dark'
            }`}
          >
            👨‍👩‍👦 Familjevy
            {activeTab === 'family' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-swedish-blue dark:bg-swedish-blue-dark" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('weaver')}
            className={`px-2 sm:px-4 py-3 text-sm sm:text-base font-medium transition-colors relative ${
              activeTab === 'weaver'
                ? 'text-swedish-blue dark:text-swedish-blue-dark'
                : 'text-gray-600 dark:text-birch-white-dark/70 hover:text-gray-900 dark:hover:text-birch-white-dark'
            }`}
          >
            🧠 Weaver CLI
            {activeTab === 'weaver' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-swedish-blue dark:bg-swedish-blue-dark" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('threads')}
            className={`px-2 sm:px-4 py-3 text-sm sm:text-base font-medium transition-colors relative ${
              activeTab === 'threads'
                ? 'text-thread-gold dark:text-thread-gold-dark'
                : 'text-gray-600 dark:text-birch-white-dark/70 hover:text-gray-900 dark:hover:text-birch-white-dark'
            }`}
          >
            ✨ Golden Threads
            {activeTab === 'threads' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-thread-gold dark:bg-thread-gold-dark" />
            )}
          </button>
          
          {/* Theme Toggle */}
          <div className="ml-auto py-3">
            <ThemeToggle />
          </div>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'sam' && <SamMedicineLog />}
        {activeTab === 'timeline' && <MedicalTimeline />}
        {activeTab === 'vardplan' && <Vardplan />}
        {activeTab === 'pia' && <PiaDashboard />}
        {activeTab === 'family' && <FamilyDashboard />}
        {activeTab === 'weaver' && <WeaverStream />}
        {activeTab === 'threads' && <GoldenThreadsTest />}
      </div>

      {/* Demo Disclaimer Footer */}
      <div className="bg-gray-100 dark:bg-bg-surface border-t border-gray-300 dark:border-border-medium px-4 py-2 text-center">
        <p className="text-xs text-gray-600 dark:text-birch-white-dark/70">
          ⚠️ Detta är en <strong>prototyp/demo</strong> med mockdata. Systemet är inte i produktion ännu.
        </p>
      </div>
    </div>
    </PasswordGate>
  );
}

