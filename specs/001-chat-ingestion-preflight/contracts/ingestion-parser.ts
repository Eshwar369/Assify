/**
 * Assify WhatsApp Chat Ingestion & Pre-Flight Validation Contract
 * Feature: 001-chat-ingestion-preflight
 * Architecture: Clean Architecture / Domain Interface
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

export interface IChatIngestionService {
  /**
   * Ingests a raw file (either .txt string/buffer or .zip binary)
   * and runs the full pre-flight validation pipeline.
   */
  ingest(fileData: string | ArrayBuffer, fileName: string): Promise<ValidationResult>;

  /**
   * Parses and validates raw chat text directly.
   */
  parseText(rawText: string): ValidationResult;
}

