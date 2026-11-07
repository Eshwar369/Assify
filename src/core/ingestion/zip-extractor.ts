import zlib from 'node:zlib';

/**
 * Assify In-Memory ZIP Extractor
 * Locates the chat text file and decompresses it entirely in RAM.
 * Guarantees 0 bytes of media (photos/audio/stickers) touch disk storage.
 */
export function extractChatTextFromZip(buffer: Buffer): string {
  if (!buffer || buffer.length < 22) {
    throw new Error('NO_TXT_IN_ARCHIVE: Invalid or truncated zip archive');
  }

  let offset = 0;
  let chatTextContent: string | null = null;

  while (offset < buffer.length - 30) {
    const signature = buffer.readUInt32LE(offset);
    if (signature !== 0x04034b50) {
      // Not a local file header, might be central directory header or padding
      break;
    }

    const compressionMethod = buffer.readUInt16LE(offset + 8);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const uncompressedSize = buffer.readUInt32LE(offset + 22);
    const fileNameLength = buffer.readUInt16LE(offset + 26);
    const extraFieldLength = buffer.readUInt16LE(offset + 28);

    const fileNameStart = offset + 30;
    const fileName = buffer.toString('utf8', fileNameStart, fileNameStart + fileNameLength);

    const dataStart = fileNameStart + fileNameLength + extraFieldLength;
    const dataEnd = dataStart + compressedSize;

    if (/\.txt$/i.test(fileName)) {
      const compressedData = buffer.subarray(dataStart, dataEnd);
      if (compressionMethod === 0) {
        // Stored (uncompressed)
        chatTextContent = compressedData.toString('utf8');
      } else if (compressionMethod === 8) {
        // Deflated
        const decompressed = zlib.inflateRawSync(compressedData);
        chatTextContent = decompressed.toString('utf8');
      } else {
        throw new Error(`NO_TXT_IN_ARCHIVE: Unsupported compression method ${compressionMethod}`);
      }
      break; // Found the chat file
    }

    offset = dataEnd;
  }

  if (chatTextContent === null) {
    throw new Error('NO_TXT_IN_ARCHIVE: No .txt file found in archive');
  }

  return chatTextContent;
}
