export const Colors = {
  // Apple System Dark Backgrounds
  background: '#000000',                  // Pure OLED Pitch Black
  secondaryBackground: '#0C0D12',         // Subtle depth background
  tertiaryBackground: '#14161F',          // Deep grouped background

  // Apple System Grays (iOS Dark Mode Spec)
  systemGray: '#8E8E93',
  systemGray2: '#636366',
  systemGray3: '#48484A',
  systemGray4: '#3A3A3C',
  systemGray5: '#2C2C2E',
  systemGray6: '#1C1C1E',

  // Apple Liquid Glass Material Tokens
  glassSurface: 'rgba(255, 255, 255, 0.05)',          // Ultra-fine frosted glass
  glassSurfaceElevated: 'rgba(255, 255, 255, 0.08)',  // Raised card glass
  glassSurfaceInteractive: 'rgba(255, 255, 255, 0.12)',// Pressed / hovered glass
  glassBorder: 'rgba(255, 255, 255, 0.12)',           // Sub-pixel hairline border
  glassBorderGleam: 'rgba(255, 255, 255, 0.24)',      // Top specular highlight
  glassDock: 'rgba(18, 18, 24, 0.82)',                // Translucent floating dock

  // Authentic Apple System Colors (iOS HIG Palette)
  systemBlue: '#007AFF',          // Iconic Apple System Blue (Primary Action)
  systemBlueSoft: 'rgba(0, 122, 255, 0.15)',
  systemBlueGlow: 'rgba(0, 122, 255, 0.35)',

  systemPink: '#FF2D55',          // Apple System Pink / Rose (Chemistry & Tension)
  systemPinkSoft: 'rgba(255, 45, 85, 0.15)',
  systemPinkGlow: 'rgba(255, 45, 85, 0.35)',

  systemPurple: '#AF52DE',        // Apple System Purple (Power & Psychology)
  systemPurpleSoft: 'rgba(175, 82, 222, 0.15)',

  systemIndigo: '#5856D6',        // Apple System Indigo
  systemIndigoSoft: 'rgba(88, 86, 214, 0.15)',

  systemCyan: '#32ADE6',          // Apple System Cyan (Speed & Chronemics)
  systemCyanSoft: 'rgba(50, 173, 230, 0.15)',

  systemGreen: '#34C759',         // Apple System Green (High Odds & Health)
  systemGreenSoft: 'rgba(52, 199, 89, 0.15)',

  systemOrange: '#FF9500',        // Apple System Orange (Warnings & Cringe)
  systemOrangeSoft: 'rgba(255, 149, 0, 0.15)',

  systemRed: '#FF3B30',           // Apple System Red (Critical Red Flags)
  systemRedSoft: 'rgba(255, 59, 48, 0.15)',

  systemYellow: '#FFCC00',        // Apple System Yellow (Delulu highlights)
  systemYellowSoft: 'rgba(255, 204, 0, 0.15)',

  // Legacy mappings for backwards-compatible component references
  accentYellow: '#007AFF',        // Remapped to Apple System Blue for Apple feel
  accentYellowMuted: '#0A84FF',
  accentYellowSoft: 'rgba(0, 122, 255, 0.12)',
  accentYellowGlow: 'rgba(0, 122, 255, 0.30)',

  accentRose: '#FF2D55',          // Apple System Pink
  accentRoseMuted: '#D62249',
  accentRoseSoft: 'rgba(255, 45, 85, 0.12)',
  accentRoseGlow: 'rgba(255, 45, 85, 0.30)',

  accentPurple: '#AF52DE',        // Apple System Purple
  accentCyan: '#32ADE6',          // Apple System Cyan
  accentGreen: '#34C759',         // Apple System Green
  accentOrange: '#FF9500',        // Apple System Orange
  accentRed: '#FF3B30',           // Apple System Red

  // Text Hierarchy (Apple SF Pro Spec & WCAG AAA Contrast)
  textPrimary: '#FFFFFF',         // Crisp 100% white
  textSecondary: '#EBEBF5',       // Secondary label (60% opacity on black)
  textTertiary: '#8E8E93',        // Apple System Gray
  textMuted: '#636366',           // Apple System Gray 2
  textQuaternary: 'rgba(235, 235, 245, 0.18)',

  // Card Surfaces
  surface: 'rgba(255, 255, 255, 0.05)',
  surfaceElevated: 'rgba(255, 255, 255, 0.08)',
  surfaceHighlight: 'rgba(255, 255, 255, 0.12)',
  surfaceGlass: 'rgba(255, 255, 255, 0.06)',
  surfaceGlassStrong: 'rgba(18, 18, 24, 0.85)',

  // Borders
  borderSubtle: 'rgba(255, 255, 255, 0.10)',
  borderGleam: 'rgba(255, 255, 255, 0.20)',
  borderActive: 'rgba(0, 122, 255, 0.50)',
  borderRose: 'rgba(255, 45, 85, 0.50)',
} as const;

export const Radius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 26,
  full: 9999,
} as const;

export const Typography = {
  displayLarge: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
    color: Colors.textPrimary,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
    color: Colors.textPrimary,
  },
  titleLarge: {
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    color: Colors.textPrimary,
  },
  titleMedium: {
    fontSize: 18,
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
    color: Colors.textTertiary,
  },
  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
};
