import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Colors } from '@/constants/theme';

export interface ReceiptQuoteProps {
  quote: string;
  timestamp?: string;
  label?: string;
  accentVariant?: 'gold' | 'rose' | 'neutral';
  style?: StyleProp<ViewStyle>;
}

export function ReceiptQuote({
  quote,
  timestamp,
  label = 'VERIFIED CHAT RECEIPT',
  accentVariant = 'gold',
  style,
}: ReceiptQuoteProps) {
  const getBorderColor = () => {
    switch (accentVariant) {
      case 'rose':
        return Colors.accentRose;
      case 'neutral':
        return Colors.textTertiary;
      default:
        return Colors.accentGold;
    }
  };

  return (
    <View style={[styles.container, { borderLeftColor: getBorderColor() }, style]}>
      {(label || timestamp) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
        </View>
      )}
      <Text style={styles.quote}>"{quote}"</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    borderLeftWidth: 2.5,
    paddingVertical: 4,
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.accentGold,
  },
  timestamp: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  quote: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
    color: Colors.textPrimary,
  },
});
