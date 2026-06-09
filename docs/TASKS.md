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
