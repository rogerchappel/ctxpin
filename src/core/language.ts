import path from 'node:path';

const extensionLanguages = new Map<string, string>([
  ['.cjs', 'javascript'],
  ['.css', 'css'],
  ['.go', 'go'],
  ['.html', 'html'],
  ['.js', 'javascript'],
  ['.json', 'json'],
  ['.jsx', 'javascript'],
  ['.md', 'markdown'],
  ['.mjs', 'javascript'],
  ['.py', 'python'],
  ['.rb', 'ruby'],
  ['.rs', 'rust'],
  ['.sh', 'shell'],
  ['.ts', 'typescript'],
  ['.tsx', 'typescript'],
  ['.txt', 'text'],
  ['.yaml', 'yaml'],
  ['.yml', 'yaml']
]);

export function detectLanguage(filePath: string): string {
  const base = path.basename(filePath).toLowerCase();

  if (base === 'dockerfile') {
    return 'dockerfile';
  }

  return extensionLanguages.get(path.extname(base)) ?? 'unknown';
}
