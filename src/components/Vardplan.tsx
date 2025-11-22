import React from 'react';

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

// Archetypal SVG Icon
const SpiralIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C10.5 2 9 3 8 4.5C7 6 6.5 8 7 10C7.5 12 9 13.5 11 14C13 14.5 15 14 16.5 13C18 12 19 10.5 19.5 8.5C20 6.5 19.5 4.5 18 3C16.5 1.5 14.5 1 12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

// Mock data - would come from real vårdplan backend
const MOCK_DATA = {
  patient: {
    name: 'Samuel Lindgren',
    personnummer: '910206-1554',
  },
  currentPlan: {
    content: `Patient: Samuel Lindgren (910206-1554)

Lithium 600mg morgon (08:00) + kväll (20:00)
Olanzapin 15mg vid aktivering >7 (kan öka till 20mg vid behov)
Zopiklon 7,5mg vid sömnbehov

⚠️ Ring litiumsköterskor om:
• Sömn <5h per natt i 2+ dagar
• Missar medicin 2+ dagar i rad
• Aktivering >8 som inte går ner med medicin

📞 Litiumsköterskor: 090-123 45 67
📅 Nästa kontroll: 15 december 2024`,
    lastModified: '7 nov 2024',
    modifiedBy: 'Pia Nordanskog (Psykiatriker)',
  },
  history: [
    {
      id: 3,
      date: '7 nov 2024',
      modifiedBy: 'Pia Nordanskog',
      content: `Patient: Samuel Lindgren (910206-1554)

Lithium 600mg morgon (08:00) + kväll (20:00)
Olanzapin 15mg vid aktivering >7 (kan öka till 20mg vid behov)
Zopiklon 7,5mg vid sömnbehov

⚠️ Ring litiumsköterskor om:
• Sömn <5h per natt i 2+ dagar
• Missar medicin 2+ dagar i rad
• Aktivering >8 som inte går ner med medicin

📞 Litiumsköterskor: 090-123 45 67
📅 Nästa kontroll: 15 december 2024`,
      note: 'Justerade olanzapin-dos baserat på sommarens episod',
    },
    {
      id: 2,
      date: '23 juni 2024',
      modifiedBy: 'Pia Nordanskog',
      content: `Lithium 600mg morgon + kväll
Olanzapin 10mg vid behov (maxdos 20mg)
Zopiklon 7,5mg vid sömnproblem

Ring vid:
• Sömnlöshet 2+ nätter
• Missar medicin
• Känner dig mycket aktiverad

Kontakt: Litiumsköterskor 090-123 45 67`,
      note: 'Akut justering under hypoman episod',
    },
    {
      id: 1,
      date: '15 mars 2024',
      modifiedBy: 'Pia Nordanskog',
      content: `Lithium 600mg morgon + kväll
Olanzapin 10mg vid behov

Ring vid frågor: Litiumsköterskor 090-123 45 67

Nästa besök: Juni 2024`,
      note: 'Initial plan efter diagnos',
    },
  ],
};

export function Vardplan() {
  const [showHistory, setShowHistory] = React.useState(false);

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6" style={{ 
      background: `linear-gradient(to bottom, ${COLORS.birchWhite} 0%, ${COLORS.alliancePurple}05 100%)`
    }}>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div style={{ color: COLORS.alliancePurple }}>
            <SpiralIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: COLORS.swedishBlue }}>
            Vårdplan
          </h1>
        </div>
        <p className="text-xs sm:text-sm" style={{ color: COLORS.swedishBlue }}>
          Single source of truth för medicin & kontaktvägar
        </p>
      </div>

      {/* Current Plan Card */}
      <div
        className="rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 relative overflow-hidden lagom-shadow"
        style={{
          backgroundColor: COLORS.birchWhite,
          border: `3px solid ${COLORS.alliancePurple}`,
        }}
      >
        {/* Subtle background */}
        <div className="absolute inset-0 opacity-5" style={{ color: COLORS.alliancePurple }}>
          <SpiralIcon className="w-full h-full" />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: COLORS.swedishBlue }}>
              📋 Aktuell Plan
            </h2>
            <div className="text-right">
              <p className="text-xs" style={{ color: COLORS.gentleSilver }}>
                Senast uppdaterad
              </p>
              <p className="text-sm font-medium" style={{ color: COLORS.swedishBlue }}>
                {MOCK_DATA.currentPlan.lastModified}
              </p>
              <p className="text-xs" style={{ color: COLORS.gentleSilver }}>
                av {MOCK_DATA.currentPlan.modifiedBy}
              </p>
            </div>
          </div>

          {/* Plan content - large, readable */}
          <div
            className="p-4 sm:p-6 rounded-lg font-mono text-sm sm:text-base leading-relaxed whitespace-pre-wrap overflow-x-auto"
            style={{
              backgroundColor: COLORS.birchWhite,
              border: `1px solid ${COLORS.gentleSilver}`,
              color: COLORS.swedishBlue,
            }}
          >
            {MOCK_DATA.currentPlan.content}
          </div>

          {/* LLM Parsing Demo (Mock) */}
          <div
            className="mt-4 p-4 rounded-lg"
            style={{
              backgroundColor: COLORS.threadGold + '15',
              border: `2px dashed ${COLORS.threadGold}`,
            }}
          >
            <p className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: COLORS.swedishBlue }}>
              🤖 Framtida Feature: LLM-Parsing
              <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: COLORS.alliancePurple, color: COLORS.birchWhite }}>
                DEMO
              </span>
            </p>
            <p className="text-xs mb-3" style={{ color: COLORS.birchWood }}>
              Klistra in text från 1177/Cosmic → LLM genererar automatisk medicin-schema för loggning
            </p>
            
            {/* Example */}
            <div className="space-y-2">
              <div
                className="p-3 rounded text-xs"
                style={{
                  backgroundColor: COLORS.birchWhite,
                  border: `1px solid ${COLORS.gentleSilver}`,
                }}
              >
                <p className="font-bold mb-1" style={{ color: COLORS.alliancePurple }}>
                  Input (från läkarbrev):
                </p>
                <p style={{ color: COLORS.swedishBlue }}>
                  "Lithium 600mg morgon + kväll, Olanzapin 15mg vid behov, Zopiklon 7.5mg"
                </p>
              </div>

              <div className="text-center text-lg" style={{ color: COLORS.threadGold }}>
                ↓ 🤖 LLM Parsing ↓
              </div>

              <div
                className="p-3 rounded text-xs"
                style={{
                  backgroundColor: COLORS.sageGreen + '20',
                  border: `1px solid ${COLORS.sageGreen}`,
                }}
              >
                <p className="font-bold mb-1" style={{ color: COLORS.sageGreen }}>
                  Output (strukturerad data):
                </p>
                <div style={{ color: COLORS.swedishBlue }}>
                  <p>✅ Lithium 2 tabletter (morgon 08:00)</p>
                  <p>✅ Lithium 3 tabletter (kväll 22:00)</p>
                  <p>✅ Olanzapin 15mg (vid behov, 22:00)</p>
                  <p>✅ Zopiklon 7.5mg (vid behov, 22:00)</p>
                </div>
              </div>

              <p className="text-xs text-center" style={{ color: COLORS.birchWood }}>
                → Kort klick på 📟 Min Medicin loggar automatiskt rätt mediciner
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
          style={{
            backgroundColor: showHistory ? COLORS.alliancePurple : COLORS.gentleSilver,
            color: COLORS.birchWhite,
          }}
        >
          <span>{showHistory ? '▼' : '▶'}</span>
          <span>Visa tidigare versioner ({MOCK_DATA.history.length})</span>
        </button>
      </div>

      {/* History (collapsible) */}
      {showHistory && (
        <div className="space-y-4">
          {MOCK_DATA.history.map((version, idx) => (
            <div
              key={version.id}
              className="rounded-2xl p-6 lagom-shadow"
              style={{
                backgroundColor: COLORS.birchWhite,
                border: `2px solid ${COLORS.gentleSilver}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold" style={{ color: COLORS.swedishBlue }}>
                    Version {MOCK_DATA.history.length - idx}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.gentleSilver }}>
                    {version.date} • {version.modifiedBy}
                  </p>
                </div>
                {version.note && (
                  <div
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: COLORS.threadGold + '30',
                      color: COLORS.swedishBlue,
                    }}
                  >
                    💬 {version.note}
                  </div>
                )}
              </div>

              <div
                className="p-4 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap"
                style={{
                  backgroundColor: COLORS.birchWhite,
                  border: `1px solid ${COLORS.gentleSilver}`,
                  color: COLORS.birchWood,
                }}
              >
                {version.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Medical Disclaimer */}
      <div
        className="mt-8 p-4 rounded-lg text-xs text-center"
        style={{
          backgroundColor: COLORS.gentleSilver + '30',
          color: COLORS.swedishBlue,
        }}
      >
        <p>⚕️ Denna vårdplan är ett levande dokument som hanteras av Pia (psykiatriker) och Sam.</p>
        <p className="mt-1">Vid akuta frågor, kontakta alltid litiumsköterskor på numret i planen.</p>
      </div>
    </div>
  );
}


