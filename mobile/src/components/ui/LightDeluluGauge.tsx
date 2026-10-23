import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, AccessibilityProps } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Radius, Typography, Spacing } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface LightDeluluGaugeProps extends AccessibilityProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  isAnalyzing?: boolean;
  classification?: string;
  onAnimationEnd?: () => void;
  hapticsEnabled?: boolean;
}

export function LightDeluluGauge({
  score,
  size = 240,
  strokeWidth = 14,
  isAnalyzing = false,
  classification,
  onAnimationEnd,
  hapticsEnabled = true,
}: LightDeluluGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animation values
  const progress = useSharedValue(0);
  const scale = useSharedValue(0.96);

  // Score-adaptive palette
  const getDynamicColors = (s: number) => {
    if (s >= 80) {
      return {
        primary: Colors.accentDanger,
        soft: Colors.systemRedSoft,
        label: 'Textbook Clownery',
        badgeBg: 'rgba(255, 59, 48, 0.08)',
        badgeText: Colors.accentDanger,
      };
    }
    if (s >= 65) {
      return {
        primary: Colors.accentRose,
        soft: Colors.accentRoseSoft,
        label: 'High Chemistry / Delulu',
        badgeBg: Colors.accentRoseSoft,
        badgeText: Colors.accentRose,
      };
    }
    if (s >= 35) {
      return {
        primary: Colors.accentGold,
        soft: Colors.accentGoldSoft,
        label: 'Simmering Delulu',
        badgeBg: Colors.accentGoldSoft,
        badgeText: Colors.accentGold,
      };
    }
    return {
      primary: Colors.accentSuccess,
      soft: Colors.systemGreenSoft,
      label: 'Reciprocal Grounded',
      badgeBg: 'rgba(52, 199, 89, 0.10)',
      badgeText: Colors.accentSuccess,
    };
  };

  const dynamic = getDynamicColors(score);
  const verdictLabel = classification || dynamic.label;

  useEffect(() => {
    if (isAnalyzing) {
      progress.value = withTiming(0.4, { duration: 1500 });
      return;
    }

    scale.value = withSpring(1, { damping: 15, stiffness: 120 });
    const targetProgress = Math.min(Math.max(score, 0), 100) / 100;

    progress.value = withSpring(
      targetProgress,
      {
        damping: 18,
        stiffness: 90,
      },
      (finished) => {
        if (finished && onAnimationEnd) {
          onAnimationEnd();
        }
      }
    );

    if (hapticsEnabled && Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // Haptics fallback
      }
    }
  }, [score, isAnalyzing]);

  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={dynamic.primary} />
              <Stop offset="100%" stopColor={dynamic.primary} stopOpacity={0.85} />
            </LinearGradient>
          </Defs>

          <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {/* Background Track */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={Colors.secondaryBackground}
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Dynamic Progress Stroke */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#scoreGrad)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              animatedProps={animatedCircleProps}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>

        {/* Center Content */}
        <View style={styles.centerContent}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreNumber}>{score}</Text>
            <Text style={styles.percentSign}>%</Text>
          </View>

          {/* Verdict Status Badge */}
          <View style={[styles.badge, { backgroundColor: dynamic.badgeBg }]}>
            <Text style={[styles.badgeText, { color: dynamic.badgeText }]}>
              {verdictLabel}
            </Text>
          </View>

          <Text style={styles.subtitle}>Delulu Score</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 58,
    fontWeight: '800',
    letterSpacing: -1.5,
    color: Colors.textPrimary,
    lineHeight: 64,
  },
  percentSign: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textTertiary,
    marginLeft: 2,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginTop: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textTertiary,
  },
});
