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
1. Update the changelogs -- **before** bumping, not after. `CHANGELOG.md` (root, one
   section per package) + `package-<x>/CHANGELOG.md`. Format: `## [x.y.z] - YYYY-MM-DD`.
   (Known debt: these stop at pro `1.0.21` / pro-ws `1.0.16`; `1.0.22`-`1.0.31` were
   never backfilled, so don't read them as a complete history.)
2. If you changed the package's main file, `cp` it to its **root mirror** (see Notes) --
   the live demos serve the root copy, not the package copy.
3. Bump `version` in `package-<x>/package.json`.
4. Commit + push to `main` -- the workflow publishes just the bumped package(s) and
   skips the rest. Workflow-green is not proof; confirm with
   `npm view <name> version --prefer-online`.
5. **`rsync` to production** if it should be live on rte.whitneys.co (see `DEPLOY.md`).

⚠️ **The push publishes to npm; it does NOT deploy the website.** They are two separate
pipelines -- npm ships on push, the site ships only on a **manual rsync**. A change that
should be live on the demos *and* on npm needs both. (This bit a prior session: the
steps here used to end at 4 with "That's it", so the site silently stayed stale.)

> `DEPLOY.md` holds the rsync/production specifics. It is **gitignored and local-only**
> (removed from the repo in `1cf5b35` -- it names the prod host), so it is NOT in a fresh
> clone. Everything above is the committed, self-sufficient version; if you don't have
> `DEPLOY.md`, step 5's target lives on Richard's box, not in git.

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

- **Every package main file is mirrored in the repo root -- keep the two in sync.**
  `app.js:197` does `app.use(express.static(__dirname))`, so the **root** copies are what
  the marketing site's live demos load (`/rte.js` on `index`/`examples`, `/rte-pro.js` on
  `pro`), while the `package-*/` copies are what npm ships. All six are byte-identical
  mirrors today:

  | root (served to the live demos) | package copy (published to npm) |
  | --- | --- |
  | `rte.js` | `package/rte.js` |
  | `rte-bundle.js` | `package-bundle/rte-bundle.js` |
  | `rte-pro.js` | `package-pro/rte-pro.js` |
  | `rte-pro-ws.js` | `package-pro-ws/rte-pro-ws.js` |
  | `rte-ws.js` | `package-ws/rte-ws.js` |
  | `wskit.js` | `package-wskit/wskit.js` |

  Edit a `package-*/` main file and you **must** `cp` it to its root mirror, or npm and
  rte.whitneys.co silently drift -- the demo keeps running the old build with no error.
  Verify with `diff -q package-pro/rte-pro.js rte-pro.js` before committing.
  (`.env` and `.git/` are NOT exposed by the static mount -- `serve-static` defaults to
  `dotfiles: 'ignore'`; verified by probe, both 404.)
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
