import React, { useState } from 'react';
import { BALANS_BUTTONS, logButtonEvent, ButtonDefinition } from '../lib/button-system';

export function ButtonPanel() {
  const [recentPress, setRecentPress] = useState<string | null>(null);
  
  const handlePress = async (button: ButtonDefinition) => {
    await logButtonEvent(button, 'manual');
    
    // Visual feedback
    setRecentPress(button.id);
    setTimeout(() => setRecentPress(null), 2000);
    
    // Haptic feedback (mobile)
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };
  
  const categories = ['medication', 'work', 'wellbeing', 'warning'] as const;
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Snabbknappar</h2>
      
      {categories.map(category => {
        const buttons = BALANS_BUTTONS.filter(b => b.category === category);
        if (buttons.length === 0) return null;
        
        return (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-600 uppercase">
              {category === 'medication' && 'Medicinering'}
              {category === 'work' && 'Arbete'}
              {category === 'wellbeing' && 'Välmående'}
              {category === 'warning' && 'Varningar'}
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {buttons.map(button => (
                <button
                  key={button.id}
                  onClick={() => handlePress(button)}
                  className={`
                    relative p-4 rounded-xl font-medium text-left
                    transition-all duration-200
                    ${recentPress === button.id 
                      ? 'scale-95 ring-4 ring-offset-2' 
                      : 'hover:scale-105 active:scale-95'
                    }
                    bg-${button.color}-500 hover:bg-${button.color}-600
                    text-white shadow-lg
                  `}
                >
                  <div className="text-3xl mb-2">{button.icon}</div>
                  <div className="text-sm">{button.label}</div>
                  
                  {/* Physical device indicator */}
                  {button.physicalDevice && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p>💡 Tips: Använd knapparna varje dag för att Balans ska lära sig dina mönster.</p>
      </div>
    </div>
  );
}

// Kitchen medication reminder component
export function KitchenMedicationPrompt({ onConfirm, onDismiss }: {
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed bottom-6 left-6 right-6 max-w-md bg-blue-500 text-white rounded-2xl shadow-2xl p-6 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="text-4xl">💊</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">God morgon!</h3>
          <p className="text-blue-100 text-sm mb-4">
            Dags att ta morgonmedicin?
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition"
            >
              ✓ Tagit medicin
            </button>
            <button
              onClick={onDismiss}
              className="px-4 text-blue-100 hover:text-white transition"
            >
              Senare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

