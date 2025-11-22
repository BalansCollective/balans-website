import React, { useState } from 'react';

// Balans Brand System - Sacred Alliance Palette
const COLORS = {
  birchWhite: '#f8f6f0',
  birchWood: '#d4b896',
  swedishBlue: '#2c5aa0',
  alliancePurple: '#6b5b95',
  threadGold: '#c9a96e',
  sageGreen: '#8faa8b',
  gentleSilver: '#b8c5d1',
  copperAnchor: '#b87333',
};

// Archetypal SVG Icon - Bridge (connection between patient and medicine)
const BridgeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 12 L6 8 L10 12 L14 8 L18 12 L22 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M2 12 L2 18 M6 8 L6 18 M10 12 L10 18 M14 8 L14 18 M18 12 L18 18 M22 8 L22 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line x1="2" y1="18" x2="22" y2="18" stroke="currentColor" strokeWidth="3" />
  </svg>
);

// Vårdplan - Source of Truth for Medication Schedule
const VARDPLAN = {
  patient: {
    name: 'Samuel Lindgren',
    personnummer: '910206-1554',
  },
  medications: [
    {
      name: 'Lithium',
      doses: [
        { time: '08:00', amount: '2 tabletter', window: 2 }, // ±2 hours
        { time: '22:00', amount: '3 tabletter', window: 2 },
      ],
    },
    {
      name: 'Olanzapin',
      doses: [
        { time: '22:00', amount: '15mg', window: 2 },
      ],
    },
    {
      name: 'Zopiklon',
      doses: [
        { time: '22:00', amount: '7.5mg', window: 2 },
      ],
    },
  ],
};

// Helper: Match current time to medication schedule
function matchMedicationTime(): { medication: string; dose: string; scheduledTime: string } | null {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  for (const med of VARDPLAN.medications) {
    for (const dose of med.doses) {
      const [hour, minute] = dose.time.split(':').map(Number);
      const scheduledTimeInMinutes = hour * 60 + minute;
      const windowInMinutes = dose.window * 60;

      const diff = Math.abs(currentTimeInMinutes - scheduledTimeInMinutes);

      if (diff <= windowInMinutes) {
        return {
          medication: med.name,
          dose: dose.amount,
          scheduledTime: dose.time,
        };
      }
    }
  }

  return null;
}

// Helper: Format current time
function formatCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
}

// Helper: Format current date
function formatCurrentDate(): string {
  const now = new Date();
  return now.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
}

interface MedicationEntry {
  name: string;
  scheduled: string;
  taken: boolean;
  amount: string;
}

// Common medications database
const COMMON_MEDICATIONS = [
  { name: 'Lithium', defaultDose: '2 tabletter' },
  { name: 'Olanzapin', defaultDose: '15mg' },
  { name: 'Zopiklon', defaultDose: '7.5mg' },
  { name: 'Paracetamol', defaultDose: '500mg' },
  { name: 'Ibuprofen', defaultDose: '400mg' },
  { name: 'Sertralin', defaultDose: '50mg' },
  { name: 'Quetiapin', defaultDose: '25mg' },
  { name: 'Oxazepam', defaultDose: '10mg' },
  { name: 'Propavan', defaultDose: '25mg' },
  { name: 'Sobril', defaultDose: '10mg' },
];

export function SamMedicineLog() {
  const [justLogged, setJustLogged] = useState(false);
  const [lastLog, setLastLog] = useState<{ medications: string[]; time: string } | null>(null);
  const [showManualLog, setShowManualLog] = useState(false);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  
  // Manual log state
  const [manualTime, setManualTime] = useState(formatCurrentTime());
  const [manualMedications, setManualMedications] = useState<MedicationEntry[]>([]);
  const [manualComment, setManualComment] = useState('');

  // Quick press: Log all scheduled medications
  const handleQuickPress = () => {
    const match = matchMedicationTime();

    if (match) {
      // Get ALL medications scheduled for this time
      const scheduledMeds = VARDPLAN.medications
        .filter(med => 
          med.doses.some(dose => dose.time === match.scheduledTime)
        )
        .map(med => {
          const dose = med.doses.find(d => d.time === match.scheduledTime)!;
          return `${med.name} ${dose.amount}`;
        });

      // Log to Chronicle (TODO: Real Chronicle integration)
      const logEntry = {
        medications: scheduledMeds,
        actualTime: formatCurrentTime(),
        date: formatCurrentDate(),
        source: 'app' as const,
      };

      setLastLog(logEntry);
      setJustLogged(true);

      // Reset after 3 seconds
      setTimeout(() => setJustLogged(false), 3000);

      // TODO: Send to Chronicle API
      console.log('📝 Quick log to Chronicle:', logEntry);
    } else {
      // No match - open manual mode
      openManualLog();
    }
  };

  // Long press: Open manual configuration
  const openManualLog = () => {
    const now = formatCurrentTime();
    setManualTime(now);

    // Pre-populate with scheduled medications (user can uncheck/adjust)
    const match = matchMedicationTime();
    let entries: MedicationEntry[] = [];

    if (match) {
      // Default to all medications scheduled for this time (deduplicated)
      const seenMeds = new Set<string>();
      entries = VARDPLAN.medications
        .filter(med => {
          const hasMatch = med.doses.some(dose => dose.time === match.scheduledTime);
          if (hasMatch && !seenMeds.has(med.name)) {
            seenMeds.add(med.name);
            return true;
          }
          return false;
        })
        .map(med => {
          const dose = med.doses.find(d => d.time === match.scheduledTime)!;
          return {
            name: med.name,
            scheduled: dose.amount,
            taken: true, // Pre-checked (user unchecks if didn't take)
            amount: dose.amount,
          };
        });
    } else {
      // No match - show most common medications unchecked
      entries = [
        { name: 'Lithium', scheduled: '2 tabletter', taken: false, amount: '2 tabletter' },
        { name: 'Olanzapin', scheduled: '15mg', taken: false, amount: '15mg' },
        { name: 'Zopiklon', scheduled: '7.5mg', taken: false, amount: '7.5mg' },
      ];
    }

    setManualMedications(entries);
    setManualComment('');
    setShowManualLog(true);
  };

  const handleButtonPress = () => {
    setIsLongPressing(true);
    const timer = window.setTimeout(() => {
      // Long press detected (0.5 seconds - matches phone haptic)
      setIsLongPressing(false);
      
      // Trigger haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50); // Short vibration
      }
      
      openManualLog();
    }, 500); // Changed from 2000ms to 500ms
    setLongPressTimer(timer);
  };

  const handleButtonRelease = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    if (isLongPressing) {
      // Released before 2 seconds → quick press
      setIsLongPressing(false);
      handleQuickPress();
    }
  };

  const handleManualSubmit = () => {
    const takenMeds = manualMedications
      .filter(med => med.taken)
      .map(med => {
        // For custom meds with '-', use just the name
        if (med.amount === '-') {
          return med.name;
        }
        return `${med.name} ${med.amount}`;
      });

    if (takenMeds.length === 0) {
      alert('Välj minst en medicin att logga');
      return;
    }

    const logEntry = {
      medications: takenMeds,
      actualTime: manualTime,
      date: formatCurrentDate(),
      source: 'app' as const,
      comment: manualComment || undefined,
    };

    setLastLog({ medications: takenMeds, time: manualTime });
    setJustLogged(true);
    setShowManualLog(false);

    // Reset after 3 seconds
    setTimeout(() => setJustLogged(false), 3000);

    // TODO: Send to Chronicle API
    console.log('📝 Manual log to Chronicle:', logEntry);
  };

  const toggleMedication = (index: number) => {
    setManualMedications(prev =>
      prev.map((med, i) =>
        i === index ? { ...med, taken: !med.taken } : med
      )
    );
  };

  const adjustDose = (index: number, change: string) => {
    setManualMedications(prev =>
      prev.map((med, i) => {
        if (i !== index) return med;
        
        // Simple dose adjustment logic
        const currentAmount = med.amount;
        let newAmount = currentAmount;

        if (med.name === 'Lithium') {
          const match = currentAmount.match(/(\d+)/);
          if (match) {
            const current = parseInt(match[1]);
            if (change === '+1' && current < 6) newAmount = `${current + 1} tabletter`;
            if (change === '-1' && current > 1) newAmount = `${current - 1} tabletter`;
          }
        } else if (med.name === 'Olanzapin') {
          const match = currentAmount.match(/(\d+)/);
          if (match) {
            const current = parseInt(match[1]);
            if (change === '+5' && current < 30) newAmount = `${current + 5}mg`;
            if (change === '-5' && current > 5) newAmount = `${current - 5}mg`;
          }
        }

        return { ...med, amount: newAmount };
      })
    );
  };

  const removeMedication = (index: number) => {
    setManualMedications(prev => prev.filter((_, i) => i !== index));
  };

  const addMedicationFromList = (med: { name: string; defaultDose: string }) => {
    // Check if already in list
    if (manualMedications.some(m => m.name === med.name)) {
      alert(`${med.name} finns redan i listan`);
      return;
    }

    setManualMedications(prev => [
      ...prev,
      {
        name: med.name,
        scheduled: '-',
        taken: true,
        amount: med.defaultDose,
      },
    ]);
    setShowAddMedication(false);
  };

  const addCustomMedication = () => {
    const medName = prompt('Lägg till annan medicin (namn):');
    if (medName && medName.trim()) {
      const dose = prompt('Dos (t.ex. "500mg" eller "1 tablett"):');
      if (dose && dose.trim()) {
        setManualMedications(prev => [
          ...prev,
          {
            name: medName.trim(),
            scheduled: '-',
            taken: true,
            amount: dose.trim(),
          },
        ]);
      }
      // Keep popup open after adding custom med
    }
  };

  const match = matchMedicationTime();

  // Add Medication Popup
  if (showAddMedication) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div
          className="w-full max-w-md rounded-2xl p-6 lagom-shadow"
          style={{ backgroundColor: COLORS.birchWhite }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: COLORS.swedishBlue }}>
              Lägg till medicin
            </h2>
            <button
              onClick={() => setShowAddMedication(false)}
              className="text-sm px-3 py-1 rounded-lg"
              style={{ backgroundColor: COLORS.gentleSilver, color: COLORS.swedishBlue }}
            >
              Avbryt
            </button>
          </div>

          <p className="text-sm mb-4" style={{ color: COLORS.birchWood }}>
            Välj från vanliga mediciner eller lägg till egen:
          </p>

          {/* Common Medications List */}
          <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
            {COMMON_MEDICATIONS.filter(med => !manualMedications.some(m => m.name === med.name)).map((med, i) => (
              <button
                key={i}
                onClick={() => addMedicationFromList(med)}
                className="w-full p-3 rounded-lg text-left lagom-hover"
                style={{
                  backgroundColor: COLORS.birchWhite,
                  border: `1px solid ${COLORS.gentleSilver}`,
                }}
              >
                <p className="font-bold" style={{ color: COLORS.swedishBlue }}>
                  {med.name}
                </p>
                <p className="text-xs" style={{ color: COLORS.birchWood }}>
                  Standard: {med.defaultDose}
                </p>
              </button>
            ))}
          </div>

          {/* Custom Medication Button */}
          <button
            onClick={addCustomMedication}
            className="w-full py-3 rounded-xl font-bold mb-2 lagom-shadow lagom-hover"
            style={{
              backgroundColor: COLORS.alliancePurple,
              color: COLORS.birchWhite,
            }}
          >
            ✏️ Annan medicin (skriv själv)
          </button>

          {/* Done Button */}
          <button
            onClick={() => setShowAddMedication(false)}
            className="w-full py-3 rounded-xl font-bold lagom-shadow"
            style={{
              backgroundColor: COLORS.sageGreen,
              color: COLORS.birchWhite,
            }}
          >
            ✓ Klar
          </button>
        </div>
      </div>
    );
  }

  // Manual Log Screen
  if (showManualLog) {
    return (
      <div
        className="w-full h-full overflow-y-auto p-4 sm:p-6"
        style={{
          background: `linear-gradient(to bottom, ${COLORS.birchWhite} 0%, ${COLORS.alliancePurple}08 100%)`,
        }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold" style={{ color: COLORS.swedishBlue }}>
              📝 Anpassad Logg
            </h1>
            <button
              onClick={() => setShowManualLog(false)}
              className="text-sm px-3 py-1 rounded-lg"
              style={{ backgroundColor: COLORS.gentleSilver, color: COLORS.swedishBlue }}
            >
              Avbryt
            </button>
          </div>
          <p className="text-xs" style={{ color: COLORS.birchWood }}>
            Välj vad du faktiskt tog + justera dos + lägg till kommentar
          </p>
        </div>

        {/* Time Picker */}
        <div
          className="rounded-xl p-4 mb-4 lagom-shadow"
          style={{
            backgroundColor: COLORS.birchWhite,
            border: `2px solid ${COLORS.gentleSilver}`,
          }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: COLORS.swedishBlue }}>
            ⏰ Tid
          </p>
          <input
            type="time"
            value={manualTime}
            onChange={(e) => setManualTime(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-lg font-bold"
            style={{
              backgroundColor: COLORS.birchWhite,
              border: `1px solid ${COLORS.gentleSilver}`,
              color: COLORS.swedishBlue,
            }}
          />
        </div>

        {/* Medication Checkboxes */}
        <div className="space-y-3 mb-4">
          {manualMedications.map((med, index) => (
            <div
              key={index}
              className="rounded-xl p-4 lagom-shadow relative"
              style={{
                backgroundColor: med.taken ? COLORS.sageGreen + '20' : COLORS.birchWhite,
                border: `2px solid ${med.taken ? COLORS.sageGreen : COLORS.gentleSilver}`,
              }}
            >
              {/* X Button (Remove) */}
              <button
                onClick={() => removeMedication(index)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center font-bold"
                style={{
                  backgroundColor: COLORS.copperAnchor,
                  color: COLORS.birchWhite,
                  fontSize: '14px',
                }}
              >
                ×
              </button>

              <div className="flex items-start justify-between mb-2 pr-8">
                <button
                  onClick={() => toggleMedication(index)}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{
                      backgroundColor: med.taken ? COLORS.sageGreen : COLORS.gentleSilver,
                      color: COLORS.birchWhite,
                    }}
                  >
                    {med.taken ? '✓' : ''}
                  </div>
                  <span className="font-bold text-lg" style={{ color: COLORS.swedishBlue }}>
                    {med.name}
                  </span>
                </button>
              </div>

              {med.taken && (
                <>
                  <p className="text-xs mb-2" style={{ color: COLORS.birchWood }}>
                    Schemalagt: {med.scheduled}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: COLORS.swedishBlue }}>
                      Tagit:
                    </span>
                    {med.name === 'Lithium' && med.amount !== '-' && (
                      <>
                        <button
                          onClick={() => adjustDose(index, '-1')}
                          className="px-3 py-1 rounded-lg font-bold"
                          style={{
                            backgroundColor: COLORS.gentleSilver,
                            color: COLORS.swedishBlue,
                          }}
                        >
                          -1
                        </button>
                        <span className="font-bold text-lg" style={{ color: COLORS.swedishBlue }}>
                          {med.amount}
                        </span>
                        <button
                          onClick={() => adjustDose(index, '+1')}
                          className="px-3 py-1 rounded-lg font-bold"
                          style={{
                            backgroundColor: COLORS.threadGold,
                            color: COLORS.birchWhite,
                          }}
                        >
                          +1
                        </button>
                      </>
                    )}
                    {med.name === 'Olanzapin' && med.amount !== '-' && (
                      <>
                        <button
                          onClick={() => adjustDose(index, '-5')}
                          className="px-3 py-1 rounded-lg font-bold"
                          style={{
                            backgroundColor: COLORS.gentleSilver,
                            color: COLORS.swedishBlue,
                          }}
                        >
                          -5
                        </button>
                        <span className="font-bold text-lg" style={{ color: COLORS.swedishBlue }}>
                          {med.amount}
                        </span>
                        <button
                          onClick={() => adjustDose(index, '+5')}
                          className="px-3 py-1 rounded-lg font-bold"
                          style={{
                            backgroundColor: COLORS.threadGold,
                            color: COLORS.birchWhite,
                          }}
                        >
                          +5
                        </button>
                      </>
                    )}
                    {(med.name === 'Zopiklon' || med.amount === '-') && (
                      <span className="font-bold text-lg" style={{ color: COLORS.swedishBlue }}>
                        {med.amount}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add Medication Button */}
        <button
          onClick={() => setShowAddMedication(true)}
          className="w-full py-3 rounded-xl font-bold mb-4 lagom-shadow lagom-hover"
          style={{
            backgroundColor: COLORS.threadGold + '30',
            border: `2px dashed ${COLORS.threadGold}`,
            color: COLORS.swedishBlue,
          }}
        >
          + Lägg till medicin
        </button>

        {/* Submit Button (MOVED UP for mobile visibility) */}
        <button
          onClick={handleManualSubmit}
          className="w-full py-4 rounded-xl text-xl font-bold mb-4 lagom-shadow lagom-hover"
          style={{
            backgroundColor: COLORS.alliancePurple,
            color: COLORS.birchWhite,
          }}
        >
          📝 Logga Detta
        </button>

        {/* Comment Field (Optional - below submit) */}
        <div
          className="rounded-xl p-4 mb-4 lagom-shadow"
          style={{
            backgroundColor: COLORS.birchWhite,
            border: `2px solid ${COLORS.gentleSilver}`,
          }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: COLORS.swedishBlue }}>
            💬 Kommentar (valfritt)
          </p>
          <textarea
            value={manualComment}
            onChange={(e) => setManualComment(e.target.value)}
            placeholder="T.ex. 'Tog sent pga sömnproblem' eller 'Justerade dos själv'"
            rows={3}
            className="w-full px-3 py-2 rounded-lg resize-none"
            style={{
              backgroundColor: COLORS.birchWhite,
              border: `1px solid ${COLORS.gentleSilver}`,
              color: COLORS.swedishBlue,
            }}
          />
        </div>

        <div
          className="mt-4 p-3 rounded-lg text-xs text-center"
          style={{
            backgroundColor: COLORS.gentleSilver + '30',
            color: COLORS.swedishBlue,
          }}
        >
          ✨ Full kontroll över vad som loggas
        </div>
      </div>
    );
  }

  // Main Screen
  return (
    <div
      className="w-full h-full overflow-y-auto p-4 sm:p-6"
      style={{
        background: `linear-gradient(to bottom, ${COLORS.birchWhite} 0%, ${COLORS.threadGold}08 100%)`,
      }}
    >
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div style={{ color: COLORS.threadGold }}>
            <BridgeIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: COLORS.swedishBlue }}>
            Medicin-logg
          </h1>
        </div>
        <p className="text-xs sm:text-sm" style={{ color: COLORS.swedishBlue }}>
          <strong>Kort tryck:</strong> Logga enligt plan • <strong>Håll inne (vibration):</strong> Anpassad logg
        </p>
      </div>

      {/* Current Time & Date */}
      <div
        className="rounded-2xl p-4 mb-6 text-center lagom-shadow"
        style={{
          backgroundColor: COLORS.birchWhite,
          border: `2px solid ${COLORS.gentleSilver}`,
        }}
      >
        <p className="text-4xl font-bold mb-1" style={{ color: COLORS.swedishBlue }}>
          {formatCurrentTime()}
        </p>
        <p className="text-sm" style={{ color: COLORS.birchWood }}>
          {formatCurrentDate()}
        </p>
      </div>

      {/* Expected Medication (if match) */}
      {match && !justLogged && (
        <div
          className="rounded-2xl p-6 mb-6 lagom-shadow"
          style={{
            backgroundColor: COLORS.threadGold + '15',
            border: `2px solid ${COLORS.threadGold}`,
          }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: COLORS.swedishBlue }}>
            📋 Schemalagt nu (±2h):
          </p>
          <p className="text-2xl font-bold mb-1" style={{ color: COLORS.swedishBlue }}>
            {match.medication}
          </p>
          <p className="text-lg" style={{ color: COLORS.birchWood }}>
            {match.dose}
          </p>
          <p className="text-xs mt-2" style={{ color: COLORS.gentleSilver }}>
            Schemalagt kl {match.scheduledTime}
          </p>
        </div>
      )}

      {/* No Match Warning */}
      {!match && !justLogged && (
        <div
          className="rounded-2xl p-6 mb-6 lagom-shadow"
          style={{
            backgroundColor: COLORS.gentleSilver + '30',
            border: `2px solid ${COLORS.gentleSilver}`,
          }}
        >
          <p className="text-sm font-medium" style={{ color: COLORS.swedishBlue }}>
            ⚠️ Ingen medicin schemalagd just nu
          </p>
          <p className="text-xs mt-2" style={{ color: COLORS.birchWood }}>
            Schemalagda tider: 08:00 (morgon) och 22:00 (kväll)
          </p>
        </div>
      )}

      {/* Success Message (after logging) */}
      {justLogged && lastLog && (
        <div
          className="rounded-2xl p-6 mb-6 lagom-shadow animate-pulse"
          style={{
            backgroundColor: COLORS.sageGreen + '30',
            border: `3px solid ${COLORS.sageGreen}`,
          }}
        >
          <p className="text-2xl font-bold mb-2" style={{ color: COLORS.sageGreen }}>
            ✅ Loggat!
          </p>
          {lastLog.medications.map((med, i) => (
            <p key={i} className="text-lg" style={{ color: COLORS.swedishBlue }}>
              • {med}
            </p>
          ))}
          <p className="text-sm mt-2" style={{ color: COLORS.birchWood }}>
            Kl {lastLog.time}
          </p>
        </div>
      )}

      {/* BIG BUTTON (Long Press Enabled) */}
      <button
        onMouseDown={handleButtonPress}
        onMouseUp={handleButtonRelease}
        onMouseLeave={handleButtonRelease}
        onTouchStart={handleButtonPress}
        onTouchEnd={handleButtonRelease}
        disabled={justLogged}
        className="w-full py-12 rounded-2xl text-3xl font-bold lagom-shadow transition-all select-none"
        style={{
          backgroundColor: justLogged
            ? COLORS.gentleSilver
            : isLongPressing
            ? COLORS.alliancePurple
            : COLORS.threadGold,
          color: COLORS.birchWhite,
          opacity: justLogged ? 0.5 : 1,
          cursor: justLogged ? 'not-allowed' : 'pointer',
          transform: isLongPressing ? 'scale(0.98)' : 'scale(1)',
        }}
      >
        {justLogged ? '✅ Loggat!' : isLongPressing ? '⏳ Håll för anpassad...' : '📟 Tagit medicin nu'}
      </button>

      {/* Info Box */}
      <div
        className="mt-6 p-4 rounded-lg text-xs"
        style={{
          backgroundColor: COLORS.gentleSilver + '30',
          color: COLORS.swedishBlue,
        }}
      >
        <p className="font-bold mb-2">💡 Hur det fungerar:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Systemet kollar klockan mot din vårdplan</li>
          <li>Loggar automatiskt rätt medicin (±2h window)</li>
          <li>Synligt i Pia's dashboard direkt</li>
          <li>Fysisk knapp (📟) kommer snart!</li>
        </ul>
      </div>

      {/* Vårdplan Reference */}
      <div
        className="mt-4 p-4 rounded-lg text-xs"
        style={{
          backgroundColor: COLORS.alliancePurple + '10',
          border: `1px solid ${COLORS.alliancePurple}`,
          color: COLORS.swedishBlue,
        }}
      >
        <p className="font-bold mb-2">📋 Min vårdplan (schemalagda tider):</p>
        {VARDPLAN.medications.map((med) => (
          <div key={med.name} className="mb-2">
            <p className="font-medium">{med.name}:</p>
            <ul className="list-disc list-inside ml-4">
              {med.doses.map((dose, idx) => (
                <li key={idx}>
                  {dose.time} - {dose.amount}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Medical Disclaimer */}
      <div
        className="mt-6 p-4 rounded-lg text-xs text-center"
        style={{
          backgroundColor: COLORS.gentleSilver + '30',
          color: COLORS.swedishBlue,
        }}
      >
        <p>⚕️ Detta är ett loggverktyg, inte medicinsk rådgivning.</p>
        <p className="mt-1">Vid frågor om medicin, kontakta alltid litiumsköterskor.</p>
      </div>
    </div>
  );
}

