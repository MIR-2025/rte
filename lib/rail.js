/* Pixboard rail -- flyout behaviour. Served under the opaque path (/<PATH>/r.js).
 *
 * The card is a sibling of the rail (never nested), positioned on hover with
 * getBoundingClientRect so nothing on the rail can clip it. It stays reachable
 * via: pointer-events on the open card, a close delay, hover listeners on the
 * card, and an invisible bridge across the tile->card gap. Video heroes have no
 * src until opened, then play muted. */
(function () {
  'use strict';

  function init() {
    var rail = document.querySelector('.rte-rail');
    var wrap = document.querySelector('.rte-cards');
    if (!rail || !wrap) return;

    var coarse = matchMedia('(hover: none), (pointer: coarse)').matches;
    var GAP = 12, CLOSE_MS = 150;
    var openCard = null, openTile = null, closeTimer = null;

    var bridge = document.createElement('div');
    bridge.className = 'rte-bridge';
    bridge.style.display = 'none';
    document.body.appendChild(bridge);

    function cardFor(id) {
      var sel = (window.CSS && CSS.escape) ? CSS.escape(id) : id;
      try { return wrap.querySelector('.rte-card[data-card="' + sel + '"]'); }
      catch (e) { return null; }
    }

    function place() {
      if (!openCard || !openTile) return;
      var r = openTile.getBoundingClientRect();
      var cw = openCard.offsetWidth, ch = openCard.offsetHeight;
      var flipped = false;
      var left = r.left - cw - GAP;
      if (left < 8) { left = r.right + GAP; flipped = true; }   // no room left -> go right
      var top = r.top + r.height / 2 - ch / 2;
      top = Math.max(8, Math.min(top, window.innerHeight - ch - 8));
      openCard.style.left = Math.round(left) + 'px';
      openCard.style.top = Math.round(top) + 'px';
      // bridge covers the gap between tile and card
      var gx1 = flipped ? r.right : (left + cw);
      var gx2 = flipped ? left : r.left;
      bridge.style.left = Math.round(Math.min(gx1, gx2) - 2) + 'px';
      bridge.style.top = Math.round(Math.min(top, r.top)) + 'px';
      bridge.style.width = Math.round(Math.abs(gx2 - gx1) + 4) + 'px';
      bridge.style.height = Math.round(Math.max(top + ch, r.bottom) - Math.min(top, r.top)) + 'px';
    }

    function playVideo(card) {
      var v = card.querySelector('video.rte-hero'); if (!v) return;
      var s = v.querySelector('source[data-src]');
      if (s && !s.getAttribute('src')) { s.setAttribute('src', s.getAttribute('data-src')); v.load(); }
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    }
    function stopVideo(card) {
      var v = card.querySelector('video.rte-hero'); if (v) { try { v.pause(); } catch (e) {} }
    }

    function cancelClose() { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; } }
    function scheduleClose() { cancelClose(); closeTimer = setTimeout(close, CLOSE_MS); }

    function open(tile) {
      cancelClose();
      var cell = tile.closest('.rte-cell');
      var card = cell && cardFor(cell.getAttribute('data-cell'));
      if (!card) return;
      if (openCard && openCard !== card) close();
      openCard = card; openTile = tile;
      card.classList.add('rte-open');
      place();
      bridge.style.display = 'block';
      playVideo(card);
    }
    function close() {
      cancelClose();
      if (openCard) { openCard.classList.remove('rte-open'); stopVideo(openCard); }
      bridge.style.display = 'none';
      openCard = null; openTile = null;
    }

    if (!coarse) {
      rail.addEventListener('mouseover', function (e) { var t = e.target.closest('.rte-tile'); if (t) open(t); });
      rail.addEventListener('mouseout', function (e) { if (e.target.closest('.rte-tile')) scheduleClose(); });
      wrap.addEventListener('mouseover', function (e) { if (e.target.closest('.rte-card')) cancelClose(); });
      wrap.addEventListener('mouseout', function (e) { if (e.target.closest('.rte-card')) scheduleClose(); });
      bridge.addEventListener('mouseover', cancelClose);
      bridge.addEventListener('mouseout', scheduleClose);
      // keyboard access
      rail.addEventListener('focusin', function (e) { var t = e.target.closest('.rte-tile'); if (t) open(t); });
      rail.addEventListener('focusout', scheduleClose);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    } else {
      // Touch: tap tile opens the card (card carries its own Visit link); tap-away closes.
      rail.addEventListener('click', function (e) {
        var t = e.target.closest('.rte-tile'); if (!t) return;
        e.preventDefault();
        if (openTile === t) close(); else open(t);
      });
      document.addEventListener('click', function (e) {
        if (openCard && !e.target.closest('.rte-card') && !e.target.closest('.rte-tile')) close();
      });
    }

    // Keep the card glued to its tile as the page scrolls/resizes.
    window.addEventListener('scroll', function () { if (openCard) place(); }, { passive: true });
    window.addEventListener('resize', function () { if (openCard) place(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
