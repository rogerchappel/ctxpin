# ctxpin Task Breakdown

## V1 MVP

- [x] Scaffold a TypeScript CLI package with `create`, `verify`, and `summary` commands.
- [x] Build deterministic context bundles with `ctxpin.json` and `CTX.md` outputs.
- [x] Capture file hashes, sizes, line counts, language hints, and redaction notes.
- [x] Respect ignore rules and explicit include globs.
- [x] Block unresolved secret-looking content by default.
- [x] Add fixture-backed tests and CLI smoke coverage.
- [x] Document install, usage, contributing, security, and release verification.

## Current Release Tasks

- Keep the CLI create, verify, and summary flows covered by fixture-backed tests.
- Run `npm run release:check` before opening release-readiness PRs.
- Confirm package contents with `npm run package:smoke` after changing `files`, `bin`, or build output.
- Review README examples against the current CLI flags whenever command parsing changes.

## Release readiness

- Keep package metadata aligned with the public GitHub repository, issue tracker, and README homepage.
- Run the local release checks before publishing or changing CLI behavior.
- Keep packaged policy and release files such as LICENSE, CHANGELOG.md, and SECURITY.md included when they exist.

## Verification gates
- Parse package.json after metadata edits.
- Run npm pack dry-run before opening release-oriented pull requests.
- Use the README verification commands as the public smoke path for contributors.

## Follow-up candidates

- Add optional token estimates for common model families.
- Add configurable redaction allowlists for project-specific placeholders.
- Add SARIF or JSONL output for bundle verification in CI.
- Add examples for pinning command output from test and build logs.
- Add fixture-backed tests for any uncovered bundle, redaction, or verification branch before expanding the command surface.
- Refresh README examples when CLI output paths or manifest fields change.
- Add fixture coverage for more language and file-type detection cases.
- Improve examples for CI handoff workflows.
- Document bundle-size limits and expected reviewer workflow.
