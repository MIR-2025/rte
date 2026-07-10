# rte.whitneys.co

The RTEPro rich-text-editor project. This one repo (`MIR-2025/rte`) holds the
marketing site **and** seven npm packages, each in its own `package-*/` dir.

## Published npm packages

| dir | npm name | main | what it is |
| --- | --- | --- | --- |
| `package` | `rte-rich-text-editor` | `rte.js` | base editor |
| `package-bundle` | `rte-rich-text-editor-bundle` | `rte-bundle.js` | bundled build |
| `package-pro` | `rte-rich-text-editor-pro` | `rte-pro.js` | full-featured + AI (used by `volt-addon-editor`) |
| `package-pro-ws` | `rte-rich-text-editor-pro-ws` | `rte-pro-ws.js` | pro + websocket collab |
| `package-ws` | `rte-rich-text-editor-ws` | `rte-ws.js` | base + websocket |
| `package-wskit` | `wskit-client` | `wskit.js` | websocket client kit |
| `package-websocket-kit` | `websocket-toolkit` | `wskit.js` | websocket toolkit |

All are **0-dependency** UMD files (script-tag friendly).

## Releasing — OIDC trusted publishing (no npm token)

`.github/workflows/publish.yml` publishes via npm **Trusted Publishing (OIDC)** —
no `NPM_TOKEN` secret. It runs on **push to `main`** (and `workflow_dispatch`),
matrixes over all 7 packages, and **only publishes a package whose version is
not yet on npm** (it checks `npm view <name>@<version>` first), provenance-signed.

**To release a package:**
1. Bump `version` in `package-<x>/package.json`.
2. Commit + push to `main`.

That's it — the workflow publishes just the bumped package(s) and skips the rest.

### One-time per package: configure the trusted publisher

For each of the 7 packages, on npmjs.com → the package → **Settings → Trusted
Publishing → GitHub Actions**:
- **Owner:** `MIR-2025`  ·  **Repository:** `rte`
- **Workflow filename:** `publish.yml`
- **Environment:** (blank)

Until a package's trusted publisher is set up, its publish step fails with
`ENEEDAUTH`. The `fail-fast: false` matrix means the other packages still publish.

### Manual fallback

Logged in (`npm whoami`), publish directly without the workflow:

```
cd package-<x> && npm publish --access public
```

## Notes

- `package-pro` (`rte-rich-text-editor-pro`) is the build the Volt editor add-on
  (`volt-addon-editor`, in the `volt` repo) depends on — the **non-ws** one
  (single-admin editor, no collab server). Switch Volt to `-pro-ws` only if it
  needs collaborative editing.
- Bump versions above `npm view <name> version`; the workflow no-ops on versions
  already published.
- The **base** editor (`package/rte.js`) has a Markdown surface as of
  `rte-rich-text-editor@1.0.31`: `getMarkdown()`, `setMarkdown(md)`, and an
  `init({ markdown })` option (ported from Pro, no AI). Added for Volt so it can ship
  the no-key base editor by default for markdown-on-disk content.
