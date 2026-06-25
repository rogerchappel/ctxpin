# Release Candidate Checklist

Use this checklist before publishing a CtxPin package or tagging a release.

## Verification

- Run `npm run release:check`.
- Confirm `npm run smoke` still creates and verifies a deterministic context bundle.
- Inspect `npm pack --dry-run` output and confirm it includes `dist`, `README.md`, `LICENSE`, and `SECURITY.md`.

## Evidence

- Save the manifest fields when bundle output changes.
- Include any hash, line-count, redaction, or verification behavior changes in release notes.
- Note CLI flag additions with a short command example.

## Support Notes

- Keep smoke fixtures synthetic and local.
- Do not publish context bundles containing secrets or private source files.
