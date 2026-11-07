import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import { ChatIngestionService } from '../../src/core/ingestion/ingestion-service.ts';

function createSingleFileZip(fileName: string, text: string): Buffer {
  const raw = Buffer.from(text, 'utf8');
  const compressed = zlib.deflateRawSync(raw);
  const nameBuf = Buffer.from(fileName, 'utf8');

  const local = Buffer.alloc(30 + nameBuf.length);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0, 6);
  local.writeUInt16LE(8, 8);
  local.writeUInt32LE(compressed.length, 18);
  local.writeUInt32LE(raw.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  nameBuf.copy(local, 30);

  const central = Buffer.alloc(46 + nameBuf.length);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(8, 10);
  central.writeUInt32LE(compressed.length, 20);
  central.writeUInt32LE(raw.length, 24);
  central.writeUInt16LE(nameBuf.length, 28);
  central.writeUInt32LE(0, 42);
  nameBuf.copy(central, 46);

  const offset = local.length + compressed.length;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(1, 8);
  eocd.writeUInt16LE(1, 10);
  eocd.writeUInt32LE(central.length, 12);
  eocd.writeUInt32LE(offset, 16);

  return Buffer.concat([local, compressed, central, eocd]);
}

test('ChatIngestionService - ingests .txt file buffer', async () => {
  const service = new ChatIngestionService();
  const fileContent = fs.readFileSync('tests/fixtures/valid_ios.txt');

  const result = await service.ingest(fileContent, 'chat.txt');
  assert.equal(result.success, true);
  if (result.success) {
    assert.deepEqual(result.summary.participants, ['Alex', 'Jordan']);
    assert.ok(result.summary.messageCount >= 30);
  }
});

test('ChatIngestionService - ingests .zip archive buffer', async () => {
  const service = new ChatIngestionService();
  const chatText = fs.readFileSync('tests/fixtures/valid_android.txt', 'utf8');
  const zipBuf = createSingleFileZip('_chat.txt', chatText);

  const result = await service.ingest(zipBuf, 'export.zip');
  assert.equal(result.success, true);
  if (result.success) {
    assert.deepEqual(result.summary.participants, ['Sam', 'Taylor']);
  }
});

test('ChatIngestionService - rejects group chat gracefully', async () => {
  const service = new ChatIngestionService();
  const fileContent = fs.readFileSync('tests/fixtures/invalid_group.txt');

  const result = await service.ingest(fileContent, 'group_chat.txt');
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.reason, 'INVALID_PARTICIPANT_COUNT');
    assert.equal(result.message, 'Assify requires a 1-on-1 conversation with at least 30 messages.');
  }
});
