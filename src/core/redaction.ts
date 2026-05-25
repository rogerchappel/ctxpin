import type { RedactionFinding, RedactionNote } from '../types.js';

const redactionMarkers = ['[REDACTED]', '<REDACTED>', '***REDACTED***'] as const;

const secretPatterns: Array<{ kind: string; pattern: RegExp }> = [
  { kind: 'aws-access-key-id', pattern: /\bAKIA[0-9A-Z]{16}\b/g },
  { kind: 'github-token', pattern: /\bgh[pousr]_[A-Za-z0-9_]{36,}\b/g },
  { kind: 'generic-secret-assignment', pattern: /\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*['"]?[A-Za-z0-9_./+=-]{16,}['"]?/gi },
  { kind: 'private-key-block', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g }
];

export function collectRedactionNotes(path: string, content: string): RedactionNote[] {
  return redactionMarkers
    .map((marker) => ({
      path,
      marker,
      count: countOccurrences(content, marker)
    }))
    .filter((note) => note.count > 0);
}

export function findUnresolvedSecrets(path: string, content: string): RedactionFinding[] {
  const findings: RedactionFinding[] = [];
  const lines = content.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';

    if (redactionMarkers.some((marker) => line.includes(marker))) {
      continue;
    }

    for (const { kind, pattern } of secretPatterns) {
      pattern.lastIndex = 0;
      if (pattern.test(line)) {
        findings.push({
          path,
          line: index + 1,
          kind,
          preview: redactPreview(line)
        });
      }
    }
  }

  return findings;
}

function countOccurrences(content: string, marker: string): number {
  let count = 0;
  let offset = 0;

  while (true) {
    const index = content.indexOf(marker, offset);
    if (index === -1) {
      return count;
    }
    count += 1;
    offset = index + marker.length;
  }
}

function redactPreview(value: string): string {
  return value.trim().replace(/[A-Za-z0-9_./+=-]{8,}/g, '[secret-like]');
}
