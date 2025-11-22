// Balans Virtual Button System
// Software buttons that log events to Chronicle, can be connected to physical hardware later

export interface ButtonDefinition {
  id: string;
  label: string;
  icon: string;
  color: string;
  category: 'medication' | 'work' | 'sleep' | 'warning' | 'wellbeing';
  
  // Optional physical binding
  physicalDevice?: {
    type: 'sonoff' | 'zigbee' | 'mqtt';
    deviceId: string;
    pressType: 'single' | 'double' | 'long';
  };
  
  // Context triggers (optional)
  autoTrigger?: {
    location?: string; // 'kitchen', 'office', 'bedroom'
    time?: string;     // '08:00', '22:00'
    condition?: string; // 'hr > 85', 'sleep < 6'
  };
}

export interface ButtonEvent {
  buttonId: string;
  timestamp: string;
  source: 'manual' | 'auto-trigger' | 'physical-device';
  context?: {
    location?: string;
    heartRate?: number;
    lastMedication?: string;
  };
}

// Predefined buttons for Balans
export const BALANS_BUTTONS: ButtonDefinition[] = [
  // === MEDICATION ===
  {
    id: 'med-morning',
    label: 'Tog Morgonmedicin',
    icon: '💊',
    color: 'blue',
    category: 'medication',
    autoTrigger: {
      location: 'kitchen',
      time: '08:00',
    },
  },
  {
    id: 'med-evening',
    label: 'Tog Kvällsmedicin',
    icon: '🌙',
    color: 'indigo',
    category: 'medication',
    autoTrigger: {
      location: 'bedroom',
      time: '22:00',
    },
  },
  
  // === WORK ===
  {
    id: 'work-start',
    label: 'Startar Fokusarbete',
    icon: '🎯',
    color: 'green',
    category: 'work',
  },
  {
    id: 'work-end',
    label: 'Avslutar Arbete',
    icon: '✅',
    color: 'green',
    category: 'work',
  },
  {
    id: 'work-break',
    label: 'Tar Paus',
    icon: '☕',
    color: 'yellow',
    category: 'work',
  },
  
  // === WARNINGS ===
  {
    id: 'warning-activated',
    label: 'Känner Aktivering',
    icon: '⚡',
    color: 'orange',
    category: 'warning',
    autoTrigger: {
      condition: 'hr > 85 && sleep < 6',
    },
  },
  {
    id: 'warning-emergency',
    label: 'Behöver Stöd NU',
    icon: '🚨',
    color: 'red',
    category: 'warning',
  },
  
  // === WELLBEING ===
  {
    id: 'wellbeing-meal',
    label: 'Åt Måltid',
    icon: '🍽️',
    color: 'emerald',
    category: 'wellbeing',
  },
  {
    id: 'wellbeing-exercise',
    label: 'Tränade',
    icon: '🏃',
    color: 'teal',
    category: 'wellbeing',
  },
  {
    id: 'wellbeing-calm',
    label: 'Mår Lugnt',
    icon: '😌',
    color: 'sky',
    category: 'wellbeing',
  },
];

// Chronicle event logger
export async function logButtonEvent(
  button: ButtonDefinition,
  source: 'manual' | 'auto-trigger' | 'physical-device',
  context?: ButtonEvent['context']
) {
  const event: ButtonEvent = {
    buttonId: button.id,
    timestamp: new Date().toISOString(),
    source,
    context,
  };
  
  // Log to Chronicle via MCP or direct API
  await fetch('/api/chronicle/button-event', {
    method: 'POST',
    body: JSON.stringify(event),
  });
  
  console.log(`🔘 Button pressed: ${button.label} (${source})`);
  
  // Trigger pattern analysis if warning button
  if (button.category === 'warning') {
    await analyzeRecentPatterns();
  }
}

// Pattern analysis trigger
async function analyzeRecentPatterns() {
  // Query last 48 hours of events
  // LLM analyzes: work sessions, sleep, meals, heart rate
  // Returns recommendations
  console.log('🧠 Analyzing recent patterns...');
}

