import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { UploadCloud, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react-native';
import { Colors, Radius, Typography, Spacing } from '../constants/theme';

interface WhatsAppDropzoneProps {
  onFileSelect?: (file: { name: string; content?: string }) => void;
  vibeMode: 'therapy' | 'unhinged';
  onVibeModeChange: (mode: 'therapy' | 'unhinged') => void;
  isAnalyzing?: boolean;
}

export const WhatsAppDropzone: React.FC<WhatsAppDropzoneProps> = ({
  onFileSelect,
  vibeMode,
  onVibeModeChange,
  isAnalyzing = false,
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleSelectFile = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // Haptics fallback
      }
    }
    const mockFileName = '_chat_sleepless_zombiee.txt';
    setSelectedFileName(mockFileName);
    if (onFileSelect) {
      onFileSelect({ name: mockFileName });
    }
  };

  const handleVibeToggle = (mode: 'therapy' | 'unhinged') => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Haptics fallback
      }
    }
    onVibeModeChange(mode);
  };

  return (
    <View style={styles.card}>
      {/* Apple Native Segmented Control */}
      <View style={styles.segmentedWrapper}>
        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleVibeToggle('therapy')}
            style={[
              styles.segmentItem,
              vibeMode === 'therapy' && styles.segmentItemActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                vibeMode === 'therapy' && styles.segmentTextActive,
              ]}
            >
              Therapy Mode
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleVibeToggle('unhinged')}
            style={[
              styles.segmentItem,
              vibeMode === 'unhinged' && styles.segmentItemActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                vibeMode === 'unhinged' && styles.segmentTextActive,
              ]}
            >
              Unhinged Roast
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upload Zone */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSelectFile}
        disabled={isAnalyzing}
        style={[
          styles.dropzone,
          selectedFileName ? styles.dropzoneSelected : null,
        ]}
      >
        {isAnalyzing ? (
          <View style={styles.analyzingWrapper}>
            <ActivityIndicator size="small" color={Colors.accentGold} />
            <Text style={styles.analyzingText}>Scrubbing PII & crunching latencies...</Text>
          </View>
        ) : selectedFileName ? (
          <View style={styles.selectedWrapper}>
            <CheckCircle2 size={32} color={Colors.systemGreen} />
            <Text style={styles.selectedText}>{selectedFileName}</Text>
            <Text style={styles.selectedSub}>Tap to replace transcript</Text>
          </View>
        ) : (
          <View style={styles.idleWrapper}>
            <View style={styles.iconCircle}>
              <UploadCloud size={24} color={Colors.textPrimary} />
            </View>
            <Text style={styles.dropzoneTitle}>Upload WhatsApp or iMessage Export</Text>
            <Text style={styles.dropzoneSubtitle}>
              Export without media • .txt or .zip format
            </Text>

            <View style={styles.badgeRow}>
              <View style={styles.applePill}>
                <ShieldCheck size={12} color={Colors.systemGreen} style={{ marginRight: 4 }} />
                <Text style={styles.applePillText}>Zero-Trust PII Masking</Text>
              </View>
              <View style={styles.applePill}>
                <Sparkles size={12} color={Colors.accentGold} style={{ marginRight: 4 }} />
                <Text style={styles.applePillText}>17 Psychological Acts</Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: Radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderCard,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      } as any,
    }),
  },
  segmentedWrapper: {
    marginBottom: 16,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBackground,
    borderRadius: Radius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  segmentItemActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
      } as any,
    }),
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textTertiary,
  },
  segmentTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  dropzone: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.borderCard,
    borderRadius: Radius.md,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondaryBackground,
  },
  dropzoneSelected: {
    borderColor: Colors.systemGreen,
    backgroundColor: 'rgba(52, 199, 89, 0.04)',
    borderStyle: 'solid',
  },
  idleWrapper: {
    alignItems: 'center',
  },
  analyzingWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  analyzingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 10,
  },
  selectedWrapper: {
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  selectedSub: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dropzoneTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  dropzoneSubtitle: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  applePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderHairline,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  applePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
