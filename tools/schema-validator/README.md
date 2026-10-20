# Independent public-schema CLI

This is an independent JSON-LD check, not an official Schema.org or Google Rich Results test.

From the repository root:

```sh
npm run schema:setup
npm run schema:test
npm run schema:check
# Optional report path:
npm run schema:check -- output/schema-live.json
```

`prebuild` installs the isolated locked tooling (lifecycle scripts disabled) and runs adapter controls plus actual source-generator checks before Next builds. PR checks run these too. The live command reads every URL in this site's public sitemap sequentially, rejects offsite/query/private URLs and redirects, enforces timeouts, requires JSON-LD and extracted entities, writes a dated per-URL JSON report, and exits nonzero on any error, warning or fetch failure. It never submits forms or queries Google/Schema.org. Public HTML only; no client JavaScript execution. Sitemap indexes, named graphs, context aliases and non-JSON-LD validation need review before extending the adapter.

## Review and pinned dependencies - 20 October 2026

The suggested codetot-web/schema-test fork at f395034cc26010e57e04afa97b47d8fddea8b969 is not published under schema-test on npm. Its README points to upstream schemacraft-validator. Reviewed the actual npm schemacraft-validator1.0.1 archive/CLI, bundled extraction/graph/domain/range/vocabulary loading paths, upstream source, install scripts and dependency metadata. The package integrity is in package-lock.json; upstream CLI's banner still says1.0.0. No install hooks, telemetry call or process execution was found in the used validation path. Its optional server/browser mode is not started. This is a focused review, not exhaustive supply-chain certification.

The dependency tree is isolated under tools/schema-validator; root application dependencies/lockfiles are unchanged. An isolated undici6.29.1 override removes the audit findings present in jsonld's old HTTP dependency chain; clean locked install/audit reports zero vulnerabilities. Do not remove the override without rechecking the full nested audit and tests.

Upstream1.0.1 omits dist/data from its published archive. The adapter supplies a hash-checked offline copy of the official HTTPS vocabulary downloaded20October2026: https://schema.org/version/latest/schemaorg-current-https.jsonld . Attribution: Schema.org contributors, CC BY-SA3.0 (https://creativecommons.org/licenses/by-sa/3.0/); vocabulary data unmodified, redistributed under that license. Its exact SHA256 is vocabulary.sha256. Updating vocabulary is a reviewed file/hash change, followed by generator and live checks; no silent network refresh occurs in a build.

Upstream resolves references only within individual script blocks and mishandles deeply nested references. The adapter indexes the page's declared types and adds a referenced type only where that ID has an explicit local declaration. It validates every declared definition separately: upstream's shared visited-ID cache can otherwise skip the fields of a full definition after encountering a typed reference. Controls prove that such definitions still expose invalid properties and deprecated branchOf. Nothing is suppressed by error code. This is an adapter input transformation only; published website markup is not rewritten to satisfy a validator bug.

Three adapter control groups cover valid/cross-script/deep references, skipped-definition regressions, unknown types/properties, wrong entity ranges, deprecation warnings, missing/malformed/empty schema, unsupported contexts and unsafe sitemap URLs. Source-generator cases cover each site's main generated types/templates. The CLI uses a limited default-graph Schema.org profile matching these sites, not a full JSON-LD processor. Upstream is permissive for text values and date strings and cannot certify Google policy, business facts, visible-content parity, indexing or rich-result display. External results and unresolved source/owner/UAT gates remain separate in PROJECT_CONTEXT.md.
