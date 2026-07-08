# ctxpin

Local-first deterministic context bundles for agent workflows.


## Quickstart

Run the tool from a fresh checkout:

```sh
npm install
npm run build
node dist/cli.js --help
npm test
```

The help command is a quick smoke test for the CLI entrypoint, and `npm test` runs the committed regression suite before you depend on the output.

## Status

This repository is early-stage. Confirm the current support, release, and
security posture before using it in production.

## Install

Install dependencies and build the CLI:

```sh
npm install
npm run build
```

## Use

Create a local context bundle from explicit file globs:

```sh
npx ctxpin create \
  --root . \
  --include "src/**/*.ts" \
  --include README.md \
  --out .ctxpin/demo
```

This writes:

- `.ctxpin/demo/ctxpin.json` - machine-readable manifest with hashes, sizes, line counts, languages, redaction notes, and unresolved secret findings
- `.ctxpin/demo/CTX.md` - readable context summary with included file contents

Verify that the pinned files still match the manifest:

```sh
npx ctxpin verify .ctxpin/demo/ctxpin.json
```

Print the readable context summary again:

```sh
npx ctxpin summary .ctxpin/demo/ctxpin.json
```

Saved command output files can be pinned too:

```sh
npx ctxpin create \
  --root . \
  --include "src/**/*.ts" \
  --command-output logs/test-output.txt \
  --out .ctxpin/with-tests
```

By default, `ctxpin` refuses to create a bundle when unresolved secret-looking
content is found. Redact the value first, or pass `--allow-secrets` when you
intentionally want to pin that content.

## Limitations

- `ctxpin` works from explicit local files and globs; it does not discover the
  "right" project context for you.
- Token counts and language detection are estimates intended for planning and
  review, not billing or model-specific accounting.
- The built-in secret scan is conservative. Review bundles before sharing them,
  especially when using `--allow-secrets` or custom command output.
- Verification proves file hashes still match the saved manifest. It does not
  prove that the bundle is complete, current, or safe to send to a third party.

## Verify

Run the local validation script before opening a pull request:

```sh
npm test
npm run check
npm run build
npm run smoke
npm run package:smoke
npm run release:check
bash scripts/validate.sh
```

`scripts/validate.sh` runs the repository's standard local checks when they are defined and will also run `agent-qc ready` when `agent-qc` is installed. Missing `agent-qc` is treated as a skip, not a failure.

## Development

Use the same local checks that back release readiness:

```sh
npm run check
npm test
npm run build
npm run smoke
npm run package:smoke
npm run release:check
```

Run the narrower commands while iterating, then finish with the broadest available check before opening a PR.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution expectations. Changes
should be small, reviewable, and verified before review.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance. Replace
the default security policy before publishing the generated repository.

These links assume this README has been copied to the generated repository root.

## License

MIT
