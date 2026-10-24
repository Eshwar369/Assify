import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as DocumentPicker from 'expo-document-picker';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { UploadCloud, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react-native';
import { Colors, Radius, Typography, Spacing } from '../constants/theme';

export interface PickedFileInfo {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

interface WhatsAppDropzoneProps {
  onFileSelect?: (file: PickedFileInfo) => void;
  vibeMode: 'therapy' | 'unhinged';
  onVibeModeChange: (mode: 'therapy' | 'unhinged') => void;
  isAnalyzing?: boolean;
  progress?: number;
  currentStep?: string;
}

export const WhatsAppDropzone: React.FC<WhatsAppDropzoneProps> = ({
  onFileSelect,
  vibeMode,
  onVibeModeChange,
  isAnalyzing = false,
  progress = 0,
  currentStep = 'Preparing chat archive...',
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<number | undefined>(undefined);

  // Animated progress bar on the UI thread (animate-expo compliance)
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    if (isAnalyzing) {
      const target = Math.min(100, Math.max(5, progress));
      animatedProgress.set(
        withTiming(target, {
          duration: 400,
          easing: Easing.bezier(0.23, 1, 0.32, 1),
        })
      );
    } else {
      animatedProgress.set(0);
    }
  }, [isAnalyzing, progress]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.get()}%`,
  }));

  const handleSelectFile = async () => {
    if (isAnalyzing) return;

    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Haptics fallback
      }
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'application/zip', 'application/x-zip-compressed'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedFileName(asset.name);
        setSelectedFileSize(asset.size);

        if (Platform.OS !== 'web') {
          try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch {
            // Haptics fallback
          }
        }

        if (onFileSelect) {
          onFileSelect({
            uri: asset.uri,
            name: asset.name,
            size: asset.size,
            mimeType: asset.mimeType,
          });
        }
      }
    } catch (err) {
      console.error('Document picker error:', err);
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
          isAnalyzing ? styles.dropzoneAnalyzing : null,
        ]}
      >
        {isAnalyzing ? (
          <View style={styles.analyzingWrapper}>
            <View style={styles.analyzingHeaderRow}>
              <View style={styles.analyzingBadge}>
                <ActivityIndicator size="small" color={Colors.accentGold} style={{ marginRight: 6 }} />
                <Text style={styles.analyzingBadgeText}>PROCESSING PIPELINE</Text>
              </View>
              <Text style={styles.progressPercentText}>{Math.round(progress)}%</Text>
            </View>

            {/* Native Reanimated Progress Bar */}
            <View style={styles.progressBarTrack}>
              <Animated.View style={[styles.progressBarFill, progressBarStyle]} />
            </View>

            <Text style={styles.currentStepText} numberOfLines={2}>
              {currentStep}
            </Text>
          </View>
        ) : selectedFileName ? (
          <View style={styles.selectedWrapper}>
            <CheckCircle2 size={32} color={Colors.systemGreen} />
            <Text style={styles.selectedText}>{selectedFileName}</Text>
            {selectedFileSize ? (
              <Text style={styles.selectedSize}>{formatFileSize(selectedFileSize)}</Text>
            ) : null}
            <Text style={styles.selectedSub}>Tap to select a different chat export</Text>
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
  dropzoneAnalyzing: {
    borderColor: Colors.accentGold,
    backgroundColor: 'rgba(191, 155, 40, 0.03)',
    borderStyle: 'solid',
    paddingVertical: 20,
  },
  idleWrapper: {
    alignItems: 'center',
  },
  analyzingWrapper: {
    width: '100%',
    paddingHorizontal: 8,
  },
  analyzingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  analyzingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyzingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Colors.accentGold,
  },
  progressPercentText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.borderHairline,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accentGold,
    borderRadius: Radius.full,
  },
  currentStepText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    textAlign: 'center',
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
  selectedSize: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textTertiary,
    marginTop: 2,
  },
  selectedSub: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 4,
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
