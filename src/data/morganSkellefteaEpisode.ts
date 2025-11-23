// Morgan Skellefteå Episode - Medical Timeline Data
// Extracted from narrative: The Skellefteå Protocol
// Source: compression/1-sources/birdturret/narratives/the-skelleftea-protocol.md

export interface ActivationEvent {
  timestamp: number;
  level: number;
  source: 'self_report' | 'family_observation' | 'tool_detection';
  markers: string[];
}

export interface MedicationLog {
  id: string;
  timestamp: number;
  medicationId: string;
  medicationName: string;
  dosageMg: number;
  takenBy: string;
  method: 'manual' | 'protocol';
}

export interface FamilyObservation {
  id: string;
  timestamp: number;
  observer: string;
  observation: string;
  behavior: string;
  context: string;
}

export interface ToolInteraction {
  id: string;
  timestamp: number;
  type: 'pause' | 'prioritization' | 'override_attempt' | 'override_abandoned' | 'catalog';
  userRequest: string;
  toolResponse: string;
  outcome: 'complied' | 'override' | 'abandoned';
}

export interface TherapeuticSession {
  id: string;
  timestamp: number;
  participants: string[];
  focus: string;
  effectiveness: 'helped' | 'neutral' | 'unclear';
}

export interface WeaverAnchor {
  id: string;
  timestamp: number;
  type: 'protocol_activation' | 'family_intervention' | 'medication_enforcement' | 'reality_check' | 'tool_enforcement';
  trigger: string;
  response: string;
  effectiveness: 'helped' | 'neutral' | 'resisted';
}

// Timeline: June 22-29, 2025 (7 days)
// Location: Summer cabin, northern Sweden

// ========================================
// ACTIVATION EVENTS
// ========================================

export const morganActivationEvents: ActivationEvent[] = [
  // June 22 - Pre-crisis (clear warning signs)
  {
    timestamp: new Date('2025-06-22T18:00:00').getTime(),
    level: 8,
    source: 'family_observation',
    markers: ['analyzing_others_behavior', 'thought_loops', 'withdrawing_from_activities']
  },
  
  // June 23 - Episode start (morning)
  {
    timestamp: new Date('2025-06-23T05:30:00').getTime(),
    level: 8,
    source: 'family_observation',
    markers: ['circular_walking', 'early_morning', 'no_sleep']
  },
  
  // June 23 - Episode confirmed (lunch recognition)
  {
    timestamp: new Date('2025-06-23T12:00:00').getTime(),
    level: 9,
    source: 'family_observation',
    markers: ['multiple_showers', 'urgent_publication_desire', 'reduced_sleep']
  },
  
  // June 24 - Peak activation
  {
    timestamp: new Date('2025-06-24T09:00:00').getTime(),
    level: 9,
    source: 'family_observation',
    markers: ['completely_absorbed', 'promise_breaking', 'unable_to_stop']
  },
  
  // June 25 - Medication effect visible
  {
    timestamp: new Date('2025-06-25T08:00:00').getTime(),
    level: 7,
    source: 'self_report',
    markers: ['cognitive_fog', 'remorseful', 'still_elevated']
  },
  
  // June 27 - Turning point
  {
    timestamp: new Date('2025-06-27T12:00:00').getTime(),
    level: 6,
    source: 'self_report',
    markers: ['clear_headed_enough', 'remorseful', 'wants_to_help']
  },
  
  // June 28 - Tool building (middle state)
  {
    timestamp: new Date('2025-06-28T10:00:00').getTime(),
    level: 5,
    source: 'tool_detection',
    markers: ['methodical_work', 'accepting_boundaries', 'present_for_family']
  },
  
  // June 29 - Stabilization (middle state)
  {
    timestamp: new Date('2025-06-29T08:00:00').getTime(),
    level: 5,
    source: 'self_report',
    markers: ['middle_state', 'aware_of_pattern', 'choosing_presence']
  },
];

// ========================================
// MEDICATION LOGS
// ========================================

export const morganMedicationLogs: MedicationLog[] = [
  // June 23 - Protocol activation (evening)
  {
    id: 'med-001',
    timestamp: new Date('2025-06-23T22:00:00').getTime(),
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 20,
    takenBy: 'Morgan',
    method: 'protocol',
  },
  {
    id: 'med-002',
    timestamp: new Date('2025-06-23T22:30:00').getTime(),
    medicationId: 'zopiklon',
    medicationName: 'Zopiklon',
    dosageMg: 7.5,
    takenBy: 'Morgan',
    method: 'protocol',
  },
  
  // June 24 - Continued 20mg (peak activation)
  {
    id: 'med-003',
    timestamp: new Date('2025-06-24T22:00:00').getTime(),
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 20,
    takenBy: 'Morgan',
    method: 'protocol',
  },
  {
    id: 'med-004',
    timestamp: new Date('2025-06-24T22:30:00').getTime(),
    medicationId: 'zopiklon',
    medicationName: 'Zopiklon',
    dosageMg: 7.5,
    takenBy: 'Morgan',
    method: 'protocol',
  },
  
  // June 25 - Taper to 10mg
  {
    id: 'med-005',
    timestamp: new Date('2025-06-25T22:00:00').getTime(),
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 10,
    takenBy: 'Morgan',
    method: 'protocol',
  },
  {
    id: 'med-006',
    timestamp: new Date('2025-06-25T22:30:00').getTime(),
    medicationId: 'zopiklon',
    medicationName: 'Zopiklon',
    dosageMg: 7.5,
    takenBy: 'Morgan',
    method: 'protocol',
  },
  
  // June 26-27 - Continued 10mg
  {
    id: 'med-007',
    timestamp: new Date('2025-06-26T22:00:00').getTime(),
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 10,
    takenBy: 'Morgan',
    method: 'protocol',
  },
  {
    id: 'med-008',
    timestamp: new Date('2025-06-27T22:00:00').getTime(),
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 10,
    takenBy: 'Morgan',
    method: 'protocol',
  },
  
  // June 28-29 - Medication discontinued (middle state, no longer needed)
];

// ========================================
// FAMILY OBSERVATIONS
// ========================================

export const morganFamilyObservations: FamilyObservation[] = [
  {
    id: 'obs-001',
    timestamp: new Date('2025-06-22T18:00:00').getTime(),
    observer: 'Eleanor',
    observation: 'Analyserar allas beteenden, fastnar i tankesnurror',
    behavior: 'Kognitiva mönsterförändringar',
    context: 'Drog sig undan från familjemiddag, fokuserad på AI-arbete',
  },
  {
    id: 'obs-002',
    timestamp: new Date('2025-06-23T05:30:00').getTime(),
    observer: 'Eleanor',
    observation: 'Går samma lilla slinga flera gånger, hörlurar i, helt uppslukad',
    behavior: 'Cirkulärt gående',
    context: '05:30, ingen sömn under natten',
  },
  {
    id: 'obs-003',
    timestamp: new Date('2025-06-23T11:00:00').getTime(),
    observer: 'Eleanor',
    observation: 'Tredje duschen för dagen vid 11:00',
    behavior: 'Flera duschar',
    context: 'Fysisk manifestation av kognitiv aktivering',
  },
  {
    id: 'obs-004',
    timestamp: new Date('2025-06-23T12:00:00').getTime(),
    observer: 'Marcus',
    observation: 'Brådskande önskan att publicera arbete ikväll, kan inte förklara varför',
    behavior: 'Pressad brådska',
    context: 'Lunchkonfrontation - mönsterigenkänningsögonblick',
  },
  {
    id: 'obs-005',
    timestamp: new Date('2025-06-24T21:45:00').getTime(),
    observer: 'Marcus',
    observation: 'Kan inte sluta arbeta trots löfte, säger "Jag vet inte hur jag ska sluta"',
    behavior: 'Bryter löften',
    context: '22:00 medicin deadline, Morgan kan inte följa den',
  },
  {
    id: 'obs-006',
    timestamp: new Date('2025-06-25T07:00:00').getTime(),
    observer: 'Eleanor',
    observation: 'Ångerfullt, kan se skadan på relationer',
    behavior: 'Insikt återvänder',
    context: 'Morgonpromenad diskussion om relationskostnad',
  },
  {
    id: 'obs-007',
    timestamp: new Date('2025-06-27T14:00:00').getTime(),
    observer: 'Marcus',
    observation: 'Hjälper till med staketlagning, har riktigt samtal om verktygsbyggande',
    behavior: 'Engagemang med familjen',
    context: 'Fysiskt arbete tillsammans, genuin närvaro',
  },
  {
    id: 'obs-008',
    timestamp: new Date('2025-06-28T15:00:00').getTime(),
    observer: 'Eleanor',
    observation: 'Arbetar metodiskt med verktyget, tar pauser, närvarande för samtal',
    behavior: 'Reglerat arbetsmönster',
    context: 'Verktygsprototyp fungerar, Morgan testar gränser',
  },
  {
    id: 'obs-009',
    timestamp: new Date('2025-06-28T20:00:00').getTime(),
    observer: 'Marcus',
    observation: 'Spelar kort under pausen, genuint engagerad',
    behavior: 'Social närvaro',
    context: 'Verktyget tvingar pauser, Morgan väljer familjetid',
  },
  {
    id: 'obs-010',
    timestamp: new Date('2025-06-29T08:00:00').getTime(),
    observer: 'Eleanor',
    observation: 'Lugn morgonpromenad, pratar om att vilja vara närvarande',
    behavior: 'Mönstermedvetenhet',
    context: 'Slutlig promenad, avslutningsdiskussion',
  },
];

// ========================================
// TOOL INTERACTIONS (June 28 - Prototype Testing)
// ========================================

export const morganToolInteractions: ToolInteraction[] = [
  // Morning session
  {
    id: 'tool-001',
    timestamp: new Date('2025-06-28T11:15:00').getTime(),
    type: 'pause',
    userRequest: 'Arbetar med ramverksdokumentation',
    toolResponse: '⏸️ PAUS: 2 timmar förflutna. Ta 20-minuters paus.',
    outcome: 'complied',
  },
  
  // Afternoon session - Constructor Theory attempt
  {
    id: 'tool-002',
    timestamp: new Date('2025-06-28T15:30:00').getTime(),
    type: 'prioritization',
    userRequest: 'Jag har en genombrott-idé om Constructor Theory och AI-alignering...',
    toolResponse: 'Du har arbetat i 2 timmar. Dags att katalogisera vad du lärt dig innan du utforskar nya idéer.',
    outcome: 'complied',
  },
  {
    id: 'tool-003',
    timestamp: new Date('2025-06-28T15:32:00').getTime(),
    type: 'override_attempt',
    userRequest: 'Men denna Constructor Theory-koppling är verkligen viktig! Om jag inte fångar den nu...',
    toolResponse: 'Det är tredje gången idag du sagt "verkligen viktig". Vilken EN idé skulle du förklara för Marcus?',
    outcome: 'abandoned',
  },
  
  // Evening session
  {
    id: 'tool-004',
    timestamp: new Date('2025-06-28T19:45:00').getTime(),
    type: 'catalog',
    userRequest: 'Låt mig dokumentera Constructor Theory-kopplingen...',
    toolResponse: 'Innan du utforskar nytt territorium, låt oss katalogisera vad du dokumenterade i morse. Vilken EN är mest kritisk?',
    outcome: 'complied',
  },
  {
    id: 'tool-005',
    timestamp: new Date('2025-06-28T20:15:00').getTime(),
    type: 'pause',
    userRequest: 'Fortsätter arbetssession',
    toolResponse: '20-minuters paus. Gå och visa Eleanor vad du skrev. Nästa session: 20:35',
    outcome: 'complied',
  },
  {
    id: 'tool-006',
    timestamp: new Date('2025-06-28T21:00:00').getTime(),
    type: 'override_attempt',
    userRequest: 'Åsidosätt protokoll. Jag måste fortsätta.',
    toolResponse: '⚠️ ÅSIDOSÄTTNING LOGGAD. Andra åsidosättningen idag. Vad skulle Eleanor säga just nu?',
    outcome: 'abandoned',
  },
  {
    id: 'tool-007',
    timestamp: new Date('2025-06-28T22:00:00').getTime(),
    type: 'pause',
    userRequest: 'Sessionsfortsättning',
    toolResponse: 'Session avslutad för idag. Sammanfattning: 4 arbetssessioner, 3 idéer dokumenterade, 2 åsidosättningsförsök övergivna.',
    outcome: 'complied',
  },
];

// ========================================
// WEAVER ANCHORS (Förankringsregler)
// ========================================

export const morganWeaverAnchors: WeaverAnchor[] = [
  // June 23 - Protocol Activation (Family + Dr. Andersson)
  {
    id: 'anchor-001',
    timestamp: new Date('2025-06-23T14:00:00').getTime(),
    type: 'protocol_activation',
    trigger: 'Familjen igenkände mönster: cirkulärt gående, flera duschar, brådska, minskad sömn',
    response: 'Dr. Andersson konsultation → Medicinprotokoll överenskommet (Olanzapin 20mg + Zopiklon 7.5mg)',
    effectiveness: 'helped',
  },
  
  // June 23 - Negotiated Boundary (10pm medication time)
  {
    id: 'anchor-002',
    timestamp: new Date('2025-06-23T14:15:00').getTime(),
    type: 'family_intervention',
    trigger: 'Morgan vill arbeta tills "klart" (odefinierad slutpunkt)',
    response: 'Marcus förhandlar: Arbeta till 22:00, sedan medicin. Morgan samtycker.',
    effectiveness: 'helped',
  },
  
  // June 24 - Broken Promise Reality Check
  {
    id: 'anchor-003',
    timestamp: new Date('2025-06-24T21:45:00').getTime(),
    type: 'reality_check',
    trigger: 'Morgan arbetar efter 22:00, bröt löfte från igår',
    response: 'Marcus: "Du sa samma sak igår också." Morgan: "Jag vet inte hur jag ska sluta."',
    effectiveness: 'resisted',
  },
  
  // June 24 - Medication Enforcement (despite resistance)
  {
    id: 'anchor-004',
    timestamp: new Date('2025-06-24T22:15:00').getTime(),
    type: 'medication_enforcement',
    trigger: 'Morgan kan inte sluta arbeta frivilligt',
    response: 'Eleanor tar fram medicin. Protokoll verkställt. Morgan följer (motvilligt).',
    effectiveness: 'helped',
  },
  
  // June 25 - Relationship Cost Anchor
  {
    id: 'anchor-005',
    timestamp: new Date('2025-06-25T08:00:00').getTime(),
    type: 'reality_check',
    trigger: 'Morgan ångerfullt men oklart om påverkan',
    response: 'Eleanor: "Marcus känner att han förlorade dig igen." Verkligheten av relationsskada.',
    effectiveness: 'helped',
  },
  
  // June 28 - Tool Anchor: 2-Hour Pause
  {
    id: 'anchor-006',
    timestamp: new Date('2025-06-28T15:30:00').getTime(),
    type: 'tool_enforcement',
    trigger: 'Morgan arbetar 2+ timmar, vill utforska NY idé (Constructor Theory)',
    response: 'Verktyg: "⏸️ PAUS: Dags att katalogisera befintliga idéer innan du utforskar nya"',
    effectiveness: 'helped',
  },
  
  // June 28 - Tool Anchor: Prioritization
  {
    id: 'anchor-007',
    timestamp: new Date('2025-06-28T15:32:00').getTime(),
    type: 'tool_enforcement',
    trigger: 'Morgan: "Men det här är verkligen viktigt!"',
    response: 'Verktyg: "Tredje gången idag du sagt det. Vilken EN idé skulle du förklara för Marcus?"',
    effectiveness: 'helped',
  },
  
  // June 28 - Tool Anchor: Override Visibility
  {
    id: 'anchor-008',
    timestamp: new Date('2025-06-28T21:00:00').getTime(),
    type: 'tool_enforcement',
    trigger: 'Morgan försöker åsidosätta: "Jag måste fortsätta"',
    response: 'Verktyg: "⚠️ ÅSIDOSÄTTNING LOGGAD. Andra åsidosättningen idag. Vad skulle Eleanor säga just nu?"',
    effectiveness: 'helped',
  },
  
  // June 28 - Tool Anchor: Session Complete
  {
    id: 'anchor-009',
    timestamp: new Date('2025-06-28T22:00:00').getTime(),
    type: 'tool_enforcement',
    trigger: 'Morgan vill fortsätta arbeta',
    response: 'Verktyg: "Session avslutad. 4 arbetssessioner idag, 2 åsidosättningar övergivna. Närvarande för: 1 kortspel, 1 samtal."',
    effectiveness: 'helped',
  },
  
  // June 29 - Pattern Awareness Anchor
  {
    id: 'anchor-010',
    timestamp: new Date('2025-06-29T08:00:00').getTime(),
    type: 'reality_check',
    trigger: 'Morgan reflekterar över veckan',
    response: 'Eleanor: "Vi kommer ha fler semestrar." Morgan: "Jag vill vara HÄR för dem. Faktiskt här."',
    effectiveness: 'helped',
  },
];

// ========================================
// THERAPEUTIC SESSIONS
// ========================================

export const morganTherapeuticSessions: TherapeuticSession[] = [
  {
    id: 'session-001',
    timestamp: new Date('2025-06-23T14:00:00').getTime(),
    participants: ['Morgan', 'Dr. Andersson (telefon)'],
    focus: 'Protokoll aktivering diskussion, medicinöverenskommelse',
    effectiveness: 'helped',
  },
  {
    id: 'session-002',
    timestamp: new Date('2025-06-25T08:00:00').getTime(),
    participants: ['Morgan', 'Eleanor'],
    focus: 'Relationskostnad diskussion, verktygsbyggande idé uppstår',
    effectiveness: 'helped',
  },
  {
    id: 'session-003',
    timestamp: new Date('2025-06-27T14:00:00').getTime(),
    participants: ['Morgan', 'Marcus'],
    focus: 'Staketlagning samtal, verktygsdemonstration begäran',
    effectiveness: 'helped',
  },
  {
    id: 'session-004',
    timestamp: new Date('2025-06-29T08:00:00').getTime(),
    participants: ['Morgan', 'Eleanor'],
    focus: 'Slutlig promenad, mellanläge diskussion, mönstermedvetenhet',
    effectiveness: 'helped',
  },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

export function getActivationLevel(timestamp: number): number {
  const event = morganActivationEvents
    .filter(e => e.timestamp <= timestamp)
    .sort((a, b) => b.timestamp - a.timestamp)[0];
  return event ? event.level : 5;
}

export function getToolInteractionsByDay(day: Date): ToolInteraction[] {
  const startOfDay = new Date(day).setHours(0, 0, 0, 0);
  const endOfDay = new Date(day).setHours(23, 59, 59, 999);
  return morganToolInteractions.filter(
    t => t.timestamp >= startOfDay && t.timestamp <= endOfDay
  );
}

export function getMedicationCompliance(): number {
  const expected = 5; // 5 days of protocol (June 23-27)
  const actual = morganMedicationLogs.filter(m => m.medicationId === 'olanzapin').length;
  return Math.round((actual / expected) * 100);
}

export function getWeaverAnchorsByType(type: WeaverAnchor['type']): WeaverAnchor[] {
  return morganWeaverAnchors.filter(a => a.type === type);
}

export function getWeaverAnchorEffectiveness(): {
  total: number;
  helped: number;
  resisted: number;
  effectiveness_rate: number;
} {
  const total = morganWeaverAnchors.length;
  const helped = morganWeaverAnchors.filter(a => a.effectiveness === 'helped').length;
  const resisted = morganWeaverAnchors.filter(a => a.effectiveness === 'resisted').length;
  return {
    total,
    helped,
    resisted,
    effectiveness_rate: Math.round((helped / total) * 100),
  };
}

// ========================================
// NARRATIVE METADATA
// ========================================

export const narrativeMetadata = {
  character: 'Morgan Taylor',
  location: 'Summer cabin, northern Sweden',
  duration_days: 7,
  episode_type: 'hypomanic',
  intervention_type: 'medication + family + tool',
  tool_development: {
    started: new Date('2025-06-27T14:00:00'),
    prototype_ready: new Date('2025-06-28T15:00:00'),
    testing_phase: new Date('2025-06-28T15:00:00'),
    status: 'functional_prototype',
  },
  weaver_anchors: {
    total_anchors: 10,
    family_based: 5, // Protocol activation, boundaries, reality checks
    tool_based: 5,   // AI enforcement, prioritization, override visibility
    effectiveness_rate: 90, // 9/10 helped, 1/10 resisted
    key_insight: 'Combination of human anchors (family) + automated anchors (tool) = comprehensive safety net',
  },
  outcome: 'stabilization_achieved',
  key_insight: 'AI as anchor vs amplifier',
};

