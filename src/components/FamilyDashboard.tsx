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

// Archetypal SVG Icons
const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2L4 6V12C4 16.5 7 20.5 12 22C17 20.5 20 16.5 20 12V6L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

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

// Mock data - would come from real Chronicle/vårdplan backend
const MOCK_DATA = {
  patient: {
    name: 'Samuel',
  },
  status: {
    level: 'calm', // 'calm' | 'elevated' | 'action_needed'
    label: 'Allt lugnt',
    message: 'Samuel följer sin plan och sover normalt',
  },
  medication: {
    last3Days: [
      { date: '7 nov', taken: true },
      { date: '6 nov', taken: true },
      { date: '5 nov', taken: true },
    ],
  },
  sleep: {
    status: 'normal', // 'normal' | 'warning'
    message: 'Sover normalt',
    details: '7-8h senaste 3 nätterna',
  },
  contact: {
    litiumskoterskorna: '090-123 45 67', // Mock number
  },
};

const getStatusColor = (level: string) => {
  switch (level) {
    case 'calm':
      return COLORS.sageGreen;
    case 'elevated':
      return COLORS.threadGold;
    case 'action_needed':
      return COLORS.copperAnchor;
    default:
      return COLORS.gentleSilver;
  }
};

const getStatusEmoji = (level: string) => {
  switch (level) {
    case 'calm':
      return '🟢';
    case 'elevated':
      return '🟡';
    case 'action_needed':
      return '🔴';
    default:
      return '⚪';
  }
};

export default function FamilyDashboard() {
  const showContactButton = MOCK_DATA.status.level !== 'calm';

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6" style={{ 
      background: `linear-gradient(to bottom, ${COLORS.birchWhite} 0%, ${COLORS.sageGreen}08 100%)`
    }}>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div style={{ color: COLORS.alliancePurple }}>
            <ShieldIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: COLORS.swedishBlue }}>
            Familjevy
          </h1>
        </div>
        <p className="text-xs sm:text-sm" style={{ color: COLORS.swedishBlue }}>
          Översikt för Eva & Roger
        </p>
      </div>

      {/* Big Status Bubble - CENTER, HERO */}
      <div className="mb-6 sm:mb-8">
        <div
          className="rounded-2xl p-6 sm:p-12 text-center relative overflow-hidden"
          style={{
            backgroundColor: COLORS.birchWhite,
            border: `4px solid ${getStatusColor(MOCK_DATA.status.level)}`,
          }}
        >
          {/* Subtle background icon */}
          <div className="absolute inset-0 opacity-5" style={{ color: getStatusColor(MOCK_DATA.status.level) }}>
            <ShieldIcon className="w-full h-full" />
          </div>

          <div className="relative">
            {/* Big emoji */}
            <div className="text-6xl sm:text-8xl mb-4">{getStatusEmoji(MOCK_DATA.status.level)}</div>

            {/* Status label */}
            <h2 className="text-2xl sm:text-4xl font-bold mb-3" style={{ color: getStatusColor(MOCK_DATA.status.level) }}>
              {MOCK_DATA.status.label}
            </h2>

            {/* Status message */}
            <p className="text-base sm:text-lg" style={{ color: COLORS.swedishBlue }}>
              {MOCK_DATA.status.message}
            </p>
          </div>
        </div>
      </div>

      {/* Two Cards: Medicine & Sleep */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Medicine Compliance Card */}
        <div
          className="rounded-2xl p-4 sm:p-6 lagom-shadow relative overflow-hidden"
          style={{
            backgroundColor: COLORS.birchWhite,
            border: `2px solid ${COLORS.alliancePurple}`,
          }}
        >
          {/* Subtle background */}
          <div className="absolute inset-0 opacity-5" style={{ color: COLORS.alliancePurple }}>
            <SpiralIcon className="w-full h-full" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💊</span>
              <h3 className="text-xl font-bold" style={{ color: COLORS.swedishBlue }}>
                Medicin
              </h3>
            </div>

            <p className="text-sm mb-4" style={{ color: COLORS.swedishBlue }}>
              Senaste 3 dagarna
            </p>

            {/* Simple checkmarks */}
            <div className="space-y-2">
              {MOCK_DATA.medication.last3Days.map((day, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-2xl">{day.taken ? '✅' : '❌'}</span>
                  <span className="text-sm font-medium" style={{ color: COLORS.swedishBlue }}>
                    {day.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sleep Warning Card */}
        <div
          className="rounded-2xl p-4 sm:p-6 lagom-shadow relative overflow-hidden"
          style={{
            backgroundColor: COLORS.birchWhite,
            border: `2px solid ${COLORS.alliancePurple}`,
          }}
        >
          {/* Subtle background */}
          <div className="absolute inset-0 opacity-5" style={{ color: COLORS.alliancePurple }}>
            <SpiralIcon className="w-full h-full" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">😴</span>
              <h3 className="text-xl font-bold" style={{ color: COLORS.swedishBlue }}>
                Sömn
              </h3>
            </div>

            <div className="text-center py-6">
              <div className="text-4xl mb-2">
                {MOCK_DATA.sleep.status === 'normal' ? '✅' : '⚠️'}
              </div>
              <p className="text-lg font-semibold mb-1" style={{ color: COLORS.swedishBlue }}>
                {MOCK_DATA.sleep.message}
              </p>
              <p className="text-sm" style={{ color: COLORS.gentleSilver }}>
                {MOCK_DATA.sleep.details}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Button (only if not calm) */}
      {showContactButton && (
        <div
          className="rounded-2xl p-4 sm:p-6 lagom-shadow text-center"
          style={{
            backgroundColor: COLORS.copperAnchor + '15',
            border: `2px solid ${COLORS.copperAnchor}`,
          }}
        >
          <p className="text-sm font-medium mb-3" style={{ color: COLORS.swedishBlue }}>
            Behöver ni stöd? Kontakta vårdteamet:
          </p>
          <a
            href={`tel:${MOCK_DATA.contact.litiumskoterskorna}`}
            className="inline-block px-6 py-3 rounded-lg font-bold text-lg"
            style={{
              backgroundColor: COLORS.copperAnchor,
              color: COLORS.birchWhite,
            }}
          >
            📞 Ring litiumsköterskor
          </a>
          <p className="text-xs mt-2" style={{ color: COLORS.swedishBlue }}>
            {MOCK_DATA.contact.litiumskoterskorna}
          </p>
        </div>
      )}

      {/* Calm reassurance footer */}
      {!showContactButton && (
        <div className="text-center py-6">
          <p className="text-sm italic" style={{ color: COLORS.gentleSilver }}>
            Denna vy uppdateras automatiskt baserat på Sams vårdplan och loggade data.
          </p>
        </div>
      )}
    </div>
  );
}

