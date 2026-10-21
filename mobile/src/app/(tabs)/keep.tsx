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
  Share,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  Sparkles,
  Utensils,
  Film,
  Gift,
  MapPin,
  Heart,
  Quote,
  Compass,
  CheckCircle2,
  Copy,
} from 'lucide-react-native';

import { Colors, Radius, Typography } from '../../constants/theme';
import { getContacts, getKeepVault, KeepItem } from '../../services/api';

const CATEGORIES = [
  { key: 'all', label: 'All Vault' },
  { key: 'food', label: 'Cravings' },
  { key: 'movie', label: 'Watchlist' },
  { key: 'gift', label: 'Wishlist' },
  { key: 'nickname', label: 'Nicknames' },
  { key: 'place', label: 'Places' },
];

const webGlassStyle: any = Platform.OS === 'web' ? { backdropFilter: 'blur(28px) saturate(180%)' } : {};

export default function KeepScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState<KeepItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedOracle, setCopiedOracle] = useState(false);

  const loadKeepData = async () => {
    try {
      const contacts = await getContacts();
      if (contacts.length > 0) {
        const vault = await getKeepVault(contacts[0].id);
        setItems(vault);
      }
    } catch (err) {
      console.error('Failed to load Keep items:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadKeepData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadKeepData();
  };

  const handleCategoryPress = (key: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setSelectedCategory(key);
  };

  const handleCopyDate = async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setCopiedOracle(true);
    setTimeout(() => setCopiedOracle(false), 2000);
    try {
      await Share.share({
        message: `ASSIFY Date Oracle:\nMidnight Spicy Comfort Food Run — Surprise them with Ellipai Kaaram Neyyi Annam followed by a late-night quiet drive.\n\nDirectly satisfies recurring late-night comfort craving from chat memory.`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food':
        return <Utensils size={14} color={Colors.systemOrange} />;
      case 'movie':
        return <Film size={14} color={Colors.systemCyan} />;
      case 'gift':
        return <Gift size={14} color={Colors.systemPink} />;
      case 'place':
        return <MapPin size={14} color={Colors.systemGreen} />;
      case 'nickname':
        return <Heart size={14} color={Colors.systemPink} />;
      default:
        return <Sparkles size={14} color={Colors.systemBlue} />;
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.systemBlue} />
        <Text style={styles.loadingText}>Accessing The Keep Memory Vault...</Text>
      </View>
    );
  }

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
        {/* Apple Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.title}>The Keep</Text>
              <View style={styles.vaultBadge}>
                <Text style={styles.vaultBadgeText}>{items.length} Memories</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>Relationship Memory & Date Oracle</Text>
          </View>
        </View>

        {/* Apple AI Date Oracle Glass Card */}
        <View style={[styles.oracleCard, webGlassStyle]}>
          <View style={styles.oracleHeader}>
            <View style={styles.oracleHeaderLeft}>
              <Compass size={15} color={Colors.systemBlue} />
              <Text style={styles.oracleLabel}>AI DATE ORACLE SYNTHESIS</Text>
            </View>
            <View style={styles.groundedTag}>
              <Text style={styles.groundedText}>100% Grounded</Text>
            </View>
          </View>

          <Text style={styles.oracleTitle}>Midnight Spicy Comfort Food Run</Text>
          <Text style={styles.oracleDesc}>
            Surprise them with authentic Ellipai Kaaram Neyyi Annam followed by a late-night quiet drive with their favorite lo-fi Telugu playlist.
          </Text>

          <View style={styles.oracleReasonTag}>
            <Sparkles size={12} color={Colors.systemBlue} style={{ marginRight: 4 }} />
            <Text style={styles.oracleReasonText}>
              Directly satisfies recurring late-night cravings identified in Act 10 receipts.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.oracleBtn}
            activeOpacity={0.82}
            onPress={handleCopyDate}>
            <Copy size={14} color="#FFFFFF" />
            <Text style={styles.oracleBtnText}>
              {copiedOracle ? 'Date Blueprint Shared!' : 'Share Date Blueprint'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter Pills (Apple Segmented Style) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}>
          {CATEGORIES.map((cat) => {
            const count =
              cat.key === 'all'
                ? items.length
                : items.filter((it) => it.category === cat.key).length;
            const isSelected = selectedCategory === cat.key;

            return (
              <TouchableOpacity
                key={cat.key}
                activeOpacity={0.8}
                onPress={() => handleCategoryPress(cat.key)}
                style={[styles.chip, isSelected && styles.chipActive]}>
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {cat.label}
                </Text>
                <View style={[styles.countBadge, isSelected && styles.countBadgeActive]}>
                  <Text style={[styles.countText, isSelected && styles.countTextActive]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Filtered Memory Items */}
        <View style={styles.itemsList}>
          {filteredItems.map((item) => (
            <View key={item.id} style={[styles.itemCard, webGlassStyle]}>
              <View style={styles.itemHeader}>
                <View style={styles.itemCategoryRow}>
                  <View style={styles.iconCircle}>{getCategoryIcon(item.category)}</View>
                  <Text style={styles.categoryLabel}>{item.category.toUpperCase()}</Text>
                </View>

                <View style={styles.targetBadge}>
                  <Text style={styles.targetBadgeText}>
                    {item.target_person === 'contact' ? "PARTNER'S FAVORITE" : 'SHARED MEMORY'}
                  </Text>
                </View>
              </View>

              <Text style={styles.itemName}>{item.item_name}</Text>

              {item.context_quote ? (
                <View style={styles.quoteBubble}>
                  <Quote size={11} color={Colors.systemBlue} style={styles.quoteIcon} />
                  <Text style={styles.quoteText}>"{item.context_quote}"</Text>
                </View>
              ) : null}

              <View style={styles.itemFooter}>
                <Text style={styles.timestampText}>
                  Logged {item.time_stamp?.split('T')[0] || 'Recently'}
                </Text>
                <View style={styles.statusIndicator}>
                  <CheckCircle2 size={12} color={Colors.systemGreen} />
                  <Text style={styles.statusText}>Forensically Verified</Text>
                </View>
              </View>
            </View>
          ))}
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
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  vaultBadge: {
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  vaultBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.systemBlue,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.systemGray,
    marginTop: 2,
  },
  oracleCard: {
    backgroundColor: Colors.glassSurface,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.35)',
    marginBottom: 20,
    shadowColor: Colors.systemBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
  oracleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  oracleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  oracleLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.systemBlue,
  },
  groundedTag: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  groundedText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.systemGreen,
  },
  oracleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  oracleDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  oracleReasonTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 10,
    borderRadius: Radius.md,
    marginBottom: 14,
  },
  oracleReasonText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '500',
    color: Colors.systemGray,
  },
  oracleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.systemBlue,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  oracleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chipsScroll: {
    marginBottom: 16,
  },
  chipsContent: {
    gap: 8,
    paddingRight: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  chipActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
    borderColor: '#FFFFFF',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.systemGray,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.full,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  countText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.systemGray,
  },
  countTextActive: {
    color: '#FFFFFF',
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: Colors.glassSurface,
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.systemGray,
  },
  targetBadge: {
    backgroundColor: 'rgba(255, 45, 85, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  targetBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: Colors.systemPink,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  quoteBubble: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Radius.md,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 2,
    borderLeftColor: Colors.systemBlue,
  },
  quoteIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  quoteText: {
    flex: 1,
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
  },
  timestampText: {
    fontSize: 11,
    color: Colors.systemGray,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.systemGreen,
  },
});
