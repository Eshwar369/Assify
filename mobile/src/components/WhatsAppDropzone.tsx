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
import { Colors, Radius, Typography } from '../constants/theme';

interface WhatsAppDropzoneProps {
  onFileSelect?: (file: { name: string; content?: string }) => void;
  vibeMode: 'therapy' | 'unhinged';
  onVibeModeChange: (mode: 'therapy' | 'unhinged') => void;
  isAnalyzing?: boolean;
}

const webGlassStyle: any = Platform.OS === 'web' ? { backdropFilter: 'blur(25px) saturate(180%)' } : {};

export const WhatsAppDropzone: React.FC<WhatsAppDropzoneProps> = ({
  onFileSelect,
  vibeMode,
  onVibeModeChange,
  isAnalyzing = false,
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleSelectFile = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const mockFileName = '_chat_sleepless_zombiee.txt';
    setSelectedFileName(mockFileName);
    if (onFileSelect) {
      onFileSelect({ name: mockFileName });
    }
  };

  const handleVibeToggle = (mode: 'therapy' | 'unhinged') => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onVibeModeChange(mode);
  };

  return (
    <View style={[styles.card, webGlassStyle]}>
      {/* Apple Native Segmented Control */}
      <View style={styles.segmentedWrapper}>
        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleVibeToggle('therapy')}
            style={[
              styles.segmentItem,
              vibeMode === 'therapy' && styles.segmentItemActive,
            ]}>
            <Text
              style={[
                styles.segmentText,
                vibeMode === 'therapy' && styles.segmentTextActive,
              ]}>
              Therapy Mode
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleVibeToggle('unhinged')}
            style={[
              styles.segmentItem,
              vibeMode === 'unhinged' && styles.segmentItemActive,
            ]}>
            <Text
              style={[
                styles.segmentText,
                vibeMode === 'unhinged' && styles.segmentTextActive,
              ]}>
              Unhinged Mode
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Apple Liquid Glass Dropzone Target */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSelectFile}
        disabled={isAnalyzing}
        style={[
          styles.dropzone,
          selectedFileName ? styles.dropzoneSelected : null,
        ]}>
        <View style={styles.iconCircle}>
          {isAnalyzing ? (
            <ActivityIndicator size="small" color={Colors.systemBlue} />
          ) : selectedFileName ? (
            <CheckCircle2 size={24} color={Colors.systemGreen} />
          ) : (
            <UploadCloud size={24} color={Colors.systemBlue} />
          )}
        </View>

        <Text style={styles.dropzoneTitle}>
          {selectedFileName ? selectedFileName : 'Import WhatsApp Conversation (.txt)'}
        </Text>
        <Text style={styles.dropzoneSubtitle}>
          {selectedFileName
            ? 'Conversation loaded • 39,154 verified messages ready'
            : 'Tap to browse exported file or share directly from WhatsApp'}
        </Text>

        <View style={styles.badgeRow}>
          <View style={styles.applePill}>
            <ShieldCheck size={11} color={Colors.systemGreen} style={{ marginRight: 4 }} />
            <Text style={styles.applePillText}>100% Local SQLite</Text>
          </View>
          <View style={styles.applePill}>
            <Sparkles size={11} color={Colors.systemBlue} style={{ marginRight: 4 }} />
            <Text style={styles.applePillText}>Zero Cloud Storage</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.glassSurface,
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
  },
  segmentedWrapper: {
    marginBottom: 16,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(120, 120, 128, 0.20)',
    borderRadius: Radius.full,
    padding: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  segmentItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.systemGray,
    letterSpacing: -0.1,
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dropzone: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: Radius.lg,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  dropzoneSelected: {
    borderColor: 'rgba(52, 199, 89, 0.4)',
    backgroundColor: 'rgba(52, 199, 89, 0.06)',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dropzoneTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  dropzoneSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.systemGray,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 17,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  applePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  applePillText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.systemGray,
  },
});
