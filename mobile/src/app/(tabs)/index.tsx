import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Flame,
  Sparkles,
  ChevronRight,
  Layers,
  MessageCircle,
} from 'lucide-react-native';

import { Colors, Radius } from '@/constants/theme';
import {
  ScreenContainer,
  AppHeader,
  SegmentedControl,
  StatStrip,
  ReceiptQuote,
  EditorialSection,
  LightDeluluGauge,
  AppleElevatedCard,
} from '@/components/ui';
import { WhatsAppDropzone, PickedFileInfo } from '@/components/WhatsAppDropzone';
import {
  getContacts,
  getReportDossier,
  uploadChatArchive,
  pollTaskStatus,
  Contact,
  ReportDossierResponse,
} from '@/services/api';
import { AlertCircle } from 'lucide-react-native';

const VIBE_OPTIONS = [
  { key: 'unhinged', label: 'Unhinged Roast', icon: Flame },
  { key: 'therapy', label: 'Clinical Therapy', icon: Sparkles },
];

export default function RadarScreen() {
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
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('Preparing upload...');
  const [analysisError, setAnalysisError] = useState<string | null>(null);

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

  const handleFileDrop = async (file: PickedFileInfo) => {
    try {
      setIsAnalyzing(true);
      setAnalysisProgress(5);
      setAnalysisStep('Uploading chat archive to ASSIFY backend...');
      setAnalysisError(null);

      const uploadRes = await uploadChatArchive(file.uri, file.name, vibeMode);
      const taskId = uploadRes.task_id;
      setAnalysisStep(uploadRes.current_step || 'Analysis queued...');

      const pollInterval = 1000;
      const maxPollTime = 180000; // 3 minutes maximum
      const startTime = Date.now();

      const timerId = setInterval(async () => {
        try {
          if (Date.now() - startTime > maxPollTime) {
            clearInterval(timerId);
            setIsAnalyzing(false);
            setAnalysisError('Analysis timed out. Please check backend server.');
            return;
          }

          const statusData = await pollTaskStatus(taskId);
          setAnalysisProgress(statusData.progress);
          setAnalysisStep(statusData.current_step);

          if (statusData.status === 'completed') {
            clearInterval(timerId);
            setIsAnalyzing(false);
            setAnalysisProgress(100);
            setAnalysisStep('Analysis completed!');

            if (Platform.OS !== 'web') {
              try {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              } catch {}
            }

            const newContactId = statusData.result?.contact_id;
            await loadData(newContactId);
          } else if (statusData.status === 'failed') {
            clearInterval(timerId);
            setIsAnalyzing(false);
            setAnalysisError(statusData.error || 'Ingestion failed on backend');

            if (Platform.OS !== 'web') {
              try {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              } catch {}
            }
          }
        } catch (pollErr: any) {
          console.warn('Status poll warning:', pollErr);
        }
      }, pollInterval);
    } catch (err: any) {
      setIsAnalyzing(false);
      setAnalysisError(err?.message || 'Failed to upload chat file');
      if (Platform.OS !== 'web') {
        try {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } catch {}
      }
    }
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
  const rawDelay = chron?.contact_median_delay_m;
  const contactDelay =
    rawDelay !== undefined
      ? rawDelay < 1
        ? '< 1m'
        : `${Math.round(rawDelay)}m`
      : '4h 48m';
  const doubleTexts = chron?.user_double_texts ?? 24;

  const chronemicsMetrics = [
    {
      label: 'INITIATION',
      value: `${userInitPct}% / ${contactInitPct}%`,
      sub: `You vs ${contactName}`,
    },
    {
      label: 'MEDIAN LAG',
      value: contactDelay,
      sub: 'Response Delay',
    },
    {
      label: '3 AM TEXTS',
      value: doubleTexts,
      sub: 'Double-Texts',
    },
    {
      label: 'GHOST RISK',
      value: isSevere ? 'Severe' : 'Low',
      sub: 'Predictive',
      accent: (isSevere ? 'rose' : 'success') as any,
    },
  ];

  return (
    <ScreenContainer
      header={
        <AppHeader
          title="Radar"
          subtitle="Relationship Forensics"
          activePartner={contactName}
        />
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.accentGold}
        />
      }
    >
      {/* 1. Unified Segmented Control (Vibe Mode) */}
      <SegmentedControl
        options={VIBE_OPTIONS}
        value={vibeMode}
        onChange={(val) => setVibeMode(val as any)}
      />

      {/* 2. Theatrical Unboxing Hero Launcher */}
      <AppleElevatedCard
        interactive
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
          <Text style={styles.unboxingTitle}>Cinematic 5-Beat Reveal</Text>
          <Text style={styles.unboxingSubtitle}>
            Paced reveals • Spring-loaded gauge • 9:16 Viral Story Receipt
          </Text>
        </View>
        <View style={styles.chevronCircle}>
          <ChevronRight size={18} color={Colors.textPrimary} />
        </View>
      </AppleElevatedCard>

      {/* 3. Centerpiece Hero Delulu Gauge */}
      <View style={styles.gaugeSection}>
        <View style={styles.diagnosticRow}>
          <View style={styles.statusPill}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusPillText}>Live Chronemics Radar</Text>
          </View>
          <Text style={styles.serialText}>
            ID: AF-{activeContact?.id ? activeContact.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() : '8492'}
          </Text>
        </View>

        <LightDeluluGauge
          score={score}
          size={230}
          strokeWidth={14}
          classification={isSevere ? 'Textbook Clownery' : 'Reciprocal Chemistry'}
        />

        {/* Archetype Badge */}
        <View style={styles.archetypeBadge}>
          <Sparkles size={12} color={Colors.accentGold} style={{ marginRight: 5 }} />
          <Text style={styles.archetypeText}>
            {profile?.status_label || 'The Olympic Paragraph Writer'}
          </Text>
        </View>
      </View>

      {/* 4. Unified Borderless StatStrip (Same DNA as Fever Chart) */}
      <StatStrip metrics={chronemicsMetrics} style={{ marginBottom: 24 }} />

      {/* 5. Executive Diagnosis using Unified ReceiptQuote */}
      <EditorialSection title="Forensic Verdict">
        <ReceiptQuote
          quote={
            profile?.overall_diagnosis ||
            'You are romanticizing radio silence and investing emotional capital into an avoidant void.'
          }
          label="DOCTOR DELULU DIAGNOSIS"
          accentVariant={isSevere ? 'rose' : 'gold'}
        />
      </EditorialSection>

      {/* 6. Quick Intelligence Shortcuts */}
      <EditorialSection title="Deep-Dive Intelligence">
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
      </EditorialSection>

      {/* 7. Transcript Dropzone */}
      <EditorialSection title="Update Transcript">
        <WhatsAppDropzone
          vibeMode={vibeMode}
          onVibeModeChange={setVibeMode}
          onFileSelect={handleFileDrop}
          isAnalyzing={isAnalyzing}
          progress={analysisProgress}
          currentStep={analysisStep}
        />

        {analysisError && (
          <View style={styles.errorBanner}>
            <AlertCircle size={16} color={Colors.accentRose} style={{ marginRight: 8 }} />
            <Text style={styles.errorText}>{analysisError}</Text>
          </View>
        )}
      </EditorialSection>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
    padding: 18,
    marginBottom: 20,
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
    fontSize: 16,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeSection: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  diagnosticRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
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
  archetypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentGoldSoft,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(191, 155, 40, 0.20)',
    marginTop: 12,
    maxWidth: '92%',
  },
  archetypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A6E10',
    textAlign: 'center',
    flexShrink: 1,
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  shortcutCard: {
    flex: 1,
    padding: 16,
    alignItems: 'flex-start',
  },
  shortcutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  shortcutSub: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentRoseSoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.md,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(235, 87, 87, 0.25)',
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accentRose,
    lineHeight: 16,
  },
});
