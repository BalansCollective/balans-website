import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

// BRAND COLORS (Sacred Alliance Palette)
const COLORS = {
  swedishBlue: '#2c5aa0',
  birchWhite: '#f8f6f0',
  birchWood: '#d4b896',
  threadGold: '#c9a96e',
  sageGreen: '#8faa8b',
  gentleSilver: '#b8c5d1',
  alliancePurple: '#6b5b95',
  truthCopper: '#b87333',
};

// Mock data for realistic demo (Nov 2024 scenario)
const MOCK_DATA = {
  patient: {
    name: "Samuel Lindgren",
    personnummer: "910206-1554",
    lastUpdate: new Date("2024-11-07T14:30:00"),
    activationLevel: 6,
    status: 'stable' as const,
  },
  todaysMedication: [
    { 
      id: 1, 
      day: 'Idag (7 nov)',
      name: 'Olanzapin', 
      dose: '15mg', 
      time: '22:00', 
      taken: true, 
      actualTime: '22:05', 
      status: 'taken' as const,
      source: 'physical_button' as const,
    },
    { 
      id: 2, 
      day: 'Idag (7 nov)',
      name: 'Zopiklon', 
      dose: '7.5mg', 
      time: '22:00', 
      taken: true, 
      actualTime: '22:05', 
      status: 'taken' as const,
      source: 'physical_button' as const,
    },
    { 
      id: 3, 
      day: 'Idag (7 nov)',
      name: 'Lithium', 
      dose: '2 tabletter (morgon)', 
      time: '08:00', 
      taken: false, 
      actualTime: null, 
      status: 'missed' as const,
      source: null as ('physical_button' | 'app' | null),
    },
    { 
      id: 4, 
      day: 'Idag (7 nov)',
      name: 'Lithium', 
      dose: '3 tabletter (kväll)', 
      time: '22:00', 
      taken: true, 
      actualTime: '22:05', 
      status: 'taken' as const,
      source: 'physical_button' as const,
    },
  ],
  yesterdaysMedication: [
    { 
      id: 5, 
      day: 'Igår (6 nov)',
      name: 'Olanzapin', 
      dose: '15mg', 
      time: '22:00', 
      taken: true, 
      actualTime: '22:12', 
      status: 'taken' as const,
      source: 'physical_button' as const,
    },
    { 
      id: 6, 
      day: 'Igår (6 nov)',
      name: 'Zopiklon', 
      dose: '7.5mg', 
      time: '22:00', 
      taken: true, 
      actualTime: '22:12', 
      status: 'taken' as const,
      source: 'physical_button' as const,
    },
    { 
      id: 7, 
      day: 'Igår (6 nov)',
      name: 'Lithium', 
      dose: '2 tabletter (morgon)', 
      time: '08:00', 
      taken: false, 
      actualTime: null, 
      status: 'missed' as const,
      source: null as ('physical_button' | 'app' | null),
    },
    { 
      id: 8, 
      day: 'Igår (6 nov)',
      name: 'Lithium', 
      dose: '3 tabletter (kväll)', 
      time: '22:00', 
      taken: true, 
      actualTime: '22:12', 
      status: 'taken' as const,
      source: 'physical_button' as const,
    },
  ],
  twoDaysAgoMedication: [
    { 
      id: 9, 
      day: '5 nov',
      name: 'Olanzapin', 
      dose: '15mg', 
      time: '22:00', 
      taken: true, 
      actualTime: '22:30', 
      status: 'taken' as const,
      source: 'app' as const, // Manually logged in app!
    },
    { 
      id: 10, 
      day: '5 nov',
      name: 'Zopiklon', 
      dose: '7.5mg', 
      time: '22:00', 
      taken: true, 
      actualTime: '22:30', 
      status: 'taken' as const,
      source: 'app' as const,
    },
    { 
      id: 11, 
      day: '5 nov',
      name: 'Lithium', 
      dose: '2 tabletter (morgon)', 
      time: '08:00', 
      taken: true, 
      actualTime: '10:15', 
      status: 'taken' as const,
      source: 'app' as const, // Took late, logged in app
    },
    { 
      id: 12, 
      day: '5 nov',
      name: 'Lithium', 
      dose: '3 tabletter (kväll)', 
      time: '22:00', 
      taken: true, 
      actualTime: '22:30', 
      status: 'taken' as const,
      source: 'app' as const,
    },
  ],
  // Sleep & Food tracking (vital for bipolar management)
  sleepData: [
    { date: '7 nov', bedtime: '23:30', wakeup: '07:15', hours: 7.75, quality: 'good' as const },
    { date: '6 nov', bedtime: '23:45', wakeup: '06:45', hours: 7.0, quality: 'poor' as const },
    { date: '5 nov', bedtime: '00:15', wakeup: '08:30', hours: 8.25, quality: 'good' as const },
  ],
  mealData: [
    { date: '7 nov', breakfast: false, lunch: true, dinner: false, snacks: 2 },
    { date: '6 nov', breakfast: false, lunch: true, dinner: true, snacks: 1 },
    { date: '5 nov', breakfast: false, lunch: true, dinner: true, snacks: 3 },
  ],
  // Taper curve data (Oct 31 - Nov 20) - realistic 5mg steps
  taperPlan: [
    { date: '31 okt', plannedDose: 15, actualDose: 15, editable: false },
    { date: '1 nov', plannedDose: 15, actualDose: 15, editable: false },
    { date: '2 nov', plannedDose: 15, actualDose: 15, editable: false },
    { date: '3 nov', plannedDose: 15, actualDose: 20, editable: false, incident: true }, // 3 nov incident
    { date: '4 nov', plannedDose: 15, actualDose: 15, editable: false },
    { date: '5 nov', plannedDose: 15, actualDose: 15, editable: false },
    { date: '6 nov', plannedDose: 15, actualDose: 15, editable: false },
    { date: '7 nov', plannedDose: 15, actualDose: 15, editable: true }, // Today
    { date: '8 nov', plannedDose: 15, actualDose: null, editable: true },
    { date: '9 nov', plannedDose: 15, actualDose: null, editable: true },
    { date: '10 nov', plannedDose: 10, actualDose: null, editable: true }, // Step down to 10mg
    { date: '11 nov', plannedDose: 10, actualDose: null, editable: true },
    { date: '12 nov', plannedDose: 10, actualDose: null, editable: true },
    { date: '13 nov', plannedDose: 10, actualDose: null, editable: true },
    { date: '14 nov', plannedDose: 5, actualDose: null, editable: true }, // Step down to 5mg
    { date: '15 nov', plannedDose: 5, actualDose: null, editable: true },
    { date: '16 nov', plannedDose: 5, actualDose: null, editable: true },
    { date: '17 nov', plannedDose: 5, actualDose: null, editable: true },
    { date: '18 nov', plannedDose: 0, actualDose: null, editable: true }, // Done!
    { date: '19 nov', plannedDose: 0, actualDose: null, editable: true },
    { date: '20 nov', plannedDose: 0, actualDose: null, editable: true },
  ],
  // Audit log (most recent first)
  auditLog: [
    {
      id: 1,
      timestamp: new Date('2024-11-07T14:30:00'),
      actor: 'Sam',
      action: 'Tog Olanzapin 15mg, Zopiklon 7.5mg, Lithium 600mg (kväll) via fysisk knapp',
      type: 'medication_taken' as const,
      approved: true,
    },
    {
      id: 2,
      timestamp: new Date('2024-11-06T08:30:00'),
      actor: 'Sam',
      action: 'Missade Lithium 600mg morgondos',
      type: 'medication_missed' as const,
      approved: false,
    },
    {
      id: 3,
      timestamp: new Date('2024-11-05T10:15:00'),
      actor: 'Pia',
      action: 'Justerade avtrappning: 12.5mg → 10mg från 7 nov',
      type: 'plan_edit' as const,
      approved: true,
    },
    {
      id: 4,
      timestamp: new Date('2024-11-04T09:00:00'),
      actor: 'Sam',
      action: 'Rapporterade dålig reaktion på 20mg dos (3 nov)',
      type: 'alert' as const,
      approved: false,
    },
    {
      id: 5,
      timestamp: new Date('2024-11-03T14:00:00'),
      actor: 'Team6 Läkare (ej Pia)',
      action: '⚠️ OBEHÖRIG: Ändrade Olanzapin 15mg → 20mg utan förankring med Pia',
      type: 'incident' as const,
      approved: false,
    },
    {
      id: 6,
      timestamp: new Date('2024-11-02T16:30:00'),
      actor: 'Pia',
      action: 'Påbörjade avtrappning från 15mg',
      type: 'plan_edit' as const,
      approved: true,
    },
  ],
};

// Archetypal Icons (SVG components for brand compliance)
const SpiralIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C10.5 2 9 3 8 4.5C7 6 6.5 8 7 10C7.5 12 9 13.5 11 14C13 14.5 15 14 16.5 13C18 12 19 10.5 19.5 8.5C20 6.5 19.5 4.5 18 3C16.5 1.5 14.5 1 12 2Z" 
          stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 5V11C4 16 7 20.5 12 22C17 20.5 20 16 20 11V5L12 2Z" 
          stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const BridgeIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12C2 12 5 8 12 8C19 8 22 12 22 12M6 12V16M12 8V16M18 12V16" 
          stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

export function PiaDashboard() {
  const getMedicationStatusColor = (status: string) => {
    switch (status) {
      case 'taken': return COLORS.sageGreen;
      case 'missed': return COLORS.truthCopper;
      case 'pending': return COLORS.threadGold;
      case 'overridden': return COLORS.alliancePurple;
      default: return COLORS.gentleSilver;
    }
  };

  const getActivationColor = (level: number) => {
    if (level <= 5) return COLORS.sageGreen;
    if (level <= 7) return COLORS.threadGold;
    return COLORS.truthCopper;
  };

  const getActivationLabel = (level: number) => {
    if (level <= 5) return 'Normal funktion';
    if (level <= 7) return 'Förhöjd aktivering';
    return 'Hypomani - uppmärksamhet';
  };

  const getAuditTypeColor = (type: string) => {
    switch (type) {
      case 'medication_taken': return COLORS.sageGreen;
      case 'medication_missed': return COLORS.truthCopper;
      case 'plan_edit': return COLORS.threadGold;
      case 'alert': return COLORS.truthCopper;
      case 'incident': return COLORS.truthCopper;
      default: return COLORS.gentleSilver;
    }
  };

  return (
    <div 
      className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6" 
      style={{ 
        background: `linear-gradient(to bottom, ${COLORS.birchWhite} 0%, ${COLORS.sageGreen}08 100%)`
      }}
    >
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold" style={{ color: COLORS.swedishBlue }}>
            Läkardashboard
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: COLORS.gentleSilver }}>
            {MOCK_DATA.patient.name} • {MOCK_DATA.patient.personnummer}
          </p>
        </div>
        <div style={{ color: COLORS.swedishBlue }}>
          <span className="text-xs sm:text-sm">Senast uppdaterad:</span>
          <span className="text-sm sm:text-base ml-2">
            {MOCK_DATA.patient.lastUpdate.toLocaleString('sv-SE', { 
              day: 'numeric', 
              month: 'short', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </header>

      {/* Top Row: Live Medication Status + Activation Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* FEATURE 1: Live Medication Status */}
        <div 
          className="rounded-2xl p-4 sm:p-8 lagom-shadow"
          style={{ 
            backgroundColor: COLORS.birchWhite,
            border: `1px solid ${COLORS.sageGreen}`
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div style={{ color: COLORS.truthCopper }}>
              <ShieldIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-lg sm:text-2xl font-bold" style={{ color: COLORS.swedishBlue }}>
              Medicinering (senaste 3 dagar)
            </h2>
          </div>
          
          <div className="space-y-4">
            {/* Today's section */}
            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: COLORS.truthCopper }}>
                Idag (7 nov)
              </h3>
              <div className="space-y-2">
                {MOCK_DATA.todaysMedication.map(med => (
                  <div 
                    key={med.id}
                    className="flex items-center justify-between p-3 rounded-md"
                    style={{ 
                      backgroundColor: COLORS.birchWhite,
                      border: `1px solid ${COLORS.gentleSilver}`
                    }}
                  >
                    <div>
                      <span className="font-medium" style={{ color: COLORS.swedishBlue }}>
                        {med.name}
                      </span>
                      <span className="text-sm ml-2" style={{ color: COLORS.birchWood }}>
                        {med.dose}
                      </span>
                      {med.source === 'physical_button' && (
                        <span className="text-xs ml-2 px-2 py-0.5 rounded" style={{ 
                          backgroundColor: COLORS.threadGold + '20',
                          color: COLORS.truthCopper 
                        }}>
                          📟 fysisk knapp
                        </span>
                      )}
                      {med.source === 'app' && (
                        <span className="text-xs ml-2 px-2 py-0.5 rounded" style={{ 
                          backgroundColor: COLORS.alliancePurple + '20',
                          color: COLORS.alliancePurple 
                        }}>
                          📱 app
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getMedicationStatusColor(med.status) }}
                      />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: getMedicationStatusColor(med.status) }}
                      >
                        {med.taken ? `✓ ${med.actualTime}` : 'Missad'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Yesterday's section */}
            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: COLORS.truthCopper }}>
                Igår (6 nov)
              </h3>
              <div className="space-y-2">
                {MOCK_DATA.yesterdaysMedication.map(med => (
                  <div 
                    key={med.id}
                    className="flex items-center justify-between p-3 rounded-md"
                    style={{ 
                      backgroundColor: COLORS.birchWhite,
                      border: `1px solid ${COLORS.gentleSilver}`
                    }}
                  >
                    <div>
                      <span className="font-medium" style={{ color: COLORS.swedishBlue }}>
                        {med.name}
                      </span>
                      <span className="text-sm ml-2" style={{ color: COLORS.birchWood }}>
                        {med.dose}
                      </span>
                      {med.source === 'physical_button' && (
                        <span className="text-xs ml-2 px-2 py-0.5 rounded" style={{ 
                          backgroundColor: COLORS.threadGold + '20',
                          color: COLORS.truthCopper 
                        }}>
                          📟 fysisk knapp
                        </span>
                      )}
                      {med.source === 'app' && (
                        <span className="text-xs ml-2 px-2 py-0.5 rounded" style={{ 
                          backgroundColor: COLORS.alliancePurple + '20',
                          color: COLORS.alliancePurple 
                        }}>
                          📱 app
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getMedicationStatusColor(med.status) }}
                      />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: getMedicationStatusColor(med.status) }}
                      >
                        {med.taken ? `✓ ${med.actualTime}` : 'Missad'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two days ago section - showing app usage */}
            <div>
              <h3 className="text-sm font-medium mb-2" style={{ color: COLORS.swedishBlue }}>
                5 nov
              </h3>
              <div className="space-y-2">
                {MOCK_DATA.twoDaysAgoMedication.map(med => (
                  <div 
                    key={med.id}
                    className="flex items-center justify-between p-3 rounded-md"
                    style={{ 
                      backgroundColor: COLORS.birchWhite,
                      border: `1px solid ${COLORS.gentleSilver}`
                    }}
                  >
                    <div>
                      <span className="font-medium" style={{ color: COLORS.swedishBlue }}>
                        {med.name}
                      </span>
                      <span className="text-sm ml-2" style={{ color: COLORS.birchWood }}>
                        {med.dose}
                      </span>
                      {med.source === 'app' && (
                        <span className="text-xs ml-2 px-2 py-0.5 rounded" style={{ 
                          backgroundColor: COLORS.alliancePurple + '20',
                          color: COLORS.alliancePurple 
                        }}>
                          📱 app
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getMedicationStatusColor(med.status) }}
                      />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: getMedicationStatusColor(med.status) }}
                      >
                        {med.taken ? `✓ ${med.actualTime}` : 'Missad'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE 2: Activation Level Display */}
        <div 
          className="rounded-2xl p-4 sm:p-8 lagom-shadow relative overflow-hidden"
          style={{ 
            backgroundColor: COLORS.birchWhite,
            border: `2px solid ${COLORS.alliancePurple}`
          }}
        >
          {/* Subtle background spiral */}
          <div className="absolute inset-0 opacity-5" style={{ color: COLORS.alliancePurple }}>
            <SpiralIcon className="w-full h-full" />
          </div>
          
          <div className="relative h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div style={{ color: COLORS.sageGreen }}>
                <SpiralIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold" style={{ color: COLORS.swedishBlue }}>
                Aktivering
              </h2>
            </div>
            
            {/* Big number */}
            <div className="text-center py-6 mb-4">
              <div className="text-6xl font-bold" style={{ color: COLORS.alliancePurple }}>
                {MOCK_DATA.patient.activationLevel}
                <span className="text-2xl" style={{ color: COLORS.gentleSilver }}>/10</span>
              </div>
              <p className="text-sm mt-2" style={{ color: COLORS.swedishBlue }}>
                {getActivationLabel(MOCK_DATA.patient.activationLevel)}
              </p>
            </div>
            
            {/* 7-day mini trend - grows to fill remaining space */}
            <div className="flex-1 flex items-end justify-between gap-1 min-h-[60px]">
              {[5, 6, 6, 7, 6, 6, 6].map((level, i) => (
                <div 
                  key={i}
                  className="flex-1 rounded-t transition-all"
                  style={{ 
                    height: `${(level / 10) * 100}%`,
                    backgroundColor: getActivationColor(level)
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-center mt-2" style={{ color: COLORS.swedishBlue }}>
              Senaste 7 dagarna
            </p>
          </div>
        </div>
      </div>

      {/* Second Row: Sleep & Food Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sleep Tracking */}
        <div 
          className="rounded-2xl p-4 sm:p-6 lagom-shadow"
          style={{ 
            backgroundColor: COLORS.birchWhite,
            border: `1px solid ${COLORS.gentleSilver}`
          }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.swedishBlue }}>
            😴 Sömn (senaste 3 nätter)
          </h2>
          <div className="space-y-3">
            {MOCK_DATA.sleepData.map((sleep) => (
              <div 
                key={sleep.date}
                className="p-3 rounded-lg"
                style={{ 
                  backgroundColor: COLORS.birchWhite,
                  border: `1px solid ${COLORS.gentleSilver}`
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium" style={{ color: COLORS.swedishBlue }}>
                    {sleep.date}
                  </span>
                  <span className="text-lg font-bold" style={{ 
                    color: sleep.hours >= 7 && sleep.hours <= 9 ? COLORS.sageGreen : COLORS.truthCopper 
                  }}>
                    {sleep.hours}h
                  </span>
                </div>
                <div className="flex justify-between text-xs" style={{ color: COLORS.swedishBlue }}>
                  <span>🛏️ {sleep.bedtime} → ⏰ {sleep.wakeup}</span>
                  <span className="px-2 py-0.5 rounded" style={{ 
                    backgroundColor: sleep.quality === 'good' ? COLORS.sageGreen + '20' : COLORS.truthCopper + '20',
                    color: sleep.quality === 'good' ? COLORS.sageGreen : COLORS.truthCopper
                  }}>
                    {sleep.quality === 'good' ? '✓ Bra' : '⚠️ Dålig'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: COLORS.threadGold + '10' }}>
            <p className="text-xs" style={{ color: COLORS.swedishBlue }}>
              💡 <strong>7-9h rekommenderat</strong> för stabilitet. Sömnbrist = ökad risk för hypomani.
            </p>
          </div>
        </div>

        {/* Food Tracking */}
        <div 
          className="rounded-2xl p-4 sm:p-6 lagom-shadow"
          style={{ 
            backgroundColor: COLORS.birchWhite,
            border: `1px solid ${COLORS.gentleSilver}`
          }}
        >
          <h2 className="text-xl font-bold mb-4" style={{ color: COLORS.swedishBlue }}>
            🍽️ Mat (senaste 3 dagar)
          </h2>
          <div className="space-y-3">
            {MOCK_DATA.mealData.map((meal) => (
              <div 
                key={meal.date}
                className="p-3 rounded-lg"
                style={{ 
                  backgroundColor: COLORS.birchWhite,
                  border: `1px solid ${COLORS.gentleSilver}`
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: COLORS.swedishBlue }}>
                    {meal.date}
                  </span>
                  <span className="text-sm font-bold" style={{ 
                    color: (meal.lunch && meal.dinner) ? COLORS.sageGreen : COLORS.truthCopper 
                  }}>
                    {[meal.breakfast, meal.lunch, meal.dinner].filter(Boolean).length}/3 måltider
                  </span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 rounded" style={{ 
                    backgroundColor: meal.breakfast ? COLORS.sageGreen + '20' : COLORS.gentleSilver + '20',
                    color: meal.breakfast ? COLORS.sageGreen : COLORS.gentleSilver
                  }}>
                    {meal.breakfast ? '✓' : '○'} Frukost
                  </span>
                  <span className="px-2 py-1 rounded" style={{ 
                    backgroundColor: meal.lunch ? COLORS.sageGreen + '20' : COLORS.gentleSilver + '20',
                    color: meal.lunch ? COLORS.sageGreen : COLORS.gentleSilver
                  }}>
                    {meal.lunch ? '✓' : '○'} Lunch
                  </span>
                  <span className="px-2 py-1 rounded" style={{ 
                    backgroundColor: meal.dinner ? COLORS.sageGreen + '20' : COLORS.gentleSilver + '20',
                    color: meal.dinner ? COLORS.sageGreen : COLORS.gentleSilver
                  }}>
                    {meal.dinner ? '✓' : '○'} Middag
                  </span>
                </div>
                {meal.snacks > 0 && (
                  <div className="mt-1 text-xs" style={{ color: COLORS.swedishBlue }}>
                    🍪 {meal.snacks} mellanmål
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: COLORS.threadGold + '10' }}>
            <p className="text-xs" style={{ color: COLORS.swedishBlue }}>
              💡 <strong>Lunch + Middag viktigt</strong> för blodsockerstabilitet och medicineffekt. Mellanmål okej om hungrig.
            </p>
          </div>
        </div>
      </div>

      {/* FEATURE 3: Interactive Taper Curve (HERO FEATURE - full width) */}
      <div 
        className="rounded-xl p-8 shadow-md relative overflow-hidden"
        style={{ 
          backgroundColor: COLORS.birchWhite,
          border: `2px solid ${COLORS.alliancePurple}`
        }}
      >
        {/* Header with Bridge + Lock */}
        <div className="flex items-center gap-3 mb-4">
          <div style={{ color: COLORS.threadGold }}>
            <BridgeIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: COLORS.swedishBlue }}>
            Olanzapin Avtrappning
          </h2>
          <div className="ml-auto flex items-center gap-2" style={{ color: COLORS.truthCopper }}>
            <ShieldIcon className="w-5 h-5" />
            <span className="text-sm">Skyddad plan</span>
          </div>
        </div>
        
        {/* The curve */}
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={MOCK_DATA.taperPlan}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.gentleSilver} />
              <XAxis 
                dataKey="date" 
                stroke={COLORS.gentleSilver}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke={COLORS.gentleSilver}
                label={{ value: 'Dos (mg)', angle: -90, position: 'insideLeft', style: { fill: COLORS.swedishBlue } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: COLORS.birchWhite,
                  border: `1px solid ${COLORS.gentleSilver}`,
                  borderRadius: '8px'
                }}
              />
              
              {/* Planned taper (dashed) */}
              <Line 
                type="monotone" 
                dataKey="plannedDose" 
                stroke={COLORS.alliancePurple}
                strokeDasharray="5 5" 
                strokeWidth={2}
                name="Planerad avtrappning"
              />
              
              {/* Actual compliance (solid) */}
              <Line 
                type="monotone" 
                dataKey="actualDose" 
                stroke={COLORS.swedishBlue}
                strokeWidth={3}
                name="Faktisk dos"
              />
              
              {/* 3 nov incident marker */}
              <ReferenceDot 
                x="3 nov" 
                y={20} 
                r={8}
                fill={COLORS.truthCopper}
                stroke={COLORS.birchWhite}
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Plan Change Request */}
        <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: COLORS.threadGold + '15', border: `1px solid ${COLORS.threadGold}` }}>
          <label className="block text-sm font-medium mb-2" style={{ color: COLORS.swedishBlue }}>
            💬 Beskriv önskad planändring
          </label>
          <textarea
            rows={3}
            placeholder="T.ex. 'Vill sänka från 15mg till 12.5mg från och med 10 nov' eller 'Sakta avtrappning, 2.5mg per vecka'"
            className="w-full p-3 rounded-md text-sm resize-none"
            style={{ 
              backgroundColor: COLORS.birchWhite,
              border: `1px solid ${COLORS.gentleSilver}`,
              color: COLORS.swedishBlue
            }}
          />
          <div className="flex gap-2 mt-2">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ 
                backgroundColor: COLORS.threadGold,
                color: COLORS.birchWhite
              }}
            >
              📨 Skicka till Sam för diskussion
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ 
                backgroundColor: COLORS.gentleSilver,
                color: COLORS.swedishBlue
              }}
            >
              💾 Spara som utkast
            </button>
          </div>
        </div>
        
        {/* 3 nov incident explanation */}
        <div 
          className="mt-4 p-4 rounded-lg border-l-4"
          style={{ 
            backgroundColor: COLORS.truthCopper + '10',
            borderLeftColor: COLORS.truthCopper
          }}
        >
          <p className="text-sm" style={{ color: COLORS.swedishBlue }}>
            <strong>⚠️ 3 nov 2024:</strong> Obehörig dosändring (15mg → 20mg) av Team6 läkare utan förankring med Pia. 
            Sam rapporterade dålig reaktion. Rekommendation: Alla dosändringar kräver Pias godkännande.
          </p>
        </div>
      </div>

      {/* FEATURE 4: Audit Log */}
      <div 
        className="rounded-lg p-6 shadow-sm"
        style={{ 
          backgroundColor: COLORS.birchWhite,
          border: `1px solid ${COLORS.gentleSilver}`
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div style={{ color: COLORS.truthCopper }}>
            <ShieldIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: COLORS.swedishBlue }}>
            Ändringslogg
          </h2>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {MOCK_DATA.auditLog.map(entry => (
            <div 
              key={entry.id}
              className="flex gap-4 p-3 rounded border-l-4"
              style={{ 
                backgroundColor: entry.type === 'incident' ? COLORS.truthCopper + '10' : 'transparent',
                borderLeftColor: getAuditTypeColor(entry.type)
              }}
            >
              {/* Timestamp */}
              <div 
                className="text-sm min-w-[140px]"
                style={{ color: COLORS.birchWood }}
              >
                {entry.timestamp.toLocaleString('sv-SE', { 
                  day: 'numeric', 
                  month: 'short', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              
              {/* Actor */}
              <div 
                className="text-sm font-medium min-w-[150px]"
                style={{ color: COLORS.swedishBlue }}
              >
                {entry.actor}
              </div>
              
              {/* Action */}
              <div 
                className="text-sm flex-1"
                style={{ color: COLORS.swedishBlue, opacity: 0.8 }}
              >
                {entry.action}
              </div>
              
              {/* Approval icon */}
              {entry.approved && (
                <div 
                  className="text-lg"
                  style={{ color: COLORS.sageGreen }}
                >
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

