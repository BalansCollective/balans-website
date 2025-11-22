import { useState } from 'react';

interface MedicationButtonProps {
  medicationName: string;
  pillsPerPress?: number;
  color?: string;
  onPress: (count: number) => void;
}

export function MedicationButton({ 
  medicationName, 
  pillsPerPress = 1,
  onPress 
}: MedicationButtonProps) {
  const [pressCount, setPressCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    const newCount = pressCount + pillsPerPress;
    setPressCount(newCount);
    setIsPressed(true);
    
    // Visual feedback
    setTimeout(() => setIsPressed(false), 200);
    
    // Notify parent
    onPress(newCount);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handlePress}
        className={`medication-button ${isPressed ? 'scale-95' : ''}`}
      >
        {medicationName}
      </button>
      {pressCount > 0 && (
        <span className="text-sm text-gray-600">
          {pressCount} {pressCount === 1 ? 'pille' : 'piller'} loggad
        </span>
      )}
    </div>
  );
}

