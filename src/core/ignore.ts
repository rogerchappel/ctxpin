import { readFile } from 'node:fs/promises';
import path from 'node:path';
import ignore from 'ignore';

const defaultIgnored = [
  '.git',
  'node_modules',
  'dist',
  'coverage',
  '.ctxpin',
  '.DS_Store'
];

export async function loadIgnoreMatcher(root: string): Promise<(relativePath: string) => boolean> {
  const matcher = ignore().add(defaultIgnored);
  const gitignorePath = path.join(root, '.gitignore');

  try {
    matcher.add(await readFile(gitignorePath, 'utf8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }

  return (relativePath: string) => matcher.ignores(relativePath);
}
