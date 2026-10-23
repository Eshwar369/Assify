import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Colors, Radius, Typography, Spacing } from '@/constants/theme';
import { AppleElevatedCard } from './AppleElevatedCard';

interface MetricCardProps {
  title: string;
  userValue: string;
  partnerValue: string;
  unit?: string;
  icon?: LucideIcon;
  insight: string;
  accentVariant?: 'none' | 'gold' | 'rose' | 'danger' | 'success';
}

export function MetricCard({
  title,
  userValue,
  partnerValue,
  unit,
  icon: Icon,
  insight,
  accentVariant = 'none',
}: MetricCardProps) {
  return (
    <AppleElevatedCard accentVariant={accentVariant} style={styles.card}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {Icon && <Icon size={16} color={Colors.textTertiary} />}
      </View>

      {/* Comparison Grid */}
      <View style={styles.comparisonGrid}>
        <View style={styles.valueColumn}>
          <Text style={styles.participantLabel}>YOU</Text>
          <View style={styles.valueRow}>
            <Text style={styles.primaryValue}>{userValue}</Text>
            {unit && <Text style={styles.unitText}>{unit}</Text>}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.valueColumn}>
          <Text style={styles.participantLabel}>THEM</Text>
          <View style={styles.valueRow}>
            <Text style={styles.partnerValue}>{partnerValue}</Text>
            {unit && <Text style={styles.unitText}>{unit}</Text>}
          </View>
        </View>
      </View>

      {/* Insight Footer */}
      <View style={styles.insightContainer}>
        <Text style={styles.insightText}>{insight}</Text>
      </View>
    </AppleElevatedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  comparisonGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  valueColumn: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.borderHairline,
    marginHorizontal: 12,
  },
  participantLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  primaryValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.textPrimary,
  },
  partnerValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.textSecondary,
  },
  unitText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textTertiary,
    marginLeft: 2,
  },
  insightContainer: {
    paddingTop: 2,
  },
  insightText: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textTertiary,
  },
});
