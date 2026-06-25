# ctxpin Orchestration Plan

ctxpin is designed for human and agent handoffs where the exact reviewed context matters.

`ctxpin` runs as a local verification step in agent and developer workflows. It does not contact external services or write outside the requested output directory.

## Normal flow

1. Choose explicit file globs for the task instead of bundling the whole repository.
2. Run `ctxpin create --root . --include "src/**/*.ts" --include README.md --out .ctxpin/<name>`.
3. Review `.ctxpin/<name>/CTX.md` before sharing it with another agent or reviewer.
4. Run `ctxpin verify .ctxpin/<name>/ctxpin.json` before reusing an older bundle.
5. Recreate the bundle after any source changes that should be part of the handoff.

## Safety contract

- Local-only operation.
- Explicit includes for files and command-output artifacts.
- Secret-looking content blocks bundle creation unless `--allow-secrets` is passed.
- Bundle manifests record included paths and hashes for review.
- No network calls, publishing, or remote credential handling.
- Treat generated bundles as review artifacts, not as approval to publish sensitive project context.

## CI pattern

```sh
ctxpin verify .ctxpin/release/ctxpin.json
```

Use verification in CI only for committed bundles that intentionally represent a stable review context.

## Stewardship flow

1. Start each change from the latest origin/main in an isolated worktree.
2. Keep package trust, README verification, and release-readiness changes in focused commits.
3. Run package parsing and pack dry-run checks locally before opening a pull request.
4. After pushing, use GitHub checks to confirm the release dry-run and repository hygiene workflows pass.

## Release handoff

- Treat npm publishing and tagging as manual maintainer actions.
- Include verification evidence in pull requests so release reviewers can reproduce the checks.
- Prefer follow-up PRs for runtime or fixture changes that are not directly tied to release readiness.
- Review `docs/release-candidate.md` and include manifest, hash, redaction, or CLI flag changes in release notes.
