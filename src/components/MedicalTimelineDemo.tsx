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
  ComposedChart,
} from 'recharts';
import {
  genericActivationEvents,
  genericMedicationLogs,
  genericFamilyObservations,
  genericTherapeuticSessions,
  ActivationEvent,
  MedicationLog,
  FamilyObservation,
  TherapeuticSession,
} from '../data/genericDemoEpisode';

// Types
interface ChartDataPoint {
  date: string;
  timestamp: number;
  level: number;
}

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

const EVENT_PRIORITY = {
  protocol: 10,
  session: 7,
  medication: 5,
  observation: 3,
};

const EVENT_COLORS = {
  protocol: '#dc2626',
  session: '#8b5cf6',
  medication: '#22c55e',
  observation: '#3b82f6',
};

const MEDICAL_TERMINOLOGY = {
  eventTypes: {
    protocol: {
      icon: '🚨',
      label: 'BalansAI Protokoll',
      description: 'AI-stödda interventionsprotokoll aktiverat',
    },
    session: {
      icon: '📞',
      label: 'Förankringssamtal',
      description: 'Verklighetsförankring med familj och AI',
    },
    medication: {
      icon: '💊',
      label: 'Medicin (Olanzapin)',
      description: 'Medicinintag registrerat',
    },
    observation: {
      icon: '📝',
      label: 'Familjeobservation',
      description: 'Familjemedlem rapporterade beteende',
    },
  },
};

// Helper: Group events by day
function groupEventsByDay(
  activationEvents: ActivationEvent[],
  medicationLogs: MedicationLog[],
  therapeuticSessions: TherapeuticSession[],
  familyObservations: FamilyObservation[],
  startDate: string,
  endDate: string
): TimelineDay[] {
  const eventsByDate = new Map<string, TimelineEvent[]>();
  
  // Collect activation events
  activationEvents.forEach(ae => {
    const date = new Date(ae.timestamp);
    const dateStr = date.toDateString();
    if (!eventsByDate.has(dateStr)) eventsByDate.set(dateStr, []);
    
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
  medicationLogs.forEach(med => {
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
  
  // Collect sessions
  therapeuticSessions.forEach(session => {
    const date = new Date(session.timestamp);
    const dateStr = date.toDateString();
    if (!eventsByDate.has(dateStr)) eventsByDate.set(dateStr, []);
    eventsByDate.get(dateStr)!.push({
      type: 'session',
      date: dateStr,
      description: `${session.focus}`,
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
  
  // Generate all days
  const days: TimelineDay[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toDateString();
    const events = eventsByDate.get(dateStr) || [];
    const activation = activationEvents.find(
      ae => new Date(ae.timestamp).toDateString() === dateStr
    );
    
    const sortedEvents = events.sort(
      (a, b) => EVENT_PRIORITY[b.type] - EVENT_PRIORITY[a.type]
    );
    
    days.push({
      date: new Date(d).toISOString().split('T')[0],
      timestamp: d.getTime(),
      level: activation?.level || 5,
      events: sortedEvents,
      displayEvent: sortedEvents[0],
      eventCount: events.length,
    });
  }
  
  return days.sort((a, b) => a.timestamp - b.timestamp);
}

function translateMarker(marker: string): string {
  const map: Record<string, string> = {
    'early_waking': 'Tidigt uppvaknande',
    'increased_energy': 'Ökad energi',
    'reduced_sleep': 'Minskad sömn',
    'racing_thoughts': 'Rusande tankar',
    'increased_activity': 'Ökad aktivitet',
    'minimal_sleep': 'Minimal sömn',
    'rapid_speech': 'Snabbt tal',
    'difficulty_focusing': 'Svårt att fokusera',
    'multiple_projects': 'Flera projekt samtidigt',
    'still_elevated': 'Fortfarande förhöjd',
    'responding_to_structure': 'Svarar på struktur',
    'improving': 'Förbättras',
    'better_sleep': 'Bättre sömn',
    'calmer': 'Lugnare',
    'stable': 'Stabil',
    'normal_activity': 'Normal aktivitet',
    'good_insight': 'God insikt',
    'baseline': 'Baslinje',
    'stable_mood': 'Stabilt humör',
    'normal_sleep': 'Normal sömn',
  };
  return map[marker] || marker;
}

export function MedicalTimelineDemo() {
  const [selectedDay, setSelectedDay] = useState<TimelineDay | null>(null);
  
  const episodeData = useMemo(() => 
    groupEventsByDay(
      genericActivationEvents,
      genericMedicationLogs,
      genericTherapeuticSessions,
      genericFamilyObservations,
      '2024-01-15',
      '2024-01-21'
    ),
    []
  );
  
  const renderEventDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!payload || !payload.events || payload.events.length === 0) return null;

    const day = payload as TimelineDay;
    const color = EVENT_COLORS[day.displayEvent.type];
    const count = day.eventCount;
    const radius = count > 1 ? 10 : 7;

    return (
      <g onClick={() => setSelectedDay(day)} style={{ cursor: 'pointer' }}>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill={color}
          stroke="white"
          strokeWidth={2}
        />
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
    <div className="w-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <h2 className="text-2xl font-bold text-swedish-blue mb-2">
          Exempel: 7-dagars Hypomani Episode
        </h2>
        <p className="text-sm text-gray-600">
          Generisk demo som visar hur BalansAI hjälper familjer hantera hypomaniska episoder. 
          Klicka på en dag för detaljer.
        </p>
      </div>
      
      {/* Chart */}
      <div className="p-6" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={episodeData}
            onClick={(data) => {
              if (data?.activePayload?.[0]) {
                setSelectedDay(data.activePayload[0].payload as TimelineDay);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={100}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()} ${date.toLocaleDateString('sv-SE', { month: 'short' })}`;
              }}
            />
            <YAxis 
              domain={[0, 10]} 
              ticks={[0, 5, 10]}
              tick={{ fontSize: 12 }}
              label={{ value: 'Aktivering', angle: -90, position: 'insideLeft' }}
            />
            
            {/* Zones */}
            <ReferenceArea y1={0} y2={5} fill="#86efac" fillOpacity={0.1} />
            <ReferenceArea y1={5} y2={7} fill="#86efac" fillOpacity={0.2} />
            <ReferenceArea y1={7} y2={10} fill="#fbbf24" fillOpacity={0.2} />
            
            <Line 
              type="monotone" 
              dataKey="level" 
              stroke="#ea580c"
              strokeWidth={3}
              dot={renderEventDot}
            />
            <Tooltip />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Day detail panel */}
      {selectedDay && (
        <div className="p-6 bg-white border-t-2 border-orange-600">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-orange-600">
                  {new Date(selectedDay.timestamp).toLocaleDateString('sv-SE', { 
                    weekday: 'long', 
                    day: 'numeric',
                    month: 'long'
                  })}
                </h3>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-bold text-2xl" style={{ 
                    color: selectedDay.level >= 9 ? '#dc2626' :
                           selectedDay.level >= 7 ? '#ea580c' :
                           selectedDay.level >= 5 ? '#f59e0b' : '#22c55e'
                  }}>
                    {selectedDay.level}
                  </span>
                  <span className="text-gray-600"> / 10 aktivering</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              {selectedDay.eventCount} {selectedDay.eventCount === 1 ? 'händelse' : 'händelser'}
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {[...selectedDay.events].sort((a, b) => {
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
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">
                        {MEDICAL_TERMINOLOGY.eventTypes[evt.type]?.icon} {MEDICAL_TERMINOLOGY.eventTypes[evt.type]?.label}
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
                          <div className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
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
  );
}

