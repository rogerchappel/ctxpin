# ctxpin PRD

Status: in-progress

## Summary

`ctxpin` is a local-first CLI that turns ad hoc agent context into a small, deterministic context bundle: selected files, command outputs, metadata, redaction notes, and content hashes. It helps developers hand an agent an exact, reviewable slice of a repo without copying half the workspace into a prompt.

## Problem

Agentic coding sessions often start with fuzzy context: a few pasted files, a terminal transcript, and whatever the agent happens to inspect. That makes review and reproduction hard. Teams need a quick way to pin "this is the context I gave the agent" in a durable, machine-readable format.

## V1 Goals

- Create a context bundle from file globs and optional command output files.
- Emit `ctxpin.json` plus a readable `CTX.md` summary.
- Include SHA-256 hashes, byte counts, line counts, and detected language.
- Support redaction markers and fail when unresolved secret-looking tokens are present.
- Provide a `verify` command that confirms bundle hashes still match.
- Include fixtures and CLI smoke tests.

## Non-Goals

- No cloud sync, prompt optimization service, or model-specific token accounting.
- No automatic traversal of private directories without explicit paths.

## CLI

```bash
ctxpin create --root . --include "src/**/*.ts" --include README.md --out .ctxpin/demo
ctxpin verify .ctxpin/demo/ctxpin.json
ctxpin summary .ctxpin/demo/ctxpin.json
```

## Safety

`ctxpin` must stay local-only, never follow ignored directories by default, and clearly report every file included in a bundle.

## Inspiration

Inspired by reproducible build manifests, code review bundles, and the recurring need to make agent context auditable without copying a whole repo.
