// Red Forge Design Tokens - Dark + Red Theme

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
    text: 'text-yellow-300',
    bg: 'bg-yellow-500/30',
    border: 'border-yellow-400',
    accent: '#facc15', // For lines
    bgTint: 'bg-yellow-950/5',
    glow: 'shadow-yellow-500/20',
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

