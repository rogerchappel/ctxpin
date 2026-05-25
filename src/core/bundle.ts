import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import { loadIgnoreMatcher } from './ignore.js';
import { detectLanguage } from './language.js';
import { assertRelativeBundlePath, relativePath, resolveInsideRoot } from './path.js';
import { byteLength, countLines, sha256 } from './stats.js';
import { collectRedactionNotes, findUnresolvedSecrets } from './redaction.js';
import type {
  BundleCommandOutput,
  BundleFile,
  BundleManifest,
  CreateOptions,
  RedactionFinding,
  RedactionNote,
  VerifyResult
} from '../types.js';

export async function createBundle(options: CreateOptions): Promise<BundleManifest> {
  const root = path.resolve(options.root);
  const out = path.resolve(options.out);
  const files = await collectFiles(root, options.includes);
  const commandOutputs = await collectCommandOutputs(root, options.commandOutputs);
  const redactions: RedactionNote[] = [];
  const unresolvedSecrets: RedactionFinding[] = [];

  for (const file of [...files, ...commandOutputs]) {
    const absolutePath = resolveInsideRoot(root, file.path);
    const content = await readFile(absolutePath, 'utf8');
    redactions.push(...collectRedactionNotes(file.path, content));
    unresolvedSecrets.push(...findUnresolvedSecrets(file.path, content));
  }

  const manifest: BundleManifest = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    root,
    includes: options.includes,
    commandOutputs,
    files,
    redactions,
    unresolvedSecrets
  };

  if (unresolvedSecrets.length > 0 && !options.allowSecrets) {
    throw new Error(formatSecretError(unresolvedSecrets));
  }

  await mkdir(out, { recursive: true });
  await writeFile(path.join(out, 'ctxpin.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(path.join(out, 'CTX.md'), await renderContextMarkdown(manifest));

  return manifest;
}

export async function verifyBundle(manifestPath: string): Promise<VerifyResult> {
  const manifest = await readManifest(manifestPath);
  const changed: VerifyResult['changed'] = [];
  const missing: string[] = [];
  const entries = [...manifest.files, ...manifest.commandOutputs];

  for (const entry of entries) {
    assertRelativeBundlePath(entry.path);
    const absolutePath = resolveInsideRoot(manifest.root, entry.path);

    try {
      const content = await readFile(absolutePath);
      const actual = sha256(content);
      if (actual !== entry.sha256) {
        changed.push({ path: entry.path, expected: entry.sha256, actual });
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        missing.push(entry.path);
      } else {
        throw error;
      }
    }
  }

  return {
    ok: missing.length === 0 && changed.length === 0,
    checkedFiles: entries.length,
    missing,
    changed
  };
}

export async function readManifest(manifestPath: string): Promise<BundleManifest> {
  const raw = await readFile(manifestPath, 'utf8');
  const parsed = JSON.parse(raw) as BundleManifest;

  if (parsed.schemaVersion !== 1 || !path.isAbsolute(parsed.root) || !Array.isArray(parsed.files)) {
    throw new Error(`Invalid ctxpin manifest: ${manifestPath}`);
  }

  for (const file of [...parsed.files, ...parsed.commandOutputs]) {
    assertRelativeBundlePath(file.path);
  }

  return parsed;
}

export async function renderContextMarkdown(manifest: BundleManifest): Promise<string> {
  const lines: string[] = [
    '# ctxpin Context',
    '',
    `Created: ${manifest.createdAt}`,
    `Root: ${manifest.root}`,
    '',
    '## Files',
    ''
  ];

  for (const file of manifest.files) {
    lines.push(`- ${file.path} (${file.language}, ${file.lines} lines, ${file.bytes} bytes, sha256:${file.sha256})`);
  }

  if (manifest.commandOutputs.length > 0) {
    lines.push('', '## Command Outputs', '');
    for (const output of manifest.commandOutputs) {
      lines.push(`- ${output.path} (${output.lines} lines, ${output.bytes} bytes, sha256:${output.sha256})`);
    }
  }

  if (manifest.redactions.length > 0) {
    lines.push('', '## Redactions', '');
    for (const note of manifest.redactions) {
      lines.push(`- ${note.path}: ${note.marker} x${note.count}`);
    }
  }

  if (manifest.unresolvedSecrets.length > 0) {
    lines.push('', '## Unresolved Secrets', '');
    for (const finding of manifest.unresolvedSecrets) {
      lines.push(`- ${finding.path}:${finding.line} ${finding.kind} ${finding.preview}`);
    }
  }

  lines.push('', '## Contents', '');

  for (const file of manifest.files) {
    const absolutePath = resolveInsideRoot(manifest.root, file.path);
    const content = await readFile(absolutePath, 'utf8');
    lines.push(`### ${file.path}`, '', `\`\`\`${file.language === 'unknown' ? '' : file.language}`, content, '```', '');
  }

  for (const output of manifest.commandOutputs) {
    const absolutePath = resolveInsideRoot(manifest.root, output.path);
    const content = await readFile(absolutePath, 'utf8');
    lines.push(`### ${output.path}`, '', '```text', content, '```', '');
  }

  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}\n`;
}

async function collectFiles(root: string, includes: string[]): Promise<BundleFile[]> {
  if (includes.length === 0) {
    throw new Error('At least one --include value is required.');
  }

  const ignored = await loadIgnoreMatcher(root);
  const matches = await fg(includes, {
    absolute: true,
    cwd: root,
    dot: true,
    followSymbolicLinks: false,
    onlyFiles: true,
    unique: true
  });

  const files: BundleFile[] = [];

  for (const absolutePath of matches.sort()) {
    const rel = relativePath(root, absolutePath);
    assertRelativeBundlePath(rel);
    if (ignored(rel)) {
      continue;
    }

    const content = await readFile(absolutePath, 'utf8');
    files.push({
      path: rel,
      bytes: byteLength(content),
      lines: countLines(content),
      language: detectLanguage(rel),
      sha256: sha256(content)
    });
  }

  return files;
}

async function collectCommandOutputs(root: string, values: string[]): Promise<BundleCommandOutput[]> {
  const outputs: BundleCommandOutput[] = [];

  for (const value of values) {
    const absolutePath = resolveInsideRoot(root, value);
    const rel = relativePath(root, absolutePath);
    assertRelativeBundlePath(rel);
    const content = await readFile(absolutePath, 'utf8');
    outputs.push({
      path: rel,
      bytes: byteLength(content),
      lines: countLines(content),
      sha256: sha256(content)
    });
  }

  return outputs.sort((a, b) => a.path.localeCompare(b.path));
}

function formatSecretError(findings: RedactionFinding[]): string {
  const rendered = findings
    .map((finding) => `${finding.path}:${finding.line} ${finding.kind} ${finding.preview}`)
    .join('\n');

  return `Unresolved secret-like content found. Redact it or rerun with --allow-secrets.\n${rendered}`;
}
