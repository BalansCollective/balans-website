/**
 * October-November 2025 Episode Data
 * 
 * Timeline: Oct 3 - Nov 13, 2025 (41 days)
 * Context: 15mg olanzapine regimen started Oct 3 for hypomania regulation
 * 
 * Data reconstructed from:
 * - Medical journal (weaver/evidence/medical/journal/journal.md)
 * - Incident documentation (2025-11-03, 2025-11-04)
 * - Chronicle logs (.weaver/chronicle/session.json - Nov 9-13)
 * - Git commit history
 * 
 * NOTE: This is a LONGER episode timeline (41 days) vs June 2025 (6 days)
 * Shows ongoing regulation with 15mg olanzapine maintenance vs acute crisis management
 */

export interface ActivationEvent {
  timestamp: string; // ISO 8601
  level: number; // 0-10 scale
  source: 'self_report' | 'family_observation' | 'llm_pattern' | 'medical_record';
  markers: string[]; // Behavioral markers observed
  context: string;
}

export interface MedicationLog {
  timestamp: string;
  medicationId: 'lithium' | 'olanzapin' | 'zopiklon';
  medicationName: string;
  dosageMg: number;
  taken: boolean; // true = taken, false = missed
  method: 'manual' | 'physical_button' | 'voice_command';
  notes?: string;
}

export interface FamilyObservation {
  timestamp: string;
  observer: string; // 'Eva', 'Roger', etc.
  observation: string;
  behavior: string;
  context: string;
  concernLevel: number; // 1-10
}

export interface TherapeuticSession {
  timestamp: string;
  type: 'reality-grounding' | 'crisis-intervention' | 'routine-checkin';
  participants: string[]; // ['Eva', 'Roger', 'LLM'] or ['Team6-nurse']
  focus: string;
  duration_minutes: number;
  effectiveness: 'helped' | 'neutral' | 'unclear' | 'communication-breakdown';
  notes?: string;
}

// Oct 3-13: Medication regulation started, baseline establishment
export const octoberNovember2025ActivationEvents: ActivationEvent[] = [
  {
    timestamp: '2025-10-03T09:00:00Z',
    level: 6,
    source: 'medical_record',
    markers: ['medication_plan_started', 'baseline_measurement'],
    context: 'Started 15mg olanzapine regimen per medical plan with Pia for hypomania regulation'
  },
  
  // Nov 3: Phone system failure day
  {
    timestamp: '2025-11-03T08:33:00Z',
    level: 5,
    source: 'self_report',
    markers: ['frustration', 'medical_system_barriers', 'bug_reporting'],
    context: 'Three failed attempts to reach litiumrådgivningen (08:33-08:35) - phone system failures'
  },
  
  // Nov 4: Acute episode day - escalation timeline
  {
    timestamp: '2025-11-04T06:00:00Z',
    level: 7,
    source: 'self_report',
    markers: ['early_waking', 'high_energy', 'decreased_sleep_need'],
    context: 'Woke at 06:00, too alert to sleep - decided to channel energy productively'
  },
  {
    timestamp: '2025-11-04T08:00:00Z',
    level: 6,
    source: 'self_report',
    markers: ['productive_channeling', 'spiralverse_deep_work', 'creative_engagement'],
    context: 'Spiralverse work: Morgan in Gaiaria Volume 1, 24-chapter timeline, Royal Road strategy'
  },
  {
    timestamp: '2025-11-04T10:40:00Z',
    level: 5,
    source: 'self_report',
    markers: ['structured_work', 'team_meeting', 'strategic_planning'],
    context: 'Dyno strategy meeting: WeaverMesh, OriginRights, Balans Red Cell planning'
  },
  {
    timestamp: '2025-11-04T11:04:00Z',
    level: 5,
    source: 'medical_record',
    markers: ['medical_callback', 'privacy_compromised', 'parental_concern'],
    context: 'Team 6 callback during work meeting - parents initiated after weekend SNOOP-BOOP test'
  },
  {
    timestamp: '2025-11-04T15:00:00Z',
    level: 5,
    source: 'self_report',
    markers: ['project_switching', 'birdturret_work', 'dyno_2026_planning'],
    context: 'Returned home: Birdturret strategic work + Dyno 2026 goals (35 items reviewed)'
  },
  {
    timestamp: '2025-11-04T17:30:00Z',
    level: 7,
    source: 'self_report',
    markers: ['mental_health_timeline_creation', 'structured_reflection', 'ai_collaboration'],
    context: 'Began creating daily mental health timeline with AI assistance'
  },
  {
    timestamp: '2025-11-04T17:55:00Z',
    level: 10,
    source: 'self_report',
    markers: ['recursive_philosophical_analysis', 'near_psychosis', 'time_perception_loss', 'flight_of_ideas_peak'],
    context: 'ACUTE CRISIS: Recursive philosophical self-analysis, near psychosis, time perception impaired'
  },
  {
    timestamp: '2025-11-04T18:06:00Z',
    level: 8,
    source: 'self_report',
    markers: ['post_medication', 'still_elevated', 'structured_documentation'],
    context: 'Post olanzapine 20mg - still hypomanic (8-9/10), continuing AI-assisted timeline documentation'
  },
  
  // Nov 5: Structured business planning (from chat analysis)
  {
    timestamp: '2025-11-05T19:00:00Z',
    level: 6,
    source: 'llm_pattern',
    markers: ['structured_planning', 'business_strategy', 'red_cell_development'],
    context: 'Red Cell business strategy session - structured planning, Saab partnership approach (confidence: medium - inferred from chat mod date + content)'
  },
  
  // Nov 6: Deep technical work (from chat analysis)
  {
    timestamp: '2025-11-06T20:00:00Z',
    level: 7,
    source: 'llm_pattern',
    markers: ['deep_technical_work', 'architecture_design', 'guardian_magician_separation'],
    context: 'Guardian/Magician mode separation design + WeaverMesh architecture refinement (confidence: high - detailed technical content, long session)'
  },
  
  // Nov 7: Mobile app planning (from chat analysis)
  {
    timestamp: '2025-11-07T10:00:00Z',
    level: 6,
    source: 'llm_pattern',
    markers: ['mobile_planning', 'tauri_research', 'demo_preparation'],
    context: 'Tauri 2.0 mobile research, React Native vs Rust backend planning for medical demo (confidence: medium - structured tech evaluation)'
  },
  
  // Nov 8: Interpolated (no chat data found)
  {
    timestamp: '2025-11-08T12:00:00Z',
    level: 7,
    source: 'medical_record',
    markers: ['interpolated', 'recovery_phase'],
    context: 'Interpolated - recovery phase after Nov 4 crisis, before Nov 9 Chronicle tracking (confidence: low - no direct evidence)'
  },
  
  // Nov 9: Chronicle tracking begins (detailed session data available)
  {
    timestamp: '2025-11-09T13:12:00Z',
    level: 6,
    source: 'llm_pattern',
    markers: ['testing_chronicle', 'system_validation', 'mcp_setup'],
    context: 'Chronicle MCP working after WORKSPACE_ROOT fix - systematic tracking begins'
  },
  {
    timestamp: '2025-11-09T16:00:00Z',
    level: 7,
    source: 'llm_pattern',
    markers: ['taper_formula_creation', 'garmin_integration_planning', 'demo_preparation'],
    context: 'Building taper calculator + demo strategy for Friday meeting with Pia & Tor'
  },
  {
    timestamp: '2025-11-09T16:44:00Z',
    level: 8,
    source: 'llm_pattern',
    markers: ['cognitive_load_detected', 'spelling_errors_15plus', 'medication_confusion'],
    context: 'HIGH COGNITIVE LOAD: 15+ spelling errors, medication confusion (lithium AM/PM, zopiclone safety)'
  },
  {
    timestamp: '2025-11-09T17:00:00Z',
    level: 8,
    source: 'llm_pattern',
    markers: ['fixation_loops', 'garmin_data_repeated_5x', 'scope_expansion'],
    context: 'Fixated on Garmin integration - mentioned "data" + "garmin" 5x in 17min window'
  },
  {
    timestamp: '2025-11-09T17:18:00Z',
    level: 9,
    source: 'llm_pattern',
    markers: ['cognitive_overload_critical_85', 'regulation_suggested', 'break_taken'],
    context: 'COGNITIVE OVERLOAD 85/100 - LLM suggested break, user accepted ("ok, back in 15")'
  },
  {
    timestamp: '2025-11-09T17:52:00Z',
    level: 8,
    source: 'llm_pattern',
    markers: ['escalation_detected', 'new_project_proposal', 'scope_expansion_after_done'],
    context: 'ESCALATION: Proposed narrative work after session "done" - classic unable-to-stop pattern'
  },
  {
    timestamp: '2025-11-09T18:03:00Z',
    level: 7,
    source: 'llm_pattern',
    markers: ['regulation_accepted', 'context_feedback_critical', 'trust_building'],
    context: 'BREAKTHROUGH: User gave critical feedback - pattern detection GOOD, but recommendations BAD (already showered 5x)'
  },
  
  // Nov 10: Demo preparation day
  {
    timestamp: '2025-11-10T08:27:00Z',
    level: 6,
    source: 'self_report',
    markers: ['hospital_visit', 'pill_bottle_research', 'sensor_acquisition'],
    context: 'At hospital reception - looking for pill bottle research group, met with team'
  },
  {
    timestamp: '2025-11-10T12:24:00Z',
    level: 7,
    source: 'self_report',
    markers: ['hardware_ordering', 'strategic_pivots', 'diy_approach'],
    context: 'Bought RPi4 + Zigbee + Sonoff buttons (avoiding Alexa/Google - full DIY control)'
  },
  {
    timestamp: '2025-11-10T15:04:00Z',
    level: 7,
    source: 'self_report',
    markers: ['hardware_ordered', 'partnership_exploration', 'tobiaz_recruited'],
    context: 'Hardware ordered (arrive Tuesday), Tobiaz recruited for enclosure design, Erik (m.nu founder→psych doc) contacted'
  },
  {
    timestamp: '2025-11-10T22:53:00Z',
    level: 5,
    source: 'self_report',
    markers: ['medication_taken', 'sleep_preparation', 'evening_routine'],
    context: 'Took sleeping, antipsychotic and stabilizing pills'
  },
  
  // Nov 11: Pattern detection complete
  {
    timestamp: '2025-11-11T17:11:00Z',
    level: 6,
    source: 'llm_pattern',
    markers: ['hypomania_pattern_detection', 'chronicle_validation', 'demo_ready'],
    context: 'Built zero-cost hypomania pattern detector - found 38 patterns in Nov 9-10, cross-validated Chronicle vs chat'
  },
  
  // Nov 12: Master plan session (from chat analysis)
  {
    timestamp: '2025-11-12T10:00:00Z',
    level: 6,
    source: 'llm_pattern',
    markers: ['strategic_planning', 'medical_demo_planning', 'friday_preparation'],
    context: 'Master plan session: medical demo architecture, CIC agents design, debates-as-missions framework (confidence: high - comprehensive planning session)'
  },
  
  // Nov 13: Current status (Friday demo day)
  {
    timestamp: '2025-11-13T19:26:00Z',
    level: 5,
    source: 'self_report',
    markers: ['timeline_extraction', 'chronicle_reconstruction', 'oct3_baseline_documented'],
    context: 'Extracting Chronicle data for Oct 3 onwards - documenting 15mg olanzapine regimen timeline'
  },
];

export const octoberNovember2025MedicationLogs: MedicationLog[] = [
  // Oct 3: Regimen started (15mg evening dose)
  {
    timestamp: '2025-10-03T20:00:00Z',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 15,
    taken: true,
    method: 'manual',
    notes: 'Started 15mg evening dose per medical plan with Pia'
  },
  
  // Nov 1-3: Daily 15mg olanzapine (baseline regimen)
  {
    timestamp: '2025-11-01T22:00:00Z',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 15,
    taken: true,
    method: 'manual',
    notes: 'Daily baseline dose'
  },
  {
    timestamp: '2025-11-02T22:00:00Z',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 15,
    taken: true,
    method: 'manual',
    notes: 'Daily baseline dose'
  },
  {
    timestamp: '2025-11-03T22:00:00Z',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 15,
    taken: true,
    method: 'manual',
    notes: 'Daily baseline dose'
  },
  
  // Nov 4: Crisis dose (20mg acute intervention)
  {
    timestamp: '2025-11-04T17:55:00Z',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 20,
    taken: true,
    method: 'manual',
    notes: 'ACUTE: 20mg prescribed by Team 6 during crisis intervention call - near psychosis episode'
  },
  
  // Nov 5-9: Daily 15mg olanzapine (return to baseline)
  {
    timestamp: '2025-11-05T22:00:00Z',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 15,
    taken: true,
    method: 'manual',
    notes: 'Daily baseline dose'
  },
  {
    timestamp: '2025-11-06T22:00:00Z',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 15,
    taken: true,
    method: 'manual',
    notes: 'Daily baseline dose'
  },
  {
    timestamp: '2025-11-07T22:00:00Z',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 15,
    taken: true,
    method: 'manual',
    notes: 'Daily baseline dose'
  },
  {
    timestamp: '2025-11-08T22:00:00Z',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 15,
    taken: true,
    method: 'manual',
    notes: 'Daily baseline dose'
  },
  {
    timestamp: '2025-11-09T22:00:00Z',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 15,
    taken: true,
    method: 'manual',
    notes: 'Daily baseline dose'
  },
  
  // Nov 10: Evening medication
  {
    timestamp: '2025-11-10T22:53:00Z',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 15,
    taken: true,
    method: 'manual',
    notes: 'Sleeping, antipsychotic and stabilizing pills taken'
  },
  
  // Nov 11-13: Daily 15mg olanzapine
  {
    timestamp: '2025-11-11T22:00:00Z',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 15,
    taken: true,
    method: 'manual',
    notes: 'Daily baseline dose'
  },
  {
    timestamp: '2025-11-12T22:00:00Z',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 15,
    taken: true,
    method: 'manual',
    notes: 'Daily baseline dose'
  },
  {
    timestamp: '2025-11-13T22:00:00Z',
    medicationId: 'olanzapin',
    medicationName: 'Olanzapin',
    dosageMg: 15,
    taken: true,
    method: 'manual',
    notes: 'Daily baseline dose'
  },
  
  // Lithium maintenance (ongoing) - example entries
  {
    timestamp: '2025-11-04T08:00:00Z',
    medicationId: 'lithium',
    medicationName: 'Litium',
    dosageMg: 300,
    taken: false, // Patient unsure if taken
    method: 'manual',
    notes: 'Morning dose - patient reports uncertainty if taken'
  },
];

export const octoberNovember2025FamilyObservations: FamilyObservation[] = [
  // Nov 2-3: Weekend SNOOP-BOOP test
  {
    timestamp: '2025-11-03T10:00:00Z',
    observer: 'Eva & Roger',
    observation: 'Sam "upp i varv" during weekend visit',
    behavior: 'Increased energy, hypomanic markers observed',
    context: 'Parents used SNOOP-BOOP-like communication strategy to test cognitive stability',
    concernLevel: 7
  },
  {
    timestamp: '2025-11-03T14:00:00Z',
    observer: 'Eva & Roger',
    observation: 'Contacted Team 6 after weekend observations',
    behavior: 'Parental concern about medication compliance and stability',
    context: 'Wanted to verify Sam taking medication correctly and following treatment plan',
    concernLevel: 8
  },
  
  // Nov 9: Context feedback
  {
    timestamp: '2025-11-09T18:03:00Z',
    observer: 'Sam (self-observation)',
    observation: 'Already showered 5x today - skin not liking it',
    behavior: 'Compulsive showering pattern, LLM recommendation missed context',
    context: 'Critical feedback: Pattern detection works BUT needs context tracking for trust',
    concernLevel: 6
  },
];

export const octoberNovember2025TherapeuticSessions: TherapeuticSession[] = [
  // Nov 4: Two medical contacts
  {
    timestamp: '2025-11-04T11:04:00Z',
    type: 'routine-checkin',
    participants: ['Team6-nurse'],
    focus: 'Callback after Nov 3 phone system failures - parental concern follow-up',
    duration_minutes: 10,
    effectiveness: 'unclear',
    notes: 'During Dyno strategy meeting - privacy compromised. Exact content unknown.'
  },
  {
    timestamp: '2025-11-04T17:55:00Z',
    type: 'crisis-intervention',
    participants: ['Team6-nurse'],
    focus: 'Near psychosis episode - recursive philosophical self-analysis',
    duration_minutes: 14,
    effectiveness: 'communication-breakdown',
    notes: '14-minute recursive loop: "Du borde sova" + "Ta rätt dos" → both very confused. Olanzapin 20mg prescribed.'
  },
];

// Summary statistics for Oct-Nov 2025 vs June 2025
export const octoberNovember2025Summary = {
  timeline: {
    start_date: '2025-10-03',
    end_date: '2025-11-13',
    duration_days: 41,
    type: 'ongoing-regulation' // vs June's 'acute-crisis'
  },
  medication: {
    baseline_dose: '15mg olanzapin evening',
    acute_dose: '20mg olanzapin (Nov 4)',
    lithium_maintenance: 'ongoing (900mg daily)',
    compliance_concerns: [
      'Patient uncertainty about lithium timing (AM/PM)',
      'Reports lithium has "no effect"',
      'Zopiclone consecutive-day warnings needed'
    ]
  },
  activation: {
    baseline: 5, // With medication
    peak: 10, // Nov 4 near-psychosis
    average: 6.5,
    regulation_success: '56%', // 10 accepted / 18 total regulation attempts (Nov 9)
  },
  key_insights: [
    '15mg olanzapine regimen provides baseline stabilization (level 5-6 vs historical 7-8)',
    'Medical system barriers (phone system, care plan access) create additional stress',
    'LLM regulation works WITH context memory (Lumens), fails WITHOUT (bureaucratic mode)',
    'Context tracking CRITICAL for trust - pattern detection alone insufficient',
    'Nov 4 crisis shows even with medication, acute episodes can occur (20mg intervention needed)',
    'Chronicle MCP tracking from Nov 9 enables objective pattern detection (38 patterns found)'
  ],
  comparison_june_2025: {
    duration: '41 days vs 6 days (ongoing regulation vs acute crisis)',
    baseline_level: '5-6 vs 8-9 (medication effect)',
    peak_level: '10 vs 9 (both near-psychosis but different contexts)',
    intervention: 'Crisis dose 20mg vs Initial prescription',
    recovery: 'Ongoing with baseline medication vs 57-71% shorter episode',
    family_role: 'Proactive monitoring (SNOOP-BOOP test) vs Reactive support',
    system_tracking: 'Chronicle MCP from Nov 9 vs Manual reconstruction'
  }
};

