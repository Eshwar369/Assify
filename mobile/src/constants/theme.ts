export const Colors = {
  // Apple.com Pure White & Grouped Light Backgrounds
  background: '#FFFFFF',                  // Pure Canvas White
  secondaryBackground: '#F5F5F7',         // Apple Grouped Slate background
  tertiaryBackground: '#E8E8ED',          // Inset grouped panels
  backgroundElevated: '#FFFFFF',          // Card Surface (Opaque White)

  // Apple System Grays (iOS Light Spec)
  systemGray: '#8E8E93',
  systemGray2: '#AEAEB2',
  systemGray3: '#C7C7CC',
  systemGray4: '#D1D1D6',
  systemGray5: '#E5E5EA',
  systemGray6: '#F2F2F7',

  // Core Text Hierarchy (Apple Editorial Jet Black & Slate)
  textPrimary: '#000000',                 // Jet Black (Display & Hero)
  textSecondary: '#1D1D1F',               // Dark Slate (Apple Standard Body)
  textTertiary: '#86868B',                // Muted Caption Gray
  textMuted: '#AEAEB2',                   // Disabled / Delimiter Gray
  textQuaternary: '#C7C7CC',              // Ghost Gray
  textInverted: '#FFFFFF',                // White text for dark buttons

  // Surgical Accents (Subtle Gold & Dusty Rose)
  accentGold: '#BF9B28',                  // Mustard / Champagne Gold (Micro-accents & seals)
  accentGoldSoft: 'rgba(191, 155, 40, 0.10)',
  accentGoldGlow: 'rgba(191, 155, 40, 0.25)',

  accentRose: '#E8A0BF',                  // Blush / Dusty Rose (Tension & Chemistry)
  accentRoseSoft: 'rgba(232, 160, 191, 0.14)',
  accentRoseGlow: 'rgba(232, 160, 191, 0.30)',

  // Semantic Feedback Colors (Apple System Palette)
  systemBlue: '#0071E3',                  // Iconic Apple Blue
  systemBlueSoft: 'rgba(0, 113, 227, 0.10)',
  systemBlueGlow: 'rgba(0, 113, 227, 0.25)',
  systemGreen: '#34C759',                 // Health & High Reciprocity
  systemGreenSoft: 'rgba(52, 199, 89, 0.12)',
  systemOrange: '#FF9500',                // Caution & Moderate Delulu
  systemOrangeSoft: 'rgba(255, 149, 0, 0.12)',
  systemRed: '#FF3B30',                   // Critical Red Flags & Severe Delulu
  systemRedSoft: 'rgba(255, 59, 48, 0.12)',
  systemPurple: '#AF52DE',
  systemPurpleSoft: 'rgba(175, 82, 222, 0.12)',
  systemCyan: '#32ADE6',
  systemCyanSoft: 'rgba(50, 173, 230, 0.12)',
  systemPink: '#E8A0BF',                  // Remapped to Dusty Rose
  systemPinkSoft: 'rgba(232, 160, 191, 0.14)',
  systemPinkGlow: 'rgba(232, 160, 191, 0.30)',
  systemYellow: '#BF9B28',                // Remapped to subtle gold

  accentDanger: '#FF3B30',
  accentSuccess: '#34C759',

  // Legacy mappings for backwards-compatible component references
  accentYellow: '#BF9B28',
  accentYellowMuted: '#9B7B1B',
  accentYellowSoft: 'rgba(191, 155, 40, 0.10)',
  accentYellowGlow: 'rgba(191, 155, 40, 0.25)',
  accentPurple: '#AF52DE',
  accentCyan: '#32ADE6',
  accentGreen: '#34C759',
  accentOrange: '#FF9500',
  accentRed: '#FF3B30',

  // Surfaces & Panels
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F5F7',
  surfaceElevated: '#FFFFFF',
  surfaceHighlight: 'rgba(0, 0, 0, 0.03)',
  surfaceGlass: 'rgba(255, 255, 255, 0.85)',
  surfaceGlassStrong: 'rgba(255, 255, 255, 0.95)',

  // Sub-pixel Hairlines & Borders
  borderSubtle: 'rgba(0, 0, 0, 0.06)',
  borderHairline: 'rgba(0, 0, 0, 0.05)',
  borderCard: 'rgba(0, 0, 0, 0.05)',
  borderGleam: 'rgba(0, 0, 0, 0.08)',
  borderActive: '#0071E3',
  borderRose: 'rgba(232, 160, 191, 0.50)',
  borderGold: 'rgba(191, 155, 40, 0.50)',

  // Material tokens for floating navigation / header
  glassSurface: 'rgba(255, 255, 255, 0.85)',
  glassSurfaceElevated: 'rgba(255, 255, 255, 0.95)',
  glassSurfaceInteractive: 'rgba(0, 0, 0, 0.04)',
  glassBorder: 'rgba(0, 0, 0, 0.06)',
  glassBorderGleam: 'rgba(0, 0, 0, 0.10)',
  glassDock: 'rgba(255, 255, 255, 0.85)',
} as const;

export const Radius = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 36,
  xxl: 48,
  screenGutter: 20,
} as const;

export const Elevation = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  cardFloating: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  pill: {
    backgroundColor: '#F5F5F7',
    borderRadius: Radius.full,
  },
} as const;

export const Typography = {
  displayLarge: {
    fontSize: 38,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
    lineHeight: 44,
    color: Colors.textPrimary,
  },
  displayMedium: {
    fontSize: 30,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
    lineHeight: 36,
    color: Colors.textPrimary,
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
    lineHeight: 30,
    color: Colors.textPrimary,
  },
  titleMedium: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    lineHeight: 26,
    color: Colors.textPrimary,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: -0.1,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    color: Colors.textTertiary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
    lineHeight: 16,
    color: Colors.textTertiary,
  },
  label: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
    color: Colors.textTertiary,
  },
};
