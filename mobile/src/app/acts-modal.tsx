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
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  X,
  Share2,
  ChevronDown,
  Sparkles,
  Trophy,
  Heart,
  Zap,
  Film,
  Quote,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Gavel,
} from 'lucide-react-native';

import { Colors, Radius, Typography } from '../constants/theme';
import { getAllActs, TheatricalAct, getContacts } from '../services/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const webGlassStyle: any = Platform.OS === 'web' ? { backdropFilter: 'blur(30px) saturate(180%)' } : {};

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
      const c = act.content || {};
      const highlight =
        c.diagnosis ||
        c.definitive_ruling ||
        c.projected_outcome ||
        c.summary_verdict ||
        'Relationship Dossier Card';

      await Share.share({
        message: `ASSIFY Relationship Intelligence — Act ${act.act_number}: ${act.act_name}\n\n"${highlight}"\n\nForensically analyzed with ASSIFY.`,
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
        <ActivityIndicator size="large" color={Colors.systemBlue} />
        <Text style={styles.loadingText}>Unpacking 17 Theatrical Dossier Acts...</Text>
      </View>
    );
  }

  const currentAct = acts[activeIndex] || acts[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top 17-Segment Story Progress Header */}
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
            <Sparkles size={12} color={Colors.systemBlue} />
            <Text style={styles.actTagText}>
              ACT {currentAct?.act_number || 1} OF {acts.length}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            activeOpacity={0.8}
            onPress={handleClose}>
            <X size={18} color={Colors.textPrimary} />
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
        snapToInterval={SCREEN_HEIGHT - 120}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        renderItem={({ item: act }) => (
          <View style={[styles.cardContainer, { height: SCREEN_HEIGHT - 120 }]}>
            <View style={[styles.actCard, webGlassStyle]}>
              <View style={styles.actHeaderRow}>
                <Text style={styles.actHeaderNumber}>ACT {act.act_number}</Text>
                <Text style={styles.actHeaderName} numberOfLines={1}>
                  {act.act_name}
                </Text>
              </View>

              {/* Dynamic Act contents */}
              <ScrollView
                style={styles.actScrollView}
                contentContainerStyle={styles.actContentContainer}
                showsVerticalScrollIndicator={false}>
                {renderActContent(act)}
              </ScrollView>

              {/* Bottom Card Controls */}
              <View style={styles.bottomBar}>
                <TouchableOpacity
                  style={styles.shareBtn}
                  activeOpacity={0.82}
                  onPress={() => handleShareCard(act)}>
                  <Share2 size={14} color="#FFFFFF" />
                  <Text style={styles.shareText}>Share Receipt Card</Text>
                </TouchableOpacity>

                {act.act_number < acts.length ? (
                  <View style={styles.swipeHint}>
                    <Text style={styles.swipeHintText}>Swipe for Act {act.act_number + 1}</Text>
                    <ChevronDown size={14} color={Colors.systemGray} />
                  </View>
                ) : (
                  <View style={styles.swipeHint}>
                    <Text style={[styles.swipeHintText, { color: Colors.systemBlue }]}>
                      Fin. The Verdict has spoken.
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
    case 1:
      return (
        <View style={styles.actBody}>
          <View style={styles.highlightBox}>
            <View style={styles.boxHeaderRow}>
              <Sparkles size={13} color={Colors.systemBlue} />
              <Text style={styles.highlightTitle}>EXECUTIVE DIAGNOSIS</Text>
            </View>
            <Text style={styles.highlightBody}>{c.diagnosis}</Text>
          </View>

          <View style={styles.pairRow}>
            <View style={styles.pairItem}>
              <Text style={styles.pairLabel}>YOUR ARCHETYPE</Text>
              <Text style={styles.pairVal}>{c.user_archetype || 'The Flirtatious Sparring Partner'}</Text>
            </View>
            <View style={[styles.pairItem, { borderColor: 'rgba(255, 45, 85, 0.3)' }]}>
              <Text style={[styles.pairLabel, { color: Colors.systemPink }]}>PARTNER ARCHETYPE</Text>
              <Text style={styles.pairVal}>{c.contact_archetype || 'The Chaotic Firehose'}</Text>
            </View>
          </View>

          {c.summary_verdict ? (
            <View style={styles.quoteCard}>
              <Text style={styles.quoteText}>"{c.summary_verdict}"</Text>
            </View>
          ) : null}
        </View>
      );

    case 2:
      return (
        <View style={styles.actBody}>
          <View style={styles.scoreHero}>
            <Text style={styles.bigScore}>{c.delulu_score || 75}</Text>
            <Text style={styles.bigScoreMax}>%</Text>
          </View>

          <View style={styles.circusPill}>
            <Sparkles size={13} color={Colors.systemPink} />
            <Text style={styles.circusTitle}>{c.circus_level || 'Romantic Clownery'}</Text>
          </View>

          <View style={styles.survivalOddsCard}>
            <Text style={styles.survivalOddsLabel}>90-DAY SURVIVAL ODDS</Text>
            <Text style={styles.survivalOddsText}>{c.survival_odds || '65% probability of continued sparring'}</Text>
          </View>

          <View style={styles.quoteCard}>
            <Text style={styles.quoteLabel}>PROJECTED OUTCOME</Text>
            <Text style={styles.quoteText}>{c.projected_outcome || c.delulu_analysis}</Text>
          </View>
        </View>
      );

    case 4:
      return (
        <View style={styles.actBody}>
          <Text style={styles.sectionSubtitle}>Comparative Behavioral RPG Stats</Text>

          <View style={styles.rpgCard}>
            <Text style={styles.rpgName}>YOUR PROFILE</Text>
            <View style={styles.statLine}>
              <Text style={styles.statLineLabel}>Patience Level</Text>
              <Text style={styles.statLineVal}>88/100</Text>
            </View>
            <View style={styles.statLine}>
              <Text style={styles.statLineLabel}>Banter Stamina</Text>
              <Text style={styles.statLineVal}>95/100</Text>
            </View>
            <View style={styles.statLine}>
              <Text style={styles.statLineLabel}>Boundary Setting</Text>
              <Text style={styles.statLineVal}>24/100</Text>
            </View>
          </View>

          <View style={[styles.rpgCard, { borderColor: 'rgba(255, 45, 85, 0.3)' }]}>
            <Text style={[styles.rpgName, { color: Colors.systemPink }]}>PARTNER PROFILE</Text>
            <View style={styles.statLine}>
              <Text style={styles.statLineLabel}>Double-Text Rate</Text>
              <Text style={[styles.statLineVal, { color: Colors.systemPink }]}>98/100</Text>
            </View>
            <View style={styles.statLine}>
              <Text style={styles.statLineLabel}>Late Night Stamina</Text>
              <Text style={[styles.statLineVal, { color: Colors.systemPink }]}>92/100</Text>
            </View>
            <View style={styles.statLine}>
              <Text style={styles.statLineLabel}>Vulnerability Guard</Text>
              <Text style={[styles.statLineVal, { color: Colors.systemPink }]}>70/100</Text>
            </View>
          </View>
        </View>
      );

    case 8:
      return (
        <View style={styles.actBody}>
          <View style={styles.highlightBox}>
            <View style={styles.boxHeaderRow}>
              <Zap size={13} color={Colors.systemBlue} />
              <Text style={styles.highlightTitle}>DIGITAL PACING & LATENCY</Text>
            </View>
            <Text style={styles.highlightBody}>
              {c.pacing_analysis || 'Sub-minute response tempo (0.5m median). Both parties keep notifications pinned.'}
            </Text>
          </View>

          <View style={[styles.highlightBox, { borderColor: 'rgba(255, 45, 85, 0.25)' }]}>
            <View style={styles.boxHeaderRow}>
              <Heart size={13} color={Colors.systemPink} />
              <Text style={[styles.highlightTitle, { color: Colors.systemPink }]}>
                DOUBLE-TEXT FLOOD PSYCHOLOGY
              </Text>
            </View>
            <Text style={styles.highlightBody}>
              {c.double_text_psychology || '6,481 double-texts from partner indicates massive conversational reliance.'}
            </Text>
          </View>
        </View>
      );

    case 10:
      return (
        <View style={styles.actBody}>
          <View style={styles.flagHeaderRow}>
            <ShieldAlert size={16} color={Colors.systemRed} />
            <Text style={styles.flagHeaderTitle}>CRITICAL RED FLAG RECEIPT</Text>
          </View>

          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <Text style={styles.receiptSeverity}>SEVERITY: 4/5</Text>
              <Text style={styles.receiptTime}>Late Night Turn</Text>
            </View>
            <Text style={styles.receiptQuote}>
              "{c.critical_red_flag || c.quote || 'Nuvvu naaku message cheyadam manesthe em cheyalo theleedu...'}"
            </Text>
            <View style={styles.receiptDivider} />
            <Text style={styles.receiptRoast}>
              {c.roast || c.forensic_commentary || 'Classic tactical reliance masked as friendly banter.'}
            </Text>
          </View>
        </View>
      );

    case 16:
      const awards = c.awards || [
        {
          title: 'The Olympic DM Olympian',
          recipient: 'Sleepless Zombiee',
          citation: 'Awarded for sending 6,481 double-texts without a single pause.',
        },
        {
          title: 'The Silent Sentry Award',
          recipient: 'You',
          citation: 'Awarded for surviving 35,000 texts with sub-minute response fidelity.',
        },
      ];

      return (
        <View style={styles.actBody}>
          <View style={styles.trophyHeader}>
            <Trophy size={24} color={Colors.systemBlue} />
            <Text style={styles.trophyTitle}>THE AWARDS CEREMONY</Text>
          </View>
          {awards.map((aw: any, i: number) => (
            <View key={i} style={styles.awardCard}>
              <Text style={styles.awardName}>🏆 {aw.title}</Text>
              <Text style={styles.awardRecip}>RECIPIENT: {aw.recipient.toUpperCase()}</Text>
              <Text style={styles.awardCite}>{aw.citation}</Text>
            </View>
          ))}
        </View>
      );

    case 17:
      return (
        <View style={styles.actBody}>
          <View style={styles.verdictCard}>
            <View style={styles.verdictHeader}>
              <Gavel size={16} color={Colors.systemBlue} />
              <Text style={styles.verdictLabel}>OFFICIAL COURT VERDICT</Text>
            </View>
            <Text style={styles.verdictText}>
              {c.definitive_ruling || 'GUILTY OF MUTUAL ROMANTIC DELUSION & CONVERSATIONAL ADDICTION'}
            </Text>
          </View>

          <View style={styles.blessingCard}>
            <Text style={styles.blessingLabel}>CLOSING VERDICT FROM DOCTOR ASSIFY</Text>
            <Text style={styles.blessingText}>
              "{c.closing_roast_or_blessing || 'Either confess over spicy food or prepare to spend another 39,000 texts sparring in the DM arena.'}"
            </Text>
          </View>
        </View>
      );

    default:
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
                JSON.stringify(c, null, 2)}
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
    padding: 24,
  },
  loadingText: {
    ...Typography.bodyMedium,
    color: Colors.systemGray,
    marginTop: 14,
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  tickPassed: {
    backgroundColor: Colors.systemBlue,
  },
  tickActive: {
    backgroundColor: '#FFFFFF',
    height: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 4,
  },
  actTagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.systemBlue,
  },
  closeBtn: {
    padding: 6,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  actCard: {
    flex: 1,
    backgroundColor: Colors.glassSurface,
    borderRadius: Radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
  },
  actHeaderRow: {
    marginBottom: 14,
  },
  actHeaderNumber: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.systemBlue,
    marginBottom: 2,
  },
  actHeaderName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: Colors.textPrimary,
  },
  actScrollView: {
    flex: 1,
  },
  actContentContainer: {
    paddingBottom: 16,
  },
  actBody: {
    gap: 12,
  },
  sectionSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.systemGray,
    textTransform: 'uppercase',
  },
  boxHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  highlightBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
  },
  highlightTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.systemBlue,
  },
  highlightBody: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textSecondary,
  },
  pairRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pairItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
  },
  pairLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.systemBlue,
    marginBottom: 4,
  },
  pairVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  quoteCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: Radius.md,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.systemBlue,
  },
  quoteLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.systemBlue,
    marginBottom: 4,
  },
  quoteText: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.systemGray,
    fontStyle: 'italic',
  },
  scoreHero: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: 8,
  },
  bigScore: {
    fontSize: 64,
    fontWeight: '800',
    color: Colors.systemPink,
    letterSpacing: -2,
  },
  bigScoreMax: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.systemGray,
    marginLeft: 4,
  },
  circusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 45, 85, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  circusTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.systemPink,
  },
  survivalOddsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: Radius.md,
    padding: 12,
    alignItems: 'center',
  },
  survivalOddsLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.systemGray,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  survivalOddsText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.systemGreen,
  },
  rpgCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
  },
  rpgName: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.systemBlue,
    marginBottom: 8,
  },
  statLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  statLineLabel: {
    fontSize: 12,
    color: Colors.systemGray,
  },
  statLineVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  flagHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flagHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.systemRed,
  },
  receiptCard: {
    backgroundColor: 'rgba(255, 59, 48, 0.06)',
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 59, 48, 0.25)',
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  receiptSeverity: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.systemRed,
  },
  receiptTime: {
    fontSize: 10,
    color: Colors.systemGray,
  },
  receiptQuote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  receiptDivider: {
    height: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 10,
  },
  receiptRoast: {
    fontSize: 12,
    color: Colors.systemGray,
    lineHeight: 17,
  },
  trophyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 6,
  },
  trophyTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: Colors.textPrimary,
  },
  awardCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 122, 255, 0.25)',
  },
  awardName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  awardRecip: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.systemGray,
    marginBottom: 4,
  },
  awardCite: {
    fontSize: 12,
    color: Colors.systemGray,
    lineHeight: 16,
  },
  verdictCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.08)',
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  verdictHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  verdictLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.systemBlue,
  },
  verdictText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  blessingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 0.5,
    borderColor: Colors.glassBorder,
  },
  blessingLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.systemPink,
    marginBottom: 4,
  },
  blessingText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 19,
    color: Colors.systemGray,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: Colors.glassBorder,
    paddingTop: 12,
    marginTop: 8,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.systemBlue,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    gap: 6,
  },
  shareText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  swipeHintText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.systemGray,
  },
});
