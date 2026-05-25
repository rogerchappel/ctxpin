import path from 'node:path';

export function normalizeRelativePath(value: string): string {
  return value.split(path.sep).join('/');
}

export function relativePath(root: string, filePath: string): string {
  return normalizeRelativePath(path.relative(root, filePath));
}

export function resolveInsideRoot(root: string, input: string): string {
  const resolvedRoot = path.resolve(root);
  const resolvedPath = path.resolve(resolvedRoot, input);
  const relative = path.relative(resolvedRoot, resolvedPath);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Path escapes root: ${input}`);
  }

  return resolvedPath;
}

export function assertRelativeBundlePath(value: string): void {
  if (!value || path.isAbsolute(value) || value.split('/').includes('..')) {
    throw new Error(`Invalid bundle path: ${value}`);
  }
}
