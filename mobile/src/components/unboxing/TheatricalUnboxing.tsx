import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  SafeAreaView,
  Modal,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Share2,
  Clock,
  RotateCcw,
  Zap,
  Quote,
  ChevronRight,
  X,
} from 'lucide-react-native';

import { Colors, Radius, Typography } from '../../constants/theme';
import { AppleGlassCard } from './AppleGlassCard';
import { SpringDeluluGauge } from './SpringDeluluGauge';
import { ViralReceiptCard, ViralReceiptData } from './ViralReceiptCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface UnboxingPayload {
  contactName: string;
  deluluScore: number;
  circusLevel: string;
  archetype: string;
  verdictSummary: string;
  theTurningPoint: {
    date: string;
    description: string;
    pivotQuote: string;
    gapShift: string;
  };
  greatestHits: Array<{
    quote: string;
    sender: 'user' | 'contact';
    timestamp?: string;
    annotation: string;
  }>;
  stats: {
    initiationUser: number;
    initiationContact: number;
    delayUser: string;
    delayContact: string;
  };
}

interface TheatricalUnboxingProps {
  payload: UnboxingPayload;
  onFinish?: () => void;
  onViewFullDossier?: () => void;
}

type UnboxingPhase = 'SCANNING' | 'VERDICT' | 'TURNING_POINT' | 'RECEIPTS' | 'STORY_CARD';

export const TheatricalUnboxing: React.FC<TheatricalUnboxingProps> = ({
  payload,
  onFinish,
  onViewFullDossier,
}) => {
  const [phase, setPhase] = useState<UnboxingPhase>('SCANNING');
  const [scanStep, setScanStep] = useState(0);
  const [storyModalVisible, setStoryModalVisible] = useState(false);

  const scanMilestones = [
    'Parsing WhatsApp conversation threads...',
    'Chronemics engine: measuring median response lag (Δt)...',
    'Auditing 2:00 AM double-texts and ghosting intervals...',
    'Synthesizing psychological profile & theatrical verdict...',
  ];

  // Phase 0: Scanning Simulation & Anticipation Pacing
  useEffect(() => {
    if (phase === 'SCANNING') {
      const interval = setInterval(() => {
        setScanStep((prev) => {
          if (Platform.OS !== 'web') {
            Haptics.selectionAsync();
          }
          if (prev >= scanMilestones.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
              setPhase('VERDICT');
            }, 600);
            return prev;
          }
          return prev + 1;
        });
      }, 750);

      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleNextPhase = (next: UnboxingPhase) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setPhase(next);
  };

  const receiptData: ViralReceiptData = {
    contactName: payload.contactName,
    deluluScore: payload.deluluScore,
    circusLevel: payload.circusLevel,
    archetype: payload.archetype,
    verdictSummary: payload.verdictSummary,
    initiationRatio: {
      user: payload.stats.initiationUser,
      contact: payload.stats.initiationContact,
    },
    medianResponseTime: {
      user: payload.stats.delayUser,
      contact: payload.stats.delayContact,
    },
    killingQuote: {
      quote: payload.greatestHits[0]?.quote || payload.theTurningPoint.pivotQuote,
      gapDuration: payload.theTurningPoint.gapShift,
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Floating Control Bar */}
        <View style={styles.topBar}>
          <View style={styles.caseIndicator}>
            <View style={styles.livePulseDot} />
            <Text style={styles.caseIndicatorText}>
              AUDIT // {payload.contactName.toUpperCase()}
            </Text>
          </View>

          {onViewFullDossier ? (
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.selectionAsync();
                onViewFullDossier();
              }}
              style={styles.skipBtn}
              accessibilityRole="button"
              accessibilityLabel="Skip unboxing and view full dossier"
            >
              <Text style={styles.skipBtnText}>Full Dossier</Text>
              <ChevronRight size={14} color={Colors.textTertiary} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ============================================================ */}
        {/* PHASE 0: FORENSIC SCANNING PULSE */}
        {/* ============================================================ */}
        {phase === 'SCANNING' && (
          <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(250)}
            style={styles.centerStage}
          >
            <SpringDeluluGauge score={payload.deluluScore} isAnalyzing={true} size={220} />

            <View style={styles.scanningTextBlock}>
              <Text style={styles.scanningStatusHeader}>CHRONEMICS TELEMETRY SCAN</Text>
              <Text style={styles.scanningStatusBody}>
                {scanMilestones[scanStep]}
              </Text>

              {/* Step Dots */}
              <View style={styles.stepDotsRow}>
                {scanMilestones.map((_, idx) => (
                  <View
                    key={`dot-${idx}`}
                    style={[
                      styles.stepDot,
                      idx <= scanStep && styles.stepDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        {/* ============================================================ */}
        {/* PHASE 1: THE VERDICT SLAM */}
        {/* ============================================================ */}
        {phase === 'VERDICT' && (
          <Animated.View
            entering={FadeInDown.duration(450)}
            exiting={SlideOutLeft.duration(250)}
            style={styles.centerStage}
          >
            <SpringDeluluGauge
              score={payload.deluluScore}
              isAnalyzing={false}
              circusLevel={payload.circusLevel}
              size={230}
            />

            {/* Verdict Card */}
            <AppleGlassCard
              variant={payload.deluluScore >= 70 ? 'danger' : 'spotlight'}
              style={styles.verdictCard}
            >
              <View style={styles.archetypeRow}>
                <Sparkles
                  size={14}
                  color={payload.deluluScore >= 70 ? Colors.systemPink : Colors.systemBlue}
                />
                <Text style={styles.archetypeLabel}>
                  {payload.archetype.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.verdictHeadline}>"{payload.verdictSummary}"</Text>

              {/* Quick Math Pill Row */}
              <View style={styles.pillRow}>
                <View style={styles.miniPill}>
                  <Text style={styles.miniPillLabel}>Initiation</Text>
                  <Text style={styles.miniPillVal}>
                    {payload.stats.initiationUser}% You
                  </Text>
                </View>
                <View style={styles.miniPill}>
                  <Text style={styles.miniPillLabel}>Reply Lag</Text>
                  <Text style={styles.miniPillVal}>
                    {payload.stats.delayContact}
                  </Text>
                </View>
              </View>
            </AppleGlassCard>

            {/* Action Bar */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => handleNextPhase('TURNING_POINT')}
              style={styles.primaryActionButton}
              accessibilityRole="button"
              accessibilityLabel="Proceed to the turning point reveal"
            >
              <Text style={styles.primaryActionText}>THE TURNING POINT (ACT 9)</Text>
              <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ============================================================ */}
        {/* PHASE 2: THE TURNING POINT (ACT 9 - THE DECAY MOMENT) */}
        {/* ============================================================ */}
        {phase === 'TURNING_POINT' && (
          <Animated.View
            entering={SlideInRight.duration(350)}
            exiting={SlideOutLeft.duration(250)}
            style={styles.stageScrollWrapper}
          >
            <View style={styles.phaseHeader}>
              <View style={styles.phaseTag}>
                <Clock size={12} color={Colors.systemPink} style={{ marginRight: 4 }} />
                <Text style={styles.phaseTagText}>ACT 9: TIMELINE OF DECAY</Text>
              </View>
              <Text style={styles.stageTitle}>The Moment the Power Shifted</Text>
              <Text style={styles.stageSubtitle}>
                Forensic telemetry detected an irreversible break in communication cadence.
              </Text>
            </View>

            {/* Shift Evidence Card */}
            <AppleGlassCard variant="danger" style={styles.evidenceCard}>
              <View style={styles.shiftMetaRow}>
                <Text style={styles.shiftDate}>{payload.theTurningPoint.date}</Text>
                <Text style={styles.shiftGapBadge}>
                  {payload.theTurningPoint.gapShift}
                </Text>
              </View>

              <Text style={styles.shiftDescription}>
                {payload.theTurningPoint.description}
              </Text>

              {/* The Fatal Shift Quote */}
              <View style={styles.pivotQuoteContainer}>
                <Quote size={16} color={Colors.systemPink} style={{ marginBottom: 4 }} />
                <Text style={styles.pivotQuoteText}>
                  "{payload.theTurningPoint.pivotQuote}"
                </Text>
              </View>
            </AppleGlassCard>

            {/* Forward Action */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => handleNextPhase('RECEIPTS')}
              style={styles.primaryActionButton}
              accessibilityRole="button"
              accessibilityLabel="Proceed to review the receipts"
            >
              <Text style={styles.primaryActionText}>EXAMINE THE RECEIPTS (ACT 15)</Text>
              <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ============================================================ */}
        {/* PHASE 3: THE RECEIPTS (ACT 15 - GREATEST HITS) */}
        {/* ============================================================ */}
        {phase === 'RECEIPTS' && (
          <Animated.View
            entering={SlideInRight.duration(350)}
            exiting={FadeOut.duration(250)}
            style={styles.stageScrollWrapper}
          >
            <View style={styles.phaseHeader}>
              <View style={styles.phaseTag}>
                <ShieldAlert size={12} color={Colors.systemPink} style={{ marginRight: 4 }} />
                <Text style={styles.phaseTagText}>ACT 15: GREATEST HITS</Text>
              </View>
              <Text style={styles.stageTitle}>The Evidence Locker</Text>
              <Text style={styles.stageSubtitle}>
                Unsparing conversational receipts extracted directly from the chat log.
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {payload.greatestHits.slice(0, 3).map((hit, index) => (
                <AppleGlassCard
                  key={`receipt-${index}`}
                  variant="elevated"
                  style={styles.receiptItemCard}
                >
                  <View style={styles.receiptTopMeta}>
                    <Text style={styles.receiptSenderBadge}>
                      {hit.sender === 'user' ? 'YOU SENT' : `${payload.contactName.toUpperCase()} REPLIED`}
                    </Text>
                    {hit.timestamp ? (
                      <Text style={styles.receiptTimeText}>{hit.timestamp}</Text>
                    ) : null}
                  </View>

                  <Text style={styles.receiptBodyQuote}>"{hit.quote}"</Text>

                  <View style={styles.receiptAnnotationBox}>
                    <Text style={styles.receiptAnnotationText}>
                      💡 {hit.annotation}
                    </Text>
                  </View>
                </AppleGlassCard>
              ))}
            </ScrollView>

            {/* Action Bar with Story Card Trigger */}
            <View style={styles.dualActionRow}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => setStoryModalVisible(true)}
                style={styles.viralShareTriggerBtn}
                accessibilityRole="button"
                accessibilityLabel="Generate 9:16 viral receipt story card"
              >
                <Share2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.viralShareBtnText}>EXPORT STORY CARD</Text>
              </TouchableOpacity>

              {onFinish ? (
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={onFinish}
                  style={styles.finishAuditBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Complete unboxing and enter dashboard"
                >
                  <Text style={styles.finishAuditBtnText}>Open Dashboard</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </Animated.View>
        )}

        {/* ============================================================ */}
        {/* VIRAL 9:16 RECEIPT CARD MODAL */}
        {/* ============================================================ */}
        <Modal
          visible={storyModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setStoryModalVisible(false)}
        >
          <SafeAreaView style={styles.modalBackdrop}>
            <ScrollView
              contentContainerStyle={{
                alignItems: 'center',
                paddingVertical: 20,
              }}
            >
              <ViralReceiptCard
                data={receiptData}
                onClose={() => setStoryModalVisible(false)}
              />
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  caseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.systemPink,
    marginRight: 6,
  },
  caseIndicatorText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 0.8,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  skipBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textTertiary,
    marginRight: 2,
  },
  centerStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  scanningTextBlock: {
    alignItems: 'center',
    marginTop: 28,
    paddingHorizontal: 20,
  },
  scanningStatusHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.systemPink,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  scanningStatusBody: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    minHeight: 44,
  },
  stepDotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  stepDot: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  stepDotActive: {
    backgroundColor: Colors.systemPink,
  },
  verdictCard: {
    width: '100%',
    marginTop: 22,
    padding: 16,
  },
  archetypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  archetypeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  verdictHeadline: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 10,
  },
  miniPill: {
    flex: 1,
  },
  miniPillLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.40)',
    textTransform: 'uppercase',
  },
  miniPillVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  primaryActionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.systemPink,
    borderRadius: Radius.lg,
    paddingVertical: 15,
    minHeight: 50,
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.systemPink,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  stageScrollWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  phaseHeader: {
    marginBottom: 16,
  },
  phaseTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 45, 85, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 85, 0.20)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  phaseTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.systemPink,
    letterSpacing: 0.8,
  },
  stageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  stageSubtitle: {
    fontSize: 13,
    color: Colors.textTertiary,
    lineHeight: 18,
    marginTop: 4,
  },
  evidenceCard: {
    marginVertical: 12,
  },
  shiftMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shiftDate: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.50)',
  },
  shiftGapBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.systemPink,
    backgroundColor: 'rgba(255, 45, 85, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  shiftDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    fontWeight: '500',
  },
  pivotQuoteContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  pivotQuoteText: {
    fontSize: 13.5,
    fontStyle: 'italic',
    color: Colors.systemPink,
    lineHeight: 19,
    fontWeight: '600',
  },
  receiptItemCard: {
    marginBottom: 10,
  },
  receiptTopMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  receiptSenderBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.45)',
    letterSpacing: 0.8,
  },
  receiptTimeText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.35)',
  },
  receiptBodyQuote: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  receiptAnnotationBox: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  receiptAnnotationText: {
    fontSize: 11.5,
    color: Colors.textTertiary,
    lineHeight: 16,
  },
  dualActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  viralShareTriggerBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.systemPink,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    minHeight: 48,
  },
  viralShareBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  finishAuditBtn: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: Radius.lg,
    paddingVertical: 14,
    minHeight: 48,
  },
  finishAuditBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
