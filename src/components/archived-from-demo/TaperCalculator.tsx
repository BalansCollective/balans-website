import { useState, useEffect } from 'react';

interface TaperStep {
  week: number;
  dose: number;
  duration: number;
  notes: string;
}

interface TaperCalculatorProps {
  initialDose?: number;
  initialWeeks?: number;
}

export function TaperCalculator({ 
  initialDose = 15, 
  initialWeeks = 12 
}: TaperCalculatorProps) {
  const [currentDose, setCurrentDose] = useState(initialDose);
  const [weeksOnDose, setWeeksOnDose] = useState(initialWeeks);
  const [schedule, setSchedule] = useState<TaperStep[]>([]);

  useEffect(() => {
    // Calculate taper schedule based on clinical guidelines
    const taperWeeks = Math.max(4, Math.ceil(weeksOnDose / 4));
    const steps: TaperStep[] = [];
    
    let dose = currentDose;
    let week = 0;
    
    while (dose > 0) {
      // 25% reduction until 10mg, then 20%
      const reductionPercent = dose > 10 ? 0.25 : 0.20;
      const nextDose = Math.max(0, Math.round(dose * (1 - reductionPercent) * 2) / 2); // Round to nearest 2.5mg
      
      steps.push({
        week: week,
        dose: dose,
        duration: dose > 5 ? 2 : 1, // Slower steps at higher doses
        notes: dose === currentDose 
          ? 'Starting dose' 
          : dose === 0 
          ? 'Complete - maintain monitoring' 
          : nextDose < dose * 0.5 
          ? '⚠️ Large drop - monitor closely' 
          : '✓ Safe reduction'
      });
      
      week += (dose > 5 ? 2 : 1);
      dose = nextDose;
      
      if (dose === 0) break;
    }
    
    setSchedule(steps);
  }, [currentDose, weeksOnDose]);

  const totalWeeks = schedule.reduce((sum, step) => sum + step.duration, 0);

  return (
    <div style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#2c5aa0', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
        💊 Olanzapine Taper Calculator
      </h2>
      
      <div style={{
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 4px rgba(44, 90, 160, 0.1)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#5a4a3a',
            marginBottom: '0.5rem'
          }}>
            Current Dose: {currentDose}mg
          </label>
          <input
            type="range"
            min="5"
            max="20"
            step="2.5"
            value={currentDose}
            onChange={(e) => setCurrentDose(parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#5a4a3a',
            marginBottom: '0.5rem'
          }}>
            Weeks on Current Dose: {weeksOnDose} weeks
          </label>
          <input
            type="range"
            min="1"
            max="52"
            value={weeksOnDose}
            onChange={(e) => setWeeksOnDose(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
        </div>

        <div style={{
          background: '#f8f6f0',
          padding: '1rem',
          borderRadius: '6px',
          fontSize: '0.875rem',
          color: '#5a4a3a',
          fontWeight: '500'
        }}>
          <strong>Taper Duration:</strong> {totalWeeks} weeks (~{Math.ceil(totalWeeks / 4)} months)
        </div>
      </div>

      <div style={{
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(44, 90, 160, 0.1)',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          color: '#2c5aa0',
          marginBottom: '1rem'
        }}>
          📅 Suggested Taper Schedule
        </h3>

        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute',
            left: '30px',
            top: '20px',
            bottom: '20px',
            width: '2px',
            background: '#d4d2cc'
          }} />

          {schedule.map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '1.5rem',
                position: 'relative'
              }}
            >
              {/* Timeline dot */}
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: step.dose === 0 ? '#8faa8b' : '#2c5aa0',
                marginRight: '1.5rem',
                marginTop: '0.25rem',
                position: 'relative',
                zIndex: 1,
                border: '3px solid #fff',
                boxShadow: '0 0 0 2px #d4d2cc',
                flexShrink: 0
              }} />

              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '0.25rem'
                }}>
                  <span style={{
                    fontWeight: '600',
                    color: '#2c5aa0',
                    fontSize: '1rem'
                  }}>
                    Week {step.week}
                  </span>
                  <span style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: step.dose === 0 ? '#8faa8b' : '#5a4a3a'
                  }}>
                    {step.dose}mg
                  </span>
                </div>
                <div style={{
                  fontSize: '0.8125rem',
                  color: '#8a8074',
                  marginBottom: '0.25rem'
                }}>
                  Duration: {step.duration} week{step.duration > 1 ? 's' : ''}
                </div>
                <div style={{
                  fontSize: '0.8125rem',
                  color: step.notes.includes('⚠️') ? '#b87333' : '#8faa8b',
                  fontWeight: '500'
                }}>
                  {step.notes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: '#fff3cd',
        border: '2px solid #b87333',
        borderRadius: '8px',
        fontSize: '0.8125rem',
        color: '#5a4a3a'
      }}>
        <strong>⚠️ Important:</strong> This is a SUGGESTION based on clinical guidelines. 
        Always consult your prescribing doctor before making changes. 
        Monitor for withdrawal symptoms: insomnia, nausea, agitation, return of symptoms.
      </div>
    </div>
  );
}





