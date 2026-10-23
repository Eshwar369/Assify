import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '@/constants/theme';

export interface StatItem {
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'gold' | 'rose' | 'danger' | 'success' | 'none';
}

export interface StatStripProps {
  metrics: StatItem[];
  style?: StyleProp<ViewStyle>;
  bordered?: boolean;
}

export function StatStrip({ metrics, style, bordered = true }: StatStripProps) {
  const getAccentColor = (accent?: StatItem['accent']) => {
    switch (accent) {
      case 'gold':
        return Colors.accentGold;
      case 'rose':
        return Colors.accentRose;
      case 'danger':
        return Colors.accentDanger;
      case 'success':
        return Colors.accentSuccess;
      default:
        return Colors.textPrimary;
    }
  };

  return (
    <View style={[styles.container, bordered && styles.bordered, style]}>
      {metrics.map((item, index) => {
        const isLast = index === metrics.length - 1;
        const color = getAccentColor(item.accent);

        return (
          <React.Fragment key={item.label}>
            <View style={styles.column}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={[styles.value, { color }]} numberOfLines={1}>
                {item.value}
              </Text>
              {item.sub && (
                <Text style={styles.sub} numberOfLines={1}>
                  {item.sub}
                </Text>
              )}
            </View>
            {!isLast && <View style={styles.divider} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    width: '100%',
  },
  bordered: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderHairline,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 32,
    backgroundColor: Colors.borderHairline,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.textTertiary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: Colors.textPrimary,
  },
  sub: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});
