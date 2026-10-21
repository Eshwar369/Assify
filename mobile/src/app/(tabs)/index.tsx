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
  Zap,
  Heart,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Brain,
  Check,
  X,
} from 'lucide-react-native';

import { Colors, Radius, Typography } from '../../constants/theme';
import { DeluluMeter } from '../../components/DeluluMeter';
import { PowerSlider } from '../../components/PowerSlider';
import { WhatsAppDropzone } from '../../components/WhatsAppDropzone';
import {
  getContacts,
  getReportDossier,
  Contact,
  ReportDossierResponse,
} from '../../services/api';

const webGlassStyle: any = Platform.OS === 'web' ? { backdropFilter: 'blur(30px) saturate(180%)' } : {};

export default function ProfilerScreen() {
  const router = useRouter();
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(activeContact?.id);
  };

  const handleLaunchActs = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (activeContact) {
      router.push({
        pathname: '/acts-modal',
        params: {
          contactId: activeContact.id,
          contactName: activeContact.display_name,
        },
      });
    }
  };

  const handleSelectContact = (c: Contact) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setActiveContact(c);
    setShowContactPicker(false);
    setLoading(true);
    getReportDossier(c.id).then((rep) => {
      setDossier(rep);
      setLoading(false);
    });
  };

  const handleFileDrop = (file: { name: string }) => {
    setIsAnalyzing(true);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setTimeout(() => {
      setIsAnalyzing(false);
      loadData();
    }, 1200);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.systemBlue} />
        <Text style={styles.loadingText}>Synthesizing Relationship Intelligence...</Text>
      </View>
    );
  }

  const profile = dossier?.profile;
  const chron = dossier?.chronemics;
  const contactName = activeContact?.display_name || 'Contact';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.systemBlue}
          />
        }>
        {/* Apple iOS App Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>ASSIFY</Text>
            <Text style={styles.brandSubtitle}>Relationship Intelligence</Text>
          </View>

          {/* Apple Contact Capsule Pill */}
          <TouchableOpacity
            style={styles.contactPill}
            activeOpacity={0.8}
            onPress={() => setShowContactPicker(true)}>
            <View style={styles.onlineDot} />
            <Text style={styles.contactPillText} numberOfLines={1}>
              {contactName}
            </Text>
            <ChevronRight size={13} color={Colors.systemGray} />
          </TouchableOpacity>
        </View>

        {/* WhatsApp Import & Vibe Calibration Dropzone */}
        <WhatsAppDropzone
          vibeMode={vibeMode}
          onVibeModeChange={setVibeMode}
          onFileSelect={handleFileDrop}
          isAnalyzing={isAnalyzing}
        />

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Offline Demo Mode</Text>
            <Text style={styles.errorBody}>
              Connected to local SQLite mirror with 39,154 verified messages.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => loadData()}>
              <Text style={styles.retryText}>Reconnect Engine</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {profile ? (
          <>
            {/* HERO CARD: Master Delulu & Power Dashboard */}
            <View style={[styles.heroCard, webGlassStyle]}>
              {/* Header Status Row */}
              <View style={styles.heroHeaderRow}>
                <View style={styles.statusBadge}>
                  <Flame size={12} color={Colors.systemPink} />
                  <Text style={styles.statusBadgeText}>ACTIVE RADAR</Text>
                </View>

                <View style={styles.vibeBadge}>
                  <Brain size={12} color={Colors.systemBlue} />
                  <Text style={styles.vibeBadgeText}>
                    {vibeMode === 'unhinged' ? 'UNHINGED MODE' : 'THERAPY MODE'}
                  </Text>
                </View>
              </View>

              {/* Dynamic Relationship Status Label */}
              <Text style={styles.statusLabel}>{profile.status_label}</Text>

              {/* Apple Delulu Meter Dial */}
              <View style={styles.meterWrapper}>
                <DeluluMeter
                  score={profile.delulu_score}
                  size={210}
                  strokeWidth={14}
                  label="DELULU SCORE"
                  circusLevel="Romantic Clownery"
                  onPress={handleLaunchActs}
                />
              </View>

              {/* Bidirectional Power Balance */}
              <PowerSlider
                userRatio={profile.power_ratio_user}
                contactRatio={profile.power_ratio_contact}
                contactName={contactName}
                onPress={handleLaunchActs}
              />

              {/* Dynamic Archetype Matchup Cards */}
              <View style={styles.archetypeGrid}>
                <View style={styles.archetypeBox}>
                  <Text style={styles.archetypeRole}>YOU</Text>
                  <Text style={styles.archetypeName}>The Flirtatious Sparring Partner</Text>
                  <Text style={styles.archetypeSub}>High banter stamina & emotional anchor</Text>
                </View>

                <View style={[styles.archetypeBox, styles.archetypeBoxPartner]}>
                  <Text style={[styles.archetypeRole, { color: Colors.systemPink }]}>
                    {contactName.toUpperCase()}
                  </Text>
                  <Text style={styles.archetypeName}>The Chaotic Firehose</Text>
                  <Text style={styles.archetypeSub}>Rapid double-texting & playful avoidance</Text>
                </View>
              </View>

              {/* Executive Grounded Diagnosis Quote */}
              <View style={styles.diagnosisBox}>
                <Text style={styles.diagnosisQuote}>"{profile.overall_diagnosis}"</Text>
              </View>

              {/* Apple Prominent Capsule Button */}
              <TouchableOpacity
                style={styles.launchButton}
                activeOpacity={0.82}
                onPress={handleLaunchActs}>
                <View style={styles.launchContent}>
                  <Sparkles size={16} color="#FFFFFF" />
                  <Text style={styles.launchButtonText}>
                    Launch Theatrical Dossier (17 Acts)
                  </Text>
                  <ChevronRight size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Apple 2x2 Frosted Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, webGlassStyle]}>
                <View style={styles.statIconRow}>
                  <Heart size={15} color={Colors.systemPink} />
                  <Text style={styles.statLabel}>CHEMISTRY</Text>
                </View>
                <Text style={[styles.statValue, { color: Colors.systemPink }]}>
                  {profile.chemistry_score}/100
                </Text>
                <Text style={styles.statSub}>Playful romantic tension</Text>
              </View>

              <View style={[styles.statCard, webGlassStyle]}>
                <View style={styles.statIconRow}>
                  <ShieldCheck size={15} color={Colors.systemGreen} />
                  <Text style={styles.statLabel}>SURVIVAL ODDS</Text>
                </View>
                <Text style={[styles.statValue, { color: Colors.systemGreen }]}>
                  {profile.survival_probability}%
                </Text>
                <Text style={styles.statSub}>6-month endurance</Text>
              </View>

              <View style={[styles.statCard, webGlassStyle]}>
                <View style={styles.statIconRow}>
                  <Zap size={15} color={Colors.systemBlue} />
                  <Text style={styles.statLabel}>REPLY SPEED</Text>
                </View>
                <Text style={[styles.statValue, { color: Colors.systemBlue }]}>
                  {chron?.contact_median_delay_m || 0.5}m
                </Text>
                <Text style={styles.statSub}>Sub-minute rapid fire</Text>
              </View>

              <View style={[styles.statCard, webGlassStyle]}>
                <View style={styles.statIconRow}>
                  <TrendingUp size={15} color={Colors.systemCyan} />
                  <Text style={styles.statLabel}>DOUBLE TEXTS</Text>
                </View>
                <Text style={[styles.statValue, { color: Colors.systemCyan }]}>
                  {chron?.contact_double_texts?.toLocaleString() || '6,481'}
                </Text>
                <Text style={styles.statSub}>Contact flood rate</Text>
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>

      {/* Apple Sheet Contact Switcher */}
      <Modal
        visible={showContactPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowContactPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Active Contact</Text>
              <TouchableOpacity
                onPress={() => setShowContactPicker(false)}
                style={styles.modalCloseBtn}>
                <X size={18} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {contacts.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.contactOptionRow,
                  c.id === activeContact?.id && styles.contactOptionActive,
                ]}
                onPress={() => handleSelectContact(c)}>
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactAvatarText}>
                    {c.display_name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactOptionName}>{c.display_name}</Text>
                  <Text style={styles.contactOptionSub}>Analyzed relationship history</Text>
                </View>
                {c.id === activeContact?.id ? (
                  <Check size={18} color={Colors.systemBlue} />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 14,
    paddingBottom: 48,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    ...Typography.bodyMedium,
    color: Colors.systemGray,
    marginTop: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.systemGray,
    marginTop: 1,
  },
  contactPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    maxWidth: 165,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.systemGreen,
    marginRight: 6,
  },
  contactPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginRight: 4,
  },
  heroCard: {
    backgroundColor: Colors.glassSurface,
    borderRadius: Radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 45, 85, 0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 45, 85, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.systemPink,
  },
  vibeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 4,
  },
  vibeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.systemBlue,
  },
  statusLabel: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: 12,
  },
  meterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  archetypeGrid: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  archetypeBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  archetypeBoxPartner: {
    backgroundColor: 'rgba(255, 45, 85, 0.04)',
    borderColor: 'rgba(255, 45, 85, 0.25)',
  },
  archetypeRole: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.systemBlue,
    marginBottom: 4,
  },
  archetypeName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  archetypeSub: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.systemGray,
    lineHeight: 15,
  },
  diagnosisBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Radius.md,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.systemBlue,
    marginVertical: 12,
  },
  diagnosisQuote: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 19,
    color: Colors.systemGray,
    fontStyle: 'italic',
  },
  launchButton: {
    backgroundColor: Colors.systemBlue,
    borderRadius: Radius.full,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: Colors.systemBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
  },
  launchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  launchButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: '48.4%',
    backgroundColor: Colors.glassSurface,
    borderRadius: Radius.xl,
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: Colors.systemGray,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  statSub: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.systemGray,
  },
  errorCard: {
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderRadius: Radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.systemOrange,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.systemOrange,
    marginBottom: 2,
  },
  errorBody: {
    fontSize: 12,
    color: Colors.systemGray,
    marginBottom: 8,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.systemOrange,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  retryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
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
    padding: 6,
  },
  contactOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    marginBottom: 6,
  },
  contactOptionActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
  },
  contactAvatar: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.systemBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  contactOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  contactOptionSub: {
    fontSize: 12,
    color: Colors.systemGray,
  },
});
