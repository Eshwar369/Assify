import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius, Typography, Spacing } from '@/constants/theme';
import { NavigationDrawer } from './NavigationDrawer';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  activePartner?: string;
  showAvatar?: boolean;
  rightElement?: React.ReactNode;
}

export function AppHeader({
  title = 'ASSIFY',
  subtitle,
  activePartner = 'Sarah',
  showAvatar = true,
  rightElement,
}: AppHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Haptics fallback
      }
    }
    setDrawerOpen(true);
  };

  return (
    <>
      <View style={styles.headerContainer}>
        {/* Left: Brand / Title */}
        <View style={styles.titleGroup}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {/* Center: Active Partner Pill */}
        {activePartner && (
          <Pressable onPress={handleOpenDrawer} style={styles.partnerPill}>
            <View style={styles.activeDot} />
            <Text style={styles.partnerText}>{activePartner}</Text>
          </Pressable>
        )}

        {/* Right: Custom element or Profile Avatar trigger */}
        <View style={styles.rightGroup}>
          {rightElement ? (
            rightElement
          ) : showAvatar ? (
            <Pressable
              onPress={handleOpenDrawer}
              style={styles.avatarButton}
              accessibilityLabel="Open navigation menu"
            >
              <View style={styles.avatarInner}>
                <Text style={styles.avatarInitial}>
                  {activePartner.charAt(0)}
                </Text>
              </View>
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Global Navigation Drawer */}
      <NavigationDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activePartner={activePartner}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenGutter,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderHairline,
  },
  titleGroup: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textTertiary,
    marginTop: 1,
  },
  partnerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackground,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.systemGreen,
    marginRight: 6,
  },
  partnerText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.accentGold,
  },
  avatarInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accentGoldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accentGold,
  },
});
