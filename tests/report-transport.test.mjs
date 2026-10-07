import test from 'node:test';
import assert from 'node:assert/strict';
import { openReport, sealReport } from '../scripts/report-transport.mjs';

const key = Buffer.alloc(32, 1).toString('base64');

test('encrypted report crosses the job boundary without plaintext', () => {
  const report = JSON.stringify({ reportDate: '2026-10-06', content: 'private daily report' });
  const envelope = sealReport(report, key);
  assert.ok(!envelope.includes('private daily report'));
  assert.equal(openReport(envelope, key), report);
  assert.notEqual(sealReport(report, key), envelope);
});

test('wrong key and tampered artifact fail closed without revealing report content', () => {
  const envelope = sealReport('private daily report', key);
  const wrongKey = Buffer.alloc(32, 2).toString('base64');
  const tampered = JSON.parse(envelope);
  tampered.data = Buffer.from('different data').toString('base64');
  for (const [artifact, transferKey] of [[envelope, wrongKey], [JSON.stringify(tampered), key], ['invalid', key]]) {
    assert.throws(() => openReport(artifact, transferKey), error => {
      assert.match(error.message, /refusing delivery/);
      assert.ok(!error.message.includes('private daily report'));
      return true;
    });
  }
  assert.throws(() => sealReport('private daily report', 'weak-key'), /32-byte key/);
});
