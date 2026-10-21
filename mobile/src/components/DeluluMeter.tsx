import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Sparkles } from 'lucide-react-native';
import { Colors, Radius } from '../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface DeluluMeterProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  circusLevel?: string;
  onPress?: () => void;
}

export const DeluluMeter: React.FC<DeluluMeterProps> = ({
  score,
  size = 210,
  strokeWidth = 14,
  label = 'DELULU METER',
  circusLevel,
  onPress,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(score / 100, {
      duration: 1400,
      easing: Easing.out(Easing.cubic),
    });
  }, [score]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  // Apple Gradient Calibration: System Blue -> System Purple -> System Pink
  const isHigh = score >= 65;
  const gradientStart = isHigh ? Colors.systemPink : Colors.systemBlue;
  const gradientEnd = isHigh ? Colors.systemPurple : Colors.systemCyan;

  const finalTier = circusLevel || (score >= 70 ? 'Romantic Clownery' : 'Sober Realist');

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={handlePress}
      style={[styles.container, { width: size, minHeight: size + 16 }]}>
      {/* Soft Apple Ambient Glow Layer */}
      <View
        style={[
          styles.glowAura,
          {
            width: size - 30,
            height: size - 30,
            borderRadius: (size - 30) / 2,
            backgroundColor: isHigh ? Colors.systemPinkGlow : Colors.systemBlueGlow,
          },
        ]}
      />

      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id="appleDeluluGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={gradientStart} />
            <Stop offset="100%" stopColor={gradientEnd} />
          </LinearGradient>
        </Defs>

        {/* Outer subtle guide ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius + strokeWidth / 2 + 2}
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={0.5}
          fill="none"
        />

        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Animated Progress Ring */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#appleDeluluGrad)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Center Label & Metric */}
      <View style={styles.centerContent}>
        <Text style={styles.labelText}>{label}</Text>
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreNumber, { color: '#FFFFFF' }]}>{score}</Text>
          <Text style={styles.scorePercent}>%</Text>
        </View>

        {/* Apple Frosted Circus Tier Pill */}
        <View style={styles.circusBadge}>
          <Sparkles size={11} color={gradientStart} style={{ marginRight: 4 }} />
          <Text style={[styles.circusText, { color: '#FFFFFF' }]} numberOfLines={1}>
            {finalTier}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'relative',
    paddingVertical: 4,
  },
  glowAura: {
    position: 'absolute',
    top: 15,
    opacity: 0.45,
    filter: 'blur(28px)',
  },
  svg: {
    position: 'absolute',
    top: 0,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    zIndex: 2,
    marginTop: 8,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: Colors.systemGray,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1.5,
  },
  scorePercent: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.systemGray,
    marginLeft: 2,
  },
  circusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginTop: 6,
    maxWidth: 160,
  },
  circusText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
