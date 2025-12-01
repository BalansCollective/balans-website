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

// TODO: Replace with actual forensic data imports when backend ready
// import { witnessStatements, digitalEvidence, physicalEvidence } from '../data/forensicCase';

// Types for our chart data
interface ChartDataPoint {
  date: string;
  timestamp: number;
  confidence: number; // 0-10 scale (replaces medical "level")
  event?: ForensicEvent;
}

interface EventMarker {
  date: string;
  timestamp: number;
  y: number;
  type: 'witness' | 'digital' | 'physical' | 'contradiction';
  data: WitnessStatement | DigitalEvidence | PhysicalEvidence | ContradictionFlag;
}

// Core forensic types
interface ForensicEvent {
  id: string;
  timestamp: string;
  source: string; // Witness name, camera ID, etc.
  confidence: number; // 0-10 (how reliable is this event?)
  description: string;
  location?: string;
  coordinates?: { lat: number; lon: number };
}

interface WitnessStatement extends ForensicEvent {
  witnessName: string;
  statementNumber: number; // For tracking multiple interviews
  context: string; // Why they were there, their perspective
}

interface DigitalEvidence extends ForensicEvent {
  evidenceType: 'cctv' | 'phone_record' | 'gps' | 'network_log';
  sourceDevice: string;
  metadata: Record<string, any>;
}

interface PhysicalEvidence extends ForensicEvent {
  evidenceType: 'forensic_sample' | 'document' | 'object';
  chainOfCustody: string[];
}

interface ContradictionFlag {
  id: string;
  type: 'spatial_ambiguity' | 'scale_ambiguity' | 'perspective_filtering' | 'audience_adaptation' | 'memory_compression' | 'temporal_impossible';
  event1: ForensicEvent;
  event2: ForensicEvent;
  confidence: number; // 0.0-1.0 (how confident is the contradiction detection?)
  explanation: string;
  status: 'unresolved' | 'false_alarm' | 'confirmed' | 'investigating';
  investigatorNotes?: string;
}

// New types for grouped events (adapted from medical timeline)
interface TimelineEvent {
  type: 'contradiction' | 'witness' | 'digital' | 'physical';
  date: string;
  description: string;
  data: ContradictionFlag | WitnessStatement | DigitalEvidence | PhysicalEvidence;
}

interface TimelineDay {
  date: string;
  timestamp: number;
  confidence: number; // Average confidence for events on this day
  events: TimelineEvent[];
  displayEvent: TimelineEvent;
  eventCount: number;
  hasContradiction: boolean; // Flag for visual highlighting
  
  // Multi-axis metrics (for Y-axis selection)
  metrics: {
    avgConfidence: number;       // 0-10: Average confidence of events
    eventDensity: number;         // Number of events this day
    witnessCount: number;         // Number of unique witnesses
    contradictionScore: number;   // 0-10: Aggregated contradiction probability
    locationSpread: number;       // Number of distinct locations
    digitalEvidenceRatio: number; // Percentage of events that are digital (0-1)
  };
}

// Y-Axis configuration
type YAxisMetric = 'confidence' | 'event_density' | 'witness_count' | 'contradiction_score' | 'location_spread';

interface YAxisConfig {
  key: YAxisMetric;
  label: string;
  description: string;
  unit: string;
  domain: [number, number]; // Min/max values
  color: string;
  icon: string;
}

const Y_AXIS_OPTIONS: Record<YAxisMetric, YAxisConfig> = {
  confidence: {
    key: 'confidence',
    label: 'Tillförlitlighet',
    description: 'Genomsnittlig tillförlitlighet för händelser (hög = mer tillförlitlig bevisning)',
    unit: '/ 10',
    domain: [0, 10],
    color: '#3b82f6', // blue
    icon: '✓',
  },
  event_density: {
    key: 'event_density',
    label: 'Händelsetäthet',
    description: 'Antal händelser per dag (många händelser = intensiv period)',
    unit: 'händelser',
    domain: [0, 20], // Will auto-adjust to data
    color: '#8b5cf6', // purple
    icon: '📊',
  },
  witness_count: {
    key: 'witness_count',
    label: 'Antal Vittnen',
    description: 'Antal unika vittnen aktiva denna dag',
    unit: 'vittnen',
    domain: [0, 10], // Will auto-adjust
    color: '#22c55e', // green
    icon: '👥',
  },
  contradiction_score: {
    key: 'contradiction_score',
    label: 'Motsägelsepoäng',
    description: 'Aggregerad sannolikhet för motsägelser (hög = mer konflikter att utreda)',
    unit: '/ 10',
    domain: [0, 10],
    color: '#dc2626', // red
    icon: '⚠️',
  },
  location_spread: {
    key: 'location_spread',
    label: 'Geografisk Spridning',
    description: 'Antal olika platser nämnda denna dag (hög = geografiskt komplex)',
    unit: 'platser',
    domain: [0, 10], // Will auto-adjust
    color: '#f59e0b', // orange
    icon: '📍',
  },
};

// Event priority for display (contradictions are highest priority)
const EVENT_PRIORITY = {
  contradiction: 10, // Always show contradictions first
  witness: 7,        // Witness statements important
  digital: 5,        // Digital evidence next
  physical: 3,       // Physical evidence lowest (often just one per day)
};

const EVENT_COLORS = {
  contradiction: '#dc2626',  // red-600 (critical - needs investigation)
  witness: '#8b5cf6',        // purple-500 (human testimony)
  digital: '#3b82f6',        // blue-500 (automated systems)
  physical: '#22c55e',       // green-500 (tangible evidence)
};

// UBIQUITOUS LANGUAGE - Forensic Timeline Domain
// Centralized terminology for consistency across UI
const FORENSIC_TERMINOLOGY = {
  eventTypes: {
    contradiction: {
      icon: '⚠️',
      label: 'Automatiskt Upptäckt Motsägelse',
      shortLabel: 'Motsägelse',
      description: 'Chronicle upptäckte potentiell motsägelse',
      definition: 'Automatiskt system som flaggar motsägelser mellan vittnen, omöjliga restider, eller andra logiska konflikter. Kräver utredares bedömning.',
    },
    witness: {
      icon: '👤',
      label: 'Vittnesmål',
      shortLabel: 'Vittne',
      description: 'Vittnesmål från förhör',
      definition: 'Information från vittnesförhör. Kan vara första-, andra- eller tredjehandsuppgifter. Tillförlitlighet varierar.',
    },
    digital: {
      icon: '📱',
      label: 'Digital Bevisning',
      shortLabel: 'Digital',
      description: 'Kameror, telefon, GPS, nätverksloggar',
      definition: 'Automatiskt genererad data från digitala system. Generellt hög tillförlitlighet men kräver verifiering av tidsstämplar och metadata.',
    },
    physical: {
      icon: '🔬',
      label: 'Fysisk Bevisning',
      shortLabel: 'Fysisk',
      description: 'Forensiska prov, dokument, föremål',
      definition: 'Fysiska bevis med dokumenterad beviskontroll. Högt bevisvärde men tidsstämplar ofta approximativa.',
    },
  },
  
  confidenceLevels: {
    label: 'Tillförlitlighet',
    unit: '/ 10',
    definition: 'Hur tillförlitlig är denna händelse? 0-3: Låg (tredje hand, oklar källa), 4-6: Medel (normal vittnesutsaga), 7-10: Hög (digital bevis, flera källor).',
    zones: {
      high: { threshold: 7, color: '#22c55e', label: 'Hög', definition: 'Hög tillförlitlighet - digital bevis eller bekräftad av flera källor' },
      medium: { threshold: 4, color: '#f59e0b', label: 'Medel', definition: 'Normal tillförlitlighet - standardvittnemål' },
      low: { threshold: 0, color: '#dc2626', label: 'Låg', definition: 'Låg tillförlitlighet - oklar källa, tredje hand, eller motsägelsefull' },
    },
  },
  
  contradictionTypes: {
    spatial_ambiguity: {
      label: 'Spatial Tvetydighet',
      description: 'Olika platser med samma namn (t.ex. Östra grinden vs. Västra grinden)',
      definition: 'Händelser verkar motsäga varandra men avser olika platser. Kräver platstaggning för klarhet.',
      investigationHint: 'Fråga vittnen: Exakt vilken plats? Kan du peka på karta?',
    },
    scale_ambiguity: {
      label: 'Skaltvetydighet',
      description: 'Olika skalor/omfång (t.ex. provtagning vs. huvudhändelse)',
      definition: 'Händelser verkar motsäga varandra men avser olika omfång av samma aktivitet.',
      investigationHint: 'Fråga vittnen: Pratar vi om hela händelsen eller en del?',
    },
    perspective_filtering: {
      label: 'Perspektivfiltrering',
      description: 'Olika observatörer ser olika delar av händelsekedjan',
      definition: 'Vittnen rapporterar olika "början" eller "slut" baserat på vad de såg.',
      investigationHint: 'Kartlägg: Var stod vittnet? Vad kunde de se därifrån?',
    },
    audience_adaptation: {
      label: 'Publik-anpassning',
      description: 'Samma person ger olika siffror till olika personer',
      definition: 'Vittne anpassar detaljer baserat på mottagare (t.ex. "10 minuter" till polis vs. "ungefär en kvart" till kollega).',
      investigationHint: 'Intervjua samma vittne flera gånger, jämför formuleringar.',
    },
    memory_compression: {
      label: 'Minneskompression',
      description: 'Fler-dagshändelse ihågkommen som enskild händelse',
      definition: 'Vittne minns process som enskild händelse (t.ex. "renoveringen gjordes måndag" när den pågick måndag-fredag).',
      investigationHint: 'Fråga vittnen: När började det? Hur länge pågick det? När slutade det?',
    },
    temporal_impossible: {
      label: 'Tidsomöjlighet',
      description: 'Restid eller händelsesekvens fysiskt omöjlig',
      definition: 'Matematiskt/fysiskt omöjlig tidslinje (t.ex. vittne påstår de körde 50km på 10 minuter).',
      investigationHint: 'Kontrollera: Avstånd, restid, tidsstämplar från GPS/kameror.',
    },
  },
  
  status: {
    unresolved: { label: 'Ej Utredd', color: 'orange', definition: 'Nyupptäckt motsägelse, inte undersökt än' },
    investigating: { label: 'Under Utredning', color: 'blue', definition: 'Utredare arbetar med detta' },
    false_alarm: { label: 'Falsklarm', color: 'gray', definition: 'Bekräftat - ingen verklig motsägelse' },
    confirmed: { label: 'Bekräftad Motsägelse', color: 'red', definition: 'Bekräftat - verklig motsägelse, kräver upplösning' },
  },
  
  glossary: {
    beviskontroll: {
      term: 'Beviskontroll (Chain of Custody)',
      definition: 'Dokumenterad kedja av vem som hanterat bevis när. Juridiskt krav enligt Brottsdatalagen.',
    },
    tidsstämpel: {
      term: 'Tidsstämpel',
      definition: 'När händelse inträffade. Digital bevis: exakt. Vittnesmål: ofta approximativ. Fysisk bevis: oftast oklar.',
    },
    förundersökningsprotokoll: {
      term: 'Förundersökningsprotokoll',
      definition: 'Polisutredningens huvuddokument. Måste innehålla kronologisk händelsekedja. Chronicle kan exportera dit.',
    },
    objektivitetsprincipen: {
      term: 'Objektivitetsprincipen',
      definition: 'Juridisk princip: polis/åklagare måste dokumentera bevis som talar för misstänkts oskuld. Chronicle hjälper identifiera detta.',
    },
  },
};

// Mock data for development (until backend ready)
const mockWitnessStatements: WitnessStatement[] = [
  {
    id: 'w1',
    timestamp: '2025-01-15T14:30:00',
    source: 'Witness A',
    witnessName: 'Johan Andersson',
    statementNumber: 1,
    confidence: 6,
    description: 'Såg misstänkt vid Östra grinden kl. 14:30',
    location: 'Östra grinden',
    context: 'Var på väg hem från jobbet, gick förbi grinden',
  },
  {
    id: 'w2',
    timestamp: '2025-01-15T14:45:00',
    source: 'Witness B',
    witnessName: 'Maria Svensson',
    statementNumber: 1,
    confidence: 7,
    description: 'Hörde höga röster vid Västra grinden omkring kl. 14:45',
    location: 'Västra grinden',
    context: 'Arbetade i kontoret med öppet fönster mot gården',
  },
];

const mockDigitalEvidence: DigitalEvidence[] = [
  {
    id: 'd1',
    timestamp: '2025-01-15T14:32:15',
    source: 'CCTV Camera 3',
    evidenceType: 'cctv',
    sourceDevice: 'Hikvision DS-2CD2142FWD',
    confidence: 9,
    description: 'Kamera 3 visar person vid Östra grinden',
    location: 'Östra grinden',
    metadata: { resolution: '1920x1080', frameNumber: 1234 },
  },
];

const mockContradictions: ContradictionFlag[] = [
  {
    id: 'c1',
    type: 'spatial_ambiguity',
    event1: mockWitnessStatements[0] as ForensicEvent,
    event2: mockWitnessStatements[1] as ForensicEvent,
    confidence: 0.95,
    explanation: 'Båda vittnen nämner "grinden" men olika platser (Östra vs. Västra). Möjlig spatial tvetydighet.',
    status: 'unresolved',
  },
];

// AI-Assisted Query Interface
interface AIQuery {
  rawQuery: string;
  interpretation: {
    filters?: {
      witnesses?: string[];
      locations?: string[];
      dateRange?: { start: string; end: string };
      eventTypes?: string[];
    };
    yAxes?: {
      primary?: YAxisMetric;
      secondary?: YAxisMetric;
      tertiary?: YAxisMetric;
    };
    zoomLevel?: 'overview' | 'week' | 'day';
    intent?: 'find_contradictions' | 'witness_timeline' | 'location_analysis' | 'general_overview';
  };
  confidence: number; // 0-1 (how confident is AI interpretation?)
  suggestions?: string[]; // Follow-up questions AI suggests
}

export default function ForensicTimeline() {
  // TODO: Replace with actual data fetching
  const [selectedCase, setSelectedCase] = useState<'mock_case_1' | null>('mock_case_1');
  const [zoomLevel, setZoomLevel] = useState<'overview' | 'week' | 'day'>('week');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showGlossary, setShowGlossary] = useState(false);
  
  // Multi-axis state
  const [primaryYAxis, setPrimaryYAxis] = useState<YAxisMetric>('confidence');
  const [secondaryYAxis, setSecondaryYAxis] = useState<YAxisMetric | null>(null);
  const [tertiaryYAxis, setTertiaryYAxis] = useState<YAxisMetric | null>(null);
  
  // AI-Assisted Configuration
  const [aiQuery, setAIQuery] = useState<string>('');
  const [aiMode, setAIMode] = useState<'hidden' | 'input' | 'interpreting' | 'applied'>('hidden');
  const [lastAIInterpretation, setLastAIInterpretation] = useState<AIQuery | null>(null);
  const [showManualControls, setShowManualControls] = useState(false);

  /**
   * Handle AI-assisted query (mock implementation)
   * 
   * In production, this would call:
   * - Weaver MCP server for intent classification
   * - Chronicle backend for query planning
   * - LLM for natural language understanding
   * 
   * For now, simple pattern matching demo
   */
  const handleAIQuery = async (query: string) => {
    setAIMode('interpreting');
    
    // TODO: Replace with actual AI service call
    // await fetch('/api/chronicle/interpret-query', { method: 'POST', body: JSON.stringify({ query }) })
    
    // Mock interpretation (pattern matching demo)
    const interpretation: AIQuery['interpretation'] = {};
    const suggestions: string[] = [];
    
    // Detect intent from query
    if (query.toLowerCase().includes('motsägelse') || query.toLowerCase().includes('konflikt')) {
      interpretation.intent = 'find_contradictions';
      interpretation.yAxes = {
        primary: 'contradiction_score',
        secondary: 'confidence',
      };
      suggestions.push('Visa mest troliga motsägelser först');
      suggestions.push('Analysera spatial tvetydighet');
    }
    
    if (query.toLowerCase().includes('vittne') || query.toLowerCase().includes('johan') || query.toLowerCase().includes('maria')) {
      interpretation.intent = 'witness_timeline';
      interpretation.yAxes = {
        primary: 'witness_count',
        secondary: 'confidence',
      };
      
      // Extract witness names (simple pattern)
      const matches = query.match(/\b[A-ZÅÄÖ][a-zåäö]+\b/g);
      if (matches) {
        interpretation.filters = {
          ...interpretation.filters,
          witnesses: matches,
        };
      }
      
      suggestions.push('Jämför med digital bevisning');
      suggestions.push('Visa händelser där båda var närvarande');
    }
    
    if (query.toLowerCase().includes('plats') || query.toLowerCase().includes('grind') || query.toLowerCase().includes('gård')) {
      interpretation.intent = 'location_analysis';
      interpretation.yAxes = {
        primary: 'location_spread',
        secondary: 'event_density',
      };
      suggestions.push('Visa på karta');
      suggestions.push('Kontrollera restider');
    }
    
    // Detect date references
    if (query.toLowerCase().includes('igår') || query.toLowerCase().includes('idag') || query.toLowerCase().includes('förra veckan')) {
      interpretation.zoomLevel = 'day';
    }
    
    // High reliability filter
    if (query.toLowerCase().includes('hög tillförlitlighet') || query.toLowerCase().includes('säker')) {
      interpretation.yAxes = {
        primary: 'confidence',
        secondary: 'event_density',
      };
    }
    
    // Apply interpretation to state
    if (interpretation.yAxes) {
      if (interpretation.yAxes.primary) setPrimaryYAxis(interpretation.yAxes.primary);
      if (interpretation.yAxes.secondary) setSecondaryYAxis(interpretation.yAxes.secondary);
      if (interpretation.yAxes.tertiary) setTertiaryYAxis(interpretation.yAxes.tertiary);
    }
    
    if (interpretation.zoomLevel) {
      setZoomLevel(interpretation.zoomLevel);
    }
    
    // TODO: Apply filters when backend ready
    
    // Store interpretation
    setLastAIInterpretation({
      rawQuery: query,
      interpretation,
      confidence: 0.85, // Mock confidence
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    });
    
    setAIMode('applied');
  };
  
  // Helper: Format filters for display
  const formatFilters = (filters: AIQuery['interpretation']['filters']): string => {
    const parts: string[] = [];
    if (filters?.witnesses) parts.push(`Vittnen: ${filters.witnesses.join(', ')}`);
    if (filters?.locations) parts.push(`Platser: ${filters.locations.join(', ')}`);
    if (filters?.dateRange) parts.push(`Datum: ${filters.dateRange.start} - ${filters.dateRange.end}`);
    if (filters?.eventTypes) parts.push(`Typer: ${filters.eventTypes.join(', ')}`);
    return parts.join(' | ') || 'Inga filter';
  };
  
  // Helper: Format Y-axes for display
  const formatYAxes = (yAxes: AIQuery['interpretation']['yAxes']): string => {
    const parts: string[] = [];
    if (yAxes?.primary) parts.push(`Primär: ${Y_AXIS_OPTIONS[yAxes.primary].label}`);
    if (yAxes?.secondary) parts.push(`Sekundär: ${Y_AXIS_OPTIONS[yAxes.secondary].label}`);
    if (yAxes?.tertiary) parts.push(`Tertiär: ${Y_AXIS_OPTIONS[yAxes.tertiary].label}`);
    return parts.join(', ');
  };

  // Group events by day (adapted from medical timeline)
  const timelineDays = useMemo(() => {
    // TODO: Implement actual grouping when data available
    // For now, return empty array
    return [] as TimelineDay[];
  }, [selectedCase]);

  // Helper: Get metric value from TimelineDay
  const getMetricValue = (day: TimelineDay, metric: YAxisMetric): number => {
    switch (metric) {
      case 'confidence':
        return day.metrics.avgConfidence;
      case 'event_density':
        return day.metrics.eventDensity;
      case 'witness_count':
        return day.metrics.witnessCount;
      case 'contradiction_score':
        return day.metrics.contradictionScore;
      case 'location_spread':
        return day.metrics.locationSpread;
    }
  };

  // Prepare chart data for Recharts (when backend ready)
  const chartData = useMemo(() => {
    return timelineDays.map((day) => ({
      date: day.date,
      timestamp: day.timestamp,
      // Primary axis (always included)
      [primaryYAxis]: getMetricValue(day, primaryYAxis),
      // Secondary axis (if selected)
      ...(secondaryYAxis ? { [secondaryYAxis]: getMetricValue(day, secondaryYAxis) } : {}),
      // Tertiary axis (if selected)
      ...(tertiaryYAxis ? { [tertiaryYAxis]: getMetricValue(day, tertiaryYAxis) } : {}),
      // Store full day for click handlers
      _day: day,
    }));
  }, [timelineDays, primaryYAxis, secondaryYAxis, tertiaryYAxis]);

  /**
   * Example Recharts implementation (when backend ready):
   * 
   * <ResponsiveContainer width="100%" height={400}>
   *   <ComposedChart data={chartData}>
   *     <CartesianGrid strokeDasharray="3 3" />
   *     <XAxis dataKey="date" />
   *     
   *     // Primary Y-Axis (left side)
   *     <YAxis 
   *       yAxisId="primary"
   *       domain={Y_AXIS_OPTIONS[primaryYAxis].domain}
   *       label={{ 
   *         value: Y_AXIS_OPTIONS[primaryYAxis].label, 
   *         angle: -90, 
   *         position: 'insideLeft' 
   *       }}
   *     />
   *     <Line 
   *       yAxisId="primary"
   *       type="monotone" 
   *       dataKey={primaryYAxis} 
   *       stroke={Y_AXIS_OPTIONS[primaryYAxis].color}
   *       strokeWidth={3}
   *       dot={{ r: 5 }}
   *     />
   *     
   *     // Secondary Y-Axis (right side, if selected)
   *     {secondaryYAxis && (
   *       <>
   *         <YAxis 
   *           yAxisId="secondary"
   *           orientation="right"
   *           domain={Y_AXIS_OPTIONS[secondaryYAxis].domain}
   *           label={{ 
   *             value: Y_AXIS_OPTIONS[secondaryYAxis].label, 
   *             angle: 90, 
   *             position: 'insideRight' 
   *           }}
   *         />
   *         <Line 
   *           yAxisId="secondary"
   *           type="monotone" 
   *           dataKey={secondaryYAxis} 
   *           stroke={Y_AXIS_OPTIONS[secondaryYAxis].color}
   *           strokeWidth={2}
   *           dot={{ r: 4 }}
   *           strokeDasharray="5 5"
   *         />
   *       </>
   *     )}
   *     
   *     // Tertiary Y-Axis (also right side, offset, if selected)
   *     {tertiaryYAxis && (
   *       <>
   *         <YAxis 
   *           yAxisId="tertiary"
   *           orientation="right"
   *           domain={Y_AXIS_OPTIONS[tertiaryYAxis].domain}
   *           // Offset to avoid overlapping with secondary
   *           // Use custom tick positioning or second right axis
   *         />
   *         <Line 
   *           yAxisId="tertiary"
   *           type="monotone" 
   *           dataKey={tertiaryYAxis} 
   *           stroke={Y_AXIS_OPTIONS[tertiaryYAxis].color}
   *           strokeWidth={2}
   *           dot={{ r: 3 }}
   *           strokeDasharray="2 2"
   *         />
   *       </>
   *     )}
   *     
   *     <Tooltip 
   *       content={({ payload }) => {
   *         if (!payload || payload.length === 0) return null;
   *         const day = payload[0].payload._day as TimelineDay;
   *         return (
   *           <div className="bg-white p-3 shadow-lg rounded border">
   *             <p className="font-semibold">{day.date}</p>
   *             {payload.map((entry, idx) => (
   *               <p key={idx} style={{ color: entry.color }}>
   *                 {Y_AXIS_OPTIONS[entry.dataKey as YAxisMetric].label}: {entry.value}
   *               </p>
   *             ))}
   *             <p className="text-xs text-gray-500 mt-1">
   *               {day.eventCount} händelser
   *             </p>
   *           </div>
   *         );
   *       }}
   *     />
   *   </ComposedChart>
   * </ResponsiveContainer>
   */

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chronicle Forensics</h1>
              <p className="mt-2 text-gray-600">
                Automatisk tidslinjevalidering för polisutredningar
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowManualControls(!showManualControls)}
                className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                title={showManualControls ? "Dölj manuella kontroller" : "Visa manuella kontroller"}
              >
                {showManualControls ? '🤖 AI-Läge' : '⚙️ Manuellt'}
              </button>
              <button
                onClick={() => setShowGlossary(!showGlossary)}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                📖 Ordlista
              </button>
            </div>
          </div>

          {/* AI Query Interface (Primary UX) */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xl">🤖</span>
              </div>
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => {
                  setAIQuery(e.target.value);
                  if (aiMode === 'hidden') setAIMode('input');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && aiQuery.trim()) {
                    handleAIQuery(aiQuery);
                  }
                }}
                placeholder="Fråga Chronicle... (t.ex. 'Visa motsägelser mellan Johan och Maria' eller 'Analysera händelser vid Östra grinden')"
                className="w-full pl-12 pr-32 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-2">
                {aiQuery.trim() && (
                  <>
                    <button
                      onClick={() => handleAIQuery(aiQuery)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Analysera
                    </button>
                    <button
                      onClick={() => {
                        setAIQuery('');
                        setAIMode('hidden');
                      }}
                      className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* AI Interpretation Display */}
            {lastAIInterpretation && aiMode === 'applied' && (
              <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      🤖 Chronicle tolkade din fråga:
                    </p>
                    <p className="text-sm text-blue-800 mb-3">
                      "{lastAIInterpretation.rawQuery}"
                    </p>
                    
                    <div className="text-xs text-blue-700 space-y-1">
                      {lastAIInterpretation.interpretation.filters && (
                        <p><strong>Filter:</strong> {formatFilters(lastAIInterpretation.interpretation.filters)}</p>
                      )}
                      {lastAIInterpretation.interpretation.yAxes && (
                        <p><strong>Y-Axlar:</strong> {formatYAxes(lastAIInterpretation.interpretation.yAxes)}</p>
                      )}
                      {lastAIInterpretation.interpretation.zoomLevel && (
                        <p><strong>Zoom:</strong> {lastAIInterpretation.interpretation.zoomLevel}</p>
                      )}
                    </div>

                    {lastAIInterpretation.suggestions && lastAIInterpretation.suggestions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-blue-300">
                        <p className="text-xs font-semibold text-blue-900 mb-2">Förslag på uppföljning:</p>
                        <div className="flex flex-wrap gap-2">
                          {lastAIInterpretation.suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setAIQuery(suggestion);
                                handleAIQuery(suggestion);
                              }}
                              className="px-3 py-1 bg-white text-blue-700 text-xs rounded-full hover:bg-blue-100 transition-colors border border-blue-300"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setAIMode('hidden')}
                    className="ml-4 text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Quick AI Prompts */}
            {aiMode === 'hidden' && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500 self-center">Snabbfrågor:</span>
                {[
                  'Visa alla motsägelser',
                  'Analysera händelser igår',
                  'Jämför vittnen Johan och Maria',
                  'Visa tidslinje med hög tillförlitlighet',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setAIQuery(prompt);
                      handleAIQuery(prompt);
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Manual Controls (Collapsed by default, AI-first UX) */}
          {showManualControls && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4 italic">
                💡 Tips: Använd AI-frågor ovan för snabbare konfiguration. Manuella kontroller för precis justering.
              </p>

              {/* Case selector */}
              <div className="flex gap-2">
                <select
                  value={selectedCase || ''}
                  onChange={(e) => setSelectedCase(e.target.value as 'mock_case_1')}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="mock_case_1">Mock Case 1 (Development)</option>
                </select>

                {/* Zoom controls */}
                <div className="flex gap-1 ml-auto">
                  {(['overview', 'week', 'day'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setZoomLevel(level)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        zoomLevel === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level === 'overview' && '📅 Översikt'}
                      {level === 'week' && '📊 Vecka'}
                      {level === 'day' && '🔍 Dag'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Glossary (collapsible) */}
        {showGlossary && (
          <div className="bg-blue-50 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📖 Ordlista & Begrepp
            </h2>

            <div className="space-y-6">
              {/* Event Types */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Händelsetyper</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(FORENSIC_TERMINOLOGY.eventTypes).map(([key, term]) => (
                    <div key={key} className="bg-white rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{term.icon}</span>
                        <span className="font-medium text-gray-900">{term.label}</span>
                      </div>
                      <p className="text-sm text-gray-600">{term.definition}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contradiction Types */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Motsägelsetyper</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(FORENSIC_TERMINOLOGY.contradictionTypes).map(([key, term]) => (
                    <div key={key} className="bg-white rounded p-3">
                      <div className="font-medium text-gray-900 mb-1">{term.label}</div>
                      <p className="text-sm text-gray-600 mb-2">{term.definition}</p>
                      <p className="text-xs text-blue-600 italic">{term.investigationHint}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Glossary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Juridiska Begrepp</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(FORENSIC_TERMINOLOGY.glossary).map(([key, term]) => (
                    <div key={key} className="bg-white rounded p-3">
                      <div className="font-medium text-gray-900 mb-1">{term.term}</div>
                      <p className="text-sm text-gray-600">{term.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Timeline Area (placeholder for now) */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tidslinje</h2>
          
          {/* Y-Axis Selector (Manual or AI-configured) */}
          {showManualControls && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Y-Axel Konfiguration 
                {lastAIInterpretation && aiMode === 'applied' && (
                  <span className="ml-2 text-xs text-blue-600">(Konfigurerad av AI)</span>
                )}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Primary Y-Axis */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Primär Y-Axel (obligatorisk)
                  </label>
                  <select
                    value={primaryYAxis}
                    onChange={(e) => setPrimaryYAxis(e.target.value as YAxisMetric)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {Object.entries(Y_AXIS_OPTIONS).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.icon} {config.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {Y_AXIS_OPTIONS[primaryYAxis].description}
                  </p>
                </div>

                {/* Secondary Y-Axis */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Sekundär Y-Axel (valfri)
                  </label>
                  <select
                    value={secondaryYAxis || ''}
                    onChange={(e) => setSecondaryYAxis(e.target.value ? e.target.value as YAxisMetric : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    disabled={!secondaryYAxis && tertiaryYAxis !== null} // Can't skip to tertiary
                  >
                    <option value="">Ingen</option>
                    {Object.entries(Y_AXIS_OPTIONS)
                      .filter(([key]) => key !== primaryYAxis && key !== tertiaryYAxis)
                      .map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.icon} {config.label}
                        </option>
                      ))}
                  </select>
                  {secondaryYAxis && (
                    <p className="text-xs text-gray-500 mt-1">
                      {Y_AXIS_OPTIONS[secondaryYAxis].description}
                    </p>
                  )}
                </div>

                {/* Tertiary Y-Axis */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Tertiär Y-Axel (valfri)
                  </label>
                  <select
                    value={tertiaryYAxis || ''}
                    onChange={(e) => setTertiaryYAxis(e.target.value ? e.target.value as YAxisMetric : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    disabled={!secondaryYAxis} // Must have secondary before tertiary
                  >
                    <option value="">Ingen</option>
                    {Object.entries(Y_AXIS_OPTIONS)
                      .filter(([key]) => key !== primaryYAxis && key !== secondaryYAxis)
                      .map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.icon} {config.label}
                        </option>
                      ))}
                  </select>
                  {tertiaryYAxis && (
                    <p className="text-xs text-gray-500 mt-1">
                      {Y_AXIS_OPTIONS[tertiaryYAxis].description}
                    </p>
                  )}
                </div>
              </div>

              {/* Active axes legend */}
              <div className="mt-3 flex gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: Y_AXIS_OPTIONS[primaryYAxis].color }}
                  />
                  <span className="font-medium">{Y_AXIS_OPTIONS[primaryYAxis].label}</span>
                </div>
                {secondaryYAxis && (
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: Y_AXIS_OPTIONS[secondaryYAxis].color }}
                    />
                    <span className="font-medium">{Y_AXIS_OPTIONS[secondaryYAxis].label}</span>
                  </div>
                )}
                {tertiaryYAxis && (
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: Y_AXIS_OPTIONS[tertiaryYAxis].color }}
                    />
                    <span className="font-medium">{Y_AXIS_OPTIONS[tertiaryYAxis].label}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Compact Y-Axis display when AI mode active */}
          {!showManualControls && (
            <div className="mb-4 flex items-center gap-3 text-sm">
              <span className="text-gray-600">Y-Axlar:</span>
              <div className="flex gap-2">
                <div className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: Y_AXIS_OPTIONS[primaryYAxis].color }}
                  />
                  <span className="font-medium">{Y_AXIS_OPTIONS[primaryYAxis].label}</span>
                </div>
                {secondaryYAxis && (
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: Y_AXIS_OPTIONS[secondaryYAxis].color }}
                    />
                    <span className="font-medium">{Y_AXIS_OPTIONS[secondaryYAxis].label}</span>
                  </div>
                )}
                {tertiaryYAxis && (
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: Y_AXIS_OPTIONS[tertiaryYAxis].color }}
                    />
                    <span className="font-medium">{Y_AXIS_OPTIONS[tertiaryYAxis].label}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Filter controls */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilterType(null)}
              className={`px-3 py-1 rounded text-sm ${
                filterType === null ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Alla
            </button>
            {Object.entries(FORENSIC_TERMINOLOGY.eventTypes).map(([key, term]) => (
              <button
                key={key}
                onClick={() => setFilterType(key)}
                className={`px-3 py-1 rounded text-sm ${
                  filterType === key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {term.icon} {term.shortLabel}
              </button>
            ))}
          </div>

          {/* Placeholder for actual timeline visualization */}
          <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-2">
                🚧 Multi-Axis Tidslinje under utveckling
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Backend-integration pågår. UI-komponenter redo.
              </p>
              <div className="text-left inline-block text-xs text-gray-500">
                <p><strong>Aktiva Y-axlar:</strong></p>
                <p>• Primär: {Y_AXIS_OPTIONS[primaryYAxis].icon} {Y_AXIS_OPTIONS[primaryYAxis].label}</p>
                {secondaryYAxis && <p>• Sekundär: {Y_AXIS_OPTIONS[secondaryYAxis].icon} {Y_AXIS_OPTIONS[secondaryYAxis].label}</p>}
                {tertiaryYAxis && <p>• Tertiär: {Y_AXIS_OPTIONS[tertiaryYAxis].icon} {Y_AXIS_OPTIONS[tertiaryYAxis].label}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Contradiction Panel (placeholder) */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ⚠️ Upptäckta Motsägelser
          </h2>

          {mockContradictions.length === 0 ? (
            <p className="text-gray-500">Inga motsägelser upptäckta</p>
          ) : (
            <div className="space-y-3">
              {mockContradictions.map((contradiction) => (
                <div
                  key={contradiction.id}
                  className="border-l-4 border-red-500 bg-red-50 p-4 rounded"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          {FORENSIC_TERMINOLOGY.contradictionTypes[contradiction.type].label}
                        </span>
                        <span className="text-sm text-gray-500">
                          Tillförlitlighet: {Math.round(contradiction.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {contradiction.explanation}
                      </p>
                      <p className="text-xs text-gray-500 italic">
                        Utredningshjälp: {FORENSIC_TERMINOLOGY.contradictionTypes[contradiction.type].investigationHint}
                      </p>
                    </div>
                    <select
                      value={contradiction.status}
                      onChange={(e) => {
                        // TODO: Update contradiction status in backend
                        console.log('Update status:', e.target.value);
                      }}
                      className="ml-4 px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      {Object.entries(FORENSIC_TERMINOLOGY.status).map(([key, status]) => (
                        <option key={key} value={key}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Development Status */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">🚧 Utvecklingsstatus</h3>
          <div className="text-sm text-yellow-800 space-y-1">
            <p>✅ UI-komponenter redo (fork från Medical Timeline)</p>
            <p>✅ Typer definierade (ForensicEvent, ContradictionFlag, etc.)</p>
            <p>✅ Ubiquitous Language (svensk forensisk terminologi)</p>
            <p>✅ Multi-axis Y-axel support (välj 1-3 metriker samtidigt)</p>
            <p>⏳ Backend-integration (Memgraph + SQLite) pågår</p>
            <p>⏳ Svenska NLP (KB-BERT) integration kommande</p>
            <p>⏳ Kartvy (OpenStreetMap + Leaflet) kommande</p>
          </div>
          
          <div className="mt-3 pt-3 border-t border-yellow-300">
            <p className="text-xs font-semibold text-yellow-900 mb-2">Tillgängliga Y-Axlar:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-yellow-800">
              {Object.values(Y_AXIS_OPTIONS).map((axis) => (
                <div key={axis.key} className="flex items-center gap-1">
                  <span>{axis.icon}</span>
                  <span>{axis.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

