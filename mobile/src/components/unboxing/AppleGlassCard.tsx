import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Platform,
  Pressable,
  AccessibilityProps,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '../../constants/theme';

interface AppleGlassCardProps extends AccessibilityProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  interactive?: boolean;
  onPress?: () => void;
  intensity?: number;
  variant?: 'surface' | 'elevated' | 'spotlight' | 'danger';
  glowColor?: string;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AppleGlassCard: React.FC<AppleGlassCardProps> = ({
  children,
  style,
  interactive = false,
  onPress,
  intensity = Platform.OS === 'ios' ? 35 : 20,
  variant = 'surface',
  glowColor,
  testID,
  accessibilityRole,
  accessibilityLabel,
  accessibilityHint,
  ...accessibilityProps
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    if (!interactive) return;
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    // Emil Kowalski press rule: 100-120ms snappy scale-down on press-in
    scale.set(
      withTiming(0.975, {
        duration: 120,
        easing: Easing.bezier(0.23, 1, 0.32, 1),
      })
    );
    opacity.set(
      withTiming(0.88, {
        duration: 120,
      })
    );
  };

  const handlePressOut = () => {
    if (!interactive) return;
    // Emil Kowalski spring release: natural recovery with subtle bounce
    scale.set(
      withSpring(1, {
        damping: 14,
        stiffness: 180,
      })
    );
    opacity.set(
      withTiming(1, {
        duration: 160,
      })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
    opacity: opacity.get(),
  }));

  // Border & Glow calibration — Apple HIG Restrained Hairlines
  const borderTone =
    variant === 'spotlight'
      ? 'rgba(0, 122, 255, 0.24)'
      : variant === 'danger'
      ? 'rgba(255, 45, 85, 0.24)'
      : variant === 'elevated'
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(255, 255, 255, 0.08)';

  const cardContent = (
    <View style={styles.innerWrapper}>
      {/* Real Blur Layer */}
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={intensity}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.androidFallback]} />
      )}

      {/* Top Hairline Specular Gleam (Apple Liquid Glass signature) */}
      <View style={styles.topSpecularGleam} />

      {/* Custom Glow Aura if provided */}
      {glowColor ? (
        <View
          style={[
            styles.radialAura,
            { backgroundColor: glowColor },
          ]}
          pointerEvents="none"
        />
      ) : null}

      {/* Actual Child Content */}
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );

  const containerStyle = [
    styles.cardBase,
    { borderColor: borderTone },
    variant === 'elevated' && styles.cardElevated,
    variant === 'spotlight' && styles.cardSpotlight,
    variant === 'danger' && styles.cardDanger,
    style,
  ];

  if (interactive) {
    return (
      <AnimatedPressable
        testID={testID}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[containerStyle, animatedStyle]}
        accessibilityRole={accessibilityRole || 'button'}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} // Minimum 44x44pt compliance
        {...accessibilityProps}
      >
        {cardContent}
      </AnimatedPressable>
    );
  }

  return (
    <View
      testID={testID}
      style={containerStyle}
      accessibilityRole={accessibilityRole || 'none'}
      accessibilityLabel={accessibilityLabel}
      {...accessibilityProps}
    >
      {cardContent}
    </View>
  );
};

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#1C1C1E',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.30,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.40)',
      } as any,
    }),
  },
  cardElevated: {
    backgroundColor: '#242426',
  },
  cardSpotlight: {
    backgroundColor: 'rgba(12, 22, 38, 0.90)',
    ...Platform.select({
      ios: {
        shadowColor: Colors.systemBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.20,
        shadowRadius: 16,
      },
    }),
  },
  cardDanger: {
    backgroundColor: 'rgba(32, 16, 20, 0.90)',
    ...Platform.select({
      ios: {
        shadowColor: Colors.systemPink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.20,
        shadowRadius: 16,
      },
    }),
  },
  innerWrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: Radius.lg,
  },
  androidFallback: {
    backgroundColor: '#1C1C1E',
  },
  topSpecularGleam: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    zIndex: 2,
  },
  radialAura: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.08,
    filter: 'blur(30px)' as any,
  },
  contentContainer: {
    zIndex: 3,
    padding: 16,
  },
});
