export type BundleFormatVersion = 1;

export type BundleFile = {
  path: string;
  bytes: number;
  lines: number;
  language: string;
  sha256: string;
};

export type BundleCommandOutput = {
  path: string;
  bytes: number;
  lines: number;
  sha256: string;
};

export type RedactionFinding = {
  path: string;
  line: number;
  kind: string;
  preview: string;
};

export type RedactionNote = {
  path: string;
  marker: string;
  count: number;
};

export type BundleManifest = {
  schemaVersion: BundleFormatVersion;
  createdAt: string;
  root: string;
  includes: string[];
  commandOutputs: BundleCommandOutput[];
  files: BundleFile[];
  redactions: RedactionNote[];
  unresolvedSecrets: RedactionFinding[];
};

export type CreateOptions = {
  root: string;
  includes: string[];
  out: string;
  commandOutputs: string[];
  allowSecrets: boolean;
};

export type VerifyResult = {
  ok: boolean;
  checkedFiles: number;
  missing: string[];
  changed: Array<{
    path: string;
    expected: string;
    actual: string;
  }>;
};
