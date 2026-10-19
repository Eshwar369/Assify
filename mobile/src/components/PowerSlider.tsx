import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface PowerSliderProps {
  userRatio: number; // e.g. 48
  contactRatio: number; // e.g. 52
  contactName: string;
}

export const PowerSlider: React.FC<PowerSliderProps> = ({
  userRatio,
  contactRatio,
  contactName,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.participantCol}>
          <Text style={styles.roleLabel}>YOU</Text>
          <Text style={styles.percentageText}>{userRatio}%</Text>
        </View>

        <View style={styles.centerBadge}>
          <Text style={styles.balanceStatus}>
            {Math.abs(userRatio - contactRatio) <= 6
              ? 'PLAYFUL PARITY'
              : userRatio > contactRatio
              ? 'YOU LEAD'
              : `${contactName.toUpperCase()} LEADS`}
          </Text>
        </View>

        <View style={[styles.participantCol, { alignItems: 'flex-end' }]}>
          <Text style={styles.roleLabel} numberOfLines={1}>
            {contactName.toUpperCase()}
          </Text>
          <Text style={[styles.percentageText, { color: Colors.accentRose }]}>
            {contactRatio}%
          </Text>
        </View>
      </View>

      {/* Bidirectional Dual-Tone Track */}
      <View style={styles.trackBackground}>
        <View
          style={[
            styles.userTrack,
            { width: `${userRatio}%` },
          ]}
        />
        <View
          style={[
            styles.contactTrack,
            { width: `${contactRatio}%` },
          ]}
        />
        {/* Center Divider Notch */}
        <View style={styles.notch} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  participantCol: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  percentageText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.accentYellow,
    letterSpacing: -0.5,
  },
  centerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  balanceStatus: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.textSecondary,
  },
  trackBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  userTrack: {
    height: '100%',
    backgroundColor: Colors.accentYellow,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  contactTrack: {
    height: '100%',
    backgroundColor: Colors.accentRose,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  notch: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.background,
    marginLeft: -1,
  },
});
