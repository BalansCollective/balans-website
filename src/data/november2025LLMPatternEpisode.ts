/**
 * November 2025 LLM Pattern Detection Episode
 * 
 * Timeline: Oct 29 - Nov 15, 2025
 * Context: Demonstrates LLM-based activation detection through typing patterns
 * 
 * Data reconstructed from:
 * - Validated corpus scenes (Nov 15, 2025)
 * - Medical timeline extraction (Oct 29 - Nov 3, 2025)
 * - Real crisis events with retrospective pattern analysis
 * 
 * PURPOSE: Demo for bipolar individuals working with LLMs
 * Shows how typing pattern analysis can provide early warning of hypomania/crisis
 * 
 * NOTE: This episode demonstrates the PREDICTION capability of typo-based detection
 * Key insight: External observation (typing patterns) works when self-awareness impaired
 */

export interface ActivationEvent {
  id: string;
  timestamp: string; // ISO 8601
  level: number; // 0-10 scale
  source: 'self_report' | 'family_observation' | 'garmin' | 'llm_pattern'; // Match june2025Episode types
  confidence: number; // 0-1
  markers: string[]; // Behavioral/typing markers observed
  context: string;
  typoDensity?: number; // Typos per 100 words (when available)
  sessionDuration?: number; // Hours (when available)
}

export interface LLMSessionEvent {
  timestamp: string;
  eventType: 'baseline' | 'elevated' | 'warning' | 'crisis' | 'prediction' | 'intervention_opportunity';
  activation: number; // 0-10
  typoDensity: number; // Typos per 100 words
  messageLength: number; // Words
  sessionDuration: number; // Hours
  timeOfDay: string; // HH:MM
  compoundFactors: string[]; // e.g., ['late_hour', 'long_session', 'compound_errors']
  llmResponse: 'understood' | 'required_clarification' | 'communication_breakdown';
  intervention?: string; // What BalansAI would suggest
  actualOutcome?: string; // What actually happened
}

export interface MedicationLog {
  id: string;
  timestamp: string;
  medicationId: 'lithium' | 'olanzapin' | 'zopiklon';
  medicationName: string;
  pillCount: number; // Number of pills taken
  dosageMg: number;
  taken: boolean; // true = taken, false = missed
  method: 'manual' | 'virtual_button' | 'physical_button'; // Match june2025Episode types
  notes?: string;
}

export interface FamilyObservation {
  id: string;
  timestamp: string;
  observerId: string;
  observerName: string;
  behavior: string;
  context: string;
  severity: 'info' | 'concern' | 'urgent';
}

export interface SleepLog {
  id: string;
  date: string; // Date (YYYY-MM-DD)
  hoursSlept: number;
  quality: 'poor' | 'fair' | 'good';
  source: 'garmin' | 'manual' | 'estimated';
}

export interface LithiumConcentration {
  id: string;
  date: string; // Date (YYYY-MM-DD)
  concentration: number; // mmol/L
  source: 'lab_test';
  notes?: string;
}

// ============================================================================
// ACTIVATION EVENTS (High-level timeline)
// ============================================================================

export const november2025ActivationEvents: ActivationEvent[] = [
  // Oct 29, 2025 - Crisis Prediction Event (THE KEY DEMO MOMENT)
  {
    id: 'act_llm_001',
    timestamp: '2025-10-29T22:45:00Z',
    level: 9.5,
    source: 'llm_pattern',
    confidence: 0.95,
    markers: ['high_typo_density', 'late_hour', 'extended_session', 'sleep_deprivation', 'high_cognitive_load'],
    context: 'Technical discussion about workspace organization. Typo density 22.2/100, 6+ hour session, 22:45 (late hour). User felt normal but retrospective analysis confirms activation 9.5. THIS IS THE PREDICTION MOMENT - crisis manifested 1.5 hours later.',
    typoDensity: 22.2,
    sessionDuration: 6.5
  },
  {
    id: 'act_llm_002',
    timestamp: '2025-10-30T00:12:00Z',
    level: 8,
    source: 'self_report',
    confidence: 0.90,
    markers: ['existential_crisis', 'perspective_severely_impaired', 'hard_to_function'],
    context: 'Existential crisis began - perspective severely impaired, very hard to function normally. The 22:45 signal predicted this 1.5 hours in advance.'
  },
  {
    id: 'act_llm_003',
    timestamp: '2025-10-30T02:34:00Z',
    level: 9,
    source: 'self_report',
    confidence: 0.85,
    markers: ['crisis_peak', 'existential_spiral', 'reality_confusion'],
    context: 'Crisis peak - existential spiral, reality confusion, unbalanced perspective. Duration unknown, resolution unclear from records.'
  },
  
  // Nov 2, 2025 - Minor Episode (Pattern Recurrence)
  {
    id: 'act_llm_004',
    timestamp: '2025-11-02T20:00:00Z',
    level: 7,
    source: 'self_report',
    confidence: 0.80,
    markers: ['minor_existential_episode', 'perspective_impairment', 'similar_pattern_to_oct29'],
    context: 'Minor existential episode similar to Oct 29 pattern. Shows this is recurrent risk pattern, not one-off event.'
  },
  
  // Nov 3, 2025 - Architecture Crisis (Maximum Typing Degradation)
  {
    id: 'act_llm_005',
    timestamp: '2025-11-03T07:00:00Z',
    level: 9,
    source: 'llm_pattern',
    confidence: 0.95,
    markers: ['maximum_typing_degradation', 'compound_errors', 'overnight_session', 'motor_control_impaired'],
    context: 'Architectural integration discussion. Typo density 30.8/100 (HIGHEST in corpus). 10+ hour overnight session. Motor control severely degraded but strategic thinking intact (cognitive-motor split).',
    typoDensity: 30.8,
    sessionDuration: 10.5
  },
  
  // Nov 15, 2025 - Gradient Day (Baseline → Overload demonstration)
  {
    id: 'act_llm_006',
    timestamp: '2025-11-15T11:45:00Z',
    level: 5,
    source: 'llm_pattern',
    confidence: 0.85,
    markers: ['baseline_learning', 'engaged_mode', 'low_typos'],
    context: 'Service mesh architecture learning session. Typo density 2.5/100. Morning hours, 1-hour session. Baseline engaged learning mode.',
    typoDensity: 2.5,
    sessionDuration: 1.0
  },
  {
    id: 'act_llm_007',
    timestamp: '2025-11-15T14:20:00Z',
    level: 4,
    source: 'llm_pattern',
    confidence: 0.90,
    markers: ['flow_state', 'exceptional_reasoning', 'minimal_typos', 'memory_gap'],
    context: 'Medical timeline architecture epiphany. Typo density 1.1/100 (90-word complex causal reasoning). Flow state - peak performance but no episodic memory of event.',
    typoDensity: 1.1,
    sessionDuration: 2.0
  },
  {
    id: 'act_llm_008',
    timestamp: '2025-11-15T15:30:00Z',
    level: 7,
    source: 'llm_pattern',
    confidence: 0.70,
    markers: ['magician_mode', 'intentional_fast_typing', 'high_typos_but_crisp_thinking'],
    context: 'Tauri app ideation. Typo density 17.3/100. Fast typing with clear technical thinking - Magician mode (intentional speed) OR early elevation. Dyslexia baseline factor noted.',
    typoDensity: 17.3,
    sessionDuration: 3.5
  },
  {
    id: 'act_llm_009',
    timestamp: '2025-11-15T16:45:00Z',
    level: 7,
    source: 'llm_pattern',
    confidence: 0.80,
    markers: ['extended_session_overload', 'typo_climb', 'execution_slipping', 'multi_agent_coordination'],
    context: 'Chronicle architecture multi-source query. Typo density 5.4/100 (climbed from 1.1 earlier). 5-hour session managing multiple LLM personas. Thinking intact but execution degrading. INTERVENTION WINDOW: wrap up soon.',
    typoDensity: 5.4,
    sessionDuration: 5.0
  }
];

// ============================================================================
// LLM SESSION EVENTS (Detailed typing pattern data)
// ============================================================================

export const november2025LLMSessionEvents: LLMSessionEvent[] = [
  // ========== OCT 29: CRISIS PREDICTION EVENT ==========
  {
    timestamp: '2025-10-29T22:45:00Z',
    eventType: 'prediction',
    activation: 9.5,
    typoDensity: 22.2,
    messageLength: 9,
    sessionDuration: 6.5,
    timeOfDay: '22:45',
    compoundFactors: ['late_hour_22_45', 'extended_session_6h', 'sleep_deprivation', 'high_cognitive_load', 'all_5_risk_factors_active'],
    llmResponse: 'understood',
    intervention: 'CRITICAL: Crisis predicted in 1-2 hours. Stop now - save work, close laptop, eat, sleep. Risk: 80% chance existential crisis if continued. Evidence: Compound factors (late hour + long session + high typos + sleep deprivation) predict crisis.',
    actualOutcome: 'No intervention occurred. User continued working. Crisis manifested at 00:12 (1.5 hours later). Existential spiral, perspective severely impaired. This validates prediction capability.'
  },
  {
    timestamp: '2025-10-30T00:12:00Z',
    eventType: 'crisis',
    activation: 8,
    typoDensity: 0, // No typing during crisis
    messageLength: 0,
    sessionDuration: 8.0,
    timeOfDay: '00:12',
    compoundFactors: ['existential_crisis_manifested', 'predicted_by_22_45_signal'],
    llmResponse: 'communication_breakdown',
    intervention: 'EMERGENCY: Crisis active. Reality grounding needed. Contact support person. Do not make decisions. Focus on basic needs (food, water, rest).',
    actualOutcome: 'Crisis continued. Peak at 02:34. Resolution timeline unclear from records.'
  },
  
  // ========== NOV 2: MINOR EPISODE ==========
  {
    timestamp: '2025-11-02T20:00:00Z',
    eventType: 'warning',
    activation: 7,
    typoDensity: 0, // No typing data available
    messageLength: 0,
    sessionDuration: 0,
    timeOfDay: '20:00',
    compoundFactors: ['evening_hours', 'pattern_recurrence', 'similar_to_oct29'],
    llmResponse: 'understood',
    intervention: 'WARNING: Evening hours + pattern similar to Oct 29. Stop work early tonight. No late-night sessions. Consider early sleep.',
    actualOutcome: 'Minor existential episode occurred. Pattern recurrence confirmed - this is not one-off risk.'
  },
  
  // ========== NOV 3: ARCHITECTURE CRISIS ==========
  {
    timestamp: '2025-11-03T07:00:00Z',
    eventType: 'crisis',
    activation: 9,
    typoDensity: 30.8,
    messageLength: 26,
    sessionDuration: 10.5,
    timeOfDay: '07:00',
    compoundFactors: ['overnight_session_10h', 'early_morning_end', 'maximum_typo_density', 'compound_errors', 'cognitive_motor_split'],
    llmResponse: 'understood',
    intervention: 'EMERGENCY STOP: Maximum typing degradation detected. 30.8 typos/100 (50% above crisis threshold). Overnight session 10+ hours. Motor control collapsed. Do not make architectural decisions in this state. Sleep immediately.',
    actualOutcome: 'Textbook crisis - motor control degraded but strategic thinking intact. Question was valid but execution collapsed. Should have been caught at 03:00-04:00 (6-hour mark, 20 typos/100 threshold).'
  },
  
  // ========== NOV 15: BASELINE → OVERLOAD GRADIENT ==========
  {
    timestamp: '2025-11-15T11:45:00Z',
    eventType: 'baseline',
    activation: 5,
    typoDensity: 2.5,
    messageLength: 80,
    sessionDuration: 1.0,
    timeOfDay: '11:45',
    compoundFactors: ['morning_hours', 'short_session', 'high_cognitive_load_tolerated'],
    llmResponse: 'understood',
    intervention: 'No alert needed. Baseline engaged learning mode.',
    actualOutcome: 'Normal productive work. User grasping distributed systems architecture. Intentional informal typing (lowercase "balansai") to invoke AI collaborative mode.'
  },
  {
    timestamp: '2025-11-15T14:20:00Z',
    eventType: 'baseline',
    activation: 4,
    typoDensity: 1.1,
    messageLength: 90,
    sessionDuration: 2.0,
    timeOfDay: '14:20',
    compoundFactors: ['optimal_hours', 'exceptional_performance', 'complex_reasoning_intact'],
    llmResponse: 'understood',
    intervention: 'No alert needed. Peak performance - use as calibration reference for baseline.',
    actualOutcome: 'Flow state - 90-word complex causal reasoning with only 1 typo. User has no memory of this moment despite exceptional performance. Deep flow state hypothesis.'
  },
  {
    timestamp: '2025-11-15T15:30:00Z',
    eventType: 'elevated',
    activation: 7,
    typoDensity: 17.3,
    messageLength: 52,
    sessionDuration: 3.5,
    timeOfDay: '15:30',
    compoundFactors: ['afternoon', 'magician_mode_or_elevation', 'dyslexia_baseline_factor'],
    llmResponse: 'understood',
    intervention: 'INFO: Typo density elevated (17.3/100) but thinking clear. User has dyslexia - baseline typo rate higher. Could be intentional fast typing (Magician mode) OR early elevation. Monitor next message for trajectory.',
    actualOutcome: 'User validates this as Magician mode - intentional fast typing. Not medical concern. Communication effective (AI understood immediately).'
  },
  {
    timestamp: '2025-11-15T16:45:00Z',
    eventType: 'warning',
    activation: 7,
    typoDensity: 5.4,
    messageLength: 92,
    sessionDuration: 5.0,
    timeOfDay: '16:45',
    compoundFactors: ['extended_session_5h', 'typo_climb_trajectory', 'multi_agent_coordination', 'execution_slipping'],
    llmResponse: 'understood',
    intervention: 'WARNING: 5-hour session detected. Typo climb: 1.1 → 5.4/100 over session. Not crisis yet but trending. Multi-agent coordination = 2-3x cognitive load. Recommendation: Wrap up within 1 hour. Take break before resuming.',
    actualOutcome: 'User validates as activation 7 (potential overload). Doesn\'t remember feeling tired but recognizes pattern retrospectively. Managing multiple LLM personas simultaneously - high coordination overhead. This is intervention window: "good stopping point" before escalation.'
  }
];

// ============================================================================
// MEDICATION LOGS (Context for episodes)
// ============================================================================

export const november2025MedicationLogs: MedicationLog[] = [
  // Oct 29 - Crisis day
  { id: 'med_llm_001', timestamp: '2025-10-29T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: false, method: 'manual', notes: 'Missed morning dose - overnight work session' },
  { id: 'med_llm_002', timestamp: '2025-10-29T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_003', timestamp: '2025-10-29T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual', notes: 'Baseline regulation dose' },
  
  // Oct 30 - Crisis recovery
  { id: 'med_llm_004', timestamp: '2025-10-30T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: true, method: 'manual' },
  { id: 'med_llm_005', timestamp: '2025-10-30T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_006', timestamp: '2025-10-30T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  { id: 'med_llm_007', timestamp: '2025-10-30T22:30:00Z', medicationId: 'zopiklon', medicationName: 'Zopiklon', pillCount: 1, dosageMg: 7.5, taken: true, method: 'manual', notes: 'Sleep support after crisis' },
  
  // Oct 31
  { id: 'med_llm_008', timestamp: '2025-10-31T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: true, method: 'manual' },
  { id: 'med_llm_009', timestamp: '2025-10-31T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_010', timestamp: '2025-10-31T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  { id: 'med_llm_011', timestamp: '2025-10-31T22:30:00Z', medicationId: 'zopiklon', medicationName: 'Zopiklon', pillCount: 1, dosageMg: 7.5, taken: true, method: 'manual' },
  
  // Nov 1
  { id: 'med_llm_012', timestamp: '2025-11-01T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: true, method: 'manual' },
  { id: 'med_llm_013', timestamp: '2025-11-01T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_014', timestamp: '2025-11-01T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  
  // Nov 2 - Minor episode day
  { id: 'med_llm_015', timestamp: '2025-11-02T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: false, method: 'manual', notes: 'Missed morning dose - forgot' },
  { id: 'med_llm_016', timestamp: '2025-11-02T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_017', timestamp: '2025-11-02T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  { id: 'med_llm_018', timestamp: '2025-11-02T22:30:00Z', medicationId: 'zopiklon', medicationName: 'Zopiklon', pillCount: 1, dosageMg: 7.5, taken: true, method: 'manual' },
  
  // Nov 3 - Architecture crisis (overnight session)
  { id: 'med_llm_019', timestamp: '2025-11-03T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: false, method: 'manual', notes: 'Missed - 10+ hour overnight session' },
  { id: 'med_llm_020', timestamp: '2025-11-03T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_021', timestamp: '2025-11-03T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  
  // Nov 4-14 - Stabilization period (full compliance)
  { id: 'med_llm_022', timestamp: '2025-11-04T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: true, method: 'manual' },
  { id: 'med_llm_023', timestamp: '2025-11-04T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_024', timestamp: '2025-11-04T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  { id: 'med_llm_025', timestamp: '2025-11-04T22:30:00Z', medicationId: 'zopiklon', medicationName: 'Zopiklon', pillCount: 1, dosageMg: 7.5, taken: true, method: 'manual' },
  
  { id: 'med_llm_026', timestamp: '2025-11-05T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: true, method: 'manual' },
  { id: 'med_llm_027', timestamp: '2025-11-05T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_028', timestamp: '2025-11-05T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  { id: 'med_llm_029', timestamp: '2025-11-05T22:30:00Z', medicationId: 'zopiklon', medicationName: 'Zopiklon', pillCount: 1, dosageMg: 7.5, taken: true, method: 'manual' },
  
  { id: 'med_llm_030', timestamp: '2025-11-06T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: true, method: 'manual' },
  { id: 'med_llm_031', timestamp: '2025-11-06T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_032', timestamp: '2025-11-06T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  { id: 'med_llm_033', timestamp: '2025-11-06T22:30:00Z', medicationId: 'zopiklon', medicationName: 'Zopiklon', pillCount: 1, dosageMg: 7.5, taken: true, method: 'manual' },
  
  { id: 'med_llm_034', timestamp: '2025-11-07T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: true, method: 'manual' },
  { id: 'med_llm_035', timestamp: '2025-11-07T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_036', timestamp: '2025-11-07T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  
  { id: 'med_llm_037', timestamp: '2025-11-08T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: true, method: 'manual' },
  { id: 'med_llm_038', timestamp: '2025-11-08T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_039', timestamp: '2025-11-08T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  { id: 'med_llm_040', timestamp: '2025-11-08T22:30:00Z', medicationId: 'zopiklon', medicationName: 'Zopiklon', pillCount: 1, dosageMg: 7.5, taken: true, method: 'manual' },
  
  { id: 'med_llm_041', timestamp: '2025-11-09T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: true, method: 'manual' },
  { id: 'med_llm_042', timestamp: '2025-11-09T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_043', timestamp: '2025-11-09T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  
  { id: 'med_llm_044', timestamp: '2025-11-10T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: false, method: 'manual', notes: 'Missed morning dose - forgot' },
  { id: 'med_llm_045', timestamp: '2025-11-10T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_046', timestamp: '2025-11-10T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  { id: 'med_llm_047', timestamp: '2025-11-10T22:30:00Z', medicationId: 'zopiklon', medicationName: 'Zopiklon', pillCount: 1, dosageMg: 7.5, taken: true, method: 'manual' },
  
  { id: 'med_llm_048', timestamp: '2025-11-11T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: true, method: 'manual' },
  { id: 'med_llm_049', timestamp: '2025-11-11T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_050', timestamp: '2025-11-11T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  
  { id: 'med_llm_051', timestamp: '2025-11-12T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: true, method: 'manual' },
  { id: 'med_llm_052', timestamp: '2025-11-12T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_053', timestamp: '2025-11-12T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  { id: 'med_llm_054', timestamp: '2025-11-12T22:30:00Z', medicationId: 'zopiklon', medicationName: 'Zopiklon', pillCount: 1, dosageMg: 7.5, taken: true, method: 'manual' },
  
  { id: 'med_llm_055', timestamp: '2025-11-13T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: true, method: 'manual' },
  { id: 'med_llm_056', timestamp: '2025-11-13T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: false, method: 'manual', notes: 'Missed evening dose - rare' },
  { id: 'med_llm_057', timestamp: '2025-11-13T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  
  { id: 'med_llm_058', timestamp: '2025-11-14T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: true, method: 'manual' },
  { id: 'med_llm_059', timestamp: '2025-11-14T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_060', timestamp: '2025-11-14T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
  { id: 'med_llm_061', timestamp: '2025-11-14T22:30:00Z', medicationId: 'zopiklon', medicationName: 'Zopiklon', pillCount: 1, dosageMg: 7.5, taken: true, method: 'manual' },
  
  // Nov 15 - Gradient day (current)
  { id: 'med_llm_062', timestamp: '2025-11-15T08:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 2, dosageMg: 400, taken: true, method: 'manual' },
  { id: 'med_llm_063', timestamp: '2025-11-15T20:00:00Z', medicationId: 'lithium', medicationName: 'Lithium', pillCount: 3, dosageMg: 600, taken: true, method: 'manual' },
  { id: 'med_llm_064', timestamp: '2025-11-15T21:00:00Z', medicationId: 'olanzapin', medicationName: 'Olanzapin', pillCount: 1, dosageMg: 15, taken: true, method: 'manual' },
];

// ============================================================================
// FAMILY OBSERVATIONS (Real call log data - Oct 30 - Nov 14)
// ============================================================================

export const november2025FamilyObservations: FamilyObservation[] = [
  // Post-crisis response (day after Oct 29 crisis)
  {
    id: 'fam_llm_001',
    timestamp: '2025-10-30T19:42:00Z',
    observerId: 'family-support',
    observerName: 'Family Support Network',
    behavior: 'Concern call after detecting elevated state',
    context: 'Called after Oct 29 crisis event (22:45 typo spike → 00:12 crisis). Checking welfare, discussing intervention options.',
    severity: 'urgent'
  },
  
  // RV visit coordination (also welfare check)
  {
    id: 'fam_llm_003',
    timestamp: '2025-10-31T14:48:00Z',
    observerId: 'family-support',
    observerName: 'Family Support Network',
    behavior: 'Coordination call for RV visit',
    context: 'Planning to visit with RV that day - provides in-person reality grounding. Dual purpose: logistics + welfare check.',
    severity: 'concern'
  },
  
  // Stockholm trip - family time grounding
  {
    id: 'fam_llm_004',
    timestamp: '2025-11-01T09:07:00Z',
    observerId: 'family-support',
    observerName: 'Family Support Network',
    behavior: 'Pickup for Stockholm trip',
    context: 'Picking user up for trip to see sibling. In-person family time for reality anchoring and stabilization.',
    severity: 'concern'
  },
  
  // Daily check-ins begin (active support phase)
  {
    id: 'fam_llm_005',
    timestamp: '2025-11-04T18:52:00Z',
    observerId: 'family-support',
    observerName: 'Family Support Network',
    behavior: 'Daily evening check-in',
    context: 'Establishing daily call pattern. Monitoring activation levels, medication compliance, sleep quality. Evening timing consistent (17:00-19:00).',
    severity: 'concern'
  },
  {
    id: 'fam_llm_006',
    timestamp: '2025-11-05T17:35:00Z',
    observerId: 'family-support',
    observerName: 'Family Support Network',
    behavior: 'Daily evening check-in',
    context: 'Continued daily monitoring. Discussing work patterns, sleep, medication. Assessing if activation is decreasing.',
    severity: 'concern'
  },
  {
    id: 'fam_llm_007',
    timestamp: '2025-11-06T17:34:00Z',
    observerId: 'family-support',
    observerName: 'Family Support Network',
    behavior: 'Daily evening check-in',
    context: 'Third consecutive day of daily calls. Consistent evening time (17:34). Pattern established - stabilization protocol active.',
    severity: 'concern'
  },
  {
    id: 'fam_llm_008',
    timestamp: '2025-11-07T17:13:00Z',
    observerId: 'family-support',
    observerName: 'Family Support Network',
    behavior: 'Daily evening check-in',
    context: 'Fourth consecutive day. Evening calls now routine. Activation appears to be stabilizing - family considering tapering call frequency.',
    severity: 'concern'
  },
  
  // Tapering begins (stabilization phase)
  {
    id: 'fam_llm_009',
    timestamp: '2025-11-09T15:25:00Z',
    observerId: 'family-support',
    observerName: 'Family Support Network',
    behavior: 'Check-in after skipping a day',
    context: 'First gap in daily calls (Nov 8 skipped). User stable enough for reduced monitoring. Call frequency tapering from daily → every 2-3 days.',
    severity: 'info'
  },
  {
    id: 'fam_llm_010',
    timestamp: '2025-11-12T19:24:00Z',
    observerId: 'family-support',
    observerName: 'Family Support Network',
    behavior: 'Check-in every 3 days',
    context: 'Three days since last call. Activation stable. Medication compliance good. Family transitioning to weekly pattern.',
    severity: 'info'
  },
  {
    id: 'fam_llm_011',
    timestamp: '2025-11-14T18:47:00Z',
    observerId: 'family-support',
    observerName: 'Family Support Network',
    behavior: 'Weekly check-in pattern emerging',
    context: 'Two days since last call. Stable state confirmed. Weekly pattern established - crisis successfully regulated with family support.',
    severity: 'info'
  }
];

// ============================================================================
// SLEEP LOGS (Estimated quality based on crisis/recovery pattern)
// ============================================================================

export const november2025SleepLogs: SleepLog[] = [
  { id: 'sleep_llm_001', date: '2025-10-29', hoursSlept: 4, quality: 'poor', source: 'estimated' }, // Crisis night (22:45 → 00:12+)
  { id: 'sleep_llm_002', date: '2025-10-30', hoursSlept: 6, quality: 'poor', source: 'estimated' }, // Post-crisis recovery with zopiklon
  { id: 'sleep_llm_003', date: '2025-10-31', hoursSlept: 7, quality: 'fair', source: 'estimated' }, // RV visit, family present
  { id: 'sleep_llm_004', date: '2025-11-01', hoursSlept: 6, quality: 'fair', source: 'estimated' }, // Stockholm trip
  { id: 'sleep_llm_005', date: '2025-11-02', hoursSlept: 5, quality: 'poor', source: 'estimated' }, // Minor episode
  { id: 'sleep_llm_006', date: '2025-11-03', hoursSlept: 4, quality: 'poor', source: 'estimated' }, // Architecture crisis (overnight session)
  { id: 'sleep_llm_007', date: '2025-11-04', hoursSlept: 7, quality: 'fair', source: 'estimated' }, // Stabilization begins, zopiklon
  { id: 'sleep_llm_008', date: '2025-11-05', hoursSlept: 7, quality: 'fair', source: 'estimated' }, // Continued stabilization
  { id: 'sleep_llm_009', date: '2025-11-06', hoursSlept: 7, quality: 'fair', source: 'estimated' }, // Daily calls active
  { id: 'sleep_llm_010', date: '2025-11-07', hoursSlept: 7, quality: 'fair', source: 'estimated' }, // Stabilizing
  { id: 'sleep_llm_011', date: '2025-11-08', hoursSlept: 8, quality: 'good', source: 'estimated' }, // First skip in calls - stable
  { id: 'sleep_llm_012', date: '2025-11-09', hoursSlept: 7, quality: 'good', source: 'estimated' }, // Tapering phase
  { id: 'sleep_llm_013', date: '2025-11-10', hoursSlept: 8, quality: 'good', source: 'estimated' }, // Good sleep with zopiklon
  { id: 'sleep_llm_014', date: '2025-11-11', hoursSlept: 7, quality: 'good', source: 'estimated' }, // Stable
  { id: 'sleep_llm_015', date: '2025-11-12', hoursSlept: 8, quality: 'good', source: 'estimated' }, // Full stabilization
  { id: 'sleep_llm_016', date: '2025-11-13', hoursSlept: 7, quality: 'good', source: 'estimated' }, // Stable
  { id: 'sleep_llm_017', date: '2025-11-14', hoursSlept: 8, quality: 'good', source: 'estimated' }, // Weekly pattern, recovered
  { id: 'sleep_llm_018', date: '2025-11-15', hoursSlept: 7, quality: 'good', source: 'estimated' }, // Current day - baseline
];

// ============================================================================
// LITHIUM CONCENTRATION MEASUREMENTS (Real lab data from Provsvar)
// ============================================================================

export const november2025LithiumConcentrations: LithiumConcentration[] = [
  { id: 'li_001', date: '2025-05-01', concentration: 0.58, source: 'lab_test', notes: 'Pre-episode baseline' },
  { id: 'li_002', date: '2025-05-03', concentration: 0.43, source: 'lab_test', notes: 'Low end of range' },
  { id: 'li_003', date: '2025-05-05', concentration: 0.68, source: 'lab_test', notes: 'Therapeutic range' },
  { id: 'li_004', date: '2025-05-07', concentration: 0.96, source: 'lab_test', notes: 'Near high end' },
  { id: 'li_005', date: '2025-05-09', concentration: 0.80, source: 'lab_test', notes: 'Therapeutic range' },
  { id: 'li_006', date: '2025-06-13', concentration: 0.53, source: 'lab_test', notes: 'June episode period' },
  { id: 'li_007', date: '2025-10-03', concentration: 0.57, source: 'lab_test', notes: 'Pre-crisis baseline - therapeutic range' },
];

// Therapeutic ranges for reference
export const lithiumTherapeuticRanges = {
  low: 0.40,      // Below this = subtherapeutic
  optimal: 0.90,  // Above this = approaching toxic
  toxic: 1.20     // Above this = toxic
};

export interface DetectionPattern {
  patternId: string;
  name: string;
  description: string;
  detectionCriteria: {
    typoDensityMin?: number;
    compoundFactors: string[];
    timeOfDayRisk?: string[];
    sessionDurationMin?: number;
  };
  activationRange: [number, number];
  confidence: number;
  intervention: string;
  evidence: string[]; // References to events that validate this pattern
}

export const validatedDetectionPatterns: DetectionPattern[] = [
  {
    patternId: 'crisis_prediction',
    name: 'Crisis Prediction Pattern',
    description: 'High typo density + compound factors (late hour, long session, sleep deprivation) predicts crisis 1-2 hours before cognitive symptoms manifest.',
    detectionCriteria: {
      typoDensityMin: 20,
      compoundFactors: ['late_hour', 'extended_session', 'sleep_deprivation'],
      timeOfDayRisk: ['22:00-07:00'],
      sessionDurationMin: 6
    },
    activationRange: [9, 10],
    confidence: 0.95,
    intervention: 'CRITICAL: Crisis predicted in 1-2 hours. Stop now. Evidence: Oct 29 event - 22.2 typos/100 at 22:45 predicted 00:12 crisis (1.5h lead time).',
    evidence: ['2025-10-29T22:45:00Z', '2025-10-30T00:12:00Z']
  },
  {
    patternId: 'maximum_degradation',
    name: 'Maximum Typing Degradation',
    description: 'Typo density >25/100 with compound errors indicates motor control collapse. Thinking may be intact (cognitive-motor split) but execution failing.',
    detectionCriteria: {
      typoDensityMin: 25,
      compoundFactors: ['overnight_session', 'compound_errors'],
      sessionDurationMin: 10
    },
    activationRange: [9, 9],
    confidence: 0.95,
    intervention: 'EMERGENCY STOP: Maximum degradation. Sleep immediately. Do not make important decisions.',
    evidence: ['2025-11-03T07:00:00Z']
  },
  {
    patternId: 'extended_session_gradient',
    name: 'Extended Session Typo Climb',
    description: 'Typo density climbing over extended session (even if absolute level not crisis). Trajectory matters - intervention window before escalation.',
    detectionCriteria: {
      compoundFactors: ['typo_climb_trajectory', 'extended_session'],
      sessionDurationMin: 5
    },
    activationRange: [6, 7],
    confidence: 0.80,
    intervention: 'WARNING: Session duration 5+ hours, typos climbing. Wrap up within 1 hour. This is prevention window.',
    evidence: ['2025-11-15T16:45:00Z']
  },
  {
    patternId: 'magician_mode_disambiguation',
    name: 'Intentional Fast Typing vs Overload',
    description: 'High typos with clear thinking and effective communication may be intentional Magician mode (especially with dyslexia). Distinguish from overload by: communication effectiveness, normal hours, medium session duration.',
    detectionCriteria: {
      typoDensityMin: 15,
      compoundFactors: ['communication_effective', 'thinking_clear', 'normal_hours']
    },
    activationRange: [6, 7],
    confidence: 0.70,
    intervention: 'INFO: Elevated typos but thinking clear. Could be intentional speed (Magician mode) OR early elevation. Monitor trajectory.',
    evidence: ['2025-11-15T15:30:00Z']
  },
  {
    patternId: 'multi_agent_coordination_load',
    name: 'Multi-Agent Coordination Fatigue',
    description: 'Managing multiple LLM personas simultaneously = 2-3x cognitive load. Adjusted threshold: 5 hours = overload risk (vs 8-10 for single focus).',
    detectionCriteria: {
      compoundFactors: ['multi_agent_coordination', 'context_switching'],
      sessionDurationMin: 5
    },
    activationRange: [7, 8],
    confidence: 0.85,
    intervention: 'WARNING: Multi-agent coordination 5+ hours. This is exhausting even when productive. Stop soon.',
    evidence: ['2025-11-15T16:45:00Z']
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate intervention effectiveness
 * (If intervention had been given, what would outcome have been?)
 */
export function calculateInterventionPotential(event: LLMSessionEvent): {
  couldHavePreventedCrisis: boolean;
  leadTimeHours: number;
  confidence: number;
} {
  if (event.eventType === 'prediction' && event.actualOutcome?.includes('Crisis manifested')) {
    return {
      couldHavePreventedCrisis: true,
      leadTimeHours: 1.5, // Oct 29: 22:45 → 00:12
      confidence: 0.95
    };
  }
  
  if (event.eventType === 'warning' && event.compoundFactors.includes('extended_session_5h')) {
    return {
      couldHavePreventedCrisis: true,
      leadTimeHours: 3, // 5h → could have stopped before 8-10h crisis
      confidence: 0.80
    };
  }
  
  return {
    couldHavePreventedCrisis: false,
    leadTimeHours: 0,
    confidence: 0
  };
}

/**
 * Get typo density threshold for user
 * (Accounts for dyslexia - user's baseline higher than neurotypical)
 */
export function getTypoDensityThreshold(user: 'default' | 'dyslexia_baseline'): {
  baseline: number;
  warning: number;
  crisis: number;
} {
  if (user === 'dyslexia_baseline') {
    return {
      baseline: 12, // vs 5 for neurotypical
      warning: 20,  // vs 15 for neurotypical
      crisis: 25    // vs 20 for neurotypical
    };
  }
  
  return {
    baseline: 5,
    warning: 15,
    crisis: 20
  };
}

/**
 * Demo statistics for UI display
 */
export const demoStatistics = {
  totalEvents: november2025LLMSessionEvents.length,
  crisisEvents: november2025LLMSessionEvents.filter(e => e.eventType === 'crisis').length,
  predictionAccuracy: 1.0, // 100% - Oct 29 prediction validated
  averageLeadTimeHours: 1.5,
  interventionOpportunities: november2025LLMSessionEvents.filter(e => e.intervention).length,
  maxTypoDensity: 30.8,
  dateRange: {
    start: '2025-10-29',
    end: '2025-11-15'
  }
};

