#!/usr/bin/env node
import { Command } from 'commander';
import { createBundle, readManifest, renderContextMarkdown, verifyBundle } from './core/bundle.js';

const program = new Command();

program
  .name('ctxpin')
  .description('Create and verify local-first deterministic context bundles.')
  .version('0.1.0');

program
  .command('create')
  .description('Create ctxpin.json and CTX.md from explicit file includes.')
  .option('--root <path>', 'workspace root', '.')
  .requiredOption('--include <glob>', 'file glob or path to include', collect, [])
  .requiredOption('--out <path>', 'output directory')
  .option('--command-output <path>', 'path to a saved command output file', collect, [])
  .option('--allow-secrets', 'allow unresolved secret-like content', false)
  .action(async (options: {
    root: string;
    include: string[];
    out: string;
    commandOutput: string[];
    allowSecrets: boolean;
  }) => {
    const manifest = await createBundle({
      root: options.root,
      includes: options.include,
      out: options.out,
      commandOutputs: options.commandOutput,
      allowSecrets: options.allowSecrets
    });

    console.log(`Created ${options.out}/ctxpin.json`);
    console.log(`Pinned ${manifest.files.length} files and ${manifest.commandOutputs.length} command outputs.`);
  });

program
  .command('verify')
  .description('Verify that files in a ctxpin manifest still match their hashes.')
  .argument('<manifest>', 'path to ctxpin.json')
  .action(async (manifest: string) => {
    const result = await verifyBundle(manifest);

    if (result.ok) {
      console.log(`OK: verified ${result.checkedFiles} files.`);
      return;
    }

    for (const missing of result.missing) {
      console.error(`MISSING: ${missing}`);
    }

    for (const changed of result.changed) {
      console.error(`CHANGED: ${changed.path}`);
      console.error(`  expected ${changed.expected}`);
      console.error(`  actual   ${changed.actual}`);
    }

    process.exitCode = 1;
  });

program
  .command('summary')
  .description('Print a readable summary for a ctxpin manifest.')
  .argument('<manifest>', 'path to ctxpin.json')
  .action(async (manifestPath: string) => {
    const manifest = await readManifest(manifestPath);
    process.stdout.write(await renderContextMarkdown(manifest));
  });

program.parseAsync().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

function collect(value: string, previous: string[]): string[] {
  previous.push(value);
  return previous;
}
