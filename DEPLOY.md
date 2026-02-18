# Deployment Process

Follow these steps **in order** when releasing changes.

## 1. Update Changelogs

Before anything else, update the changelog files with what changed:

- **`CHANGELOG.md`** (root) — master changelog for all packages
- **`package-pro/CHANGELOG.md`** — if rte-pro changed
- **`package-pro-ws/CHANGELOG.md`** — if rte-pro-ws changed

Use the format:
```
## [x.y.z] - YYYY-MM-DD
- Description of change
```

## 2. Bump Package Versions

For each package that changed, bump the version:

```bash
cd package && npm version patch --no-git-tag-version
cd package-bundle && npm version patch --no-git-tag-version
cd package-pro && npm version patch --no-git-tag-version
cd package-pro-ws && npm version patch --no-git-tag-version
cd package-ws && npm version patch --no-git-tag-version
```

Only bump packages that actually have code changes (or need to stay in sync).

## 3. Push to GitHub

```bash
cd /home/rwhitney/websites/rte.whitneys.co
git add -A
git commit -m "description of changes"
git push
```

## 4. Publish to npm

From the root project directory, publish each changed package:

```bash
cd package && npm publish
cd package-bundle && npm publish
cd package-pro && npm publish
cd package-pro-ws && npm publish
cd package-ws && npm publish
```

### Package Registry

| Package | npm Name | Directory |
|---|---|---|
| RTE Base | `rte-rich-text-editor` | `package/` |
| RTE Bundle | `rte-rich-text-editor-bundle` | `package-bundle/` |
| RTE Pro | `rte-rich-text-editor-pro` | `package-pro/` |
| RTE Pro+WS | `rte-rich-text-editor-pro-ws` | `package-pro-ws/` |
| RTE WS | `rte-rich-text-editor-ws` | `package-ws/` |
| WSKit | `wskit-client` | `package-wskit/` |
| WS Toolkit | `websocket-toolkit` | `package-websocket-kit/` |

## 5. Rsync to Production

```bash
cd /home/rwhitney/websites/rte.whitneys.co
rsync -auv --exclude 'node_modules' ./ whit@137.184.63.124:rte.whitneys.co/
```

## Quick One-Liner (after changelogs and version bumps)

```bash
git add -A && git commit -m "v bump" && git push && \
cd package && npm publish && cd .. && \
cd package-bundle && npm publish && cd .. && \
cd package-pro && npm publish && cd .. && \
cd package-pro-ws && npm publish && cd .. && \
cd package-ws && npm publish && cd .. && \
rsync -auv --exclude 'node_modules' ./ whit@137.184.63.124:rte.whitneys.co/
```
