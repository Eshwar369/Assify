import type { ChronemicMetrics } from './types.ts';

const DOUBLE_TEXT_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
const NIGHT_GAP_THRESHOLD_MS = 12 * 60 * 60 * 1000; // 12 hours

export class ChronemicsAccumulator {
  private user: string;
  private partner: string;

  private userMessageCount = 0;
  private partnerMessageCount = 0;

  private userDoubleTexts = 0;
  private partnerDoubleTexts = 0;

  private userResponseDeltas: number[] = [];
  private partnerResponseDeltas: number[] = [];

  private lastSender: string | null = null;
  private lastMessageTime: Date | null = null;

  constructor(user: string, partner: string) {
    this.user = user;
    this.partner = partner;
  }

  public addMessage(sender: string, timestamp: Date): void {
    const isUser = sender === this.user;
    const isPartner = sender === this.partner;

    if (!isUser && !isPartner) return;

    if (isUser) {
      this.userMessageCount++;
    } else {
      this.partnerMessageCount++;
    }

    if (this.lastSender !== null && this.lastMessageTime !== null) {
      const deltaMs = timestamp.getTime() - this.lastMessageTime.getTime();

      if (deltaMs >= 0) {
        if (sender === this.lastSender) {
          // Double text burst
          if (deltaMs >= DOUBLE_TEXT_THRESHOLD_MS) {
            if (isUser) this.userDoubleTexts++;
            else this.partnerDoubleTexts++;
          }
        } else {
          // Turn change: reply latency
          if (deltaMs <= NIGHT_GAP_THRESHOLD_MS) {
            const deltaMins = Math.round(deltaMs / (60 * 1000));
            if (isUser) {
              this.userResponseDeltas.push(deltaMins);
            } else {
              this.partnerResponseDeltas.push(deltaMins);
            }
          }
        }
      }
    }

    this.lastSender = sender;
    this.lastMessageTime = timestamp;
  }

  private calculateMedian(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 !== 0) {
      return sorted[mid];
    }
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }

  public getMetrics(): ChronemicMetrics {
    return {
      userResponseTimeMins: this.calculateMedian(this.userResponseDeltas),
      partnerResponseTimeMins: this.calculateMedian(this.partnerResponseDeltas),
      userDoubleTexts: this.userDoubleTexts,
      partnerDoubleTexts: this.partnerDoubleTexts,
      userMessageCount: this.userMessageCount,
      partnerMessageCount: this.partnerMessageCount,
    };
  }
}
