/**
 * Assify WhatsApp Ingestion Domain Types
 * Principle: Model Primacy (Zero Shortcuts, Single Source of Truth)
 */

export type RejectionReason =
  | 'TOO_FEW_MESSAGES'
  | 'INVALID_PARTICIPANT_COUNT'
  | 'EMPTY_OR_UNREADABLE'
  | 'NO_TXT_IN_ARCHIVE';

export interface ChronemicMetrics {
  userResponseTimeMins: number;
  partnerResponseTimeMins: number;
  userDoubleTexts: number;
  partnerDoubleTexts: number;
  userMessageCount: number;
  partnerMessageCount: number;
}

export interface ParsedChatSummary {
  participants: [string, string];
  messageCount: number;
  dateRange: {
    start: string; // ISO 8601
    end: string;   // ISO 8601
  };
  cleanedChatText: string;
  metrics: ChronemicMetrics;
}

export type ValidationResult =
  | {
      success: true;
      summary: ParsedChatSummary;
    }
  | {
      success: false;
      reason: RejectionReason;
      rawCount?: number;
      participantCount?: number;
      message: string;
    };

export interface RawParsedLine {
  dateStr: string;
  timeStr: string;
  sender: string;
  message: string;
  isSystem: boolean;
}
