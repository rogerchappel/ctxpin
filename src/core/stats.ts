import { createHash } from 'node:crypto';

export function sha256(content: string | Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

export function countLines(content: string): number {
  if (content.length === 0) {
    return 0;
  }

  const matches = content.match(/\n/g);
  return (matches?.length ?? 0) + (content.endsWith('\n') ? 0 : 1);
}

export function byteLength(content: string): number {
  return Buffer.byteLength(content, 'utf8');
}
