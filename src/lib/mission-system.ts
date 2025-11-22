// Weavermesh Mission System
// Represents coordinated work between human agents, AI agents, and hardware

import { Flow, Trigger } from './flow-system';

export interface Mission {
  id: string;
  name: string;
  goal: string;
  description: string;
  category: 'medication' | 'work-balance' | 'sleep' | 'nutrition' | 'exercise';
  
  // Agents participating in this mission
  agents: Agent[];
  
  // Tasks assigned to agents
  tasks: Task[];
  
  // Success criteria
  successMetrics: SuccessMetric[];
  
  // Timeline
  startDate: string;
  endDate?: string; // ongoing if null
  status: 'draft' | 'active' | 'completed' | 'paused' | 'cancelled';
  
  // Associated flows (automation)
  flows?: string[]; // flow IDs
  
  // Progress tracking
  completionRate?: number; // 0-100
  lastUpdated: string;
}

export interface Agent {
  id: string;
  name: string;
  type: 'human' | 'ai' | 'hardware' | 'system';
  
  // For humans
  relationship?: 'self' | 'family' | 'medical-team' | 'friend';
  
  // Capabilities (what this agent can do)
  capabilities: Capability[];
  
  // Availability
  availability?: {
    timezone?: string;
    activeHours?: [number, number]; // e.g. [8, 22] = 8am-10pm
  };
  
  // Communication preferences
  notifications?: {
    method: 'push' | 'sms' | 'email' | 'none';
    urgencyThreshold: 'info' | 'concern' | 'emergency';
  };
  
  // Status
  active: boolean;
}

export type Capability =
  // Human capabilities
  | 'measure-weight'
  | 'log-meal'
  | 'take-medication'
  | 'provide-support'
  | 'medical-oversight'
  | 'emergency-response'
  // AI capabilities
  | 'detect-patterns'
  | 'analyze-risk'
  | 'suggest-interventions'
  | 'generate-reports'
  // Hardware capabilities
  | 'measure-heart-rate'
  | 'detect-location'
  | 'signal-event'
  | 'track-sleep';

export interface Task {
  id: string;
  missionId: string;
  
  // Assignment
  assignedTo: string; // agent id
  assignedAt: string;
  
  // Task details
  action: string; // "Measure weight", "Take medication"
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Scheduling
  schedule?: {
    frequency: 'once' | 'daily' | 'weekly' | 'as-needed';
    time?: string; // e.g. "08:00"
    days?: string[]; // ['mon', 'wed', 'fri']
    triggers?: Trigger[]; // from flow-system
  };
  
  // Data collection
  dataToLog?: {
    metric: string; // 'weight', 'medication-taken', 'sleep-quality'
    valueType: 'number' | 'boolean' | 'string' | 'timestamp';
    unit?: string; // 'kg', 'mg', 'hours', 'rating-1-10'
    required: boolean;
  };
  
  // Status tracking
  status: 'pending' | 'in-progress' | 'completed' | 'skipped' | 'blocked';
  completedAt?: string;
  completedBy?: string; // agent id
  result?: any; // data logged by agent
  
  // Dependencies
  dependsOn?: string[]; // other task IDs that must complete first
  blockedBy?: string; // reason if blocked
  
  // Reminders
  reminders?: {
    enabled: boolean;
    beforeMinutes: number[]; // [60, 15] = remind 1hr and 15min before
  };
  
  // History (for recurring tasks)
  occurrences?: TaskOccurrence[];
}

export interface TaskOccurrence {
  date: string;
  status: 'completed' | 'missed' | 'skipped';
  completedAt?: string;
  result?: any;
  notes?: string;
}

export interface SuccessMetric {
  name: string;
  description: string;
  type: 'boolean' | 'percentage' | 'count' | 'threshold';
  
  // For percentage/count
  target?: number;
  current?: number;
  
  // For threshold
  metric?: string; // 'medication-adherence', 'sleep-hours'
  operator?: '>' | '<' | '==' | 'between';
  value?: number | [number, number];
  
  // Evaluation
  evaluationFrequency: 'daily' | 'weekly' | 'monthly';
  lastEvaluated?: string;
  met: boolean;
}

// ============ EXAMPLE MISSIONS ============

export const EXAMPLE_MISSIONS: Mission[] = [
  // Mission 1: Daily medication adherence
  {
    id: 'med-adherence-daily',
    name: 'Daglig Medicinföljsamhet',
    goal: 'Säkerställ 100% medicinföljsamhet för litium, olanzapin, zopiklon',
    description: 'Koordinerad insats mellan Sam, familj och AI för att bibehålla medicinföljsamhet',
    category: 'medication',
    
    agents: [
      {
        id: 'agent-sam',
        name: 'Samuel',
        type: 'human',
        relationship: 'self',
        capabilities: ['take-medication', 'log-meal', 'measure-weight'],
        notifications: {
          method: 'push',
          urgencyThreshold: 'concern',
        },
        active: true,
      },
      {
        id: 'agent-kitchen-button',
        name: 'Köksknapp',
        type: 'hardware',
        capabilities: ['signal-event', 'detect-location'],
        active: true,
      },
      {
        id: 'agent-pattern-ai',
        name: 'Mönsterigenkänning AI',
        type: 'ai',
        capabilities: ['detect-patterns', 'analyze-risk', 'suggest-interventions'],
        active: true,
      },
      {
        id: 'agent-family',
        name: 'Familj',
        type: 'human',
        relationship: 'family',
        capabilities: ['provide-support', 'emergency-response'],
        notifications: {
          method: 'sms',
          urgencyThreshold: 'emergency',
        },
        active: true,
      },
    ],
    
    tasks: [
      {
        id: 'task-morning-med',
        missionId: 'med-adherence-daily',
        assignedTo: 'agent-sam',
        assignedAt: '2025-11-12T00:00:00Z',
        action: 'Ta morgonmedicin',
        description: 'Litium 900mg + olanzapin 2,5mg',
        priority: 'high',
        schedule: {
          frequency: 'daily',
          time: '08:00',
          triggers: [
            {
              type: 'location',
              location: 'kitchen',
              event: 'enter',
            },
          ],
        },
        dataToLog: {
          metric: 'medication-morning-taken',
          valueType: 'timestamp',
          required: true,
        },
        status: 'pending',
        reminders: {
          enabled: true,
          beforeMinutes: [15, 60],
        },
        occurrences: [],
      },
      {
        id: 'task-evening-med',
        missionId: 'med-adherence-daily',
        assignedTo: 'agent-sam',
        assignedAt: '2025-11-12T00:00:00Z',
        action: 'Ta kvällsmedicin',
        description: 'Litium 900mg + olanzapin 5mg + zopiklon 7,5mg',
        priority: 'high',
        schedule: {
          frequency: 'daily',
          time: '22:00',
          triggers: [
            {
              type: 'location',
              location: 'bedroom',
              event: 'enter',
            },
          ],
        },
        dataToLog: {
          metric: 'medication-evening-taken',
          valueType: 'timestamp',
          required: true,
        },
        status: 'pending',
        reminders: {
          enabled: true,
          beforeMinutes: [15, 30],
        },
        occurrences: [],
      },
      {
        id: 'task-analyze-adherence',
        missionId: 'med-adherence-daily',
        assignedTo: 'agent-pattern-ai',
        assignedAt: '2025-11-12T00:00:00Z',
        action: 'Analysera medicinmönster',
        description: 'Detektera missade doser, timing-patterns, korrelation med sömn/arbete',
        priority: 'medium',
        schedule: {
          frequency: 'daily',
          time: '23:00',
        },
        dependsOn: ['task-morning-med', 'task-evening-med'],
        status: 'pending',
      },
      {
        id: 'task-family-support',
        missionId: 'med-adherence-daily',
        assignedTo: 'agent-family',
        assignedAt: '2025-11-12T00:00:00Z',
        action: 'Stötta vid behov',
        description: 'Notifieras endast om Samuel missar medicin >2 dagar i rad',
        priority: 'low',
        schedule: {
          frequency: 'as-needed',
          triggers: [
            {
              type: 'event',
              eventType: 'medication-streak-broken',
            },
          ],
        },
        status: 'pending',
      },
    ],
    
    successMetrics: [
      {
        name: 'Medicinföljsamhet',
        description: '100% av doser tagna inom 2h från schemalagd tid',
        type: 'percentage',
        target: 100,
        current: 95,
        evaluationFrequency: 'weekly',
        met: false,
      },
      {
        name: 'Litiumblodvärde stabilt',
        description: 'Litiumvärde 0,6-0,8 mmol/L',
        type: 'threshold',
        metric: 'lithium-level',
        operator: 'between',
        value: [0.6, 0.8],
        evaluationFrequency: 'monthly',
        met: true,
      },
    ],
    
    flows: ['morning-med-kitchen', 'evening-med-bedroom'],
    
    startDate: '2025-11-12T00:00:00Z',
    status: 'active',
    completionRate: 95,
    lastUpdated: '2025-11-12T10:00:00Z',
  },
  
  // Mission 2: Work-life balance
  {
    id: 'work-balance-weekly',
    name: 'Arbets-livsbalans',
    goal: 'Max 30h arbete/vecka, 8h sömn/natt, inga hypomana episoder',
    description: 'Förebyggande åtgärder för att undvika aktivering',
    category: 'work-balance',
    
    agents: [
      {
        id: 'agent-sam',
        name: 'Samuel',
        type: 'human',
        relationship: 'self',
        capabilities: ['log-meal', 'take-medication'],
        active: true,
      },
      {
        id: 'agent-fitbit',
        name: 'Fitbit',
        type: 'hardware',
        capabilities: ['measure-heart-rate', 'track-sleep'],
        active: true,
      },
      {
        id: 'agent-work-ai',
        name: 'Arbetsbalanserare AI',
        type: 'ai',
        capabilities: ['detect-patterns', 'analyze-risk', 'suggest-interventions'],
        active: true,
      },
    ],
    
    tasks: [
      {
        id: 'task-track-work-hours',
        missionId: 'work-balance-weekly',
        assignedTo: 'agent-sam',
        assignedAt: '2025-11-12T00:00:00Z',
        action: 'Logga arbetspass',
        description: 'Tryck "Startar arbete" och "Avslutar arbete" knappar',
        priority: 'high',
        schedule: {
          frequency: 'as-needed',
        },
        dataToLog: {
          metric: 'work-session-duration',
          valueType: 'number',
          unit: 'hours',
          required: true,
        },
        status: 'in-progress',
      },
      {
        id: 'task-sleep-tracking',
        missionId: 'work-balance-weekly',
        assignedTo: 'agent-fitbit',
        assignedAt: '2025-11-12T00:00:00Z',
        action: 'Mät sömn automatiskt',
        description: 'Fitbit trackar sömn varje natt',
        priority: 'high',
        schedule: {
          frequency: 'daily',
        },
        dataToLog: {
          metric: 'sleep-duration',
          valueType: 'number',
          unit: 'hours',
          required: true,
        },
        status: 'in-progress',
      },
      {
        id: 'task-weekly-analysis',
        missionId: 'work-balance-weekly',
        assignedTo: 'agent-work-ai',
        assignedAt: '2025-11-12T00:00:00Z',
        action: 'Veckoanalys av arbetsmönster',
        description: 'Analysera arbete/sömn-korrelation, detektera överbelastning',
        priority: 'medium',
        schedule: {
          frequency: 'weekly',
          days: ['mon'],
          time: '09:00',
        },
        dependsOn: ['task-track-work-hours', 'task-sleep-tracking'],
        status: 'pending',
      },
    ],
    
    successMetrics: [
      {
        name: 'Arbetstimmar/vecka',
        description: 'Max 30h arbete per vecka',
        type: 'threshold',
        metric: 'weekly-work-hours',
        operator: '<',
        value: 30,
        evaluationFrequency: 'weekly',
        met: true,
      },
      {
        name: 'Sömnkvalitet',
        description: 'Minst 7h sömn/natt i genomsnitt',
        type: 'threshold',
        metric: 'avg-sleep-hours',
        operator: '>',
        value: 7,
        evaluationFrequency: 'weekly',
        met: false,
      },
    ],
    
    flows: ['work-overload-warning'],
    
    startDate: '2025-11-12T00:00:00Z',
    status: 'active',
    completionRate: 78,
    lastUpdated: '2025-11-12T10:00:00Z',
  },
];

// Mission execution engine
export class MissionEngine {
  async assignTask(task: Task, agent: Agent): Promise<void> {
    // Notify agent of new task
    console.log(`📋 Task assigned: "${task.action}" → ${agent.name}`);
  }
  
  async completeTask(taskId: string, result: any, completedBy: string): Promise<void> {
    // Log task completion to Chronicle
    console.log(`✅ Task completed: ${taskId} by ${completedBy}`);
  }
  
  async evaluateMission(mission: Mission): Promise<number> {
    // Calculate completion rate based on tasks and metrics
    const completedTasks = mission.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = mission.tasks.length;
    return (completedTasks / totalTasks) * 100;
  }
}

