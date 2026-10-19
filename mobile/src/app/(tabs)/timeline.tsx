import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { GitCommit, Sparkles, AlertCircle, Heart, Zap, Shield } from 'lucide-react-native';
import { Colors, Typography } from '../../constants/theme';

const EPOCHS = [
  {
    number: '01',
    title: 'Epoch 1: Genesis & First Spark',
    date: 'April - May 2026',
    narrative:
      'Early tentative calibration. Started with light playful banter and checking in on daily life. Both maintained polite texting decorum before formality dissolved.',
    color: Colors.accentYellow,
    icon: Sparkles,
  },
  {
    number: '02',
    title: 'Epoch 2: The Crucible & Vulnerability Threshold',
    date: 'May - July 2026',
    narrative:
      'The defining emotional turning point. When Eshwar had surgery, Sleepless Zombiee dropped all defenses: "Surgery annav kada... everything will be alright take care get well soon ❤️". Mutual care was permanently unlocked.',
    color: Colors.accentRose,
    icon: Heart,
  },
  {
    number: '03',
    title: 'Epoch 3: Habitual Equilibrium & Inside Lore',
    date: 'July - September 2026',
    narrative:
      'Comfort zone unlocked. Nicknames solidified ("Zombiee", "Pulihora Raja"). Daily routines, meme exchanges, and voice note banter became the conversational baseline.',
    color: Colors.accentCyan,
    icon: Shield,
  },
  {
    number: '04',
    title: 'Epoch 4: The Present Operating Reality',
    date: 'October 2026 (Live Dynamic)',
    narrative:
      'Sub-minute rapid fire responses (0.5m median delay), 6,481 double-texts, and late-night muted video calls keeping voice low so parents do not walk in. Pure romantic tension teetering on mutual confession.',
    color: Colors.accentYellow,
    icon: Zap,
    isCurrent: true,
  },
];

export default function TimelineScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <GitCommit size={24} color={Colors.accentYellow} />
            <Text style={styles.title}>THE TIMELINE</Text>
          </View>
          <Text style={styles.subtitle}>4-Epoch Relational Evolution & History</Text>
        </View>

        {/* Epoch Cards */}
        <View style={styles.timelineList}>
          {EPOCHS.map((epoch, i) => {
            const Icon = epoch.icon;
            return (
              <View key={i} style={[styles.epochCard, epoch.isCurrent && styles.epochCardCurrent]}>
                <View style={styles.epochHeaderRow}>
                  <View style={[styles.epochNumberBadge, { backgroundColor: epoch.color }]}>
                    <Text style={styles.epochNumberText}>{epoch.number}</Text>
                  </View>
                  <View style={styles.epochTitleCol}>
                    <Text style={styles.epochTitle}>{epoch.title}</Text>
                    <Text style={styles.epochDate}>{epoch.date}</Text>
                  </View>
                </View>

                <Text style={styles.epochNarrative}>{epoch.narrative}</Text>

                {epoch.isCurrent ? (
                  <View style={styles.currentBadge}>
                    <Zap size={12} color="#08090E" />
                    <Text style={styles.currentBadgeText}>
                      ACTIVE OPERATING REALITY (75% PROFILER WEIGHT)
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
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
  header: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  timelineList: {
    gap: 16,
  },
  epochCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  epochCardCurrent: {
    borderColor: Colors.accentYellow,
    backgroundColor: 'rgba(255, 214, 10, 0.04)',
  },
  epochHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  epochNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  epochNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#08090E',
  },
  epochTitleCol: {
    flex: 1,
  },
  epochTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  epochDate: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  epochNarrative: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#08090E',
    letterSpacing: 0.5,
  },
});
