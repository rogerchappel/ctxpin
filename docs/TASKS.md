# ctxpin Task Breakdown

Use this list to keep release-readiness work concrete and reviewable.

## Current Release Tasks

- Keep the CLI create, verify, and summary flows covered by fixture-backed tests.
- Run `npm run release:check` before opening release-readiness PRs.
- Confirm package contents with `npm run package:smoke` after changing `files`, `bin`, or build output.
- Review README examples against the current CLI flags whenever command parsing changes.

## Follow-up Candidates

- Add more fixtures for redaction edge cases.
- Document expected bundle stability when file ordering or ignored paths change.
- Expand smoke coverage for command-output bundles.

## Release readiness

- Keep package metadata aligned with the public GitHub repository, issue tracker, and README homepage.
- Run the local release checks before publishing or changing CLI behavior.
- Keep packaged policy and release files such as LICENSE, CHANGELOG.md, and SECURITY.md included when they exist.

## Verification gates
- Parse package.json after metadata edits.
- Run npm pack dry-run before opening release-oriented pull requests.
- Use the README verification commands as the public smoke path for contributors.

## Follow-up candidates

- Add fixture-backed tests for any uncovered bundle, redaction, or verification branch before expanding the command surface.
- Refresh README examples when CLI output paths or manifest fields change.
- Add fixture coverage for more language and file-type detection cases.
- Improve examples for CI handoff workflows.
- Document bundle-size limits and expected reviewer workflow.
