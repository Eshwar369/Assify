import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  AccessibilityProps,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface SpringDeluluGaugeProps extends AccessibilityProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  isAnalyzing?: boolean;
  circusLevel?: string;
  onAnimationEnd?: () => void;
  hapticsEnabled?: boolean;
}

export const SpringDeluluGauge: React.FC<SpringDeluluGaugeProps> = ({
  score,
  size = 230,
  strokeWidth = 15,
  isAnalyzing = false,
  circusLevel,
  onAnimationEnd,
  hapticsEnabled = true,
  accessibilityRole,
  accessibilityLabel,
  ...accessibilityProps
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Reanimated 4 Shared Values
  const progress = useSharedValue(0);
  const scaleAnim = useSharedValue(0.96);
  const glowOpacity = useSharedValue(0.35);

  const isSevere = score >= 75;
  const isModerate = score >= 45 && score < 75;

  const gradientColors = isSevere
    ? { start: Colors.systemPink, end: Colors.systemRed, glow: Colors.systemPinkGlow }
    : isModerate
    ? { start: Colors.systemPurple, end: Colors.systemPink, glow: Colors.systemPurpleSoft }
    : { start: Colors.systemCyan, end: Colors.systemBlue, glow: Colors.systemBlueGlow };

  const defaultTier =
    score >= 80
      ? 'CIRCUS HEADLINER'
      : score >= 60
      ? 'DANGEROUSLY DELUSIONAL'
      : score >= 35
      ? 'MILDLY HOPEFUL'
      : 'SOBER REALIST';

  const tierText = circusLevel || defaultTier;

  useEffect(() => {
    if (isAnalyzing) {
      // Anticipatory scanning hunt (slot-machine / radar oscillation)
      progress.set(
        withRepeat(
          withSequence(
            withTiming(0.35, { duration: 600, easing: Easing.bezier(0.23, 1, 0.32, 1) }),
            withTiming(0.12, { duration: 500, easing: Easing.bezier(0.77, 0, 0.175, 1) })
          ),
          -1,
          true
        )
      );
      glowOpacity.set(
        withRepeat(
          withSequence(
            withTiming(0.65, { duration: 400 }),
            withTiming(0.20, { duration: 400 })
          ),
          -1,
          true
        )
      );
    } else {
      // Physical Emil Kowalski spring reveal
      // Sequence: accelerate to target + overshoot slightly, then snap home
      const targetNormalized = Math.min(Math.max(score / 100, 0.02), 1);

      if (Platform.OS !== 'web' && hapticsEnabled) {
        // Heartbeat tick cadence before final slam
        setTimeout(() => Haptics.selectionAsync(), 120);
        setTimeout(() => Haptics.selectionAsync(), 280);
        setTimeout(() => Haptics.selectionAsync(), 450);
        setTimeout(() => {
          if (isSevere) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }
        }, 750);
      }

      // Spring with Apple's natural settle parameters
      progress.set(
        withSpring(targetNormalized, {
          damping: 13,
          stiffness: 90,
          mass: 1.0,
        }, (finished) => {
          if (finished && onAnimationEnd) {
            onAnimationEnd();
          }
        })
      );

      scaleAnim.set(
        withSpring(1, {
          damping: 14,
          stiffness: 140,
        })
      );

      glowOpacity.set(
        withTiming(isSevere ? 0.70 : 0.45, { duration: 600 })
      );
    }
  }, [isAnalyzing, score]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.get());
    return {
      strokeDashoffset,
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.get() }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.get(),
  }));

  // Render radial tick marks on the perimeter for watchmaking precision
  const tickCount = 36;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const angle = (i * 360) / tickCount;
    const isMajor = i % 9 === 0;
    return (
      <Circle
        key={`tick-${i}`}
        cx={size / 2}
        cy={size / 2 - (radius + strokeWidth / 2 + 5)}
        r={isMajor ? 1.5 : 0.75}
        fill={isMajor ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.12)'}
        transform={`rotate(${angle} ${size / 2} ${size / 2})`}
      />
    );
  });

  return (
    <Animated.View
      style={[styles.wrapper, { width: size, height: size }, animatedContainerStyle]}
      accessibilityRole={accessibilityRole || 'progressbar'}
      accessibilityLabel={
        accessibilityLabel || `Delulu Score: ${score} percent. Tier: ${tierText}.`
      }
      accessibilityValue={{ min: 0, max: 100, now: score }}
      {...accessibilityProps}
    >
      {/* Dynamic Ambient Neon Aura */}
      <Animated.View
        style={[
          styles.glowAura,
          {
            width: size - 40,
            height: size - 40,
            borderRadius: (size - 40) / 2,
            backgroundColor: gradientColors.glow,
          },
          animatedGlowStyle,
        ]}
      />

      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id="springDeluluGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors.start} />
            <Stop offset="100%" stopColor={gradientColors.end} />
          </LinearGradient>
        </Defs>

        {/* Outer Fine Ticks */}
        <G>{ticks}</G>

        {/* Recessed Track Ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Physical Spring Indicator Arc */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#springDeluluGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Center Frosted Glass Dome */}
      <View
        style={[
          styles.centerGlassDome,
          {
            width: size - strokeWidth * 2 - 28,
            height: size - strokeWidth * 2 - 28,
            borderRadius: (size - strokeWidth * 2 - 28) / 2,
          },
        ]}
      >
        <Text style={styles.eyebrowText}>
          {isAnalyzing ? 'AUDITING...' : 'DELULU INDEX'}
        </Text>

        <View style={styles.scoreRow}>
          <Text style={styles.scoreValue}>{isAnalyzing ? '--' : score}</Text>
          <Text style={styles.percentSymbol}>%</Text>
        </View>

        <View
          style={[
            styles.tierPill,
            { borderColor: isSevere ? 'rgba(255, 45, 85, 0.35)' : 'rgba(0, 122, 255, 0.35)' },
          ]}
        >
          <Text
            style={[
              styles.tierText,
              { color: isSevere ? Colors.systemPink : Colors.systemBlue },
            ]}
            numberOfLines={1}
          >
            {isAnalyzing ? 'CALIBRATING...' : tierText}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowAura: {
    position: 'absolute',
    opacity: 0.35,
    ...Platform.select({
      web: {
        filter: 'blur(45px)',
      } as any,
    }),
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  centerGlassDome: {
    backgroundColor: 'rgba(10, 10, 15, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.50,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  eyebrowText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.45)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    includeFontPadding: false,
  },
  percentSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.50)',
    marginTop: 8,
    marginLeft: 2,
  },
  tierPill: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    maxWidth: '95%',
  },
  tierText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
