/* Pixboard first-party ad rail for rte.whitneys.co.
 *
 * First-party is the whole point: the reader's browser only ever talks to
 * rte.whitneys.co. We fetch ads server->server, cache them, and proxy every
 * asset (and the rail's own css/js) under one opaque path so an ad blocker has
 * nothing to match -- our own markup can't be stripped the way a third-party
 * script would be.
 *
 * Security:
 *   - The API key is a server secret (env only): never the browser, a URL, or git.
 *   - SSRF: the proxy ONLY fetches a URL taken from the feed entry for the
 *     requested adId, and only https on the known Pixboard CDN. A URL from the
 *     request is never fetched.
 *   - The rail never blanks or slows a page: reads are pure cache reads, and a
 *     slow/failed refresh keeps serving the last good feed.
 */

import express from 'express';
import { Readable } from 'node:stream';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE = 'https://pixboard.ad';
const CDN_HOST = 'pixboard.sfo3.cdn.digitaloceanspaces.com'; // img / hero / poster
const N = 14;

const PUB = process.env.PIXBOARD_PUB || '';
const KEY = process.env.PIXBOARD_KEY || '';
const PATH = (process.env.PIXBOARD_PATH || '').replace(/^\/+|\/+$/g, '');

export const enabled = Boolean(PUB && KEY && PATH);
export const pathPrefix = PATH;

const FEED_TTL_MS = 60_000;
const FETCH_TIMEOUT_MS = 1500;   // >~1s slow -> keep last good
const REPORT_EVERY_MS = 3 * 60_000;
const ASSET_TIMEOUT_MS = 15_000;

// Replaced only by a *successful* refresh, so a failed refresh keeps the last
// good feed -- the rail never blanks mid-flight.
let feed = { ads: [], mark: null, byId: new Map() };
let counts = new Map();          // adId -> impressions pending report

// The rail's own assets, served under the opaque path (cached, un-matchable).
const RAIL_CSS = safeRead('rail.css');
const RAIL_JS = safeRead('rail.js');
function safeRead(name) {
  try { return readFileSync(join(__dirname, name), 'utf8'); }
  catch { return ''; }
}

async function refreshFeed() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const r = await fetch(
      `${BASE}/api/rail?pub=${encodeURIComponent(PUB)}&n=${N}&meter=0`,
      { headers: { 'x-pixboard-key': KEY }, signal: ctrl.signal });
    if (!r.ok) throw new Error(`rail ${r.status}`);
    const j = await r.json();
    if (!j || !j.ok || !Array.isArray(j.ads)) throw new Error('bad rail payload');
    feed = {
      ads: j.ads,
      mark: j.mark || null,
      byId: new Map(j.ads.map((a) => [String(a.id), a])),
    };
  } catch (err) {
    console.warn('[pixboard] feed refresh failed:', err.message,
      feed.ads.length ? '(serving last good)' : '(no cache yet)');
  } finally {
    clearTimeout(t);
  }
}

function getAd(id) { return feed.byId.get(String(id)) || null; }

/** What a page render needs -- only ids + flyout text/flags. No raw CDN URL
 *  ever crosses to the browser; everything visual is proxied under `path`. */
export function getRail() {
  if (!enabled) return null;
  return {
    path: PATH,
    mark: feed.mark,
    ads: feed.ads.map((a) => ({
      id: String(a.id),
      title: a.title || '',
      host: a.host || '',
      flyout: {
        headline: a.flyout?.headline || '',
        body: a.flyout?.body || '',
        heroType: a.flyout?.heroType === 'video' ? 'video' : 'image',
        hasHero: Boolean(a.flyout?.hero),
        hasAudio: Boolean(a.flyout?.hasAudio),
      },
    })),
  };
}

/* ---- impressions --------------------------------------------------------- *
 * The TRIGGER is kept separate from the count-and-report machinery: switching
 * "impression = page view" to "impression = flyout open" is a one-line change
 * (call onPageview from the client via a beacon instead of the middleware). */
export function onPageview() {
  if (!enabled) return;
  for (const a of feed.ads) {
    const id = String(a.id);
    counts.set(id, (counts.get(id) || 0) + 1);
  }
}

/** Count one impression per real HTML page a reader loads -- never per request
 *  (that would inflate ~10-15x). Skips assets, the api, and the proxy path. */
export function pageviewCounter() {
  return (req, res, next) => {
    if (!enabled || req.method !== 'GET') return next();
    const p = req.path;
    if (p.startsWith('/api/') || p === `/${PATH}` || p.startsWith(`/${PATH}/`)) return next();
    res.on('finish', () => {
      try {
        if (res.statusCode === 200 && /text\/html/i.test(res.get('Content-Type') || '')) {
          onPageview();
        }
      } catch { /* metering must never break a response */ }
    });
    next();
  };
}

async function reportImpressions() {
  if (!enabled || counts.size === 0) return;
  const snapshot = Object.fromEntries(counts);
  counts = new Map(); // clear up front so counts during the POST aren't lost
  try {
    const r = await fetch(`${BASE}/rail/impressions`, {
      method: 'POST',
      headers: { 'x-pixboard-key': KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ pub: PUB, counts: snapshot }),
      signal: AbortSignal.timeout(5000),
    });
    if (r.status !== 204) throw new Error(`impressions ${r.status}`);
  } catch (err) {
    // Never drop held counts -- merge back and try again next time.
    for (const [id, c] of Object.entries(snapshot)) counts.set(id, (counts.get(id) || 0) + c);
    console.error('[pixboard] impression report FAILED, retained counts:', err.message);
  }
}

/* ---- asset proxy (SSRF-safe) --------------------------------------------- */
async function streamAsset(req, res, pick) {
  const ad = getAd(req.params.adId);
  if (!ad) return res.status(404).end();

  const src = pick(ad);
  let u;
  try { u = new URL(src); } catch { return res.status(404).end(); }
  // URL comes ONLY from the trusted feed entry for this adId, never the request.
  if (u.protocol !== 'https:' || u.hostname !== CDN_HOST) return res.status(502).end();

  const headers = {};
  if (req.headers.range) headers.Range = req.headers.range; // forward Range so video seeks

  let up;
  try { up = await fetch(u.href, { headers, signal: AbortSignal.timeout(ASSET_TIMEOUT_MS) }); }
  catch { return res.status(504).end(); }
  if (!up.ok && up.status !== 206) return res.status(502).end();

  res.status(up.status);
  const ct = up.headers.get('content-type'); if (ct) res.set('Content-Type', ct);
  const cl = up.headers.get('content-length'); if (cl) res.set('Content-Length', cl);
  res.set('Accept-Ranges', up.headers.get('accept-ranges') || 'bytes');
  const cr = up.headers.get('content-range'); if (cr) res.set('Content-Range', cr);
  res.set('Cache-Control', 'public, max-age=300');
  res.set('X-Content-Type-Options', 'nosniff');

  if (up.body) Readable.fromWeb(up.body).pipe(res);
  else res.end();
}

export function proxyRouter() {
  const r = express.Router();
  // Rail's own assets under the opaque path (defined before /:adId).
  r.get('/r.css', (_req, res) => {
    res.type('text/css').set('Cache-Control', 'public, max-age=3600').send(RAIL_CSS);
  });
  r.get('/r.js', (_req, res) => {
    res.type('application/javascript').set('Cache-Control', 'public, max-age=3600').send(RAIL_JS);
  });
  r.get('/:adId', (req, res) => streamAsset(req, res, (ad) => ad.img));
  r.get('/:adId/hero', (req, res) => streamAsset(req, res, (ad) => ad.flyout?.hero));
  r.get('/:adId/poster', (req, res) => streamAsset(req, res, (ad) => ad.flyout?.poster));
  r.get('/:adId/go', (req, res) => {
    const ad = getAd(req.params.adId);
    if (!ad || !ad.click) return res.status(404).end();
    let u;
    try { u = new URL(ad.click); } catch { return res.status(404).end(); }
    if (!/^https?:$/.test(u.protocol)) return res.status(404).end();
    res.set('Referrer-Policy', 'no-referrer');
    res.redirect(302, ad.click); // feed's click URL already routes through Pixboard for attribution
  });
  return r;
}

/* ---- lifecycle ----------------------------------------------------------- */
export function start() {
  if (!enabled) {
    console.log('[pixboard] rail disabled (PIXBOARD_PUB/KEY/PATH not all set)');
    return;
  }
  refreshFeed(); // fire-and-forget so boot never blocks on the network
  setInterval(refreshFeed, FEED_TTL_MS).unref?.();
  setInterval(reportImpressions, REPORT_EVERY_MS).unref?.();
  const flush = () => reportImpressions().catch(() => {});
  for (const sig of ['SIGTERM', 'SIGINT']) {
    process.once(sig, () => { flush().finally(() => process.exit(0)); });
  }
  console.log(`[pixboard] rail enabled: pub=${PUB}, path=/${PATH}`);
}
