import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Platform,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  Gift,
  Film,
  Utensils,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Sparkles,
  Bookmark,
} from 'lucide-react-native';

import { Colors, Radius } from '@/constants/theme';
import {
  ScreenContainer,
  AppHeader,
  ReceiptQuote,
  EditorialSection,
  AppleElevatedCard,
} from '@/components/ui';
import { getContacts, getKeepVault, KeepItem } from '@/services/api';

const CATEGORIES = [
  { key: 'all', label: 'All Vault' },
  { key: 'gift', label: '🎁 Gift Wishlist' },
  { key: 'food', label: '🍕 Food & Dining' },
  { key: 'movie', label: '🎬 Watchlist' },
  { key: 'place', label: '📍 Date Spots' },
  { key: 'dislike', label: '🚫 Red Lines' },
];

const DEFAULT_VAULT_ITEMS: KeepItem[] = [
  {
    id: 1,
    contact_id: 'default',
    category: 'gift',
    item_name: 'Vintage Leather Journal / Sketchbook',
    context_quote: 'Omg that leather journal you posted... I’ve been looking for one with handmade paper forever!!',
    time_stamp: 'Sept 18th',
    status: 'pending',
    target_person: 'contact',
    ai_generated: 1,
  },
  {
    id: 2,
    contact_id: 'default',
    category: 'food',
    item_name: 'Late Night Spicy Ramen & Boba',
    context_quote: 'If someone brought me spicy tonkotsu ramen and taro milk tea right now I would marry them on the spot.',
    time_stamp: 'Oct 3rd, 1:14 AM',
    status: 'pending',
    target_person: 'contact',
    ai_generated: 1,
  },
  {
    id: 3,
    contact_id: 'default',
    category: 'movie',
    item_name: 'Past Lives (2023)',
    context_quote: 'We HAVE to watch Past Lives together sometime, apparently the ending destroys you.',
    time_stamp: 'Aug 29th',
    status: 'pending',
    target_person: 'both',
    ai_generated: 1,
  },
  {
    id: 4,
    contact_id: 'default',
    category: 'place',
    item_name: 'The Hidden Rooftop Botanical Cafe',
    context_quote: 'Look at this rooftop garden cafe! We are 100% going here on Saturday.',
    time_stamp: 'Oct 8th',
    status: 'pending',
    target_person: 'both',
    ai_generated: 1,
  },
  {
    id: 5,
    contact_id: 'default',
    category: 'dislike',
    item_name: 'Crowded Loud Clubs & Bad Tequila',
    context_quote: 'I swear if anyone drags me to another loud techno club I will literally disappear into the night.',
    time_stamp: 'Sept 12th',
    status: 'pending',
    target_person: 'contact',
    ai_generated: 1,
  },
];

export default function KeepScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState<KeepItem[]>(DEFAULT_VAULT_ITEMS);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadKeepData = async () => {
    try {
      const contacts = await getContacts();
      if (contacts.length > 0) {
        const vault = await getKeepVault(contacts[0].id);
        if (vault && vault.length > 0) {
          setItems(vault);
        }
      }
    } catch (err) {
      console.warn('Loading fallback Keep items:', err);
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
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Haptics fallback
      }
    }
    loadKeepData();
  };

  const handleCategoryPress = (key: string) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Haptics fallback
      }
    }
    setSelectedCategory(key);
  };

  const handleToggleComplete = (id: number) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Haptics fallback
      }
    }
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'gift':
        return <Gift size={16} color={Colors.accentGold} />;
      case 'food':
        return <Utensils size={16} color={Colors.accentRose} />;
      case 'movie':
        return <Film size={16} color={Colors.textPrimary} />;
      case 'place':
        return <MapPin size={16} color={Colors.accentGold} />;
      case 'dislike':
        return <AlertTriangle size={16} color={Colors.accentDanger} />;
      default:
        return <Bookmark size={16} color={Colors.textTertiary} />;
    }
  };

  return (
    <ScreenContainer
      header={
        <AppHeader
          title="The Keep"
          subtitle="Partner Vault & Receipts"
          activePartner="Sarah"
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
      {/* Hero Overview */}
      <View style={styles.heroSection}>
        <View style={styles.heroHeader}>
          <View style={styles.statusBadge}>
            <Sparkles size={12} color={Colors.accentGold} style={{ marginRight: 4 }} />
            <Text style={styles.statusBadgeText}>AUTOMATED VAULT</Text>
          </View>
          <Text style={styles.vaultCounter}>
            {completedIds.size}/{items.length} Completed
          </Text>
        </View>

        <Text style={styles.heroTitle}>Partner Preferences Ledger</Text>
        <Text style={styles.heroSub}>
          Everything Sarah casually mentioned in conversation: wishlist items, date spots, food cravings, and red lines mined with verified chat receipts.
        </Text>
      </View>

      {/* Category Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              activeOpacity={0.8}
              onPress={() => handleCategoryPress(cat.key)}
              style={[styles.filterPill, active && styles.filterPillActive]}
            >
              <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Keep Items Feed */}
      <EditorialSection title="Captured Preferences">
        <View style={styles.itemsList}>
          {filteredItems.map((item) => {
            const isCompleted = completedIds.has(item.id);

            return (
              <AppleElevatedCard
                key={item.id}
                style={styles.itemCard}
                accentVariant={isCompleted ? 'success' : 'none'}
              >
                <View style={styles.itemTopRow}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleToggleComplete(item.id)}
                    style={styles.checkboxTouch}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={22} color={Colors.systemGreen} />
                    ) : (
                      <Circle size={22} color={Colors.borderCard} />
                    )}
                  </TouchableOpacity>

                  <View style={styles.itemTitleContainer}>
                    <View style={styles.itemCategoryRow}>
                      {getCategoryIcon(item.category)}
                      <Text style={styles.itemCategoryLabel}>
                        {item.category.toUpperCase()}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.itemName,
                        isCompleted && styles.itemNameCompleted,
                      ]}
                    >
                      {item.item_name}
                    </Text>
                  </View>
                </View>

                {/* Unified Borderless ReceiptQuote */}
                <ReceiptQuote
                  quote={item.context_quote}
                  timestamp={item.time_stamp}
                  accentVariant={isCompleted ? 'neutral' : 'gold'}
                />
              </AppleElevatedCard>
            );
          })}
        </View>
      </EditorialSection>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  vaultCounter: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  heroTitle: {
    fontSize: 22,
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
  filterScroll: {
    marginBottom: 24,
  },
  filterContent: {
    gap: 8,
    paddingVertical: 4,
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
  itemsList: {
    gap: 16,
  },
  itemCard: {
    padding: 16,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  checkboxTouch: {
    marginRight: 12,
    marginTop: 2,
  },
  itemTitleContainer: {
    flex: 1,
  },
  itemCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  itemCategoryLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.textTertiary,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  itemNameCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textTertiary,
  },
});
