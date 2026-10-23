import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import {
  Sparkles,
  Heart,
  Zap,
  Shield,
  Activity,
  TrendingUp,
} from 'lucide-react-native';

import { Colors, Radius } from '@/constants/theme';
import {
  ScreenContainer,
  AppHeader,
  SegmentedControl,
  StatStrip,
  ReceiptQuote,
  EditorialSection,
} from '@/components/ui';

interface EpochItem {
  number: string;
  title: string;
  date: string;
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
    narrative:
      'Sub-minute rapid fire responses (0.5m median delay), 6,481 double-texts, and late-night calls. Pure romantic tension teetering on mutual confession.',
    quote: 'Nuvvu padukunte nenu evartho matladali? Sleep is illegal.',
    accent: Colors.accentGold,
    icon: Zap,
    isCurrent: true,
    deltaMetric: '0.5m Response Lag • Peak Tension',
  },
];

const TIME_RANGES = [
  { key: '30d', label: '30D' },
  { key: '90d', label: '90D' },
  { key: 'all', label: 'All Time' },
];

export default function TimelineScreen() {
  const [selectedRange, setSelectedRange] = useState('all');

  const timelineMetrics = [
    { label: 'TOTAL EPOCHS', value: '4 Phases' },
    { label: 'VELOCITY', value: 'Sub-Minute', accent: 'gold' as const },
    { label: 'PROGNOSIS', value: 'Peak Delulu', accent: 'rose' as const },
  ];

  return (
    <ScreenContainer
      header={
        <AppHeader
          title="Fever Chart"
          subtitle="Longitudinal Trajectory"
          activePartner="Sarah"
        />
      }
    >
      {/* 1. Unified Segmented Bar */}
      <SegmentedControl
        options={TIME_RANGES}
        value={selectedRange}
        onChange={setSelectedRange}
      />

      {/* 2. Seamless Editorial Hero Section */}
      <View style={styles.editorialHero}>
        <View style={styles.diagnosticRow}>
          <View style={styles.statusBadge}>
            <Activity size={12} color={Colors.accentGold} style={{ marginRight: 4 }} />
            <Text style={styles.statusBadgeText}>DIAGNOSTIC STATUS</Text>
          </View>
          <Text style={styles.dateRangeText}>APR 2026 → PRESENT</Text>
        </View>

        <Text style={styles.headline}>Accelerated Emotional Entanglement</Text>
        <Text style={styles.subheadline}>
          Tracking over 14,821 messages indicates an exponential surge in late-night availability and reciprocal vulnerability.
        </Text>

        {/* Bezier Curve */}
        <View style={styles.chartWrapper}>
          <Svg width="100%" height={140} viewBox="0 0 340 140">
            <Defs>
              <LinearGradient id="feverGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={Colors.accentGold} stopOpacity={0.18} />
                <Stop offset="70%" stopColor={Colors.accentGold} stopOpacity={0.03} />
                <Stop offset="100%" stopColor={Colors.background} stopOpacity={0.0} />
              </LinearGradient>
            </Defs>

            <Path
              d="M 10 110 C 70 100, 120 80, 180 55 C 230 40, 280 22, 330 16 L 330 135 L 10 135 Z"
              fill="url(#feverGrad)"
            />

            <Path
              d="M 10 110 C 70 100, 120 80, 180 55 C 230 40, 280 22, 330 16"
              fill="none"
              stroke={Colors.accentGold}
              strokeWidth={3}
            />

            <Circle cx="10" cy="110" r="4" fill={Colors.textTertiary} />
            <Circle cx="120" cy="80" r="4" fill={Colors.accentRose} />
            <Circle cx="230" cy="40" r="4" fill={Colors.accentGold} />
            <Circle
              cx="330"
              cy="16"
              r="5"
              fill={Colors.textPrimary}
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          </Svg>

          <View style={styles.chartXRow}>
            <Text style={styles.chartXText}>Apr 2026</Text>
            <Text style={styles.chartXText}>Jul 2026</Text>
            <Text style={styles.chartXText}>Sep 2026</Text>
            <Text style={[styles.chartXText, styles.chartXTextCurrent]}>Now</Text>
          </View>
        </View>

        {/* 3. The Unified StatStrip (Zero nested boxes!) */}
        <StatStrip metrics={timelineMetrics} />
      </View>

      {/* 4. Editorial Chronological Stream */}
      <EditorialSection title="Chronological Turning Points" topDivider>
        <View style={styles.timelineStream}>
          {EPOCHS.map((epoch, idx) => {
            const isLast = idx === EPOCHS.length - 1;

            return (
              <View key={epoch.number} style={styles.streamItem}>
                <View style={styles.streamGutter}>
                  <View
                    style={[
                      styles.streamDot,
                      epoch.isCurrent && styles.streamDotActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.streamDotInner,
                        { backgroundColor: epoch.accent },
                      ]}
                    />
                  </View>
                  {!isLast && <View style={styles.streamLine} />}
                </View>

                <View style={styles.streamBody}>
                  <View style={styles.streamHeaderRow}>
                    <View style={styles.streamPhaseRow}>
                      <Text style={styles.streamPhaseNumber}>
                        PHASE {epoch.number}
                      </Text>
                      {epoch.isCurrent && (
                        <View style={styles.activePill}>
                          <Text style={styles.activePillText}>ACTIVE STAGE</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.streamDate}>{epoch.date}</Text>
                  </View>

                  <Text style={styles.streamTitle}>{epoch.title}</Text>
                  <Text style={styles.streamNarrative}>{epoch.narrative}</Text>

                  {/* Unified ReceiptQuote */}
                  <ReceiptQuote
                    quote={epoch.quote}
                    accentVariant={epoch.isCurrent ? 'gold' : 'neutral'}
                  />

                  <View style={styles.deltaRow}>
                    <TrendingUp
                      size={12}
                      color={Colors.textTertiary}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.deltaText}>{epoch.deltaMetric}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </EditorialSection>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  editorialHero: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  diagnosticRow: {
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
  headline: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 30,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subheadline: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  chartWrapper: {
    paddingVertical: 6,
    marginBottom: 18,
  },
  chartXRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 4,
  },
  chartXText: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  chartXTextCurrent: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  timelineStream: {
    paddingLeft: 4,
  },
  streamItem: {
    flexDirection: 'row',
    marginBottom: 28,
  },
  streamGutter: {
    width: 28,
    alignItems: 'center',
  },
  streamDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.secondaryBackground,
    borderWidth: 1.5,
    borderColor: Colors.borderHairline,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  streamDotActive: {
    borderColor: Colors.accentGold,
  },
  streamDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  streamLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: Colors.borderHairline,
    marginTop: 4,
    marginBottom: -8,
  },
  streamBody: {
    flex: 1,
    paddingLeft: 12,
  },
  streamHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  streamPhaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streamPhaseNumber: {
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
  streamDate: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  streamTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  streamNarrative: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  deltaText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
});
