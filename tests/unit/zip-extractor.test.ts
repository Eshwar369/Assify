import test from 'node:test';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import { extractChatTextFromZip } from '../../src/core/ingestion/zip-extractor.ts';

function createMockZipBuffer(files: Array<{ name: string; content: string | Buffer }>): Buffer {
  const localHeaders: Buffer[] = [];
  const centralHeaders: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const rawBuffer = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content, 'utf8');
    const compressed = zlib.deflateRawSync(rawBuffer);
    const fileNameBuf = Buffer.from(file.name, 'utf8');

    // Local Header (30 bytes + name)
    const localHeader = Buffer.alloc(30 + fileNameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // PK\x03\x04
    localHeader.writeUInt16LE(20, 4); // version needed
    localHeader.writeUInt16LE(0, 6); // flags
    localHeader.writeUInt16LE(8, 8); // compression: deflate (8)
    localHeader.writeUInt16LE(0, 10); // mod time
    localHeader.writeUInt16LE(0, 12); // mod date
    localHeader.writeUInt32LE(0, 14); // crc32 (mock 0)
    localHeader.writeUInt32LE(compressed.length, 18); // compressed size
    localHeader.writeUInt32LE(rawBuffer.length, 22); // uncompressed size
    localHeader.writeUInt16LE(fileNameBuf.length, 26); // name length
    localHeader.writeUInt16LE(0, 28); // extra field length
    fileNameBuf.copy(localHeader, 30);

    // Central Directory Header (46 bytes + name)
    const centralHeader = Buffer.alloc(46 + fileNameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0); // PK\x01\x02
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(0, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(rawBuffer.length, 24);
    centralHeader.writeUInt16LE(fileNameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42); // relative offset of local header
    fileNameBuf.copy(centralHeader, 46);

    localHeaders.push(localHeader, compressed);
    centralHeaders.push(centralHeader);

    offset += localHeader.length + compressed.length;
  }

  const centralDirOffset = offset;
  const centralDirSize = centralHeaders.reduce((sum, h) => sum + h.length, 0);

  // End of Central Directory Record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // PK\x05\x06
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // start disk
  eocd.writeUInt16LE(files.length, 8); // entries on disk
  eocd.writeUInt16LE(files.length, 10); // total entries
  eocd.writeUInt32LE(centralDirSize, 12); // size of central directory
  eocd.writeUInt32LE(centralDirOffset, 16); // offset of central directory
  eocd.writeUInt16LE(0, 20); // comment length

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

test('extractChatTextFromZip - extracts _chat.txt and ignores media files', () => {
  const mockChat = '[12/04/24, 18:31:00] Alex: Hello\n[12/04/24, 18:32:00] Jordan: Hi';
  const zipBuffer = createMockZipBuffer([
    { name: 'photo1.jpg', content: Buffer.from([0xff, 0xd8, 0xff, 0xe0]) },
    { name: '_chat.txt', content: mockChat },
    { name: 'voice_note.opus', content: Buffer.from([0x4f, 0x67, 0x67, 0x53]) },
  ]);

  const extracted = extractChatTextFromZip(zipBuffer);
  assert.equal(extracted, mockChat);
});

test('extractChatTextFromZip - throws error if no text file in archive', () => {
  const zipBuffer = createMockZipBuffer([
    { name: 'photo1.jpg', content: Buffer.from([0xff, 0xd8, 0xff, 0xe0]) },
  ]);

  assert.throws(() => {
    extractChatTextFromZip(zipBuffer);
  }, /NO_TXT_IN_ARCHIVE/);
});
