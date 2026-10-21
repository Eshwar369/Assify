import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Scale } from 'lucide-react-native';
import { Colors, Radius } from '../constants/theme';

interface PowerSliderProps {
  userRatio: number; // e.g. 48
  contactRatio: number; // e.g. 52
  contactName: string;
  leverageNote?: string;
  onPress?: () => void;
}

export const PowerSlider: React.FC<PowerSliderProps> = ({
  userRatio,
  contactRatio,
  contactName,
  leverageNote,
  onPress,
}) => {
  const diff = Math.abs(userRatio - contactRatio);
  const isEquilibrium = diff <= 6;
  const userLeads = userRatio > contactRatio;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (onPress) onPress();
  };

  const defaultNote = isEquilibrium
    ? 'High-speed mutual sparring: conversational tempo shifts dynamically with zero drag.'
    : userLeads
    ? `You initiate and anchor conversation topics; ${contactName} matches your cadence.`
    : `${contactName} dictates response rhythm while you provide analytical depth.`;

const webGlassStyle: any = Platform.OS === 'web' ? { backdropFilter: 'blur(20px) saturate(160%)' } : {};

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handlePress}
      style={[styles.container, webGlassStyle]}>
      <View style={styles.headerRow}>
        <View style={styles.participantCol}>
          <Text style={styles.roleLabel}>YOU</Text>
          <Text style={styles.percentageText}>{userRatio}%</Text>
        </View>

        <View style={styles.centerBadge}>
          <Scale size={11} color={Colors.systemBlue} style={{ marginRight: 4 }} />
          <Text style={styles.balanceStatus}>
            {isEquilibrium
              ? 'Tactical Parity'
              : userLeads
              ? 'You Lead'
              : `${contactName} Leads`}
          </Text>
        </View>

        <View style={[styles.participantCol, { alignItems: 'flex-end' }]}>
          <Text style={styles.roleLabel} numberOfLines={1}>
            {contactName.toUpperCase()}
          </Text>
          <Text style={[styles.percentageText, { color: Colors.systemPink }]}>
            {contactRatio}%
          </Text>
        </View>
      </View>

      {/* Bidirectional Dual-Tone Apple Track */}
      <View style={styles.trackBackground}>
        <View style={[styles.userTrack, { width: `${userRatio}%` }]} />
        <View style={[styles.contactTrack, { width: `${contactRatio}%` }]} />
        {/* Center Divider Notch */}
        <View style={styles.notch} />
      </View>

      {/* Forensic Leverage Note */}
      <Text style={styles.leverageText} numberOfLines={2}>
        {leverageNote || defaultNote}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.glassSurfaceElevated,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginVertical: 12,
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
    fontWeight: '600',
    color: Colors.systemGray,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  percentageText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.systemBlue,
    letterSpacing: -0.3,
  },
  centerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 122, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  balanceStatus: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.systemBlue,
    letterSpacing: -0.1,
  },
  trackBackground: {
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  userTrack: {
    height: '100%',
    backgroundColor: Colors.systemBlue,
    borderTopLeftRadius: Radius.full,
    borderBottomLeftRadius: Radius.full,
  },
  contactTrack: {
    height: '100%',
    backgroundColor: Colors.systemPink,
    borderTopRightRadius: Radius.full,
    borderBottomRightRadius: Radius.full,
  },
  notch: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.background,
    marginLeft: -1,
    zIndex: 3,
  },
  leverageText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 17,
    color: Colors.systemGray,
    marginTop: 10,
  },
});
