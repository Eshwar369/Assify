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
} from 'lucide-react-native';

import { Colors, Typography } from '../../constants/theme';
import { getContacts, getKeepVault, KeepItem } from '../../services/api';

const CATEGORIES = [
  { key: 'all', label: 'All Vault' },
  { key: 'food', label: 'Cravings' },
  { key: 'movie', label: 'Watchlist' },
  { key: 'gift', label: 'Wishlist' },
  { key: 'nickname', label: 'Nicknames' },
  { key: 'place', label: 'Places' },
];

export default function KeepScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState<KeepItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food':
        return <Utensils size={14} color={Colors.accentYellow} />;
      case 'movie':
        return <Film size={14} color={Colors.accentCyan} />;
      case 'gift':
        return <Gift size={14} color={Colors.accentRose} />;
      case 'place':
        return <MapPin size={14} color={Colors.accentGreen} />;
      case 'nickname':
        return <Heart size={14} color={Colors.accentRose} />;
      default:
        return <Sparkles size={14} color={Colors.accentYellow} />;
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.accentYellow} />
        <Text style={styles.loadingText}>Unlocking The Keep Memory Vault...</Text>
      </View>
    );
  }

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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.title}>THE KEEP</Text>
              <View style={styles.vaultBadge}>
                <Text style={styles.vaultBadgeText}>{items.length} MEMORIES</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>Curated Relationship Memory & Oracle</Text>
          </View>
        </View>

        {/* DATE ORACLE HERO CARD */}
        <View style={styles.oracleCard}>
          <View style={styles.oracleHeader}>
            <Compass size={16} color={Colors.accentYellow} />
            <Text style={styles.oracleLabel}>AI DATE ORACLE RECOMMENDATION</Text>
          </View>
          <Text style={styles.oracleTitle}>Midnight Spicy Comfort Food Run</Text>
          <Text style={styles.oracleDesc}>
            Surprise them with authentic Ellipai Kaaram Neyyi Annam followed by a late-night quiet drive.
          </Text>
          <View style={styles.oracleReasonTag}>
            <Text style={styles.oracleReasonText}>Directly satisfies recurring late-night comfort craving</Text>
          </View>
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => handleCategoryPress(cat.key)}>
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Keep Memory Cards */}
        <View style={styles.cardList}>
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.memoryCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.categoryBadge}>
                  {getCategoryIcon(item.category)}
                  <Text style={styles.categoryBadgeText}>
                    {item.category.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.targetBadge}>
                  <Text style={styles.targetBadgeText}>
                    {item.target_person === 'contact' ? 'FOR HER' : 'FOR YOU'}
                  </Text>
                </View>
              </View>

              <Text style={styles.itemName}>{item.item_name}</Text>

              {item.context_quote ? (
                <View style={styles.quoteRow}>
                  <Quote size={12} color={Colors.textTertiary} style={styles.quoteIcon} />
                  <Text style={styles.contextQuote}>"{item.context_quote}"</Text>
                </View>
              ) : null}

              {item.time_stamp ? (
                <Text style={styles.timestampText}>
                  Captured: {item.time_stamp.replace('T', ' ').slice(0, 16)}
                </Text>
              ) : null}
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 10,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    marginTop: 14,
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
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  vaultBadge: {
    backgroundColor: 'rgba(255, 214, 10, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  vaultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.accentYellow,
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  oracleCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 214, 10, 0.25)',
    marginBottom: 16,
  },
  oracleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  oracleLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.accentYellow,
  },
  oracleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  oracleDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  oracleReasonTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  oracleReasonText: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  chipsScroll: {
    marginBottom: 16,
  },
  chipsContent: {
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  chipActive: {
    backgroundColor: Colors.accentYellow,
    borderColor: Colors.accentYellow,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: '#08090E',
    fontWeight: '700',
  },
  cardList: {
    gap: 12,
  },
  memoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 0.6,
  },
  targetBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  targetBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  quoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceElevated,
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
  },
  quoteIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  contextQuote: {
    flex: 1,
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  timestampText: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 6,
  },
});
