import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  GitCommit,
  Sparkles,
  Heart,
  Zap,
  Shield,
  Calendar,
  Quote,
} from 'lucide-react-native';
import { Colors, Radius, Typography } from '../../constants/theme';

const EPOCHS = [
  {
    number: '01',
    title: 'Epoch 1: Genesis & First Spark',
    date: 'April - May 2026',
    weight: '5% Weight',
    narrative:
      'Early tentative calibration. Started with light playful banter and polite check-ins on college and daily life. Both maintained polite texting decorum before boundaries naturally dissolved.',
    quote: 'Hi, are you also in the campus library today?',
    color: Colors.systemBlue,
    icon: Sparkles,
  },
  {
    number: '02',
    title: 'Epoch 2: The Crucible & Vulnerability Threshold',
    date: 'May - July 2026',
    weight: '10% Weight',
    narrative:
      'The defining emotional turning point of the relationship. When Eshwar had surgery, Sleepless Zombiee dropped all sarcastic armor and defenses. Care and emotional reliance became permanent.',
    quote: 'Surgery annav kada... everything will be alright take care get well soon ❤️',
    color: Colors.systemPink,
    icon: Heart,
  },
  {
    number: '03',
    title: 'Epoch 3: Habitual Equilibrium & Inside Lore',
    date: 'July - September 2026',
    weight: '10% Weight',
    narrative:
      'Comfort zone unlocked. Nicknames solidified ("Zombiee", "Pulihora Raja"). Daily routines, meme exchanges, and voice note sparring became the default conversational baseline.',
    quote: 'Nuvvu naaku message cheyadam manesthe nenu evartho matladali?',
    color: Colors.systemPurple,
    icon: Shield,
  },
  {
    number: '04',
    title: 'Epoch 4: The Present Operating Reality',
    date: 'October 2026 (Live Dynamic)',
    weight: '75% Profiler Weight',
    narrative:
      'Sub-minute rapid fire responses (0.5m median delay), 6,481 double-texts, and late-night muted video calls keeping voice low so parents do not walk in. Pure romantic tension teetering on mutual confession.',
    quote: 'Nuvvu padukunte nenu evartho matladali? Sleep is illegal.',
    color: Colors.systemCyan,
    icon: Zap,
    isCurrent: true,
  },
];

const webGlassStyle: any = Platform.OS === 'web' ? { backdropFilter: 'blur(25px) saturate(160%)' } : {};

export default function TimelineScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Apple Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <GitCommit size={24} color={Colors.systemBlue} />
            <Text style={styles.title}>The Timeline</Text>
          </View>
          <Text style={styles.subtitle}>4-Epoch Relational Evolution & History</Text>
        </View>

        {/* Apple Weight Architecture Banner */}
        <View style={styles.weightBanner}>
          <Zap size={14} color={Colors.systemBlue} />
          <Text style={styles.weightBannerText}>
            75% Profiler Weight on Epoch 4 to eliminate dead data bias
          </Text>
        </View>

        {/* Connected Vertical Timeline List */}
        <View style={styles.timelineList}>
          {EPOCHS.map((epoch, i) => {
            const Icon = epoch.icon;
            const isLast = i === EPOCHS.length - 1;

            return (
              <View key={i} style={styles.epochItem}>
                {/* Left Node & Spine Column */}
                <View style={styles.spineColumn}>
                  <View style={[styles.nodeCircle, { borderColor: epoch.color }]}>
                    <Icon size={14} color={epoch.color} />
                  </View>
                  {!isLast ? <View style={styles.spineLine} /> : null}
                </View>

                {/* Right Card Column */}
                <View
                  style={[
                    styles.epochCard,
                    epoch.isCurrent && styles.epochCardCurrent,
                    webGlassStyle,
                  ]}>
                  <View style={styles.epochHeaderRow}>
                    <View style={styles.epochTitleCol}>
                      <Text style={styles.epochTitle}>{epoch.title}</Text>
                      <View style={styles.dateRow}>
                        <Calendar size={11} color={Colors.systemGray} />
                        <Text style={styles.epochDate}>{epoch.date}</Text>
                      </View>
                    </View>

                    <View style={[styles.weightBadge, { borderColor: epoch.color }]}>
                      <Text style={[styles.weightText, { color: epoch.color }]}>
                        {epoch.weight}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.epochNarrative}>{epoch.narrative}</Text>

                  {/* Quoted Historical Receipt */}
                  {epoch.quote ? (
                    <View style={styles.quoteBox}>
                      <Quote size={11} color={epoch.color} style={{ marginRight: 6, marginTop: 2 }} />
                      <Text style={styles.quoteText}>"{epoch.quote}"</Text>
                    </View>
                  ) : null}

                  {epoch.isCurrent ? (
                    <View style={styles.currentBadge}>
                      <Zap size={12} color="#FFFFFF" />
                      <Text style={styles.currentBadgeText}>
                        ACTIVE OPERATING REALITY
                      </Text>
                    </View>
                  ) : null}
                </View>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 14,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.systemGray,
    marginTop: 2,
  },
  weightBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 122, 255, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    marginBottom: 20,
  },
  weightBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.systemBlue,
    letterSpacing: -0.1,
  },
  timelineList: {
    gap: 0,
  },
  epochItem: {
    flexDirection: 'row',
    gap: 14,
  },
  spineColumn: {
    alignItems: 'center',
    width: 32,
  },
  nodeCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  spineLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 4,
  },
  epochCard: {
    flex: 1,
    backgroundColor: Colors.glassSurface,
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  epochCardCurrent: {
    borderColor: 'rgba(0, 122, 255, 0.4)',
    backgroundColor: 'rgba(0, 122, 255, 0.04)',
    shadowColor: Colors.systemBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  epochHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  epochTitleCol: {
    flex: 1,
    marginRight: 8,
  },
  epochTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  epochDate: {
    fontSize: 11,
    color: Colors.systemGray,
  },
  weightBadge: {
    borderWidth: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  weightText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  epochNarrative: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  quoteBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Radius.md,
    padding: 10,
    marginBottom: 8,
  },
  quoteText: {
    flex: 1,
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: Colors.systemBlue,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#FFFFFF',
  },
});
