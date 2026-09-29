import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { commitToInbox, inboxPath, parseUpload } from '../api/_lib/captureInbox.ts';

const capture = JSON.parse(readFileSync('measurements/galaxy-s/galaxy-s23-plus/landscape-1-gesture.json', 'utf8'));

test('accepts real probe captures and rejects malformed uploads', () => {
  const upload = parseUpload({ files: { 'landscape-1-gesture.json': capture }, note: 'RTL sweep' });
  assert.equal(typeof upload, 'object');
  assert.equal(upload.model, capture.device.model);
  assert.match(parseUpload({ files: {} }), /No files/);
  assert.match(parseUpload({ files: { '../x.json': capture } }), /Invalid file name/);
  assert.match(parseUpload({ files: { 'a.json': { ...capture, insets: undefined } } }), /missing insets/);
  const other = { ...capture, device: { ...capture.device, model: 'SM-X' } };
  assert.match(parseUpload({ files: { 'a.json': capture, 'b.json': other } }), /same device model/);
});

test('inbox paths stay inside the inbox folder', () => {
  assert.equal(inboxPath('SM-S916U', '2026-09-27T07-00-00-000Z', 'main-gesture.json'),
    'measurements/_inbox/SM-S916U/2026-09-27T07-00-00-000Z/main-gesture.json');
  assert.equal(inboxPath('../evil', 'x/y', 'a.json'), 'measurements/_inbox/.._evil/x_y/a.json');
});

test('one upload is one commit on the inbox branch, and the inbox PR is reused', async () => {
  const calls = [];
  const gh = async (path, init = {}) => {
    calls.push(`${init.method ?? 'GET'} ${path}`);
    if (path === '/git/ref/heads/main') return { status: 200, data: { object: { sha: 'main1' } } };
    if (path === '/git/ref/heads/capture-inbox') return { status: 200, data: { object: { sha: 'inbox1' } } };
    if (path === '/git/commits/inbox1') return { status: 200, data: { tree: { sha: 'tree0' } } };
    if (path === '/git/trees') { assert.equal(init.body.tree.length, 1); return { status: 201, data: { sha: 'tree1' } }; }
    if (path === '/git/commits') { assert.deepEqual(init.body.parents, ['inbox1']); return { status: 201, data: { sha: 'commit1' } }; }
    if (path === '/git/refs/heads/capture-inbox') return { status: 200, data: {} };
    if (path === '') return { status: 200, data: { owner: { login: 'easyhooon' } } };
    if (path.startsWith('/pulls?')) return { status: 200, data: [{ number: 42 }] };
    throw new Error(`unexpected ${path}`);
  };
  const result = await commitToInbox(gh, parseUpload({ files: { 'landscape-1-gesture.json': capture } }), new Date('2026-09-27T07:00:00Z'));
  assert.equal(result.pr, 42);
  assert.ok(!calls.includes('POST /pulls'));
  assert.equal(calls.filter(c => c === 'POST /git/commits').length, 1);
});

test('an expired token surfaces as a clear error', async () => {
  const gh = async () => ({ status: 401, data: { message: 'Bad credentials' } });
  await assert.rejects(commitToInbox(gh, parseUpload({ files: { 'a.json': capture } })), /token expired or revoked/);
});
