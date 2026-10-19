export const Colors = {
  // Canvas & Backgrounds (Apple Deep Obsidian / Midnight Navy)
  background: '#08090E',        // Ultra-deep void background
  surface: '#0E1017',           // Primary card background
  surfaceElevated: '#151824',   // Raised modals, action sheets
  surfaceGlass: 'rgba(21, 24, 36, 0.78)', // Translucent frosted glass

  // Borders & Dividers
  borderSubtle: 'rgba(255, 255, 255, 0.08)', // Hairline divider
  borderActive: 'rgba(255, 214, 10, 0.40)',  // Subtle yellow glow
  borderRose: 'rgba(255, 55, 95, 0.40)',    // Subtle rose glow

  // Primary Accents (The ASSIFY Signature Duo)
  accentYellow: '#FFD60A',      // Radiant Citron Gold (Scores, highlights, brilliance)
  accentYellowMuted: '#C7A600',  // Darker gold for borders and subtle tags
  accentYellowSoft: 'rgba(255, 214, 10, 0.12)', // Subtle yellow card tint

  accentRose: '#FF375F',        // Electric Rose / Vivid Pink (Chemistry, romantic tension)
  accentRoseMuted: '#D62249',   // Subtle rose for soft chips and badges
  accentRoseSoft: 'rgba(255, 55, 95, 0.12)', // Subtle rose card tint

  // Secondary Accents
  accentCyan: '#32ADE6',        // Digital rhythm, chronemics, logic
  accentGreen: '#30D158',       // Green flags, healthy patterns
  accentOrange: '#FF9F0A',      // Red flags, power warnings
  accentPurple: '#BF5AF2',      // Deep psychological insight

  // Text Hierarchy (Apple SF Pro Spec)
  textPrimary: '#F5F5F7',       // High-contrast clean white
  textSecondary: '#A1A1A6',     // Elegant secondary gray
  textTertiary: '#636366',      // Subtle timestamps and meta
  textMuted: '#48484A',         // Watermarks and faint captions

  // Status Badges
  badgeSuccessBg: 'rgba(48, 209, 88, 0.14)',
  badgeSuccessText: '#30D158',
  badgeWarningBg: 'rgba(255, 159, 10, 0.14)',
  badgeWarningText: '#FF9F0A',
  badgeDangerBg: 'rgba(255, 55, 95, 0.14)',
  badgeDangerText: '#FF375F',
} as const;

export const Typography = {
  displayLarge: {
    fontSize: 44,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
    color: Colors.textPrimary,
  },
  displayMedium: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    color: Colors.textPrimary,
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    color: Colors.textPrimary,
  },
  titleMedium: {
    fontSize: 19,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    color: Colors.textPrimary,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
    color: Colors.textTertiary,
  },
  label: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
};
