import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Share,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  X,
  Share2,
  ChevronDown,
  Flame,
  Sparkles,
  Trophy,
  AlertTriangle,
  Heart,
  Zap,
  Film,
  Quote,
} from 'lucide-react-native';

import { Colors } from '../constants/theme';
import { getAllActs, TheatricalAct, getContacts } from '../services/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ActsModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ contactId?: string; contactName?: string }>();
  const [acts, setActs] = useState<TheatricalAct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    async function loadActs() {
      try {
        let cid = params.contactId;
        if (!cid) {
          const contactList = await getContacts();
          if (contactList.length > 0) cid = contactList[0].id;
        }

        if (cid) {
          const actList = await getAllActs(cid);
          setActs(actList);
        }
      } catch (err) {
        console.error('Failed to load acts in modal:', err);
      } finally {
        setLoading(false);
      }
    }
    loadActs();
  }, [params.contactId]);

  const handleClose = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const handleShareCard = async (act: TheatricalAct) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    try {
      await Share.share({
        message: `ASSIFY Relationship Intelligence — Act ${act.act_number}: ${act.act_name}\n\nDiagnosis: ${JSON.stringify(act.content, null, 2).slice(0, 300)}...\n\nAnalyzed with ASSIFY.`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      const idx = viewableItems[0].index;
      if (idx !== null && idx !== activeIndex) {
        setActiveIndex(idx);
        if (Platform.OS !== 'web') {
          Haptics.selectionAsync();
        }
      }
    }
  }).current;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.accentYellow} />
        <Text style={styles.loadingText}>Loading 17 Theatrical Acts...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Controls & 17-Segment Progress Header */}
      <View style={styles.topBar}>
        {/* Progress Ticks */}
        <View style={styles.ticksContainer}>
          {acts.map((_, i) => (
            <View
              key={i}
              style={[
                styles.tick,
                i === activeIndex && styles.tickActive,
                i < activeIndex && styles.tickPassed,
              ]}
            />
          ))}
        </View>

        {/* Header Actions */}
        <View style={styles.headerRow}>
          <View style={styles.actTag}>
            <Flame size={12} color={Colors.accentYellow} />
            <Text style={styles.actTagText}>
              ACT {acts[activeIndex]?.act_number || 1} OF {acts.length}
            </Text>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <X size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Vertical Snap Swiper */}
      <FlatList
        ref={flatListRef}
        data={acts}
        keyExtractor={(item) => item.act_number.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT - 110}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item: act }) => (
          <View style={[styles.cardContainer, { height: SCREEN_HEIGHT - 110 }]}>
            <View style={styles.actCard}>
              <Text style={styles.actHeaderName}>{act.act_name.toUpperCase()}</Text>

              {/* Render dynamic Act contents */}
              <View style={styles.actContentContainer}>
                {renderActContent(act)}
              </View>

              {/* Bottom Card Controls */}
              <View style={styles.bottomBar}>
                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={() => handleShareCard(act)}>
                  <Share2 size={16} color="#08090E" />
                  <Text style={styles.shareText}>Share Card</Text>
                </TouchableOpacity>

                {act.act_number < 17 ? (
                  <View style={styles.swipeHint}>
                    <Text style={styles.swipeHintText}>Swipe for Act {act.act_number + 1}</Text>
                    <ChevronDown size={14} color={Colors.textTertiary} />
                  </View>
                ) : (
                  <View style={styles.swipeHint}>
                    <Text style={[styles.swipeHintText, { color: Colors.accentYellow }]}>
                      Fin. The Verdict has been spoken.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function renderActContent(act: TheatricalAct) {
  const c = act.content || {};

  switch (act.act_number) {
    case 1: // Opening
      return (
        <View style={styles.actBody}>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>DIAGNOSIS</Text>
            <Text style={styles.highlightBody}>{c.diagnosis}</Text>
          </View>
          <View style={styles.pairRow}>
            <View style={styles.pairItem}>
              <Text style={styles.pairLabel}>YOUR ARCHETYPE</Text>
              <Text style={styles.pairVal}>{c.user_archetype}</Text>
            </View>
            <View style={[styles.pairItem, { borderColor: Colors.accentRose }]}>
              <Text style={[styles.pairLabel, { color: Colors.accentRose }]}>HER ARCHETYPE</Text>
              <Text style={styles.pairVal}>{c.contact_archetype}</Text>
            </View>
          </View>
          <Text style={styles.summaryVerdict}>{c.summary_verdict}</Text>
        </View>
      );

    case 2: // Delulu Meter
      return (
        <View style={styles.actBody}>
          <View style={styles.scoreHero}>
            <Text style={styles.bigScore}>{c.delulu_score}</Text>
            <Text style={styles.bigScoreMax}>/100</Text>
          </View>
          <Text style={styles.circusTitle}>{c.circus_level}</Text>
          <Text style={styles.survivalOddsText}>{c.survival_odds}</Text>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>{c.projected_outcome}</Text>
          </View>
        </View>
      );

    case 8: // Chronemics
      return (
        <View style={styles.actBody}>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>DIGITAL PACING & LATENCY</Text>
            <Text style={styles.highlightBody}>{c.pacing_analysis}</Text>
          </View>
          <View style={styles.highlightBox}>
            <Text style={[styles.highlightTitle, { color: Colors.accentRose }]}>
              DOUBLE-TEXT PSYCHOLOGY
            </Text>
            <Text style={styles.highlightBody}>{c.double_text_psychology}</Text>
          </View>
          <View style={styles.highlightBox}>
            <Text style={[styles.highlightTitle, { color: Colors.accentCyan }]}>
              LATE-NIGHT ADDICTION
            </Text>
            <Text style={styles.highlightBody}>{c.late_night_dynamic}</Text>
          </View>
        </View>
      );

    case 12: // Pop Culture
      return (
        <View style={styles.actBody}>
          <View style={styles.popHero}>
            <Film size={28} color={Colors.accentYellow} />
            <Text style={styles.movieTitle}>{c.movie_parallel}</Text>
          </View>
          <View style={styles.delusionGapCard}>
            <Text style={styles.gapLabel}>WHAT YOU THINK IT IS</Text>
            <Text style={styles.gapText}>{c.the_delusion_gap?.what_you_think_it_is}</Text>
            <View style={styles.divider} />
            <Text style={[styles.gapLabel, { color: Colors.accentRose }]}>
              WHAT IT ACTUALLY IS
            </Text>
            <Text style={styles.gapText}>{c.the_delusion_gap?.what_it_actually_is}</Text>
          </View>
          <Text style={styles.songText}>🎵 Soundtrack: {c.soundtrack_song}</Text>
        </View>
      );

    case 15: // Greatest Hits
      const hits = c.hits || [];
      return (
        <View style={styles.actBody}>
          <Text style={styles.hitsSubtitle}>Forensically Logged Chat Receipts</Text>
          {hits.slice(0, 3).map((hit: any, i: number) => (
            <View key={i} style={styles.hitCard}>
              <View style={styles.hitBadge}>
                <Text style={styles.hitBadgeText}>{hit.hit_type.toUpperCase()}</Text>
              </View>
              <Text style={styles.hitQuote}>"{hit.quote}"</Text>
              <Text style={styles.hitRoast}>{hit.roast_commentary}</Text>
            </View>
          ))}
        </View>
      );

    case 16: // Awards
      const awards = c.awards || [];
      return (
        <View style={styles.actBody}>
          <View style={styles.trophyHeader}>
            <Trophy size={28} color={Colors.accentYellow} />
            <Text style={styles.trophyTitle}>THE AWARDS CEREMONY</Text>
          </View>
          {awards.slice(0, 3).map((aw: any, i: number) => (
            <View key={i} style={styles.awardCard}>
              <Text style={styles.awardName}>🏆 {aw.title}</Text>
              <Text style={styles.awardRecip}>RECIPIENT: {aw.recipient.toUpperCase()}</Text>
              <Text style={styles.awardCite}>{aw.citation}</Text>
            </View>
          ))}
        </View>
      );

    case 17: // Final Verdict
      return (
        <View style={styles.actBody}>
          <View style={styles.verdictCard}>
            <Text style={styles.verdictLabel}>DEFINITIVE RULING</Text>
            <Text style={styles.verdictText}>{c.definitive_ruling}</Text>
          </View>
          <View style={styles.blessingCard}>
            <Text style={styles.blessingLabel}>CLOSING WORDS FROM ASSIFY</Text>
            <Text style={styles.blessingText}>"{c.closing_roast_or_blessing}"</Text>
          </View>
          <Text style={styles.horizonText}>Horizon: {c.time_horizon_to_breakdown}</Text>
        </View>
      );

    default: // Generic JSON viewer for other acts
      return (
        <View style={styles.actBody}>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightBody}>
              {c.diagnosis ||
                c.the_raw_truth ||
                c.friction_point ||
                c.flirting_reciprocity ||
                c.critical_red_flag ||
                c.silver_linings ||
                JSON.stringify(c, null, 2).slice(0, 350)}
            </Text>
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 10,
    paddingBottom: 10,
  },
  ticksContainer: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 10,
  },
  tick: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  tickActive: {
    backgroundColor: Colors.accentYellow,
    height: 4,
  },
  tickPassed: {
    backgroundColor: 'rgba(255, 214, 10, 0.45)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  actTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accentYellow,
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'center',
  },
  actCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    justifyContent: 'space-between',
  },
  actHeaderName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  actContentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  actBody: {
    gap: 12,
  },
  highlightBox: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentYellow,
  },
  highlightTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accentYellow,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  highlightBody: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
  },
  pairRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pairItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 214, 10, 0.05)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.2)',
  },
  pairLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.accentYellow,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  pairVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  summaryVerdict: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  scoreHero: {
    flexDirection: 'row',
    alignItems: 'baseline',
    alignSelf: 'center',
  },
  bigScore: {
    fontSize: 64,
    fontWeight: '900',
    color: Colors.accentRose,
    letterSpacing: -2,
  },
  bigScoreMax: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textTertiary,
    marginLeft: 4,
  },
  circusTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  survivalOddsText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accentGreen,
    textAlign: 'center',
  },
  quoteCard: {
    backgroundColor: Colors.surfaceElevated,
    padding: 14,
    borderRadius: 14,
  },
  quoteText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 19,
  },
  popHero: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  delusionGapCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  gapLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accentYellow,
    letterSpacing: 0.8,
  },
  gapText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginVertical: 4,
  },
  songText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  hitsSubtitle: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  hitCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  hitBadge: {
    backgroundColor: 'rgba(255, 55, 95, 0.14)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  hitBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.accentRose,
    letterSpacing: 0.5,
  },
  hitQuote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textPrimary,
  },
  hitRoast: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  trophyHeader: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  trophyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.accentYellow,
    letterSpacing: 0.5,
  },
  awardCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    padding: 10,
    gap: 3,
  },
  awardName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  awardRecip: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.accentYellow,
    letterSpacing: 0.6,
  },
  awardCite: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  verdictCard: {
    backgroundColor: 'rgba(255, 214, 10, 0.08)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.25)',
  },
  verdictLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accentYellow,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  verdictText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  blessingCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    padding: 14,
  },
  blessingLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accentRose,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  blessingText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  horizonText: {
    fontSize: 11,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accentYellow,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  shareText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#08090E',
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  swipeHintText: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
});
