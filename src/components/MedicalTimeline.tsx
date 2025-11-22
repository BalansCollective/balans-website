import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Scatter,
  ScatterChart,
  ZAxis,
  Cell,
  ComposedChart,
} from 'recharts';
import {
  june2025ActivationEvents,
  june2025MedicationLogs,
  june2025FamilyObservations,
  june2025TherapeuticSessions,
  ActivationEvent,
  MedicationLog,
  FamilyObservation,
  TherapeuticSession,
} from '../data/june2025Episode';
import {
  november2025ActivationEvents,
  november2025MedicationLogs,
  november2025FamilyObservations,
  november2025SleepLogs,
  november2025LithiumConcentrations,
  lithiumTherapeuticRanges,
  november2025LLMSessionEvents,
  validatedDetectionPatterns,
} from '../data/november2025LLMPatternEpisode';

// Types for our chart data
interface ChartDataPoint {
  date: string;
  timestamp: number;
  level: number;
  event?: ActivationEvent;
}

interface EventMarker {
  date: string;
  timestamp: number;
  y: number;
  type: 'medication' | 'observation' | 'session';
  data: MedicationLog | FamilyObservation | TherapeuticSession;
}

// New types for grouped events
interface TimelineEvent {
  type: 'protocol' | 'session' | 'medication' | 'observation';
  date: string;
  description: string;
  data: ActivationEvent | MedicationLog | FamilyObservation | TherapeuticSession;
}

interface TimelineDay {
  date: string;
  timestamp: number;
  level: number;
  events: TimelineEvent[];
  displayEvent: TimelineEvent;
  eventCount: number;
}

// Event priority for display
const EVENT_PRIORITY = {
  protocol: 10,
  session: 7,
  medication: 5,
  observation: 3,
};

const EVENT_COLORS = {
  protocol: '#dc2626',  // red-600
  session: '#8b5cf6',   // purple-500
  medication: '#22c55e', // green-500
  observation: '#3b82f6', // blue-500
};

// UBIQUITOUS LANGUAGE - Medical Timeline Domain
// Centralized terminology for consistency across UI
const MEDICAL_TERMINOLOGY = {
  eventTypes: {
    protocol: {
      icon: '🚨',
      label: 'BalansAI Protokoll',
      shortLabel: 'Protokoll',
      description: 'AI-stödda interventionsprotokoll aktiverat',
      definition: 'Automatiskt system som aktiveras vid tecken på hypomani. Kombinerar AI-analys med familjesamordning för snabb intervention.',
    },
    session: {
      icon: '📞',
      label: 'Förankringssamtal (Eva, Roger, LLM)',
      shortLabel: 'Förankring',
      description: 'Verklighetsförankring med familj och AI',
      definition: 'Strukturerat samtal med familj och AI-stöd för att kontrollera verklighetsförankring vid förhöjd aktivering. Hjälper identifiera hypomaniska tankebanor.',
    },
    medication: {
      icon: '💊',
      label: 'Medicin (Olanzapin)',
      shortLabel: 'Medicin',
      description: 'Medicinintag registrerat',
      definition: 'Antipsykotiskt läkemedel som dämpar hypomaniska symtom. Tas vid behov vid förhöjd aktivering.',
    },
    observation: {
      icon: '📝',
      label: 'Familjeobservation',
      shortLabel: 'Observation',
      description: 'Familjemedlem rapporterade beteende',
      definition: 'Beteenden eller mönster som familjemedlemmar noterat. Viktigt för tidig upptäckt av episoder.',
    },
  },
  activationLevels: {
    label: 'Aktivering',
    unit: '/ 10',
    definition: 'Kognitiv och emotionell aktiveringsnivå. 0-3: Depression/handlingsförlamning, 4-6: Normal funktion, 7-10: Hypomani/mani.',
    zones: {
      critical: { threshold: 9, color: '#dc2626', label: 'Kritisk', definition: 'Akut hypomani - omedelbar intervention krävs' },
      high: { threshold: 7, color: '#ea580c', label: 'Hög', definition: 'Hypomani - protokoll bör aktiveras' },
      elevated: { threshold: 5, color: '#f59e0b', label: 'Förhöjd', definition: 'Förhöjd men hanterbar - övervakning' },
      normal: { threshold: 0, color: '#22c55e', label: 'Normal', definition: 'Normal funktion - ingen intervention' },
    },
  },
  effectiveness: {
    helped: { label: 'Hjälpte', color: 'green' },
    neutral: { label: 'Neutral', color: 'gray' },
    unclear: { label: 'Oklart', color: 'blue' },
  },
  glossary: {
    hypomani: {
      term: 'Hypomani',
      definition: 'Förhöjd aktivering (nivå 7-10). Kännetecknas av minskad sömnbehov, snabba tankar, ökad produktivitet men försämrad omdöme.',
    },
    markörer: {
      term: 'Markörer',
      definition: 'Specifika beteenden som indikerar ökad aktivering (t.ex. cirkelgång, flera duschar, tankesnurror, tidiga morgnar).',
    },
    episod: {
      term: 'Episod',
      definition: 'Period med avvikande aktivering som varar flera dagar. Målet är att förkorta episoder genom tidig intervention.',
    },
  },
};

type ZoomLevel = 'year' | 'episode' | 'day';

interface SelectedDay {
  day: TimelineDay;
  episode: Episode;
}

// Episode metadata
interface Episode {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  activationEvents: ActivationEvent[];
  medicationLogs: MedicationLog[];
  familyObservations: FamilyObservation[];
  therapeuticSessions: TherapeuticSession[];
  color: string;
  description: string;
}

const EPISODES: Episode[] = [
  {
    id: 'june-2025',
    name: 'Juni 2025',
    startDate: '2025-06-14',
    endDate: '2025-06-29',
    activationEvents: june2025ActivationEvents,
    medicationLogs: june2025MedicationLogs,
    familyObservations: june2025FamilyObservations,
    therapeuticSessions: june2025TherapeuticSessions,
    color: '#ea580c', // orange-600
    description: '16-dagars episod (14-29 juni) - BalansAI protokoll aktiverat 23 juni'
  },
  {
    id: 'nov-2025-llm-pattern',
    name: 'Nov 2025 (LLM Pattern Detection)',
    startDate: '2025-10-29',
    endDate: '2025-11-15',
    activationEvents: november2025ActivationEvents,
    medicationLogs: november2025MedicationLogs,
    familyObservations: november2025FamilyObservations,
    therapeuticSessions: [], // No therapeutic sessions - this demonstrates automated LLM detection + family coordination
    color: '#8b5cf6', // purple-500
    description: 'LLM-baserad detektion + familjestöd - Crisis→Dagliga samtal→Veckovis (tappering mönster)'
  },
];

// User profile configuration
interface UserProfile {
  name: string;
  zoneConfig: {
    zone1: { min: number; max: number; color: string; label: string };
    zone2: { min: number; max: number; color: string; label: string };
    zone3: { min: number; max: number; color: string; label: string };
  };
}

// Predefined profiles
const USER_PROFILES: Record<string, UserProfile> = {
  sam: {
    name: "Sam (Bipolär typ 1, ingen depression)",
    zoneConfig: {
      zone1: { min: 3, max: 5, color: '#d1d5db', label: 'Handlingsförlamning' },
      zone2: { min: 5, max: 7, color: '#86efac', label: 'Normal' },
      zone3: { min: 7, max: 10, color: '#fbbf24', label: 'Hypomani' },
    },
  },
  standard: {
    name: "Standard (Bipolär, klassiskt mönster)",
    zoneConfig: {
      zone1: { min: 0, max: 3, color: '#93c5fd', label: 'Depression' },
      zone2: { min: 3, max: 7, color: '#86efac', label: 'Normal' },
      zone3: { min: 7, max: 10, color: '#fbbf24', label: 'Hypomani' },
    },
  },
};

// DEPRECATED: Old event selection approach
interface SelectedEvent_DEPRECATED {
  type: 'day';
  day: TimelineDay;
}

// Helper: Generate full year data with ALL episodes
function generateYearData(): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const baselineLevel = 5; // Normal baseline
  
  // Jan - May: Stable baseline
  for (let month = 0; month < 5; month++) {
    for (let week = 0; week < 4; week++) {
      const date = new Date(2025, month, week * 7 + 1);
      data.push({
        date: date.toISOString().split('T')[0],
        timestamp: date.getTime(),
        level: baselineLevel,
      });
    }
  }
  
  // June: Episode 1 (June 2025 - acute crisis)
  // Add weekly baseline points leading up to episode
  for (let day = 1; day <= 22; day += 7) {
    const date = new Date(2025, 5, day); // June = month 5
    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      level: baselineLevel,
    });
  }
  june2025ActivationEvents.forEach(event => {
    const date = new Date(event.timestamp);
    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      level: event.level,
      event,
    });
  });
  
  // July - Sep: Stable baseline
  for (let month = 6; month < 9; month++) {
    for (let week = 0; week < 4; week++) {
      const date = new Date(2025, month, week * 7 + 1);
      data.push({
        date: date.toISOString().split('T')[0],
        timestamp: date.getTime(),
        level: baselineLevel,
      });
    }
  }
  
  // Oct-Nov: Episode 2 (LLM Pattern Detection - Oct 29 - Nov 15, 2025)
  // For year view, take only ONE point per day (use max level for that day)
  const novDailyLevels = new Map<string, number>();
  november2025ActivationEvents
    .filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= new Date('2025-10-29') && eventDate <= new Date('2025-11-15');
    })
    .forEach(event => {
      const dateStr = new Date(event.timestamp).toISOString().split('T')[0];
      const currentMax = novDailyLevels.get(dateStr) || 0;
      novDailyLevels.set(dateStr, Math.max(currentMax, event.level));
    });
  
  // Add one point per day for Nov episode
  novDailyLevels.forEach((level, dateStr) => {
    data.push({
      date: dateStr,
      timestamp: new Date(dateStr).getTime(),
      level: level,
    });
  });
  
  // Dec: Stable baseline (current/future)
  for (let week = 0; week < 4; week++) {
    const date = new Date(2025, 11, week * 7 + 1);
    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      level: baselineLevel,
    });
  }
  
  return data.sort((a, b) => a.timestamp - b.timestamp);
}

// Helper: Group events by day with priority
function groupEventsByDay(
  activationEvents: ActivationEvent[],
  medicationLogs: MedicationLog[],
  therapeuticSessions: TherapeuticSession[],
  familyObservations: FamilyObservation[],
  startDate: string,
  endDate: string
): TimelineDay[] {
  const eventsByDate = new Map<string, TimelineEvent[]>();
  
  // Collect activation events (for protocol detection)
  activationEvents.forEach(ae => {
    const date = new Date(ae.timestamp);
    const dateStr = date.toDateString();
    if (!eventsByDate.has(dateStr)) eventsByDate.set(dateStr, []);
    
    // Check if protocol triggered (level >= 8)
    if (ae.level >= 8) {
      eventsByDate.get(dateStr)!.push({
        type: 'protocol',
        date: dateStr,
        description: `BalansAI Protokoll aktiverat (nivå ${ae.level})`,
        data: ae,
      });
    }
  });
  
  // Collect medications
  medicationLogs
    .filter(log => log.medicationId === 'olanzapin' || log.medicationId === 'zopiklon')
    .forEach(med => {
      const date = new Date(med.timestamp);
      const dateStr = date.toDateString();
      if (!eventsByDate.has(dateStr)) eventsByDate.set(dateStr, []);
      eventsByDate.get(dateStr)!.push({
        type: 'medication',
        date: dateStr,
        description: `${med.medicationName} ${med.dosageMg}mg`,
        data: med,
      });
    });
  
  // Collect sessions (Eva & Roger + LLM reality-grounding)
  therapeuticSessions.forEach(session => {
    const date = new Date(session.timestamp);
    const dateStr = date.toDateString();
    if (!eventsByDate.has(dateStr)) eventsByDate.set(dateStr, []);
    eventsByDate.get(dateStr)!.push({
      type: 'session',
      date: dateStr,
      description: `Förankringssamtal (Eva, Roger, LLM): ${session.focus}`,
      data: session,
    });
  });
  
  // Collect observations
  familyObservations.forEach(obs => {
    const date = new Date(obs.timestamp);
    const dateStr = date.toDateString();
    if (!eventsByDate.has(dateStr)) eventsByDate.set(dateStr, []);
    eventsByDate.get(dateStr)!.push({
      type: 'observation',
      date: dateStr,
      description: obs.observation,
      data: obs,
    });
  });
  
  // Generate ALL days in range (not just days with events!)
  const days: TimelineDay[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // First pass: collect all days with their raw data
  const dayData: Array<{dateStr: string, date: Date, events: TimelineEvent[], activation?: ActivationEvent}> = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toDateString();
    const events = eventsByDate.get(dateStr) || [];
    const activation = activationEvents.find(
      ae => new Date(ae.timestamp).toDateString() === dateStr
    );
    dayData.push({ dateStr, date: new Date(d), events, activation });
  }
  
  // Second pass: interpolate missing activation levels
  for (let i = 0; i < dayData.length; i++) {
    const day = dayData[i];
    let level = day.activation?.level;
    
    if (!level) {
      // Find previous and next known levels for interpolation
      let prevLevel: number | undefined;
      let nextLevel: number | undefined;
      let prevDistance = 0;
      let nextDistance = 0;
      
      // Look backwards
      for (let j = i - 1; j >= 0; j--) {
        if (dayData[j].activation?.level) {
          prevLevel = dayData[j].activation!.level;
          prevDistance = i - j;
          break;
        }
      }
      
      // Look forwards
      for (let j = i + 1; j < dayData.length; j++) {
        if (dayData[j].activation?.level) {
          nextLevel = dayData[j].activation!.level;
          nextDistance = j - i;
          break;
        }
      }
      
      // Interpolate
      if (prevLevel !== undefined && nextLevel !== undefined) {
        // Linear interpolation between two known values
        const totalDistance = prevDistance + nextDistance;
        const weight = prevDistance / totalDistance;
        level = Math.round(prevLevel + (nextLevel - prevLevel) * weight);
      } else if (prevLevel !== undefined) {
        // Only previous known, use that
        level = prevLevel;
      } else if (nextLevel !== undefined) {
        // Only next known, use that
        level = nextLevel;
      } else {
        // No known values at all, default to baseline
        level = 5;
      }
    }
    
    // Sort events by priority
    const sortedEvents = day.events.sort(
      (a, b) => EVENT_PRIORITY[b.type] - EVENT_PRIORITY[a.type]
    );
    const displayEvent = sortedEvents[0];
    
    days.push({
      date: day.date.toISOString().split('T')[0],
      timestamp: day.date.getTime(),
      level: level,
      events: sortedEvents,
      displayEvent,
      eventCount: day.events.length,
    });
  }
  
  return days.sort((a, b) => a.timestamp - b.timestamp);
}

// Helper: Get episode detail data with grouped events
function getEpisodeData(): TimelineDay[] {
  return groupEventsByDay(
    june2025ActivationEvents, 
    june2025MedicationLogs, 
    june2025TherapeuticSessions, 
    june2025FamilyObservations,
    '2025-06-23',
    '2025-06-29'
  );
}

function getEpisodeDataForEpisode(episode: Episode): TimelineDay[] {
  return groupEventsByDay(
    episode.activationEvents,
    episode.medicationLogs,
    episode.therapeuticSessions,
    episode.familyObservations,
    episode.startDate,
    episode.endDate
  );
}

// Helper: Get event markers for episode view
function getEventMarkers(): EventMarker[] {
  return getEventMarkersForData(june2025MedicationLogs, june2025FamilyObservations, june2025TherapeuticSessions);
}

function getEventMarkersForEpisode(episode: Episode): EventMarker[] {
  return getEventMarkersForData(episode.medicationLogs, episode.familyObservations, episode.therapeuticSessions);
}

function getEventMarkersForData(
  medicationLogs: MedicationLog[],
  familyObservations: FamilyObservation[],
  therapeuticSessions: TherapeuticSession[]
): EventMarker[] {
  const markers: EventMarker[] = [];
  
  // Medication markers (Olanzapin only)
  medicationLogs
    .filter(log => log.medicationId === 'olanzapin')
    .forEach(log => {
      const date = new Date(log.timestamp);
      markers.push({
        date: date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' }),
        timestamp: date.getTime(),
        y: 1, // Bottom of chart
        type: 'medication',
        data: log,
      });
    });
  
  // Observation markers
  familyObservations.forEach(obs => {
    const date = new Date(obs.timestamp);
    markers.push({
      date: date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' }),
      timestamp: date.getTime(),
      y: 2, // Slightly higher
      type: 'observation',
      data: obs,
    });
  });
  
  // Therapeutic session markers (📚)
  therapeuticSessions.forEach(session => {
    const date = new Date(session.timestamp);
    markers.push({
      date: date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' }),
      timestamp: date.getTime(),
      y: 3, // Mid-height
      type: 'session',
      data: session,
    });
  });
  
  return markers;
}

// DEPRECATED: Old popup approach - now using detail panel below timeline
// Event detail card component - now shows all events from a day
function EventDetailCard_DEPRECATED({ event, onClose }: { event: SelectedEvent; onClose: () => void }) {
  const day = event.day;
  const date = new Date(day.timestamp);
  
  // Sort events by timestamp (chronological order)
  const sortedEvents = [...day.events].sort((a, b) => {
    const timeA = new Date((a.data as any).timestamp).getTime();
    const timeB = new Date((b.data as any).timestamp).getTime();
    return timeA - timeB;
  });
  
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-6 max-w-lg max-h-[80vh] z-50 border-2 flex flex-col overflow-visible" style={{ borderColor: 'var(--color-swedish-blue)' }}>
      <div className="flex justify-between items-start mb-4 flex-shrink-0">
        <div>
          <h3 className="text-xl font-bold" style={{ color: 'var(--color-swedish-blue)' }}>
            {date.toLocaleDateString('sv-SE', { 
              weekday: 'long', 
              day: 'numeric',
              month: 'long'
            })}
          </h3>
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-bold text-2xl" style={{ 
              color: day.level >= 9 ? '#dc2626' :
                     day.level >= 7 ? '#ea580c' :
                     day.level >= 5 ? '#f59e0b' : '#22c55e'
            }}>
              {day.level}
            </span>
            <span className="text-gray-600"> / 10 aktivering</span>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">
          ×
        </button>
      </div>
      
      <div className="text-sm text-gray-600 mb-2 flex-shrink-0">
        {day.eventCount} {day.eventCount === 1 ? 'händelse' : 'händelser'}
      </div>
      
      <div className="space-y-4 overflow-y-auto flex-1 pr-2">
        {sortedEvents.map((evt, idx) => {
          const timestamp = new Date((evt.data as any).timestamp);
          const timeStr = timestamp.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
          
          return (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex-shrink-0">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: EVENT_COLORS[evt.type] }}
              />
              <div className="text-xs text-gray-500 mt-1 font-mono">
                {timeStr}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm mb-1">
                {MEDICAL_TERMINOLOGY.eventTypes[evt.type as keyof typeof MEDICAL_TERMINOLOGY.eventTypes]?.icon} {MEDICAL_TERMINOLOGY.eventTypes[evt.type as keyof typeof MEDICAL_TERMINOLOGY.eventTypes]?.label}
              </div>
              <div className="text-sm text-gray-700">
                {evt.description}
              </div>
              
              {/* Additional details based on type */}
              {evt.type === 'observation' && (
                <div className="mt-2 text-xs text-gray-600">
                  <div><strong>Beteende:</strong> {(evt.data as FamilyObservation).behavior}</div>
                  <div className="mt-1">{(evt.data as FamilyObservation).context}</div>
                </div>
              )}
              
              {evt.type === 'session' && (
                <div className="mt-2">
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    (evt.data as TherapeuticSession).effectiveness === 'helped' ? 'bg-green-100 text-green-800' :
                    (evt.data as TherapeuticSession).effectiveness === 'neutral' ? 'bg-gray-100 text-gray-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {(evt.data as TherapeuticSession).effectiveness === 'helped' ? 'Hjälpte' :
                     (evt.data as TherapeuticSession).effectiveness === 'neutral' ? 'Neutral' : 'Oklart'}
                  </div>
                </div>
              )}
              
              {evt.type === 'protocol' && (
                <div className="mt-2 text-xs text-gray-600">
                  <div><strong>Markörer:</strong></div>
                  <ul className="list-disc list-inside mt-1">
                    {(evt.data as ActivationEvent).markers.slice(0, 3).map((marker, i) => (
                      <li key={i}>{translateMarker(marker)}</li>
                    ))}
                    {(evt.data as ActivationEvent).markers.length > 3 && (
                      <li>+ {(evt.data as ActivationEvent).markers.length - 3} fler...</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

// DEPRECATED: Old overlay for popup
function Overlay_DEPRECATED({ onClick }: { onClick: () => void }) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 z-40"
      onClick={onClick}
    />
  );
}

// Main component
export function MedicalTimeline() {
  const [currentProfile, setCurrentProfile] = useState<string>('sam');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('year');
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);
  
  const profile = USER_PROFILES[currentProfile];
  const zones = profile.zoneConfig;
  
  // Data based on zoom level
  const yearData = useMemo(() => generateYearData(), []);
  const episodeData = useMemo(() => 
    selectedEpisode ? getEpisodeDataForEpisode(selectedEpisode) : getEpisodeData(), 
    [selectedEpisode]
  );
  const eventMarkers = useMemo(() => 
    selectedEpisode ? getEventMarkersForEpisode(selectedEpisode) : getEventMarkers(),
    [selectedEpisode]
  );
  
  const handleChartClick = (data: any) => {
    if (!data || !data.activePayload) return;
    
    const point = data.activePayload[0]?.payload;
    if (!point) return;
    
    // In episode view, clicking shows day details below (not popup)
    if (zoomLevel === 'episode') {
      setSelectedDay({
        day: point as TimelineDay,
        episode: selectedEpisode || EPISODES[0]
      });
    }
  };
  
  const handleMarkerClick = (marker: EventMarker) => {
    // Find the day for this marker
    const day = episodeData.find(d => d.timestamp === marker.timestamp);
    if (day) {
      setSelectedDay({
        day,
        episode: selectedEpisode || EPISODES[0]
      });
    }
  };
  
  // Custom dot renderer with priority color + count badge
  const renderEventDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload || !payload.events || payload.events.length === 0) return null;

    const day = payload as TimelineDay;
    const color = EVENT_COLORS[day.displayEvent.type];
    const count = day.eventCount;
    const radius = count > 1 ? 10 : 7;

    return (
      <g onClick={() => setSelectedDay({ day, episode: selectedEpisode || EPISODES[0] })} style={{ cursor: 'pointer' }}>
        {/* Main marker circle */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill={color}
          stroke="white"
          strokeWidth={2}
        />

        {/* Event count badge (if multiple events) */}
        {count > 1 && (
          <>
            <circle
              cx={cx + 10}
              cy={cy - 10}
              r={8}
              fill="rgba(0,0,0,0.85)"
              stroke="white"
              strokeWidth={1}
            />
            <text
              x={cx + 10}
              y={cy - 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fontWeight="bold"
              fill="white"
            >
              {count}
            </text>
          </>
        )}
      </g>
    );
  };
  
  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-swedish-blue)' }}>
              {zoomLevel === 'year' && '2025 - Medicinsk Tidslinje'}
              {zoomLevel === 'episode' && selectedEpisode && `${selectedEpisode.name} - ${selectedEpisode.description}`}
              {zoomLevel === 'episode' && !selectedEpisode && 'Juni 2025 - Hypomanisk Episod'}
            </h1>
            {zoomLevel === 'year' && (
              <p className="text-sm text-gray-600 mt-1">
                Välj en episod ovan för att se detaljer
              </p>
            )}
            {zoomLevel === 'episode' && (
              <p className="text-sm text-gray-600 mt-1">
                Klicka på en dag för att se detaljer
              </p>
            )}
          </div>
          
          {/* Zoom controls */}
          <div className="flex gap-2">
            {zoomLevel === 'episode' && (
              <button
                onClick={() => {
                  setZoomLevel('year');
                  setSelectedEpisode(null);
                  setSelectedDay(null);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
              >
                ← Årsöversikt
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Scrollable content area - takes remaining height */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="flex flex-col pb-32">
          {/* Episode selection badges for year view */}
          {zoomLevel === 'year' && (
            <div className="flex gap-4 justify-center p-4 bg-gray-50">
              {EPISODES.map(episode => (
                <button
                  key={episode.id}
                  onClick={() => {
                    setSelectedEpisode(episode);
                    setZoomLevel('episode');
                    setSelectedDay(null);
                  }}
                  className="px-6 py-3 rounded-lg border-2 hover:scale-105 transition-transform cursor-pointer shadow-md"
                  style={{ 
                    borderColor: episode.color,
                    backgroundColor: `${episode.color}20`
                  }}
                >
                  <div className="font-bold" style={{ color: episode.color }}>
                    {episode.name}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {episode.description.split(' - ')[0]}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* Chart - fixed height */}
          <div className="p-6 bg-gray-50" style={{ height: '500px' }}>
            <div style={{ width: '100%', height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={zoomLevel === 'year' ? yearData : episodeData} 
            onClick={(data) => {
              // Handle clicks in episode view - snap to nearest day
              if (zoomLevel === 'episode') {
                if (data && data.activePayload && data.activePayload[0]) {
                  // Direct hit on a data point
                  handleChartClick(data);
                } else if (data && data.activeLabel) {
                  // Clicked near a day - find it by date label
                  const clickedDate = data.activeLabel;
                  const day = episodeData.find(d => d.date === clickedDate);
                  if (day) {
                    setSelectedDay({
                      day,
                      episode: selectedEpisode || EPISODES[0]
                    });
                  }
                }
              }
            }}
            style={{ outline: 'none', overflow: 'visible', cursor: zoomLevel === 'episode' ? 'pointer' : 'default' }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11 }}
              angle={zoomLevel === 'year' ? 0 : -45}
              textAnchor={zoomLevel === 'year' ? 'middle' : 'end'}
              height={zoomLevel === 'year' ? 60 : 100}
              interval={zoomLevel === 'year' ? 'preserveStartEnd' : Math.ceil(episodeData.length / 10)}
              tickFormatter={(value) => {
                if (zoomLevel === 'year') {
                  // Show month name for year view
                  const date = new Date(value);
                  return date.toLocaleDateString('sv-SE', { month: 'short' });
                } else {
                  // Show "23 jun" for episode view
                  const date = new Date(value);
                  const day = date.getDate();
                  const month = date.toLocaleDateString('sv-SE', { month: 'short' });
                  return `${day} ${month}`;
                }
              }}
            />
            
            <YAxis 
              domain={[0, 10]} 
              ticks={[0, 5, 10]}
              tick={{ fontSize: 12 }}
              label={{ value: MEDICAL_TERMINOLOGY.activationLevels.label, angle: -90, position: 'insideLeft' }}
            />
            
            {/* Color zones */}
            <ReferenceArea 
              y1={zones.zone1.min} 
              y2={zones.zone1.max} 
              fill={zones.zone1.color} 
              fillOpacity={0.1} 
            />
            <ReferenceArea 
              y1={zones.zone2.min} 
              y2={zones.zone2.max} 
              fill={zones.zone2.color} 
              fillOpacity={0.1} 
            />
            <ReferenceArea 
              y1={zones.zone3.min} 
              y2={zones.zone3.max} 
              fill={zones.zone3.color} 
              fillOpacity={0.2} 
            />
            
            {/* Main mood line - with custom event dots */}
            <Line 
              type="monotone" 
              dataKey="level" 
              stroke={selectedEpisode ? selectedEpisode.color : "#f97316"}
              strokeWidth={3}
              dot={zoomLevel === 'year' ? false : renderEventDot}
              activeDot={zoomLevel === 'episode'} // Only in episode view
            />
          </ComposedChart>
        </ResponsiveContainer>
            </div>
          </div>
        
          {/* Lithium Concentration Bar - only shown in episode view for Nov 2025 */}
          {zoomLevel === 'episode' && selectedEpisode?.id === 'nov-2025-llm-pattern' && (
            <div className="px-6 py-4 bg-white border-t border-gray-200">
              <div className="max-w-6xl mx-auto">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Litiumkoncentration (P-Litium, mmol/L)
                </h3>
                <div className="relative h-20 bg-gray-50 rounded border border-gray-200">
                  {/* Therapeutic zones */}
                  <div className="absolute inset-0 flex">
                    {/* Subtherapeutic zone (<0.40) - Yellow */}
                    <div 
                      className="h-full bg-yellow-100 border-r border-yellow-300"
                      style={{ width: `${(lithiumTherapeuticRanges.low / 1.5) * 100}%` }}
                    >
                      <div className="text-xs text-yellow-700 p-1">&lt;0.40</div>
                    </div>
                    {/* Therapeutic zone (0.40-0.90) - Green */}
                    <div 
                      className="h-full bg-green-100 border-r border-green-300"
                      style={{ width: `${((lithiumTherapeuticRanges.optimal - lithiumTherapeuticRanges.low) / 1.5) * 100}%` }}
                    >
                      <div className="text-xs text-green-700 p-1 text-center">Terapeutiskt (0.40-0.90)</div>
                    </div>
                    {/* Approaching toxic (0.90-1.20) - Orange */}
                    <div 
                      className="h-full bg-orange-100 border-r border-orange-300"
                      style={{ width: `${((lithiumTherapeuticRanges.toxic - lithiumTherapeuticRanges.optimal) / 1.5) * 100}%` }}
                    >
                      <div className="text-xs text-orange-700 p-1">0.90-1.20</div>
                    </div>
                    {/* Toxic (>1.20) - Red */}
                    <div 
                      className="h-full bg-red-100"
                      style={{ width: `${((1.5 - lithiumTherapeuticRanges.toxic) / 1.5) * 100}%` }}
                    >
                      <div className="text-xs text-red-700 p-1">&gt;1.20 (Toxisk)</div>
                    </div>
                  </div>
                  
                  {/* Lab values plotted as markers */}
                  {november2025LithiumConcentrations.map((reading) => {
                    const episodeStart = new Date(selectedEpisode.startDate).getTime();
                    const episodeEnd = new Date(selectedEpisode.endDate).getTime();
                    const readingDate = new Date(reading.date).getTime();
                    
                    // Calculate position within episode timeline
                    const position = ((readingDate - episodeStart) / (episodeEnd - episodeStart)) * 100;
                    
                    // Determine color based on value
                    const markerColor = reading.concentration < lithiumTherapeuticRanges.low ? '#f59e0b' : // yellow
                                       reading.concentration > lithiumTherapeuticRanges.toxic ? '#dc2626' : // red
                                       reading.concentration > lithiumTherapeuticRanges.optimal ? '#ea580c' : // orange
                                       '#22c55e'; // green
                    
                    // Highlight Oct 3 reading (the current/recent one)
                    const isCurrentReading = reading.date === '2025-10-03';
                    
                    return (
                      <div
                        key={reading.id}
                        className="absolute"
                        style={{ 
                          left: `${position}%`, 
                          top: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {/* Marker circle */}
                        <div 
                          className={`w-3 h-3 rounded-full border-2 ${isCurrentReading ? 'border-blue-600 ring-4 ring-blue-200' : 'border-white'}`}
                          style={{ backgroundColor: markerColor }}
                        />
                        {/* Value label */}
                        <div 
                          className={`absolute top-full mt-1 text-xs whitespace-nowrap font-semibold ${isCurrentReading ? 'text-blue-700' : 'text-gray-700'}`}
                          style={{ left: '50%', transform: 'translateX(-50%)' }}
                        >
                          {reading.concentration.toFixed(2)}
                        </div>
                        {/* Date label (only for current reading) */}
                        {isCurrentReading && (
                          <div 
                            className="absolute bottom-full mb-1 text-xs text-blue-700 font-bold whitespace-nowrap"
                            style={{ left: '50%', transform: 'translateX(-50%)' }}
                          >
                            {new Date(reading.date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Senaste provtagning: {new Date(november2025LithiumConcentrations[november2025LithiumConcentrations.length - 1].date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })} 
                  ({november2025LithiumConcentrations[november2025LithiumConcentrations.length - 1].concentration} mmol/L)
                </div>
              </div>
            </div>
          )}
        
          {/* Day detail panel - scrollable below chart */}
          {selectedDay && (
            <div className="p-6 bg-white border-t-2" style={{ borderColor: selectedDay.episode.color }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold" style={{ color: selectedDay.episode.color }}>
                  {new Date(selectedDay.day.timestamp).toLocaleDateString('sv-SE', { 
                    weekday: 'long', 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h2>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-bold text-2xl" style={{ 
                    color: selectedDay.day.level >= 9 ? '#dc2626' :
                           selectedDay.day.level >= 7 ? '#ea580c' :
                           selectedDay.day.level >= 5 ? '#f59e0b' : '#22c55e'
                  }}>
                    {selectedDay.day.level}
                  </span>
                  <span className="text-gray-600"> / 10 aktivering</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none px-3 py-1"
              >
                ✕
              </button>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              {selectedDay.day.eventCount} {selectedDay.day.eventCount === 1 ? 'händelse' : 'händelser'}
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {[...selectedDay.day.events].sort((a, b) => {
                const timeA = new Date((a.data as any).timestamp).getTime();
                const timeB = new Date((b.data as any).timestamp).getTime();
                return timeA - timeB;
              }).map((evt, idx) => {
                const timestamp = new Date((evt.data as any).timestamp);
                const timeStr = timestamp.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: EVENT_COLORS[evt.type] }}
                      />
                      <div className="text-xs text-gray-500 mt-1 font-mono">
                        {timeStr}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-1">
                        {MEDICAL_TERMINOLOGY.eventTypes[evt.type as keyof typeof MEDICAL_TERMINOLOGY.eventTypes]?.icon} {MEDICAL_TERMINOLOGY.eventTypes[evt.type as keyof typeof MEDICAL_TERMINOLOGY.eventTypes]?.label}
                      </div>
                      <div className="text-sm text-gray-700">
                        {evt.description}
                      </div>
                      
                      {evt.type === 'observation' && (
                        <div className="mt-2 text-xs text-gray-600">
                          <div><strong>Beteende:</strong> {(evt.data as FamilyObservation).behavior}</div>
                          <div className="mt-1">{(evt.data as FamilyObservation).context}</div>
                        </div>
                      )}
                      
                      {evt.type === 'session' && (
                        <div className="mt-2">
                          <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            (evt.data as TherapeuticSession).effectiveness === 'helped' ? 'bg-green-100 text-green-800' :
                            (evt.data as TherapeuticSession).effectiveness === 'neutral' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {(evt.data as TherapeuticSession).effectiveness === 'helped' ? 'Hjälpte' :
                             (evt.data as TherapeuticSession).effectiveness === 'neutral' ? 'Neutral' : 'Oklart'}
                          </div>
                        </div>
                      )}
                      
                      {evt.type === 'protocol' && (
                        <div className="mt-2 text-xs text-gray-600">
                          <div><strong>Markörer:</strong></div>
                          <ul className="list-disc list-inside mt-1">
                            {(evt.data as ActivationEvent).markers.slice(0, 3).map((marker, i) => (
                              <li key={i}>{translateMarker(marker)}</li>
                            ))}
                            {(evt.data as ActivationEvent).markers.length > 3 && (
                              <li>+ {(evt.data as ActivationEvent).markers.length - 3} fler...</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function translateSource(source: string): string {
  const map: Record<string, string> = {
    'self_report': 'Självrapport',
    'family_observation': 'Familjeobservation',
    'garmin': 'Garmin-data',
    'llm_pattern': 'LLM-mönster',
  };
  return map[source] || source;
}

function translateMarker(marker: string): string {
  const map: Record<string, string> = {
    // June 23 markers
    'circular_walking': 'Cirkelgång',
    'early_morning': 'Tidig morgon',
    'rain_walk': 'Promenad i regn',
    'ruminating_thoughts': 'Grubbeltankar',
    'multiple_showers': 'Flera duschar',
    'wanted_to_publish_online': 'Ville publicera online',
    // June 24 markers
    'early_waking': 'Tidigt uppvaknande',
    'everything_about_ai': 'Allt om AI',
    'could_not_stop_ai_work': 'Kunde inte sluta AI-arbete',
    'broke_promise': 'Bröt löfte',
    // June 25 markers
    'stuck_in_thought_loops': 'Fast i tankesnurror',
    'could_not_calm_down': 'Kunde inte lugna ner sig',
    // June 26 markers
    'still_elevated': 'Fortfarande förhöjd',
    'helped_with_garden': 'Hjälpte i trädgården',
    // June 27 markers
    'remorseful': 'Ångerful',
    'wants_to_minimize_problems': 'Vill minimera problem',
    'less_walking_fewer_showers': 'Mindre gång, färre duschar',
    // June 28 markers
    'calmer_computer_work': 'Lugnare datajobb',
    'wanted_to_finish_project': 'Ville slutföra projekt',
    'started_manic_control_tool': 'Började designa manikontrollverktyg',
    // June 29 markers
    'long_morning_walk': 'Lång morgonpromenad',
    'calmer': 'Lugnare',
    'middle_state': 'Mellanläge',
    'balanced_computer_use': 'Balanserad datoranvändning',
    // Legacy markers
    'thought_flight': 'Tankeflykt',
    'compulsive_behaviors': 'Tvångsbeteenden',
    'social_difficulty': 'Social svårighet',
    'improving': 'Förbättras',
    'calming_down': 'Lugnar ner sig',
    'expressing_remorse': 'Uttrycker ånger',
    'more_calm': 'Mer lugn',
    'stable': 'Stabil',
    'normal_social': 'Normal social',
    'stable_sleep': 'Stabil sömn',
  };
  return map[marker] || marker;
}

function translateMethod(method: string): string {
  const map: Record<string, string> = {
    'manual': 'Manuell',
    'virtual_button': 'Virtuell knapp',
    'physical_button': 'Fysisk knapp',
  };
  return map[method] || method;
}
