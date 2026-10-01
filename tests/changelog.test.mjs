import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { runnerImport } from 'vite';

const { entries } = JSON.parse(readFileSync('app/data/changelog.json', 'utf8'));
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

test('changelog entries are well formed and newest first', () => {
  assert.ok(entries.length > 0);
  for (const entry of entries) {
    assert.match(entry.hash, /^[0-9a-f]{40}$/);
    assert.match(entry.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(['added', 'corrected'].includes(entry.kind), entry.hash);
    assert.ok(['data', 'site'].includes(entry.area), entry.hash);
    assert.ok(entry.summary.length > 0, entry.hash);
    assert.equal(entry.devices.length > 0, entry.area === 'data', entry.hash);
  }
  assert.deepEqual(entries.map(e => e.date), [...entries.map(e => e.date)].sort().reverse());
  assert.equal(new Set(entries.map(e => e.hash)).size, entries.length);
});

test('every entry is a real data commit that touched the devices it names', { skip: git('rev-parse', '--is-shallow-repository') === 'true' }, () => {
  for (const entry of entries.filter(e => e.area === 'data').slice(0, 20)) {
    const files = git('show', '--name-only', '--format=', entry.hash).split('\n');
    for (const slug of entry.devices) {
      assert.ok(files.some(file => file.startsWith(`app/data/devices/`) && readFileSync(`app/data/devices/${file.split('/')[3]}/index.ts`, 'utf8').includes(`slug: "${slug}"`)), `${entry.hash} ${slug}`);
    }
    assert.match(git('show', '-s', '--format=%s', entry.hash), /^(feat|fix)(\((data|devices)\))?: /);
  }
});

test('RSS feed escapes text and links measured devices', async () => {
  const { module: { changelogFeed, changelog } } = await runnerImport('./app/data/changelog.ts', { root: process.cwd() });
  const xml = changelogFeed(5);
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>\n<rss version="2.0"/);
  assert.equal((xml.match(/<item>/g) ?? []).length, Math.min(5, changelog.length));
  assert.ok(xml.includes(`<guid isPermaLink="false">${changelog[0].hash}</guid>`));
  assert.doesNotMatch(xml.replace(/<[^>]+>/g, ''), /[<>]/);
});

test('site entries are merged pull requests or direct commits that touched the site', { skip: git('rev-parse', '--is-shallow-repository') === 'true' }, () => {
  for (const entry of entries.filter(e => e.area === 'site').slice(0, 20)) {
    const [base, merged] = git('show', '-s', '--format=%P', entry.hash).split(' ');
    if (entry.pr) {
      assert.ok(merged, `${entry.hash} should be a merge`);
      assert.match(git('show', '-s', '--format=%s', entry.hash), new RegExp(`^Merge pull request #${entry.pr} `));
    }
    const files = merged ? git('diff', '--name-only', `${base}...${merged}`) : git('show', '--name-only', '--format=', entry.hash);
    assert.ok(files.split('\n').some(f => /^(app|public)\//.test(f)), entry.hash);
  }
});
