import React, { useState } from 'react';

// Balans Brand Colors
const COLORS = {
  birchWhite: '#f8f6f0',
  swedishBlue: '#2c5aa0',
  alliancePurple: '#6b5b95',
  gentleSilver: '#b8c5d1',
};

// Simple password gate - client-side only (demo purposes)
const DEMO_PASSWORD = 'pia'; // Password for Pia's demo access

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

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEMO_PASSWORD) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: COLORS.birchWhite }}
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl shadow-lg"
        style={{
          backgroundColor: 'white',
          border: `2px solid ${COLORS.alliancePurple}`,
        }}
      >
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div style={{ color: COLORS.alliancePurple }}>
            <SpiralIcon className="w-16 h-16" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-2" style={{ color: COLORS.swedishBlue }}>
          Weaver Medical Demo
        </h1>
        <p className="text-sm text-center mb-6" style={{ color: COLORS.gentleSilver }}>
          Denna demo är privat. Ange lösenord för åtkomst.
        </p>

        {/* Password Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
              style={{ color: COLORS.swedishBlue }}
            >
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                borderColor: error ? '#dc2626' : COLORS.gentleSilver,
              }}
              placeholder="Ange lösenord"
              autoFocus
            />
            {error && (
              <p className="text-sm mt-2" style={{ color: '#dc2626' }}>
                ❌ Felaktigt lösenord
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: COLORS.alliancePurple }}
          >
            Lås upp demo
          </button>
        </form>

        {/* Footer note */}
        <p className="text-xs text-center mt-6" style={{ color: COLORS.gentleSilver }}>
          🔒 Denna demo innehåller känslig medicinsk information. Dela inte lösenordet.
        </p>
      </div>
    </div>
  );
}

