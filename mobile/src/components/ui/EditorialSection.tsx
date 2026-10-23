import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '@/constants/theme';

export interface EditorialSectionProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  topDivider?: boolean;
}

export function EditorialSection({
  title,
  subtitle,
  badge,
  rightAction,
  children,
  style,
  topDivider = false,
}: EditorialSectionProps) {
  return (
    <View style={[styles.section, topDivider && styles.sectionWithDivider, style]}>
      {topDivider && <View style={styles.dividerLine} />}

      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={styles.titleWithBadge}>
            <Text style={styles.title}>{title}</Text>
            {badge}
          </View>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
      </View>

      {/* Content */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
    width: '100%',
  },
  sectionWithDivider: {
    paddingTop: 16,
  },
  dividerLine: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.borderHairline,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleGroup: {
    flex: 1,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  rightAction: {
    marginLeft: 12,
  },
});
