# ctxpin Orchestration

ctxpin is designed for human and agent handoffs where the exact reviewed context matters.

## Agent workflow

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

## CI pattern

```sh
ctxpin verify .ctxpin/release/ctxpin.json
```

Use verification in CI only for committed bundles that intentionally represent a stable review context.
