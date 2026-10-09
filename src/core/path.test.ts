import path from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveInsideRoot } from './path.js';

describe('resolveInsideRoot', () => {
  it('allows in-root path components beginning with two dots', () => {
    const root = path.resolve('/tmp/ctxpin-root');
    assert.equal(resolveInsideRoot(root, '..cache/file.txt'), path.join(root, '..cache/file.txt'));
  });

  it('rejects parent traversal and absolute paths outside the root', () => {
    const root = path.resolve('/tmp/ctxpin-root');
    assert.throws(() => resolveInsideRoot(root, '../outside.txt'), /Path escapes root/);
    assert.throws(() => resolveInsideRoot(root, path.resolve('/tmp/outside.txt')), /Path escapes root/);
  });
});
