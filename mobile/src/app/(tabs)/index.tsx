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
} from 'lucide-react-native';

import { Colors, Typography } from '../../constants/theme';
import { DeluluMeter } from '../../components/DeluluMeter';
import { PowerSlider } from '../../components/PowerSlider';
import {
  getContacts,
  getReportDossier,
  Contact,
  ReportDossierResponse,
} from '../../services/api';

export default function ProfilerScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [dossier, setDossier] = useState<ReportDossierResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const contactList = await getContacts();
      setContacts(contactList);

      if (contactList.length > 0) {
        const primary = contactList[0];
        setActiveContact(primary);
        const report = await getReportDossier(primary.id);
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
    loadData();
  };

  const handleLaunchActs = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (activeContact) {
      router.push({
        pathname: '/acts-modal',
        params: { contactId: activeContact.id, contactName: activeContact.display_name },
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.accentYellow} />
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accentYellow}
          />
        }>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}>
              <Text style={styles.brandTitle}>ASSIFY</Text>
              <View style={styles.brandDot} />
            </View>
            <Text style={styles.brandSubtitle}>Relationship Intelligence</Text>
          </View>

          {/* Contact Selector Pill */}
          <View style={styles.contactPill}>
            <View style={styles.onlineDot} />
            <Text style={styles.contactPillText} numberOfLines={1}>
              {contactName}
            </Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Backend Connection Notice</Text>
            <Text style={styles.errorBody}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadData}>
              <Text style={styles.retryText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {profile ? (
          <>
            {/* HERO CARD: Master Delulu & Power Dashboard */}
            <View style={styles.heroCard}>
              <View style={styles.statusBadge}>
                <Flame size={12} color={Colors.accentRose} />
                <Text style={styles.statusBadgeText}>ACTIVE RADAR</Text>
              </View>

              <Text style={styles.statusLabel}>{profile.status_label}</Text>

              {/* The Circular Delulu Meter */}
              <View style={styles.meterWrapper}>
                <DeluluMeter
                  score={profile.delulu_score}
                  size={190}
                  strokeWidth={14}
                  label="DELULU SCORE"
                  circusLevel="Romantic Clownery"
                />
              </View>

              {/* Bidirectional Power Balance */}
              <PowerSlider
                userRatio={profile.power_ratio_user}
                contactRatio={profile.power_ratio_contact}
                contactName={contactName}
              />

              {/* Archetypes */}
              <View style={styles.archetypeGrid}>
                <View style={styles.archetypeBox}>
                  <Text style={styles.archetypeRole}>YOU</Text>
                  <Text style={styles.archetypeName}>The Flirtatious Sparring Partner</Text>
                </View>
                <View style={[styles.archetypeBox, styles.archetypeBoxRose]}>
                  <Text style={[styles.archetypeRole, { color: Colors.accentRose }]}>
                    {contactName.toUpperCase()}
                  </Text>
                  <Text style={styles.archetypeName}>The Chaotic Firehose</Text>
                </View>
              </View>

              {/* Executive Diagnosis */}
              <View style={styles.diagnosisBox}>
                <Text style={styles.diagnosisQuote}>"{profile.overall_diagnosis}"</Text>
              </View>

              {/* PRIMARY ACTION BUTTON */}
              <TouchableOpacity
                style={styles.launchButton}
                activeOpacity={0.88}
                onPress={handleLaunchActs}>
                <View style={styles.launchContent}>
                  <Sparkles size={18} color="#08090E" />
                  <Text style={styles.launchButtonText}>
                    Launch Theatrical Dossier (17 Acts)
                  </Text>
                  <ChevronRight size={18} color="#08090E" />
                </View>
              </TouchableOpacity>
            </View>

            {/* QUICK STATS 2x2 GRID */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIconRow}>
                  <Heart size={16} color={Colors.accentRose} />
                  <Text style={styles.statLabel}>CHEMISTRY</Text>
                </View>
                <Text style={[styles.statValue, { color: Colors.accentRose }]}>
                  {profile.chemistry_score}/100
                </Text>
                <Text style={styles.statSub}>Playful romantic tension</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconRow}>
                  <ShieldCheck size={16} color={Colors.accentGreen} />
                  <Text style={styles.statLabel}>SURVIVAL ODDS</Text>
                </View>
                <Text style={[styles.statValue, { color: Colors.accentGreen }]}>
                  {profile.survival_probability}%
                </Text>
                <Text style={styles.statSub}>6-month endurance</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconRow}>
                  <Zap size={16} color={Colors.accentYellow} />
                  <Text style={styles.statLabel}>REPLY SPEED</Text>
                </View>
                <Text style={[styles.statValue, { color: Colors.accentYellow }]}>
                  {chron?.contact_median_delay_m || 0.5}m
                </Text>
                <Text style={styles.statSub}>Sub-minute rapid fire</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconRow}>
                  <TrendingUp size={16} color={Colors.accentCyan} />
                  <Text style={styles.statLabel}>DOUBLE TEXTS</Text>
                </View>
                <Text style={[styles.statValue, { color: Colors.accentCyan }]}>
                  {chron?.contact_double_texts?.toLocaleString() || '6,481'}
                </Text>
                <Text style={styles.statSub}>Contact flood rate</Text>
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 10,
    paddingBottom: 40,
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
    color: Colors.textSecondary,
    marginTop: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accentYellow,
    marginLeft: 4,
    marginTop: 4,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textTertiary,
    letterSpacing: 0.2,
  },
  contactPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    maxWidth: 160,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.accentGreen,
    marginRight: 6,
  },
  contactPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: 18,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.badgeDangerBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accentRose,
    marginLeft: 4,
    letterSpacing: 0.8,
  },
  statusLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 16,
    lineHeight: 26,
  },
  meterWrapper: {
    marginVertical: 10,
    alignItems: 'center',
  },
  archetypeGrid: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  archetypeBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 214, 10, 0.06)',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.18)',
  },
  archetypeBoxRose: {
    backgroundColor: 'rgba(255, 55, 95, 0.06)',
    borderColor: 'rgba(255, 55, 95, 0.18)',
  },
  archetypeRole: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.accentYellow,
    marginBottom: 4,
  },
  archetypeName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 17,
  },
  diagnosisBox: {
    backgroundColor: Colors.surfaceElevated,
    padding: 14,
    borderRadius: 14,
    marginVertical: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentYellow,
  },
  diagnosisQuote: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 19,
  },
  launchButton: {
    backgroundColor: Colors.accentYellow,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginTop: 6,
    alignItems: 'center',
  },
  launchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  launchButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#08090E',
    marginHorizontal: 8,
    letterSpacing: -0.1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textTertiary,
    marginLeft: 6,
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  statSub: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  errorCard: {
    backgroundColor: 'rgba(255, 55, 95, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.accentRose,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accentRose,
    marginBottom: 4,
  },
  errorBody: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: Colors.accentRose,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
