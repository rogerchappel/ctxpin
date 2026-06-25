# ctxpin Tasks

## V1 MVP

- [x] Scaffold a TypeScript CLI package with `create`, `verify`, and `summary` commands.
- [x] Build deterministic context bundles with `ctxpin.json` and `CTX.md` outputs.
- [x] Capture file hashes, sizes, line counts, language hints, and redaction notes.
- [x] Respect ignore rules and explicit include globs.
- [x] Block unresolved secret-looking content by default.
- [x] Add fixture-backed tests and CLI smoke coverage.
- [x] Document install, usage, contributing, security, and release verification.

## Next

- [ ] Add optional token estimates for common model families.
- [ ] Add configurable redaction allowlists for project-specific placeholders.
- [ ] Add SARIF or JSONL output for bundle verification in CI.
- [ ] Add examples for pinning command output from test and build logs.
