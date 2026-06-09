# ctxpin Orchestration Plan

`ctxpin` is designed to run as a local verification step in agent and developer workflows. It does not contact external services or write outside the requested output directory.

## Normal Flow

1. Select explicit input globs and command-output files.
2. Create a context bundle with `ctxpin create`.
3. Review unresolved secret findings before sharing the bundle.
4. Re-run `ctxpin verify` before reusing a saved bundle in a later workflow.

## Automation Boundaries

- Treat generated bundles as review artifacts, not as approval to publish sensitive project context.
- Keep secret-looking findings unresolved by default unless a human intentionally passes `--allow-secrets`.
- Run `npm run release:check` before release-readiness changes are merged.
