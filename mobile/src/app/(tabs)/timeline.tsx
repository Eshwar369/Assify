import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import {
  Sparkles,
  Heart,
  Zap,
  Shield,
  Clock,
  Activity,
  Calendar,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react-native';

import { Colors, Radius, Typography, Spacing } from '@/constants/theme';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppleElevatedCard } from '@/components/ui/AppleElevatedCard';

interface EpochItem {
  number: string;
  title: string;
  date: string;
  weight: string;
  narrative: string;
  quote: string;
  accent: string;
  icon: any;
  isCurrent?: boolean;
  deltaMetric: string;
}

const EPOCHS: EpochItem[] = [
  {
    number: '01',
    title: 'Genesis & First Spark',
    date: 'April - May 2026',
    weight: '5% Weight',
    narrative:
      'Early tentative calibration. Started with light playful banter and polite check-ins on campus. Both maintained polite texting decorum before boundaries dissolved.',
    quote: 'Hi, are you also in the campus library today?',
    accent: Colors.textSecondary,
    icon: Sparkles,
    deltaMetric: 'Latency: 12m avg • 50/50 Initiation',
  },
  {
    number: '02',
    title: 'The Vulnerability Threshold',
    date: 'May - July 2026',
    weight: '10% Weight',
    narrative:
      'The defining turning point. When health emergency occurred, all sarcastic armor dropped. Care and reliance became permanent fixtures of the dynamic.',
    quote: 'Surgery annav kada... everything will be alright take care get well soon ❤️',
    accent: Colors.accentRose,
    icon: Heart,
    deltaMetric: 'Emotional Armor: Disarmed',
  },
  {
    number: '03',
    title: 'Habitual Equilibrium & Inside Lore',
    date: 'July - September 2026',
    weight: '10% Weight',
    narrative:
      'Comfort zone unlocked. Nicknames solidified ("Zombiee", "Pulihora Raja"). Daily routines, meme exchanges, and voice note sparring became the baseline.',
    quote: 'Nuvvu naaku message cheyadam manesthe nenu evartho matladali?',
    accent: Colors.accentGold,
    icon: Shield,
    deltaMetric: 'Double texts doubled • 4h daily dwell',
  },
  {
    number: '04',
    title: 'The Present Operating Reality',
    date: 'October 2026 (Active Dynamic)',
    weight: '75% Profiler Weight',
    narrative:
      'Sub-minute rapid fire responses (0.5m median delay), 6,481 double-texts, and late-night calls. Pure romantic tension teetering on mutual confession.',
    quote: 'Nuvvu padukunte nenu evartho matladali? Sleep is illegal.',
    accent: Colors.accentGold,
    icon: Zap,
    isCurrent: true,
    deltaMetric: '0.5m Response Lag • Peak Tension',
  },
];

export default function TimelineScreen() {
  const [selectedRange, setSelectedRange] = useState<'all' | '90d' | '30d'>('all');

  const handleRangeChange = (range: 'all' | '90d' | '30d') => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Haptics fallback
      }
    }
    setSelectedRange(range);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.desktopCanvas}>
        <AppHeader
          title="Fever Chart"
          subtitle="Longitudinal Trajectory"
          activePartner="Sarah"
        />

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Time Range Filter Bar */}
          <View style={styles.filterRow}>
            {(['all', '90d', '30d'] as const).map((r) => {
              const label = r === 'all' ? 'All Time' : r === '90d' ? 'Last 90 Days' : 'Last 30 Days';
              const active = selectedRange === r;
              return (
                <TouchableOpacity
                  key={r}
                  activeOpacity={0.8}
                  onPress={() => handleRangeChange(r)}
                  style={[styles.filterPill, active && styles.filterPillActive]}
                >
                  <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Hero Trajectory Card */}
          <AppleElevatedCard floating style={styles.heroCard}>
            <View style={styles.heroCardHeader}>
              <View style={styles.statusBadge}>
                <Activity size={12} color={Colors.accentGold} style={{ marginRight: 4 }} />
                <Text style={styles.statusBadgeText}>DIAGNOSTIC STATUS</Text>
              </View>
              <Text style={styles.dateRangeText}>APR 2026 → PRESENT</Text>
            </View>

            <Text style={styles.heroTitle}>Accelerated Emotional Entanglement</Text>
            <Text style={styles.heroSub}>
              Tracking over 14,821 messages indicates an exponential surge in late-night availability and reciprocal vulnerability.
            </Text>

            {/* Apple Bezier Fever Curve */}
            <View style={styles.chartContainer}>
              <Svg width="100%" height={120} viewBox="0 0 340 120">
                <Defs>
                  <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={Colors.accentGold} stopOpacity={0.25} />
                    <Stop offset="100%" stopColor={Colors.accentGold} stopOpacity={0.0} />
                  </LinearGradient>
                </Defs>

                {/* Shaded Area */}
                <Path
                  d="M 10 95 C 70 85, 120 70, 180 50 C 230 35, 280 20, 330 15 L 330 110 L 10 110 Z"
                  fill="url(#chartGrad)"
                />

                {/* Curve Line */}
                <Path
                  d="M 10 95 C 70 85, 120 70, 180 50 C 230 35, 280 20, 330 15"
                  fill="none"
                  stroke={Colors.accentGold}
                  strokeWidth={3}
                />

                {/* Milestone Node Dots */}
                <Circle cx="10" cy="95" r="4" fill={Colors.textSecondary} />
                <Circle cx="120" cy="70" r="4" fill={Colors.accentRose} />
                <Circle cx="230" cy="35" r="4" fill={Colors.accentGold} />
                <Circle cx="330" cy="15" r="5" fill={Colors.textPrimary} stroke="#FFFFFF" strokeWidth={2} />
              </Svg>

              <View style={styles.chartXLabels}>
                <Text style={styles.chartXText}>Apr 2026</Text>
                <Text style={styles.chartXText}>Jul 2026</Text>
                <Text style={styles.chartXText}>Sep 2026</Text>
                <Text style={[styles.chartXText, { color: Colors.textPrimary, fontWeight: '700' }]}>Now</Text>
              </View>
            </View>

            {/* Inset Stat Pills */}
            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Text style={styles.statLabel}>Total Epochs</Text>
                <Text style={styles.statValue}>4 Phases</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statLabel}>Current Velocity</Text>
                <Text style={[styles.statValue, { color: Colors.accentGold }]}>Sub-Minute</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statLabel}>Prognosis</Text>
                <Text style={[styles.statValue, { color: Colors.accentRose }]}>Peak Delulu</Text>
              </View>
            </View>
          </AppleElevatedCard>

          {/* Epoch Timeline Feed */}
          <Text style={styles.sectionTitle}>CHRONOLOGICAL TURNING POINTS</Text>

          <View style={styles.timelineList}>
            {EPOCHS.map((epoch, idx) => {
              const IconComp = epoch.icon;
              return (
                <AppleElevatedCard
                  key={epoch.number}
                  style={styles.epochCard}
                  accentVariant={epoch.isCurrent ? 'gold' : 'none'}
                >
                  <View style={styles.epochHeaderRow}>
                    <View style={styles.epochLeftHeader}>
                      <View style={[styles.epochIconCircle, { backgroundColor: Colors.secondaryBackground }]}>
                        <IconComp size={16} color={epoch.accent} />
                      </View>
                      <View>
                        <View style={styles.epochBadgeRow}>
                          <Text style={styles.epochNumber}>PHASE {epoch.number}</Text>
                          {epoch.isCurrent && (
                            <View style={styles.activePill}>
                              <Text style={styles.activePillText}>ACTIVE STAGE</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.epochTitle}>{epoch.title}</Text>
                      </View>
                    </View>

                    <Text style={styles.epochDate}>{epoch.date}</Text>
                  </View>

                  <Text style={styles.epochNarrative}>{epoch.narrative}</Text>

                  {/* Verified Receipt Callout */}
                  <View style={styles.receiptBox}>
                    <Text style={styles.receiptLabel}>VERIFIED CHAT RECEIPT</Text>
                    <Text style={styles.receiptQuote}>"{epoch.quote}"</Text>
                  </View>

                  {/* Delta Metric */}
                  <View style={styles.deltaRow}>
                    <TrendingUp size={13} color={Colors.textTertiary} style={{ marginRight: 6 }} />
                    <Text style={styles.deltaText}>{epoch.deltaMetric}</Text>
                  </View>
                </AppleElevatedCard>
              );
            })}
          </View>
        </ScrollView>
      </View>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenGutter,
    paddingTop: 16,
    paddingBottom: 110,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondaryBackground,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  filterPillActive: {
    backgroundColor: Colors.textPrimary,
    borderColor: Colors.textPrimary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterPillTextActive: {
    color: Colors.textInverted,
  },
  heroCard: {
    padding: 22,
    marginBottom: 32,
  },
  heroCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentGoldSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.accentGold,
  },
  dateRangeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  chartXLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 6,
  },
  chartXText: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flex: 1,
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.md,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textTertiary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.textTertiary,
    marginBottom: 14,
    marginLeft: 4,
  },
  timelineList: {
    gap: 16,
  },
  epochCard: {
    padding: 20,
  },
  epochHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  epochLeftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  epochIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  epochBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  epochNumber: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.textTertiary,
  },
  activePill: {
    backgroundColor: Colors.accentGoldSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: Colors.accentGold,
  },
  epochTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  epochDate: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  epochNarrative: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  receiptBox: {
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  receiptLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.accentGold,
    marginBottom: 4,
  },
  receiptQuote: {
    fontSize: 13,
    fontStyle: 'italic',
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deltaText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
});
