import type { ValidationResult, ParsedChatSummary } from './types.ts';
import { validateChatText } from './preflight-validator.ts';
import { extractChatTextFromZip } from './zip-extractor.ts';

export interface IChatIngestionService {
  ingest(fileData: string | Buffer | ArrayBuffer, fileName: string): Promise<ValidationResult>;
  parseText(rawText: string): ValidationResult;
}

export class ChatIngestionService implements IChatIngestionService {
  public parseText(rawText: string): ValidationResult {
    return validateChatText(rawText);
  }

  public async ingest(fileData: string | Buffer | ArrayBuffer, fileName: string): Promise<ValidationResult> {
    try {
      let textContent: string;

      const isZip = /\.zip$/i.test(fileName) || (Buffer.isBuffer(fileData) && fileData.readUInt32LE(0) === 0x04034b50);

      if (isZip) {
        const buffer = Buffer.isBuffer(fileData)
          ? fileData
          : Buffer.from(fileData as ArrayBuffer);
        textContent = extractChatTextFromZip(buffer);
      } else {
        if (typeof fileData === 'string') {
          textContent = fileData;
        } else if (Buffer.isBuffer(fileData)) {
          textContent = fileData.toString('utf8');
        } else {
          textContent = Buffer.from(fileData as ArrayBuffer).toString('utf8');
        }
      }

      return this.parseText(textContent);
    } catch (err: any) {
      if (err.message && err.message.startsWith('NO_TXT_IN_ARCHIVE')) {
        return {
          success: false,
          reason: 'NO_TXT_IN_ARCHIVE',
          message: 'The selected ZIP archive does not contain a valid chat text file.',
        };
      }

      return {
        success: false,
        reason: 'EMPTY_OR_UNREADABLE',
        message: 'Could not process the chat file. It may be corrupted or unreadable.',
      };
    }
  }
}
