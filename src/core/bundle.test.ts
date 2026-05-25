import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createBundle, readManifest, verifyBundle } from './bundle.js';

let tempRoot: string;

beforeEach(async () => {
  tempRoot = await mkdtemp(path.join(os.tmpdir(), 'ctxpin-'));
});

afterEach(async () => {
  await rm(tempRoot, { recursive: true, force: true });
});

describe('createBundle', () => {
  it('writes a manifest and readable context file for explicit includes', async () => {
    await writeFile(path.join(tempRoot, 'README.md'), '# Demo\n');
    await mkdir(path.join(tempRoot, 'src'));
    await writeFile(path.join(tempRoot, 'src', 'index.ts'), 'export const value = 1;\n');
    await writeFile(path.join(tempRoot, '.gitignore'), 'ignored.txt\n');
    await writeFile(path.join(tempRoot, 'ignored.txt'), 'nope\n');
    await writeFile(path.join(tempRoot, 'cmd.txt'), 'npm test\nPASS\n');

    const manifest = await createBundle({
      root: tempRoot,
      includes: ['README.md', 'src/**/*.ts', 'ignored.txt'],
      out: path.join(tempRoot, '.ctxpin', 'demo'),
      commandOutputs: ['cmd.txt'],
      allowSecrets: false
    });

    assert.deepEqual(manifest.files.map((file) => file.path), ['README.md', 'src/index.ts']);
    assert.equal(manifest.commandOutputs[0]?.path, 'cmd.txt');
    assert.equal(manifest.files[1]?.language, 'typescript');

    const saved = await readManifest(path.join(tempRoot, '.ctxpin', 'demo', 'ctxpin.json'));
    assert.equal(saved.files.length, 2);

    const ctx = await readFile(path.join(tempRoot, '.ctxpin', 'demo', 'CTX.md'), 'utf8');
    assert.match(ctx, /### src\/index\.ts/);
    assert.match(ctx, /export const value = 1;/);
  });

  it('blocks unresolved secret-like values by default', async () => {
    await writeFile(path.join(tempRoot, 'config.txt'), 'api_key = "1234567890abcdef"\n');

    await assert.rejects(
      createBundle({
        root: tempRoot,
        includes: ['config.txt'],
        out: path.join(tempRoot, '.ctxpin', 'secret'),
        commandOutputs: [],
        allowSecrets: false
      }),
      /Unresolved secret-like content found/
    );
  });
});

describe('verifyBundle', () => {
  it('reports changed files', async () => {
    await writeFile(path.join(tempRoot, 'README.md'), '# Demo\n');
    await createBundle({
      root: tempRoot,
      includes: ['README.md'],
      out: path.join(tempRoot, '.ctxpin', 'demo'),
      commandOutputs: [],
      allowSecrets: false
    });

    await writeFile(path.join(tempRoot, 'README.md'), '# Changed\n');
    const result = await verifyBundle(path.join(tempRoot, '.ctxpin', 'demo', 'ctxpin.json'));

    assert.equal(result.ok, false);
    assert.equal(result.changed[0]?.path, 'README.md');
  });
});
