import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import {
  Compass,
  MessageCircle,
  TrendingUp,
  Bookmark,
  Sparkles,
  Shield,
  X,
  ChevronRight,
  User,
  LogOut,
  RefreshCw,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius, Typography, Spacing } from '@/constants/theme';

interface NavigationDrawerProps {
  visible: boolean;
  onClose: () => void;
  activePartner?: string;
  onSwitchPartner?: () => void;
}

export function NavigationDrawer({
  visible,
  onClose,
  activePartner = 'Sarah',
  onSwitchPartner,
}: NavigationDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (route: string) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Haptics fallback
      }
    }
    onClose();
    router.replace(route as any);
  };

  const navItems = [
    {
      title: 'Radar',
      subtitle: 'Command Center & Forensics',
      route: '/',
      icon: Compass,
      active: pathname === '/' || pathname === '/(tabs)',
      accent: Colors.accentGold,
    },
    {
      title: 'Doctor Delulu',
      subtitle: 'AI Coach & Reply Triad',
      route: '/coach',
      icon: MessageCircle,
      active: pathname === '/coach',
      accent: Colors.accentRose,
    },
    {
      title: 'Timeline',
      subtitle: 'Longitudinal Fever Chart',
      route: '/timeline',
      icon: TrendingUp,
      active: pathname === '/timeline',
      accent: Colors.systemBlue,
    },
    {
      title: 'The Keep',
      subtitle: 'Partner Vault & Receipts',
      route: '/keep',
      icon: Bookmark,
      active: pathname === '/keep',
      accent: Colors.accentGold,
    },
    {
      title: 'Theatrical Unboxing',
      subtitle: '5-Beat Reveal Engine',
      route: '/unboxing-preview',
      icon: Sparkles,
      active: pathname === '/unboxing-preview',
      accent: Colors.accentRose,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop press to close */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Drawer Content */}
        <View style={styles.drawerContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.drawerContent}
          >
            {/* Header */}
            <View style={styles.drawerHeader}>
              <View>
                <Text style={styles.brandTitle}>ASSIFY</Text>
                <Text style={styles.brandSubtitle}>Relationship Intelligence</Text>
              </View>
              <Pressable
                onPress={onClose}
                style={styles.closeButton}
                hitSlop={12}
              >
                <X size={20} color={Colors.textSecondary} />
              </Pressable>
            </View>

            {/* Active Subject / Relationship Card */}
            <View style={styles.subjectCard}>
              <View style={styles.subjectAvatar}>
                <Text style={styles.avatarLetter}>{activePartner.charAt(0)}</Text>
              </View>
              <View style={styles.subjectInfo}>
                <Text style={styles.subjectLabel}>ACTIVE AUDIT</Text>
                <Text style={styles.subjectName}>{activePartner}</Text>
                <Text style={styles.subjectMeta}>14,821 messages parsed</Text>
              </View>
              {onSwitchPartner && (
                <Pressable
                  onPress={onSwitchPartner}
                  style={styles.switchButton}
                >
                  <RefreshCw size={14} color={Colors.textTertiary} />
                </Pressable>
              )}
            </View>

            {/* Navigation Section */}
            <Text style={styles.sectionHeader}>INTELLIGENCE MODULES</Text>
            <View style={styles.menuGroup}>
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                const isFirst = index === 0;
                const isLast = index === navItems.length - 1;

                return (
                  <Pressable
                    key={item.route}
                    onPress={() => handleNavigate(item.route)}
                    style={[
                      styles.menuItem,
                      item.active && styles.menuItemActive,
                      isFirst && styles.menuItemFirst,
                      isLast && styles.menuItemLast,
                    ]}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor: item.active
                            ? Colors.textPrimary
                            : Colors.secondaryBackground,
                        },
                      ]}
                    >
                      <IconComponent
                        size={18}
                        color={item.active ? Colors.textInverted : item.accent}
                      />
                    </View>

                    <View style={styles.menuTextContainer}>
                      <Text
                        style={[
                          styles.menuItemTitle,
                          item.active && styles.menuItemTitleActive,
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.menuItemSubtitle}>
                        {item.subtitle}
                      </Text>
                    </View>

                    <ChevronRight
                      size={16}
                      color={
                        item.active ? Colors.textPrimary : Colors.textMuted
                      }
                    />
                  </Pressable>
                );
              })}
            </View>

            {/* Privacy & System Status */}
            <Text style={styles.sectionHeader}>SECURITY & PRIVACY</Text>
            <View style={styles.privacyCard}>
              <View style={styles.privacyIconRow}>
                <Shield size={16} color={Colors.systemGreen} />
                <Text style={styles.privacyStatus}>Zero-Trust Sanitization Active</Text>
              </View>
              <Text style={styles.privacyDescription}>
                All names, phone numbers, and location telemetry are masked
                on-device before any AI processing.
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.versionText}>ASSIFY v2.4.0 (Build 540) • Apple HIG Edition</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  drawerContainer: {
    width: '85%',
    maxWidth: 380,
    backgroundColor: Colors.background,
    height: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: -4, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
      },
      web: {
        boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.12)',
      } as any,
    }),
  },
  drawerContent: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 40,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.textPrimary,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textTertiary,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  subjectAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textInverted,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.accentGold,
    marginBottom: 2,
  },
  subjectName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subjectMeta: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  switchButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textTertiary,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderHairline,
  },
  menuItemActive: {
    backgroundColor: '#FFFFFF',
  },
  menuItemFirst: {},
  menuItemLast: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  menuItemTitleActive: {
    fontWeight: '700',
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  privacyCard: {
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  privacyIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  privacyStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.systemGreen,
    marginLeft: 8,
  },
  privacyDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textTertiary,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  versionText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
