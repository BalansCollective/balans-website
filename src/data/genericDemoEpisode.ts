// Generic demo data for public medical timeline demo
// No real personal information - illustrative example only

export interface ActivationEvent {
  timestamp: string;
  level: number;
  markers: string[];
  source: 'self_report' | 'family_observation' | 'ai_detection';
}

export interface MedicationLog {
  id: string;
  timestamp: string;
  medicationId: string;
  medicationName: string;
  dosageMg: number;
  takenBy: string;
  method: 'manual' | 'virtual_button';
}

export interface FamilyObservation {
  id: string;
  timestamp: string;
  observer: string; // Generic: "Familjemedlem A", "Familjemedlem B"
  observation: string;
  behavior: string;
  context: string;
}

export interface TherapeuticSession {
  id: string;
  timestamp: string;
  participants: string[]; // Generic: ["Patient", "Familj", "AI-stöd"]
  focus: string;
  effectiveness: 'helped' | 'neutral' | 'unclear';
  duration: string;
}

// Generic hypomanic episode demo data
// Timeline: 7 days, shows typical pattern with intervention
export const genericActivationEvents: ActivationEvent[] = [
  // Day 1: Early warning signs
  { timestamp: '2024-01-15T07:00:00', level: 6, markers: ['early_waking', 'increased_energy'], source: 'self_report' },
  
  // Day 2: Escalation begins
  { timestamp: '2024-01-16T06:30:00', level: 7, markers: ['reduced_sleep', 'racing_thoughts', 'increased_activity'], source: 'family_observation' },
  
  // Day 3: Peak activation - protocol triggered
  { timestamp: '2024-01-17T05:00:00', level: 9, markers: ['minimal_sleep', 'rapid_speech', 'difficulty_focusing', 'multiple_projects'], source: 'ai_detection' },
  
  // Day 4: Intervention active
  { timestamp: '2024-01-18T07:00:00', level: 8, markers: ['still_elevated', 'responding_to_structure'], source: 'family_observation' },
  
  // Day 5: Stabilizing
  { timestamp: '2024-01-19T07:30:00', level: 7, markers: ['improving', 'better_sleep', 'calmer'], source: 'self_report' },
  
  // Day 6: Continued improvement
  { timestamp: '2024-01-20T08:00:00', level: 6, markers: ['stable', 'normal_activity', 'good_insight'], source: 'self_report' },
  
  // Day 7: Return to baseline
  { timestamp: '2024-01-21T08:00:00', level: 5, markers: ['baseline', 'stable_mood', 'normal_sleep'], source: 'self_report' },
];

export const genericMedicationLogs: MedicationLog[] = [
  // Day 3: Protocol activation - immediate intervention
  {
    id: 'med-001',
    timestamp: '2024-01-17T20:00:00',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 5,
    takenBy: 'patient',
    method: 'virtual_button',
  },
  
  // Day 4: Continued treatment
  {
    id: 'med-002',
    timestamp: '2024-01-18T21:00:00',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 5,
    takenBy: 'patient',
    method: 'virtual_button',
  },
  
  // Day 5: Reduced dose
  {
    id: 'med-003',
    timestamp: '2024-01-19T21:00:00',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 2.5,
    takenBy: 'patient',
    method: 'virtual_button',
  },
];

export const genericFamilyObservations: FamilyObservation[] = [
  // Day 2: Family notices changes
  {
    id: 'obs-001',
    timestamp: '2024-01-16T19:00:00',
    observer: 'Familjemedlem A',
    observation: 'Pratar snabbare än vanligt och verkar ha svårt att sitta still',
    behavior: 'Ökad aktivitet, flera projekt samtidigt',
    context: 'Märkte under middagen att samtalet gick mycket snabbt',
  },
  
  // Day 3: Concerns escalate
  {
    id: 'obs-002',
    timestamp: '2024-01-17T10:00:00',
    observer: 'Familjemedlem B',
    observation: 'Sov bara 3 timmar men verkar inte trött',
    behavior: 'Minimal sömn, hög energinivå',
    context: 'Varit uppe sedan 05:00, startat flera nya projekt',
  },
  
  // Day 4: Positive response to intervention
  {
    id: 'obs-003',
    timestamp: '2024-01-18T18:00:00',
    observer: 'Familjemedlem A',
    observation: 'Lite lugnare efter gårdagens protokoll. Följer strukturen vi satt upp.',
    behavior: 'Mer strukturerad, accepterar gränser',
    context: 'Kunde pausa arbete för att äta middag tillsammans',
  },
  
  // Day 6: Recovery noted
  {
    id: 'obs-004',
    timestamp: '2024-01-20T20:00:00',
    observer: 'Familjemedlem B',
    observation: 'Betydligt lugnare, pratar i normalt tempo',
    behavior: 'Normal aktivitetsnivå',
    context: 'Kunde ha ett vanligt samtal utan att hoppa mellan ämnen',
  },
];

export const genericTherapeuticSessions: TherapeuticSession[] = [
  // Day 3: Crisis intervention - protocol activated
  {
    id: 'session-001',
    timestamp: '2024-01-17T14:00:00',
    participants: ['Patient', 'Familj', 'AI-stöd'],
    focus: 'Verklighetsförankring: Identifiera hypomaniska tankemönster, sätta upp daglig struktur',
    effectiveness: 'helped',
    duration: '45 min',
  },
  
  // Day 4: Follow-up
  {
    id: 'session-002',
    timestamp: '2024-01-18T15:00:00',
    participants: ['Patient', 'Familj', 'AI-stöd'],
    focus: 'Granskning av struktur, justering av aktivitetsnivå',
    effectiveness: 'helped',
    duration: '30 min',
  },
  
  // Day 5: Stabilization check
  {
    id: 'session-003',
    timestamp: '2024-01-19T16:00:00',
    participants: ['Patient', 'Familj'],
    focus: 'Utvärdering av förbättring, planering för fortsatt stabilisering',
    effectiveness: 'helped',
    duration: '20 min',
  },
];

