import { useState, useEffect } from 'react';

// Simple mock data for demo
interface StatusData {
  name: string;
  lastUpdate: Date;
  alertLevel: 'green' | 'yellow' | 'red';
  medication: { taken: boolean; time?: string };
  sleep: { hours: number; quality: 'good' | 'fair' | 'poor' };
  activation: number; // 1-10
  cognitiveLoad: 'low' | 'medium' | 'high';
  socialActivity: 'active' | 'quiet' | 'withdrawn';
  interventionNeeded: boolean;
  statusMessage: string;
  suggestion: string;
}

export function ParentDashboard() {
  // Real scenario: June 28, 2025 - Stabilization phase
  // Based on family observation log: "Lugnare, kände sig i mellanläge"
  const [data] = useState<StatusData>({
    name: "Sam",
    lastUpdate: new Date('2025-06-28T14:30:00'),
    alertLevel: 'yellow',
    medication: { taken: true, time: '22:30' },
    sleep: { hours: 6, quality: 'fair' },
    activation: 6,
    cognitiveLoad: 'medium',
    socialActivity: 'quiet',
    interventionNeeded: false,
    statusMessage: "Stabilizing after episode. Working on important project but taking breaks. All vital signs improving.",
    suggestion: "No urgent call needed. Check dashboard tonight. Gentle text OK: 'Tänker på dig ❤️ Hur mår du?'"
  });

  const alertColors = {
    green: '#8faa8b',
    yellow: '#c9a96e',
    red: '#b87333'
  };

  const alertEmojis = {
    green: '✅',
    yellow: '🟡',
    red: '🔴'
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f6f0 0%, #e8e6e0 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '1.5rem',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            color: '#2c5aa0',
            fontSize: '1.75rem',
            marginBottom: '0.5rem'
          }}>
            Balans Monitored Autonomy
          </h1>
          <p style={{
            color: '#8a8074',
            fontSize: '0.875rem'
          }}>
            {data.name}'s Status Dashboard
          </p>
        </div>

        {/* Alert Status Card */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 4px 6px rgba(44, 90, 160, 0.1)',
          border: `3px solid ${alertColors[data.alertLevel]}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{
              fontSize: '2.5rem'
            }}>
              {alertEmojis[data.alertLevel]}
            </div>
            <div style={{
              textAlign: 'right'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: '#8a8074',
                marginBottom: '0.25rem'
              }}>
                Status
              </div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: alertColors[data.alertLevel]
              }}>
                {data.alertLevel === 'green' ? 'All Good' : data.alertLevel === 'yellow' ? 'Monitoring' : 'Needs Attention'}
              </div>
            </div>
          </div>
          
          <div style={{
            fontSize: '0.9375rem',
            color: '#5a4a3a',
            lineHeight: '1.5',
            marginBottom: '1rem'
          }}>
            {data.statusMessage}
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: '#8a8074',
            textAlign: 'right'
          }}>
            Last updated: {data.lastUpdate.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Vital Signs */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 4px 6px rgba(44, 90, 160, 0.1)'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            color: '#2c5aa0',
            marginBottom: '1rem'
          }}>
            📊 Vital Signs (Last 24 Hours)
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Medication */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#5a4a3a', fontSize: '0.9375rem' }}>💊 Medication</span>
              <span style={{
                color: data.medication.taken ? '#8faa8b' : '#b87333',
                fontWeight: '600',
                fontSize: '0.9375rem'
              }}>
                {data.medication.taken ? `✅ Taken ${data.medication.time}` : '❌ Missed'}
              </span>
            </div>

            {/* Sleep */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#5a4a3a', fontSize: '0.9375rem' }}>😴 Sleep</span>
              <span style={{
                color: data.sleep.hours >= 6 ? '#8faa8b' : '#b87333',
                fontWeight: '600',
                fontSize: '0.9375rem'
              }}>
                {data.sleep.hours}hrs ({data.sleep.quality})
              </span>
            </div>

            {/* Activation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#5a4a3a', fontSize: '0.9375rem' }}>📈 Activation</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  display: 'flex',
                  gap: '2px'
                }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <div
                      key={i}
                      style={{
                        width: '8px',
                        height: '20px',
                        background: i <= data.activation
                          ? (data.activation <= 5 ? '#8faa8b' : data.activation <= 7 ? '#c9a96e' : '#b87333')
                          : '#e8e6e0',
                        borderRadius: '2px'
                      }}
                    />
                  ))}
                </div>
                <span style={{
                  color: data.activation <= 7 ? '#5a4a3a' : '#b87333',
                  fontWeight: '600',
                  fontSize: '0.9375rem'
                }}>
                  {data.activation}/10
                </span>
              </div>
            </div>

            {/* Cognitive Load */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#5a4a3a', fontSize: '0.9375rem' }}>🧠 Cognitive Load</span>
              <span style={{
                color: data.cognitiveLoad === 'high' ? '#c9a96e' : '#8faa8b',
                fontWeight: '600',
                fontSize: '0.9375rem'
              }}>
                {data.cognitiveLoad === 'high' ? '⚠️ High (problem-solving)' : data.cognitiveLoad === 'medium' ? 'Medium' : '✅ Low'}
              </span>
            </div>

            {/* Social Activity */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#5a4a3a', fontSize: '0.9375rem' }}>💬 Social Activity</span>
              <span style={{
                color: '#8a8074',
                fontWeight: '600',
                fontSize: '0.9375rem'
              }}>
                {data.socialActivity === 'active' ? '✅ Active' : data.socialActivity === 'quiet' ? '📱 Quiet (focused)' : '⚠️ Withdrawn'}
              </span>
            </div>
          </div>
        </div>

        {/* Intervention Status */}
        <div style={{
          background: data.interventionNeeded ? '#fff3cd' : '#e8f4f8',
          border: `2px solid ${data.interventionNeeded ? '#b87333' : '#2c5aa0'}`,
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1rem'
        }}>
          <h3 style={{
            fontSize: '1rem',
            color: data.interventionNeeded ? '#b87333' : '#2c5aa0',
            marginBottom: '0.75rem',
            fontWeight: '600'
          }}>
            {data.interventionNeeded ? '🚨 Intervention Needed' : '✅ No Intervention Needed'}
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#5a4a3a',
            lineHeight: '1.5',
            margin: 0
          }}>
            {data.suggestion}
          </p>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '0.75rem'
        }}>
          <button
            onClick={() => alert('Call feature - coming soon')}
            style={{
              flex: 1,
              padding: '1rem',
              background: data.interventionNeeded ? '#2c5aa0' : '#e8e6e0',
              color: data.interventionNeeded ? '#fff' : '#8a8074',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: data.interventionNeeded ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            📞 Call Now
          </button>
          <button
            onClick={() => alert('Text feature - coming soon')}
            style={{
              flex: 1,
              padding: '1rem',
              background: '#8faa8b',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            💬 Send Gentle Text
          </button>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(44, 90, 160, 0.05)',
          fontSize: '0.8125rem',
          color: '#8a8074',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0 }}>
            Powered by <strong style={{ color: '#2c5aa0' }}>Balans</strong> Monitored Autonomy
          </p>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            All data encrypted • GDPR compliant • Swedish hosting
          </p>
        </div>
      </div>
    </div>
  );
}

