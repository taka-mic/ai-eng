const tint = '#6C63FF';

export const Colors = {
  primary: '#6C63FF',
  primaryDark: '#5A52E0',
  primaryLight: '#EAE9FF',
  secondary: '#FF6584',
  accent: '#43D9AD',
  warning: '#FFB347',
  danger: '#FF5C5C',
  success: '#43D9AD',

  background: '#F8F7FF',
  surface: '#FFFFFF',
  surfaceVariant: '#F0EFF9',

  textPrimary: '#1A1A2E',
  textSecondary: '#6B6B8D',
  textMuted: '#A0A0B8',
  textOnPrimary: '#FFFFFF',

  border: '#E5E4F0',
  divider: '#EFEFEF',

  easy: '#43D9AD',
  medium: '#FFB347',
  hard: '#FF5C5C',

  tabIconDefault: '#A0A0B8',
  tabIconSelected: tint,
};

export type ColorKey = keyof typeof Colors;
