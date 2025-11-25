// Red Forge Design Tokens - RED AESTHETIC (ember/fire/crimson)

// US/NATO Classification Colors
export const CLASSIFICATION_COLORS = {
  UNCLASSIFIED: {
    text: 'text-blue-300',
    bg: 'bg-blue-500/30',
    border: 'border-blue-400',
    accent: '#60a5fa', // For lines
    bgTint: 'bg-blue-950/5',
    glow: 'shadow-blue-500/20',
  },
  CONFIDENTIAL: {
    text: 'text-orange-300', // Ember glow
    bg: 'bg-orange-500/30',
    border: 'border-orange-400',
    accent: '#fb923c', // For lines - ember orange
    bgTint: 'bg-orange-950/5',
    glow: 'shadow-orange-500/20',
  },
  SECRET: {
    text: 'text-red-300',
    bg: 'bg-red-500/30',
    border: 'border-red-400',
    accent: '#f87171', // For lines
    bgTint: 'bg-red-950/5',
    glow: 'shadow-red-500/20',
  },
  TOP_SECRET: {
    text: 'text-red-400',
    bg: 'bg-red-900/40',
    border: 'border-red-500',
    accent: '#dc2626', // For lines
    bgTint: 'bg-red-900/10',
    glow: 'shadow-red-900/30',
  },
} as const;

// Swedish (FMV/SAK-IMS) Classification Colors
export const SWEDISH_CLASSIFICATION_COLORS = {
  EJ_SEKRETESS: {
    text: 'text-blue-300',
    bg: 'bg-blue-500/30',
    border: 'border-blue-400',
    accent: '#60a5fa',
    bgTint: 'bg-blue-950/5',
    glow: 'shadow-blue-500/20',
    label: 'Ej sekretess',
    abbr: 'ES',
  },
  BEGRANSAT_HEMLIG: {
    text: 'text-yellow-300',
    bg: 'bg-yellow-500/30',
    border: 'border-yellow-400',
    accent: '#fbbf24',
    bgTint: 'bg-yellow-950/5',
    glow: 'shadow-yellow-500/20',
    label: 'Begränsat hemlig',
    abbr: 'BH',
  },
  KONFIDENTIELL: {
    text: 'text-orange-300',
    bg: 'bg-orange-500/30',
    border: 'border-orange-400',
    accent: '#fb923c',
    bgTint: 'bg-orange-950/5',
    glow: 'shadow-orange-500/20',
    label: 'Konfidentiell',
    abbr: 'K',
  },
  HEMLIG: {
    text: 'text-red-300',
    bg: 'bg-red-500/30',
    border: 'border-red-400',
    accent: '#f87171',
    bgTint: 'bg-red-950/5',
    glow: 'shadow-red-500/20',
    label: 'Hemlig',
    abbr: 'H',
  },
  KVALIFICERAT_HEMLIG: {
    text: 'text-red-400',
    bg: 'bg-red-900/40',
    border: 'border-red-500',
    accent: '#dc2626',
    bgTint: 'bg-red-900/10',
    glow: 'shadow-red-900/30',
    label: 'Kvalificerat hemlig',
    abbr: 'KH',
  },
} as const;

// Mapping between US and Swedish levels (approximate equivalents)
export const CLASSIFICATION_MAPPING = {
  US_TO_SWEDISH: {
    UNCLASSIFIED: 'EJ_SEKRETESS',
    CONFIDENTIAL: 'KONFIDENTIELL',
    SECRET: 'HEMLIG',
    TOP_SECRET: 'KVALIFICERAT_HEMLIG',
  },
  SWEDISH_TO_US: {
    EJ_SEKRETESS: 'UNCLASSIFIED',
    BEGRANSAT_HEMLIG: 'CONFIDENTIAL', // Approximate - between UNCLASSIFIED and CONFIDENTIAL
    KONFIDENTIELL: 'CONFIDENTIAL',
    HEMLIG: 'SECRET',
    KVALIFICERAT_HEMLIG: 'TOP_SECRET',
  },
} as const;

export const NETWORK_ZONE_COLORS = {
  white: {
    icon: '🌐',
    color: 'text-blue-400',
    label: 'White Network (Internet OK)',
  },
  yellow: {
    icon: '🏢',
    color: 'text-yellow-400',
    label: 'Yellow Network (On-Prem AI)',
  },
  red: {
    icon: '🔒',
    color: 'text-red-400',
    label: 'Red Network (No AI)',
  },
} as const;

export const TAG_ICONS = {
  what: '📘',
  how: '🔧',
  untagged: '⚠️',
  classified: '🔒',
} as const;

// Smoldering glow effects (from Red Forge Design Lumen)
export const SMOLDERING_EFFECTS = {
  'orange-ember': {
    layer1Classes: 'bg-gradient-to-br from-[#fb923c]/60 via-[#ff8800]/80 to-[#d97706]/70 blur-3xl',
    layer2Style: 'radial-gradient(circle at 50% 50%, rgba(251,146,60,0.8), rgba(255,136,0,0.4), transparent 70%)',
    timing: 'transition-all duration-500',
    scale: 'scale-95 group-hover:scale-110',
    opacity: 'opacity-0 group-hover:opacity-100'
  },
  'red-smolder': {
    layer1Classes: 'bg-gradient-to-br from-[#dc143c]/60 via-[#ff4500]/80 to-[#8b0000]/70 blur-3xl',
    layer2Style: 'radial-gradient(circle at 50% 50%, rgba(220,20,60,0.8), rgba(255,69,0,0.4), transparent 70%)',
    timing: 'transition-all duration-500',
    scale: 'scale-95 group-hover:scale-110',
    opacity: 'opacity-0 group-hover:opacity-100'
  }
} as const;

