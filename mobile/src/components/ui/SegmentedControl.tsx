import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ViewStyle,
  StyleProp,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LucideIcon } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

export interface SegmentOption {
  key: string;
  label: string;
  icon?: LucideIcon;
}

export interface SegmentedControlProps {
  options: (string | SegmentOption)[];
  value: string;
  onChange: (key: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  style,
}: SegmentedControlProps) {
  const normalizedOptions: SegmentOption[] = options.map((opt) =>
    typeof opt === 'string' ? { key: opt, label: opt } : opt
  );

  const handleSelect = (key: string) => {
    if (key === value) return;
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Haptics fallback
      }
    }
    onChange(key);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.track}>
        {normalizedOptions.map((opt) => {
          const active = opt.key === value;
          const Icon = opt.icon;

          return (
            <TouchableOpacity
              key={opt.key}
              activeOpacity={0.8}
              onPress={() => handleSelect(opt.key)}
              style={[styles.tab, active && styles.tabActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
            >
              {Icon && (
                <Icon
                  size={13}
                  color={active ? Colors.textPrimary : Colors.textTertiary}
                  style={{ marginRight: 6 }}
                />
              )}
              <Text
                style={[styles.label, active && styles.labelActive]}
                numberOfLines={1}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  track: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
      } as any,
    }),
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textTertiary,
    letterSpacing: -0.1,
  },
  labelActive: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
