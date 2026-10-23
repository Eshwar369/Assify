import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Platform,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Flame,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Brain,
  Clock,
  Layers,
  Check,
  X,
  MessageCircle,
  Shield,
  Zap,
} from 'lucide-react-native';

import { Colors, Radius, Typography, Spacing } from '@/constants/theme';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppleElevatedCard } from '@/components/ui/AppleElevatedCard';
import { LightDeluluGauge } from '@/components/ui/LightDeluluGauge';
import { WhatsAppDropzone } from '@/components/WhatsAppDropzone';
import { useTabBar } from '@/context/TabBarContext';
import {
  getContacts,
  getReportDossier,
  Contact,
  ReportDossierResponse,
} from '@/services/api';

export default function RadarScreen() {
  const router = useRouter();
  const { handleScroll } = useTabBar();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [dossier, setDossier] = useState<ReportDossierResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vibeMode, setVibeMode] = useState<'therapy' | 'unhinged'>('unhinged');
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const loadData = async (targetContactId?: string) => {
    try {
      setError(null);
      const contactList = await getContacts();
      setContacts(contactList);

      if (contactList.length > 0) {
        const selected = targetContactId
          ? contactList.find((c) => c.id === targetContactId) || contactList[0]
          : activeContact
          ? contactList.find((c) => c.id === activeContact.id) || contactList[0]
          : contactList[0];

        setActiveContact(selected);
        const report = await getReportDossier(selected.id);
        setDossier(report);
      }
    } catch (err: any) {
      console.error('Error loading dossier:', err);
      setError(err?.message || 'Could not connect to ASSIFY backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Haptics fallback
      }
    }
    loadData(activeContact?.id).finally(() => setRefreshing(false));
  };

  const handleSelectContact = (contact: Contact) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Haptics fallback
      }
    }
    setActiveContact(contact);
    setShowContactPicker(false);
    setLoading(true);
    loadData(contact.id);
  };

  const handleFileDrop = (file: { name: string }) => {
    setIsAnalyzing(true);
    if (Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Haptics fallback
      }
    }
    setTimeout(() => {
      setIsAnalyzing(false);
      loadData(activeContact?.id);
    }, 1200);
  };

  const handleVibeToggle = (mode: 'therapy' | 'unhinged') => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Haptics fallback
      }
    }
    setVibeMode(mode);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.accentGold} />
        <Text style={styles.loadingTitle}>Crunching Forensics</Text>
        <Text style={styles.loadingSub}>Analyzing interaction patterns and delays</Text>
      </View>
    );
  }

  const profile = dossier?.profile;
  const chron = dossier?.chronemics;
  const contactName = activeContact?.display_name || 'Sarah';
  const score = profile?.delulu_score ?? 84;
  const isSevere = score >= 70;

  // Formatting chronemics
  const userInitPct = chron?.user_initiation_pct ?? 81;
  const contactInitPct = chron?.contact_initiation_pct ?? 19;
  const userDelay = chron?.user_median_delay_m ? `${chron.user_median_delay_m}m` : '3m';
  const contactDelay = chron?.contact_median_delay_m ? `${chron.contact_median_delay_m}m` : '4h 48m';
  const doubleTexts = chron?.user_double_texts ?? 24;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.desktopCanvas}>
        {/* Apple Persistent App Header */}
        <AppHeader
          title="Radar"
          subtitle="Relationship Forensics"
          activePartner={contactName}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.accentGold}
            />
          }
        >
          {/* ============================================================ */}
          {/* THEATRICAL UNBOXING HERO LAUNCHER */}
          {/* ============================================================ */}
          <AppleElevatedCard
            interactive
            floating
            accentVariant="rose"
            onPress={() => router.push('/unboxing-preview')}
            style={styles.unboxingBanner}
          >
            <View style={styles.unboxingBannerContent}>
              <View style={styles.unboxingBadgeRow}>
                <View style={styles.unboxingBadge}>
                  <Sparkles size={11} color={Colors.accentRose} style={{ marginRight: 4 }} />
                  <Text style={styles.unboxingBadgeText}>THEATRICAL EXPERIENCE</Text>
                </View>
              </View>

              <Text style={styles.unboxingTitle}>Cinematic 5-Beat Unboxing</Text>
              <Text style={styles.unboxingSubtitle}>
                Paced reveals • Spring-loaded gauge • 9:16 Viral Story Receipt
              </Text>
            </View>
            <View style={styles.chevronCircle}>
              <ChevronRight size={18} color={Colors.textPrimary} />
            </View>
          </AppleElevatedCard>

          {/* ============================================================ */}
          {/* HERO DELULU COMMAND CENTER */}
          {/* ============================================================ */}
          <AppleElevatedCard floating style={styles.heroGaugeCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.statusPill}>
                <View style={styles.pulseDot} />
                <Text style={styles.statusPillText}>Live Chronemics Radar</Text>
              </View>
              <Text style={styles.serialText}>
                ID: AF-{activeContact?.id?.slice(0, 4) || '8492'}
              </Text>
            </View>

            {/* Centered Light Delulu Gauge */}
            <View style={styles.gaugeContainer}>
              <LightDeluluGauge
                score={score}
                size={230}
                strokeWidth={14}
                classification={isSevere ? 'Textbook Clownery' : 'Reciprocal Chemistry'}
              />
            </View>

            {/* Verdict Diagnosis Blockquote */}
            <View style={styles.verdictContainer}>
              <View style={styles.archetypeBadge}>
                <Sparkles size={12} color={Colors.accentGold} style={{ marginRight: 5 }} />
                <Text style={styles.archetypeText}>
                  {profile?.status_label || 'The Olympic Paragraph Writer'}
                </Text>
              </View>

              <Text style={styles.verdictQuote}>
                "{profile?.overall_diagnosis ||
                  'You are romanticizing radio silence and investing emotional capital into an avoidant void.'}"
              </Text>
            </View>

            {/* Power Balance Bar */}
            <View style={styles.powerSection}>
              <View style={styles.powerLabelRow}>
                <Text style={styles.powerTitle}>Power Balance</Text>
                <Text style={styles.powerStatus}>
                  {userInitPct < 50 ? `${contactName} Controls Frame` : 'You Control Frame'}
                </Text>
              </View>

              <View style={styles.powerTrack}>
                <View
                  style={[
                    styles.powerFill,
                    { width: `${Math.min(Math.max(userInitPct, 15), 85)}%` },
                  ]}
                />
              </View>

              <View style={styles.powerStatsRow}>
                <Text style={styles.powerStatText}>You: {userInitPct}%</Text>
                <Text style={styles.powerStatText}>{contactName}: {contactInitPct}%</Text>
              </View>
            </View>
          </AppleElevatedCard>

          {/* ============================================================ */}
          {/* FORENSIC CHRONEMICS GRID */}
          {/* ============================================================ */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Forensic Chronemics</Text>
            <View style={styles.mathBadge}>
              <Text style={styles.mathBadgeText}>MATHEMATICAL METRICS</Text>
            </View>
          </View>

          <View style={styles.metricGrid}>
            {/* Metric 1: Initiation */}
            <AppleElevatedCard style={styles.metricCard}>
              <Text style={styles.metricCardLabel}>INITIATION SPLIT</Text>
              <Text style={styles.metricCardValue}>{userInitPct}% / {contactInitPct}%</Text>
              <Text style={styles.metricCardSub}>You vs {contactName}</Text>
            </AppleElevatedCard>

            {/* Metric 2: Delay */}
            <AppleElevatedCard style={styles.metricCard}>
              <Text style={styles.metricCardLabel}>THEIR MEDIAN LAG</Text>
              <Text style={styles.metricCardValue}>{contactDelay}</Text>
              <Text style={styles.metricCardSub}>Response Latency</Text>
            </AppleElevatedCard>

            {/* Metric 3: Night Owl Texts */}
            <AppleElevatedCard style={styles.metricCard}>
              <Text style={styles.metricCardLabel}>NIGHT OWL TEXTS</Text>
              <Text style={styles.metricCardValue}>{doubleTexts}</Text>
              <Text style={styles.metricCardSub}>3:00 AM Double Texts</Text>
            </AppleElevatedCard>

            {/* Metric 4: Ghosting Threat */}
            <AppleElevatedCard style={styles.metricCard}>
              <Text style={styles.metricCardLabel}>GHOSTING RISK</Text>
              <Text
                style={[
                  styles.metricCardValue,
                  { color: isSevere ? Colors.accentDanger : Colors.accentSuccess },
                ]}
              >
                {isSevere ? 'Severe' : 'Low'}
              </Text>
              <Text style={styles.metricCardSub}>Predictive Risk</Text>
            </AppleElevatedCard>
          </View>

          {/* ============================================================ */}
          {/* QUICK SHORTCUTS ROW */}
          {/* ============================================================ */}
          <View style={styles.shortcutsRow}>
            <AppleElevatedCard
              interactive
              onPress={() => router.push('/acts-modal')}
              style={styles.shortcutCard}
            >
              <Layers size={20} color={Colors.textPrimary} style={{ marginBottom: 8 }} />
              <Text style={styles.shortcutTitle}>17 Theatrical Acts</Text>
              <Text style={styles.shortcutSub}>Psychological Forensics</Text>
            </AppleElevatedCard>

            <AppleElevatedCard
              interactive
              onPress={() => router.push('/coach')}
              style={styles.shortcutCard}
            >
              <MessageCircle size={20} color={Colors.accentGold} style={{ marginBottom: 8 }} />
              <Text style={styles.shortcutTitle}>Doctor Delulu</Text>
              <Text style={styles.shortcutSub}>Tactical Reply Triad</Text>
            </AppleElevatedCard>
          </View>

          {/* ============================================================ */}
          {/* TRANSCRIPT DROPZONE */}
          {/* ============================================================ */}
          <View style={styles.dropzoneSection}>
            <Text style={styles.sectionTitle}>Update Transcript</Text>
            <WhatsAppDropzone
              vibeMode={vibeMode}
              onVibeModeChange={setVibeMode}
              onFileSelect={handleFileDrop}
              isAnalyzing={isAnalyzing}
            />
          </View>
        </ScrollView>
      </View>

      {/* ============================================================ */}
      {/* CONTACT PICKER MODAL */}
      {/* ============================================================ */}
      <Modal
        visible={showContactPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowContactPicker(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowContactPicker(false)}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Audited Contact</Text>
              <TouchableOpacity
                onPress={() => setShowContactPicker(false)}
                style={styles.modalCloseBtn}
              >
                <X size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 320 }}>
              {contacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  activeOpacity={0.8}
                  onPress={() => handleSelectContact(contact)}
                  style={[
                    styles.contactItem,
                    activeContact?.id === contact.id && styles.contactItemActive,
                  ]}
                >
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactAvatarText}>
                      {contact.display_name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contactItemName}>{contact.display_name}</Text>
                    <Text style={styles.contactItemSub}>
                      {contact.created_at
                        ? `Audited since ${contact.created_at.slice(0, 10)}`
                        : 'Verified Chat Log'}
                    </Text>
                  </View>
                  {activeContact?.id === contact.id ? (
                    <Check size={18} color={Colors.accentGold} />
                  ) : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  desktopCanvas: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: Colors.background,
    ...Platform.select({
      web: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: Colors.borderHairline,
        minHeight: '100vh',
      } as any,
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenGutter,
    paddingTop: 16,
    paddingBottom: 110,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 16,
    letterSpacing: -0.3,
  },
  loadingSub: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 4,
    textAlign: 'center',
  },
  unboxingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 24,
  },
  unboxingBannerContent: {
    flex: 1,
    paddingRight: 12,
  },
  unboxingBadgeRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  unboxingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentRoseSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  unboxingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.accentRose,
  },
  unboxingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  unboxingSubtitle: {
    fontSize: 12,
    color: Colors.textTertiary,
    lineHeight: 16,
  },
  chevronCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGaugeCard: {
    padding: 22,
    marginBottom: 32,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackground,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.systemGreen,
    marginRight: 6,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  serialText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textTertiary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  verdictContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  archetypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentGoldSoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    marginBottom: 10,
  },
  archetypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accentGold,
  },
  verdictQuote: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  powerSection: {
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderHairline,
  },
  powerLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  powerTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  powerStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  powerTrack: {
    height: 6,
    backgroundColor: Colors.secondaryBackground,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  powerFill: {
    height: '100%',
    backgroundColor: Colors.textPrimary,
    borderRadius: 3,
  },
  powerStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  powerStatText: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: Colors.textPrimary,
  },
  mathBadge: {
    backgroundColor: Colors.secondaryBackground,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  mathBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.textTertiary,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  metricCard: {
    flex: 1,
    minWidth: '46%',
    padding: 16,
    alignItems: 'center',
  },
  metricCardLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.textTertiary,
    marginBottom: 6,
  },
  metricCardValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  metricCardSub: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  shortcutCard: {
    flex: 1,
    padding: 18,
    alignItems: 'flex-start',
  },
  shortcutTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  shortcutSub: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  dropzoneSection: {
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderHairline,
  },
  contactItemActive: {
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.md,
    paddingHorizontal: 8,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  contactItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  contactItemSub: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});
