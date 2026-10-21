import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { Colors, Radius } from '../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  glowColor?: string;
  elevated?: boolean;
}

const webGlassStyle: any = Platform.OS === 'web' ? { backdropFilter: 'blur(28px) saturate(180%)' } : {};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  glowColor,
  elevated = false,
}) => {
  return (
    <View
      style={[
        styles.base,
        elevated ? styles.elevated : styles.standard,
        glowColor
          ? {
              borderColor: glowColor,
              shadowColor: glowColor,
              shadowOpacity: 0.25,
              shadowRadius: 20,
            }
          : null,
        webGlassStyle,
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  standard: {
    backgroundColor: Colors.glassSurface,
  },
  elevated: {
    backgroundColor: Colors.glassSurfaceElevated,
    borderColor: Colors.glassBorderGleam,
  },
});
