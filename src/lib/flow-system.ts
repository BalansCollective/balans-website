// Balans Flow System - No-code intervention flows
// Define triggers → conditions → actions → data collection

export interface Flow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'medication' | 'work' | 'sleep' | 'warning' | 'wellbeing';
  
  // WHEN: What triggers this flow
  triggers: Trigger[];
  
  // IF: Optional conditions that must be true
  conditions?: Condition[];
  
  // THEN: What actions to take
  actions: Action[];
  
  // COLLECT: What data to log
  dataCollection: DataPoint[];
  
  // Meta
  createdBy: 'system' | 'user' | 'medical-team';
  createdAt: string;
}

// ============ TRIGGERS ============

type Trigger =
  | TimeTrigger
  | LocationTrigger
  | BiometricTrigger
  | ButtonTrigger
  | EventTrigger
  | ManualTrigger;

interface TimeTrigger {
  type: 'time';
  time: string; // '08:00', '22:00'
  days?: string[]; // ['mon', 'tue', ...] or 'everyday'
}

interface LocationTrigger {
  type: 'location';
  location: 'kitchen' | 'office' | 'bedroom' | 'outside';
  event: 'enter' | 'exit' | 'duration'; // duration = stayed for X min
  durationMin?: number;
}

interface BiometricTrigger {
  type: 'biometric';
  metric: 'hr' | 'hrv' | 'sleep' | 'steps';
  operator: '>' | '<' | '==' | 'between';
  value: number | [number, number]; // threshold or [min, max]
}

interface ButtonTrigger {
  type: 'button';
  buttonId: string;
  pressType?: 'single' | 'double' | 'long';
}

interface EventTrigger {
  type: 'event';
  eventType: 'sleep-end' | 'work-session-end' | 'meal-logged' | 'medication-due';
}

interface ManualTrigger {
  type: 'manual';
  description: string; // User manually runs this flow
}

// ============ CONDITIONS ============

type Condition =
  | TimeSinceCondition
  | BiometricRangeCondition
  | StreakCondition
  | PatternCondition;

interface TimeSinceCondition {
  type: 'time-since';
  event: string; // 'last-medication', 'last-meal', 'work-start'
  operator: '>' | '<';
  hours: number;
}

interface BiometricRangeCondition {
  type: 'biometric-range';
  metric: 'sleep' | 'hr' | 'hrv';
  min?: number;
  max?: number;
  lookbackHours: number; // average over last X hours
}

interface StreakCondition {
  type: 'streak';
  event: string; // 'medication-adherence'
  consecutive: boolean; // must be consecutive days
  days: number;
}

interface PatternCondition {
  type: 'pattern';
  pattern: 'work-overload' | 'sleep-debt' | 'activation-risk';
  confidence: number; // 0-100, threshold for triggering
}

// ============ ACTIONS ============

type Action =
  | ShowPromptAction
  | NotificationAction
  | LogEventAction
  | AnalyzePatternAction
  | NotifyFamilyAction
  | WorkLimitAction
  | CreateReminderAction;

interface ShowPromptAction {
  type: 'show-prompt';
  promptId: string; // references prompt definition
  priority: 'low' | 'medium' | 'high';
  dismissable: boolean;
}

interface NotificationAction {
  type: 'notification';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sound?: boolean;
  vibrate?: boolean;
}

interface LogEventAction {
  type: 'log-event';
  category: string;
  eventName: string;
  metadata?: Record<string, any>;
}

interface AnalyzePatternAction {
  type: 'analyze-pattern';
  lookbackDays: number;
  focus: 'work-medical-correlation' | 'protective-factors' | 'risk-detection';
}

interface NotifyFamilyAction {
  type: 'notify-family';
  message: string;
  urgency: 'info' | 'concern' | 'emergency';
  when: 'immediate' | 'daily-summary' | 'if-unresolved';
}

interface WorkLimitAction {
  type: 'work-limit';
  maxHours: number;
  reason: string;
}

interface CreateReminderAction {
  type: 'create-reminder';
  message: string;
  delayMinutes: number;
}

// ============ DATA COLLECTION ============

interface DataPoint {
  metric: string; // 'medication-adherence', 'work-hours', 'sleep-quality'
  source: 'user-input' | 'biometric' | 'calculated';
  valueType: 'boolean' | 'number' | 'string' | 'timestamp';
}

// ============ EXAMPLE FLOWS ============

export const EXAMPLE_FLOWS: Flow[] = [
  // Flow 1: Morning medication reminder
  {
    id: 'morning-med-kitchen',
    name: 'Morgonmedicin - Köksvarning',
    description: 'Påminnelse när jag går in i köket på morgonen',
    enabled: true,
    category: 'medication',
    createdBy: 'system',
    createdAt: '2025-11-12T00:00:00Z',
    
    triggers: [
      {
        type: 'location',
        location: 'kitchen',
        event: 'enter',
      },
      {
        type: 'time',
        time: '08:00',
        days: 'everyday',
      },
    ],
    
    conditions: [
      {
        type: 'time-since',
        event: 'last-medication-morning',
        operator: '>',
        hours: 20, // hasn't taken in last 20hrs (yesterday's dose)
      },
    ],
    
    actions: [
      {
        type: 'show-prompt',
        promptId: 'kitchen-med-reminder',
        priority: 'high',
        dismissable: true,
      },
      {
        type: 'log-event',
        category: 'medication',
        eventName: 'reminder-shown',
        metadata: { location: 'kitchen', time: 'morning' },
      },
    ],
    
    dataCollection: [
      {
        metric: 'medication-adherence',
        source: 'user-input',
        valueType: 'boolean',
      },
      {
        metric: 'reminder-response-time',
        source: 'calculated',
        valueType: 'number',
      },
    ],
  },
  
  // Flow 2: Work overload detection
  {
    id: 'work-overload-warning',
    name: 'Arbetsöverbelastning - Varning',
    description: 'Varnar när arbetsmönster riskerar aktivering',
    enabled: true,
    category: 'work',
    createdBy: 'system',
    createdAt: '2025-11-12T00:00:00Z',
    
    triggers: [
      {
        type: 'button',
        buttonId: 'work-start',
      },
    ],
    
    conditions: [
      {
        type: 'biometric-range',
        metric: 'sleep',
        max: 6,
        lookbackHours: 24,
      },
      {
        type: 'pattern',
        pattern: 'work-overload',
        confidence: 70,
      },
    ],
    
    actions: [
      {
        type: 'notification',
        title: '⚠️ Arbetsvarning',
        message: 'Du sov <6h. Rekommenderad gräns: 4h idag.',
        priority: 'high',
        sound: true,
      },
      {
        type: 'work-limit',
        maxHours: 4,
        reason: 'sleep-debt',
      },
      {
        type: 'analyze-pattern',
        lookbackDays: 3,
        focus: 'work-medical-correlation',
      },
    ],
    
    dataCollection: [
      {
        metric: 'work-session-with-warning',
        source: 'calculated',
        valueType: 'boolean',
      },
      {
        metric: 'sleep-hours-before-work',
        source: 'biometric',
        valueType: 'number',
      },
    ],
  },
  
  // Flow 3: Emergency activation warning
  {
    id: 'activation-emergency',
    name: 'Aktiering - Akutprotokoll',
    description: 'Aktiveras vid långtryck på varningsknapp',
    enabled: true,
    category: 'warning',
    createdBy: 'system',
    createdAt: '2025-11-12T00:00:00Z',
    
    triggers: [
      {
        type: 'button',
        buttonId: 'warning-activated',
        pressType: 'long',
      },
    ],
    
    conditions: [
      {
        type: 'biometric-range',
        metric: 'hr',
        min: 85,
        lookbackHours: 2,
      },
    ],
    
    actions: [
      {
        type: 'notify-family',
        message: 'Samuel känner aktivering. HR förhöjd, sömnbrist.',
        urgency: 'concern',
        when: 'immediate',
      },
      {
        type: 'notification',
        title: '🚨 Aktiveringsprotokoll',
        message: 'Familjen är notifierade. Ta medicin nu. Kontakta litiumsköterska.',
        priority: 'urgent',
        sound: true,
        vibrate: true,
      },
      {
        type: 'analyze-pattern',
        lookbackDays: 7,
        focus: 'risk-detection',
      },
      {
        type: 'create-reminder',
        message: 'Följ upp med litiumsköterska',
        delayMinutes: 120,
      },
    ],
    
    dataCollection: [
      {
        metric: 'activation-event',
        source: 'user-input',
        valueType: 'timestamp',
      },
      {
        metric: 'heart-rate-at-activation',
        source: 'biometric',
        valueType: 'number',
      },
      {
        metric: 'sleep-deficit',
        source: 'calculated',
        valueType: 'number',
      },
    ],
  },
];

// Flow engine (executes flows)
export class FlowEngine {
  async evaluateFlow(flow: Flow, context: any): Promise<boolean> {
    // Check if all conditions are met
    if (flow.conditions) {
      for (const condition of flow.conditions) {
        if (!await this.evaluateCondition(condition, context)) {
          return false;
        }
      }
    }
    
    // Execute actions
    for (const action of flow.actions) {
      await this.executeAction(action, context);
    }
    
    // Log data
    for (const dataPoint of flow.dataCollection) {
      await this.collectData(dataPoint, context);
    }
    
    return true;
  }
  
  private async evaluateCondition(condition: Condition, context: any): Promise<boolean> {
    // Query Chronicle/Memgraph for condition data
    // Return true/false based on condition logic
    return true; // placeholder
  }
  
  private async executeAction(action: Action, context: any): Promise<void> {
    // Execute the action (show prompt, send notification, etc.)
  }
  
  private async collectData(dataPoint: DataPoint, context: any): Promise<void> {
    // Log data to Chronicle
  }
}

