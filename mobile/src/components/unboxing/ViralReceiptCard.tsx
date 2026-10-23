import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
  Platform,
  AccessibilityProps,
} from 'react-native';
import { Share2, X, Sparkles, ShieldAlert, CheckCircle2, Lock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Radius } from '../../constants/theme';
import { SpringDeluluGauge } from './SpringDeluluGauge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 32, 380);
const CARD_HEIGHT = Math.round((CARD_WIDTH * 16) / 9); // Strict 9:16 aspect ratio

export interface ViralReceiptData {
  contactName: string;
  deluluScore: number;
  circusLevel: string;
  archetype: string;
  verdictSummary: string;
  initiationRatio: { user: number; contact: number };
  medianResponseTime: { user: string; contact: string };
  killingQuote: {
    quote: string;
    context?: string;
    gapDuration?: string;
  };
  caseId?: string;
}

interface ViralReceiptCardProps extends AccessibilityProps {
  data: ViralReceiptData;
  onClose?: () => void;
  onShareComplete?: () => void;
}

export const ViralReceiptCard: React.FC<ViralReceiptCardProps> = ({
  data,
  onClose,
  onShareComplete,
  ...accessibilityProps
}) => {
  const caseId = data.caseId || `AF-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleShare = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    try {
      const shareMessage = `🚨 My Relationship Forensic Audit on ASSIFY:
Score: ${data.deluluScore}% DELUSIONAL (${data.circusLevel})
Archetype: ${data.archetype}
Killing Receipt: "${data.killingQuote.quote}"

Check your score on ASSIFY: https://assify.app`;

      await Share.share({
        title: `ASSIFY Forensic Audit - ${data.contactName}`,
        message: shareMessage,
      });

      if (onShareComplete) onShareComplete();
    } catch (err) {
      console.warn('Share error:', err);
    }
  };

  return (
    <View style={styles.outerContainer} {...accessibilityProps}>
      {/* 9:16 Aspect Ratio Canvas */}
      <View style={[styles.canvas, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
        {/* Deep Obsidian Mesh Background */}
        <View style={styles.ambientMesh} />

        {/* Top Specular Liquid Border */}
        <View style={styles.topSpecularLine} />

        {/* Top Header Bar */}
        <View style={styles.header}>
          <View style={styles.dossierTag}>
            <Lock size={10} color={Colors.systemPink} style={{ marginRight: 4 }} />
            <Text style={styles.dossierSerial}>CASE #{caseId} // FORENSIC REPORT</Text>
          </View>
          {onClose ? (
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.selectionAsync();
                onClose();
              }}
              style={styles.closeBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Close receipt card"
            >
              <X size={16} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Subject Dossier Bar */}
        <View style={styles.subjectBar}>
          <Text style={styles.subjectLabel}>AUDIT OF RELATIONSHIP WITH</Text>
          <Text style={styles.subjectName} numberOfLines={1}>
            {data.contactName.toUpperCase()}
          </Text>
        </View>

        {/* Hero Gauge Section */}
        <View style={styles.gaugeContainer}>
          <SpringDeluluGauge
            score={data.deluluScore}
            size={180}
            strokeWidth={13}
            circusLevel={data.circusLevel}
          />
        </View>

        {/* Archetype & Verdict Banner */}
        <View style={styles.archetypeContainer}>
          <View style={styles.archetypeBadge}>
            <Sparkles size={11} color={Colors.systemPink} style={{ marginRight: 5 }} />
            <Text style={styles.archetypeText} numberOfLines={1}>
              {data.archetype.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.verdictText} numberOfLines={2}>
            "{data.verdictSummary}"
          </Text>
        </View>

        {/* 3 Hard Mathematical Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>INITIATION</Text>
            <Text style={styles.metricValue}>
              {data.initiationRatio.user}% / {data.initiationRatio.contact}%
            </Text>
            <Text style={styles.metricSub}>You vs Them</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>RESPONSE DELAY</Text>
            <Text style={styles.metricValue}>
              {data.medianResponseTime.contact}
            </Text>
            <Text style={styles.metricSub}>Their Median Wait</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>RISK LEVEL</Text>
            <Text
              style={[
                styles.metricValue,
                { color: data.deluluScore >= 70 ? Colors.systemPink : Colors.systemBlue },
              ]}
            >
              {data.deluluScore >= 75 ? 'CRITICAL' : data.deluluScore >= 50 ? 'ELEVATED' : 'STABLE'}
            </Text>
            <Text style={styles.metricSub}>Ghosting Threat</Text>
          </View>
        </View>

        {/* The Devastating Killing Receipt */}
        <View style={styles.receiptBox}>
          <View style={styles.receiptHeader}>
            <ShieldAlert size={12} color={Colors.systemPink} style={{ marginRight: 4 }} />
            <Text style={styles.receiptTag}>THE FATAL RECEIPT</Text>
            {data.killingQuote.gapDuration ? (
              <Text style={styles.receiptGap}>[GAP: {data.killingQuote.gapDuration}]</Text>
            ) : null}
          </View>
          <Text style={styles.receiptQuote} numberOfLines={2}>
            "{data.killingQuote.quote}"
          </Text>
        </View>

        {/* Footer & Watermark */}
        <View style={styles.footer}>
          <View style={styles.verificationRow}>
            <CheckCircle2 size={12} color={Colors.systemGreen} style={{ marginRight: 4 }} />
            <Text style={styles.verifiedText}>CERTIFIED FORENSICS // 0-LLM MATH ENGINE</Text>
          </View>
          <Text style={styles.watermark}>ASSIFY • RELATIONSHIP INTELLIGENCE OS</Text>
        </View>
      </View>

      {/* Floating High-Contrast Action Bar */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleShare}
          style={styles.shareBtn}
          accessibilityRole="button"
          accessibilityLabel="Export and share receipt card to Instagram or TikTok"
        >
          <Share2 size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.shareBtnText}>SHARE STORY RECEIPT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  canvas: {
    backgroundColor: '#07070A',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'space-between',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.60,
        shadowRadius: 28,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
      } as any,
    }),
  },
  ambientMesh: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 45, 85, 0.12)',
    filter: 'blur(50px)' as any,
  },
  topSpecularLine: {
    position: 'absolute',
    top: 0,
    left: '15%',
    right: '15%',
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.30)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dossierTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 45, 85, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 85, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  dossierSerial: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.systemPink,
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectBar: {
    marginTop: 2,
    alignItems: 'center',
  },
  subjectLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.45)',
    letterSpacing: 1.1,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    marginTop: 1,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -2,
  },
  archetypeContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  archetypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginBottom: 4,
  },
  archetypeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  verdictText: {
    fontSize: 12.5,
    fontWeight: '500',
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 17,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radius.sm,
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: 8.5,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.45)',
    letterSpacing: 0.6,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
    letterSpacing: -0.2,
  },
  metricSub: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.35)',
    marginTop: 1,
  },
  receiptBox: {
    backgroundColor: 'rgba(255, 45, 85, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 85, 0.20)',
    borderRadius: Radius.md,
    padding: 8,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  receiptTag: {
    fontSize: 8.5,
    fontWeight: '800',
    color: Colors.systemPink,
    letterSpacing: 0.8,
  },
  receiptGap: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.40)',
    marginLeft: 'auto',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  receiptQuote: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 16,
  },
  footer: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  verifiedText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.systemGreen,
    letterSpacing: 0.7,
  },
  watermark: {
    fontSize: 8,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.30)',
    letterSpacing: 1.0,
  },
  actionRow: {
    width: CARD_WIDTH,
    marginTop: 14,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.systemPink,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    minHeight: 48, // Accessibility target compliance
    ...Platform.select({
      ios: {
        shadowColor: Colors.systemPink,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.40,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
