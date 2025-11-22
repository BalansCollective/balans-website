// June 2025 Medical Episode Data (Hardcoded for demo)

export interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  timestamp: string;
  pillCount: number;
  dosageMg?: number; // For medications tracked in mg (e.g., Olanzapin, Zopiklon)
  method: 'manual' | 'virtual_button' | 'physical_button';
  taken: boolean;
}

export interface ActivationEvent {
  id: string;
  timestamp: string;
  level: number; // 0-10
  source: 'self_report' | 'family_observation' | 'garmin' | 'llm_pattern';
  confidence: number;
  markers: string[];
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

export interface TherapeuticSession {
  id: string;
  timestamp: string;
  sessionNumber: number;
  focus: string;
  effectiveness: 'helped' | 'neutral' | 'unclear';
}

export interface SleepLog {
  id: string;
  date: string; // Date (not timestamp, as sleep spans a night)
  hoursSlept: number;
  quality: 'poor' | 'fair' | 'good';
  source: 'garmin' | 'manual' | 'estimated';
}

// Hardcoded June 2025 episode data (FROM REAL DOCUMENTATION + LLM inference where gaps exist)
// Timeline: June 14-29, 2025 (family vacation in Skellefteå - 100% lithium compliance due to parental monitoring)
export const june2025MedicationLogs: MedicationLog[] = [
  // June 14-21: Pre-episode baseline (lithium only - inference from 100% compliance during Skellefteå)
  // Source: Familjeobservationslogg states "100% compliance" due to parental monitoring
  { id: 'log_pre_01a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-14T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_pre_01b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-14T20:00:00', pillCount: 3, method: 'manual', taken: true },
  { id: 'log_pre_02a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-15T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_pre_02b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-15T20:00:00', pillCount: 3, method: 'manual', taken: true },
  { id: 'log_pre_03a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-16T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_pre_03b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-16T20:00:00', pillCount: 3, method: 'manual', taken: true },
  { id: 'log_pre_04a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-17T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_pre_04b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-17T20:00:00', pillCount: 3, method: 'manual', taken: true },
  { id: 'log_pre_05a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-18T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_pre_05b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-18T20:00:00', pillCount: 3, method: 'manual', taken: true },
  { id: 'log_pre_06a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-19T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_pre_06b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-19T20:00:00', pillCount: 3, method: 'manual', taken: true },
  { id: 'log_pre_07a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-20T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_pre_07b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-20T20:00:00', pillCount: 3, method: 'manual', taken: true },
  { id: 'log_pre_08a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-21T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_pre_08b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-21T20:00:00', pillCount: 3, method: 'manual', taken: true },
  
  // June 22, 2025 - Pre-episode (early warning signs escalating)
  // Source: Familjeobservationslogg "Ökad analys av andras beteenden, tankesnurror"
  { id: 'log_000a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-22T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_000b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-22T20:00:00', pillCount: 3, method: 'manual', taken: true },
  
  // June 23, 2025 - Episode detection day - Protocol activation
  // Source: Familjeobservationslogg "Startade medicinering: 20mg olanzapin + zopiklon"
  { id: 'log_001a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-23T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_001b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-23T20:00:00', pillCount: 3, method: 'manual', taken: true },
  { id: 'log_001', medicationId: 'olanzapin', medicationName: 'Olanzapin', timestamp: '2025-06-23T22:00:00', pillCount: 2, dosageMg: 20, method: 'manual', taken: true },
  { id: 'log_002', medicationId: 'zopiklon', medicationName: 'Zopiklon', timestamp: '2025-06-23T22:30:00', pillCount: 1, dosageMg: 7.5, method: 'manual', taken: true },
  
  // June 24 - Active regulation peak
  // Source: Familjeobservationslogg "Fortsatt 20mg olanzapin + zopiklon"
  { id: 'log_003a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-24T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_003b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-24T20:00:00', pillCount: 3, method: 'manual', taken: true },
  { id: 'log_003', medicationId: 'olanzapin', medicationName: 'Olanzapin', timestamp: '2025-06-24T22:00:00', pillCount: 2, dosageMg: 20, method: 'manual', taken: true },
  { id: 'log_004', medicationId: 'zopiklon', medicationName: 'Zopiklon', timestamp: '2025-06-24T22:30:00', pillCount: 1, dosageMg: 7.5, method: 'manual', taken: true },
  
  // June 25 - Tapering starts (20mg → 10mg)
  // Source: Familjeobservationslogg "Reducerad till 10mg olanzapin + zopiklon"
  { id: 'log_005a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-25T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_005b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-25T20:00:00', pillCount: 3, method: 'manual', taken: true },
  { id: 'log_005', medicationId: 'olanzapin', medicationName: 'Olanzapin', timestamp: '2025-06-25T22:00:00', pillCount: 1, dosageMg: 10, method: 'manual', taken: true },
  { id: 'log_006', medicationId: 'zopiklon', medicationName: 'Zopiklon', timestamp: '2025-06-25T22:30:00', pillCount: 1, dosageMg: 7.5, method: 'manual', taken: true },
  
  // June 26 - Continued 10mg + double sleep meds
  // Source: Familjeobservationslogg "10mg olanzapin + två sömnmediciner"
  { id: 'log_007a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-26T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_007b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-26T20:00:00', pillCount: 3, method: 'manual', taken: true },
  { id: 'log_007', medicationId: 'olanzapin', medicationName: 'Olanzapin', timestamp: '2025-06-26T22:00:00', pillCount: 1, dosageMg: 10, method: 'manual', taken: true },
  { id: 'log_008', medicationId: 'zopiklon', medicationName: 'Zopiklon', timestamp: '2025-06-26T22:30:00', pillCount: 2, dosageMg: 15, method: 'manual', taken: true },
  
  // June 27 - Turning point, continued 10mg
  // Source: Familjeobservationslogg "10mg olanzapin + sömnmedicin"
  { id: 'log_009a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-27T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_009b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-27T20:00:00', pillCount: 3, method: 'manual', taken: true },
  { id: 'log_009', medicationId: 'olanzapin', medicationName: 'Olanzapin', timestamp: '2025-06-27T22:00:00', pillCount: 1, dosageMg: 10, method: 'manual', taken: true },
  { id: 'log_010', medicationId: 'zopiklon', medicationName: 'Zopiklon', timestamp: '2025-06-27T22:30:00', pillCount: 1, dosageMg: 7.5, method: 'manual', taken: true },
  
  // June 28 - Olanzapin STOPPED, only sleep meds
  // Source: Familjeobservationslogg "Endast sömnmediciner (ingen olanzapin)"
  { id: 'log_011a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-28T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_011b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-28T20:00:00', pillCount: 3, method: 'manual', taken: true },
  { id: 'log_011', medicationId: 'zopiklon', medicationName: 'Zopiklon', timestamp: '2025-06-28T22:30:00', pillCount: 1, dosageMg: 7.5, method: 'manual', taken: true },
  
  // June 29 - Stabilization, only sleep meds (LLM inference - likely continued)
  { id: 'log_012a', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-29T08:00:00', pillCount: 2, method: 'manual', taken: true },
  { id: 'log_012b', medicationId: 'lithium', medicationName: 'Lithium', timestamp: '2025-06-29T20:00:00', pillCount: 3, method: 'manual', taken: true },
  { id: 'log_012', medicationId: 'zopiklon', medicationName: 'Zopiklon', timestamp: '2025-06-29T22:30:00', pillCount: 1, dosageMg: 7.5, method: 'manual', taken: true },
  
  // NOTE: Lithium compliance during Skellefteå visit (June 2025) was 100% due to parental monitoring
  // Normally Sam admits to "hiding" lithium at home in Linköping, but parents ensured compliance during this episode
];

export const june2025ActivationEvents: ActivationEvent[] = [
  // June 14-15 - Baseline/Stable (from familjeobservationslogg)
  { id: 'act_pre_01', timestamp: '2025-06-14T12:00:00', level: 4, source: 'family_observation', confidence: 0.9, markers: ['normal_sleep', 'balanced_computer_use', 'participated_in_activities'] },
  { id: 'act_pre_02', timestamp: '2025-06-15T12:00:00', level: 4, source: 'family_observation', confidence: 0.9, markers: ['normal_sleep', 'board_games', 'family_outings'] },
  
  // June 16-20 - Gradual escalation
  { id: 'act_pre_03', timestamp: '2025-06-16T12:00:00', level: 5, source: 'family_observation', confidence: 0.85, markers: ['increased_computer_time', 'all_travel_time_on_ai'] },
  { id: 'act_pre_04', timestamp: '2025-06-17T12:00:00', level: 5, source: 'family_observation', confidence: 0.85, markers: ['parents_expressing_concern', 'continued_ai_focus'] },
  { id: 'act_pre_05', timestamp: '2025-06-18T12:00:00', level: 6, source: 'family_observation', confidence: 0.85, markers: ['more_time_on_computer', 'still_breaks_for_activities'] },
  { id: 'act_pre_06', timestamp: '2025-06-19T12:00:00', level: 6, source: 'family_observation', confidence: 0.8, markers: ['continued_concern', 'ai_work_during_travel'] },
  { id: 'act_pre_07', timestamp: '2025-06-20T12:00:00', level: 6, source: 'family_observation', confidence: 0.8, markers: ['extended_computer_sessions', 'breaks_when_asked'] },
  
  // June 21 - Warning signs escalate
  { id: 'act_pre_08', timestamp: '2025-06-21T12:00:00', level: 7, source: 'family_observation', confidence: 0.9, markers: ['full_day_at_computer', 'talking_more_about_ai'] },
  
  // June 22 - Pre-crisis (clear warning signs)
  { id: 'act_pre_09', timestamp: '2025-06-22T12:00:00', level: 8, source: 'family_observation', confidence: 0.95, markers: ['analyzing_others_behavior', 'thought_loops', 'withdrawing_from_evening_activities'] },
  
  // June 23 - Episode start (from familjeobservationslogg)
  { id: 'act_001', timestamp: '2025-06-23T05:30:00', level: 8, source: 'family_observation', confidence: 0.9, markers: ['circular_walking', 'early_morning', 'rain_walk'] },
  { id: 'act_002', timestamp: '2025-06-23T12:00:00', level: 9, source: 'family_observation', confidence: 0.95, markers: ['ruminating_thoughts', 'multiple_showers', 'wanted_to_publish_online'] },
  
  // June 24 - Peak ("Väldigt uppe i varv")
  { id: 'act_003', timestamp: '2025-06-24T06:00:00', level: 9, source: 'family_observation', confidence: 0.95, markers: ['early_waking', 'everything_about_ai'] },
  { id: 'act_004', timestamp: '2025-06-24T18:00:00', level: 9, source: 'family_observation', confidence: 0.9, markers: ['could_not_stop_ai_work', 'broke_promise'] },
  
  // June 25 - Continued high ("Satt fast i tankesnurror")
  { id: 'act_005', timestamp: '2025-06-25T12:00:00', level: 8, source: 'family_observation', confidence: 0.85, markers: ['stuck_in_thought_loops', 'could_not_calm_down'] },
  
  // June 26 - Stabilization attempt ("Fortfarande uppvarvad")
  { id: 'act_006', timestamp: '2025-06-26T12:00:00', level: 7, source: 'family_observation', confidence: 0.8, markers: ['still_elevated', 'helped_with_garden'] },
  
  // June 27 - Turning point ("Ångerfull, vill göra sitt bästa")
  { id: 'act_007', timestamp: '2025-06-27T07:00:00', level: 6, source: 'family_observation', confidence: 0.85, markers: ['remorseful', 'wants_to_minimize_problems', 'less_walking_fewer_showers'] },
  
  // June 28 - Clear improvement ("Lugnare datajobb")
  { id: 'act_008', timestamp: '2025-06-28T12:00:00', level: 5, source: 'self_report', confidence: 0.8, markers: ['calmer_computer_work', 'wanted_to_finish_project', 'started_manic_control_tool'] },
  
  // June 29 - Stabilization ("I ett mellanläge")
  { id: 'act_009', timestamp: '2025-06-29T09:00:00', level: 5, source: 'self_report', confidence: 0.75, markers: ['long_morning_walk', 'calmer', 'middle_state', 'balanced_computer_use'] },
];

export const june2025FamilyObservations: FamilyObservation[] = [
  // Pre-episode observations
  {
    id: 'obs_pre_01',
    timestamp: '2025-06-16T18:00:00',
    observerId: 'eva',
    observerName: 'Eva',
    behavior: 'Ökad tid med AI-arbete under resan',
    context: 'Började kommunicera oro över omfattande datatid. "All restid använder han till AI"',
    severity: 'info'
  },
  {
    id: 'obs_pre_02',
    timestamp: '2025-06-21T20:00:00',
    observerId: 'eva',
    observerName: 'Eva',
    behavior: 'Heldag vid datorn, började prata mer om AI när möjlighet gavs',
    context: 'Började dra sig undan gemensamma aktiviteter på kvällen',
    severity: 'concern'
  },
  {
    id: 'obs_pre_03',
    timestamp: '2025-06-22T18:00:00',
    observerId: 'eva',
    observerName: 'Eva',
    behavior: 'Ökad analys av andras beteenden, började fastna i "tankesnurror"',
    context: 'Upplever honom mer och mer ostabil. Began dra sig undan familjen',
    severity: 'concern'
  },
  // Crisis phase
  {
    id: 'obs_001',
    timestamp: '2025-06-23T05:30:00',
    observerId: 'eva',
    observerName: 'Eva',
    behavior: 'Morgonpromenad i regn, går flera varv på kort slinga',
    context: 'Tidiga varningssignaler - tankarna snurrar, svårt att följa resonemang',
    severity: 'urgent'
  },
  {
    id: 'obs_002',
    timestamp: '2025-06-23T14:00:00',
    observerId: 'eva',
    observerName: 'Eva',
    behavior: 'Flera duschar under dagen, vill publicera material online',
    context: 'Förhindrades av föräldrar - skapade handlingsplan tillsammans',
    severity: 'urgent'
  },
  {
    id: 'obs_003',
    timestamp: '2025-06-24T08:00:00',
    observerId: 'eva',
    observerName: 'Eva',
    behavior: 'Väldigt uppe i varv, allt kretsade kring AI',
    context: 'Kunde göra ärenden på stan, periodvis tänka på annat',
    severity: 'urgent'
  },
  {
    id: 'obs_004',
    timestamp: '2025-06-24T21:00:00',
    observerId: 'eva',
    observerName: 'Eva',
    behavior: 'Kunde inte hålla sig från AI-arbete på kvällen trots löfte',
    context: 'Kunde dock sova relativt bra den natten med medicinering',
    severity: 'concern'
  },
  {
    id: 'obs_005',
    timestamp: '2025-06-25T16:00:00',
    observerId: 'eva',
    observerName: 'Eva',
    behavior: 'Satt fast i tankesnurror kring AI, kunde inte komma ner i varv',
    context: 'Försökte ta det lugnare, följde med på promenad',
    severity: 'concern'
  },
  {
    id: 'obs_006',
    timestamp: '2025-06-26T14:00:00',
    observerId: 'roger',
    observerName: 'Roger',
    behavior: 'Hjälpte till med trädgårdsarbete men fortfarande uppvarvad',
    context: 'Samtal om att han inte följde sin egen handlingsplan',
    severity: 'concern'
  },
  {
    id: 'obs_007',
    timestamp: '2025-06-27T07:00:00',
    observerId: 'eva',
    observerName: 'Eva',
    behavior: 'Vaknar tidigt och är ångerfull, vill göra sitt bästa',
    context: 'Lite lugnare, gick mindre och duschade färre gånger. Ville minimera arbete som ger nya problem',
    severity: 'info'
  },
  {
    id: 'obs_008',
    timestamp: '2025-06-28T09:00:00',
    observerId: 'eva',
    observerName: 'Eva',
    behavior: 'Morgonpromenad, lugnare datajobb',
    context: 'Ville absolut slutföra påbörjat projekt, påbörjade design för AI-baserat verktyg för manikontroll',
    severity: 'info'
  },
  {
    id: 'obs_009',
    timestamp: '2025-06-29T09:00:00',
    observerId: 'eva',
    observerName: 'Eva',
    behavior: 'Lång morgonpromenad, kände sig lugnare',
    context: 'Själv att han är i ett mellanläge. Deltog i promenader och måltider',
    severity: 'info'
  },
];

// Therapeutic sessions (June 18-23, 2025) - SIMULATED BalansAI SESSIONS (AI-mediated regulation, not real therapist)
export const june2025TherapeuticSessions: TherapeuticSession[] = [
  { id: 'sess_001', timestamp: '2025-06-18T10:00:00', sessionNumber: 1, focus: 'Human-AI Feedback Loop (BalansAI)', effectiveness: 'helped' },
  { id: 'sess_002', timestamp: '2025-06-20T14:00:00', sessionNumber: 2, focus: 'Shadow Integration (BalansAI)', effectiveness: 'helped' },
  { id: 'sess_003', timestamp: '2025-06-22T10:00:00', sessionNumber: 3, focus: 'Cognitive Differences (BalansAI)', effectiveness: 'helped' },
  { id: 'sess_004', timestamp: '2025-06-23T09:00:00', sessionNumber: 4, focus: 'Hypomanic Regulation (Simulated Dr. K)', effectiveness: 'helped' },
  { id: 'sess_005', timestamp: '2025-06-23T14:00:00', sessionNumber: 5, focus: 'Reality Anchoring (BalansAI)', effectiveness: 'helped' },
  { id: 'sess_006', timestamp: '2025-06-23T18:00:00', sessionNumber: 6, focus: 'Recursive Gnome Freeform (BalansAI)', effectiveness: 'helped' },
  { id: 'sess_007', timestamp: '2025-06-23T22:00:00', sessionNumber: 7, focus: 'Collective Evolution (BalansAI)', effectiveness: 'helped' },
];

// Helper to calculate compliance
export function calculateCompliance(logs: MedicationLog[], medicationId: string, days: number = 7): number {
  const filtered = logs.filter(log => log.medicationId === medicationId);
  const taken = filtered.filter(log => log.taken).length;
  
  // Lithium should be 2x daily = 14 doses in 7 days
  const expected = medicationId === 'lithium' ? days * 2 : days;
  
  return Math.round((taken / expected) * 100);
}

