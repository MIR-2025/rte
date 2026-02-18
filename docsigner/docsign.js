(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DocSign = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // --- Embedded CSS ---
  var CSS = `
    .ds-root { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a2e; background: #f0f2f5; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; height: 100%; min-height: 500px; }
    .ds-header { background: #1a1a2e; color: #fff; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
    .ds-header h2 { margin: 0; font-size: 16px; font-weight: 600; }
    .ds-status { padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .ds-status-pending { background: #fbbf24; color: #78350f; }
    .ds-status-partial { background: #60a5fa; color: #1e3a5f; }
    .ds-status-completed { background: #34d399; color: #064e3b; }
    .ds-body { display: flex; flex: 1; overflow: hidden; }
    .ds-main { flex: 1; overflow-y: auto; padding: 20px; background: #e5e7eb; }
    .ds-sidebar { width: 280px; background: #fff; border-left: 1px solid #d1d5db; display: flex; flex-direction: column; overflow-y: auto; flex-shrink: 0; }
    .ds-doc-viewer { background: #fff; max-width: 720px; margin: 0 auto; padding: 40px 50px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); border-radius: 4px; min-height: 400px; line-height: 1.7; font-size: 14px; }
    .ds-doc-viewer h1 { font-size: 22px; margin-top: 0; }
    .ds-doc-viewer h2 { font-size: 18px; }
    .ds-sig-placeholder { border: 2px dashed #9ca3af; border-radius: 6px; padding: 16px; margin: 12px 0; text-align: center; cursor: pointer; transition: all 0.2s; background: #f9fafb; }
    .ds-sig-placeholder:hover { border-color: #3b82f6; background: #eff6ff; }
    .ds-sig-placeholder.ds-signed { border-color: #34d399; background: #ecfdf5; cursor: default; }
    .ds-sig-placeholder.ds-mine { border-color: #3b82f6; }
    .ds-sig-placeholder .ds-sig-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
    .ds-sig-placeholder .ds-sig-name { font-size: 16px; font-weight: 600; color: #1a1a2e; }
    .ds-sig-placeholder .ds-sig-stamp { font-size: 11px; color: #059669; margin-top: 4px; }
    .ds-sig-image { max-height: 60px; margin-top: 6px; }
    .ds-section { padding: 16px; border-bottom: 1px solid #e5e7eb; }
    .ds-section h3 { margin: 0 0 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; }
    .ds-signer-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; }
    .ds-signer-avatar { width: 32px; height: 32px; border-radius: 50%; background: #dbeafe; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: #2563eb; flex-shrink: 0; }
    .ds-signer-info { flex: 1; }
    .ds-signer-info .name { font-size: 13px; font-weight: 600; }
    .ds-signer-info .status { font-size: 11px; }
    .ds-signer-info .status.signed { color: #059669; }
    .ds-signer-info .status.pending { color: #9ca3af; }
    .ds-hash { font-family: monospace; font-size: 11px; color: #6b7280; background: #f3f4f6; padding: 6px 10px; border-radius: 4px; word-break: break-all; }
    .ds-audit-item { font-size: 12px; padding: 6px 0; border-bottom: 1px solid #f3f4f6; color: #374151; }
    .ds-audit-item .time { color: #9ca3af; font-size: 11px; }
    .ds-btn { padding: 8px 16px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
    .ds-btn-primary { background: #3b82f6; color: #fff; }
    .ds-btn-primary:hover { background: #2563eb; }
    .ds-btn-secondary { background: #e5e7eb; color: #374151; }
    .ds-btn-secondary:hover { background: #d1d5db; }
    .ds-btn-sm { padding: 5px 12px; font-size: 12px; }
    .ds-actions { padding: 12px 16px; display: flex; gap: 8px; border-top: 1px solid #e5e7eb; margin-top: auto; }
    /* Modal */
    .ds-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; }
    .ds-modal { background: #fff; border-radius: 12px; width: 520px; max-width: 95vw; max-height: 90vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); display: flex; flex-direction: column; }
    .ds-modal-header { padding: 16px 20px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; }
    .ds-modal-header h3 { margin: 0; font-size: 16px; }
    .ds-modal-close { background: none; border: none; font-size: 22px; cursor: pointer; color: #6b7280; padding: 0 4px; }
    .ds-modal-body { padding: 20px; overflow-y: auto; flex: 1; }
    .ds-modal-footer { padding: 14px 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 8px; }
    /* Tabs */
    .ds-tabs { display: flex; border-bottom: 2px solid #e5e7eb; margin-bottom: 16px; }
    .ds-tab { padding: 8px 16px; font-size: 13px; font-weight: 600; color: #6b7280; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; background: none; border-top: none; border-left: none; border-right: none; }
    .ds-tab.active { color: #3b82f6; border-bottom-color: #3b82f6; }
    /* Type signature */
    .ds-type-input { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 15px; margin-bottom: 12px; box-sizing: border-box; }
    .ds-type-preview { min-height: 60px; display: flex; align-items: center; justify-content: center; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin-bottom: 8px; }
    .ds-font-options { display: flex; gap: 8px; flex-wrap: wrap; }
    .ds-font-opt { padding: 6px 14px; border: 2px solid #e5e7eb; border-radius: 6px; cursor: pointer; font-size: 18px; background: #fff; transition: border-color 0.15s; }
    .ds-font-opt.active { border-color: #3b82f6; background: #eff6ff; }
    .ds-font-opt:hover { border-color: #93c5fd; }
    /* Draw */
    .ds-draw-canvas { border: 1px solid #d1d5db; border-radius: 6px; cursor: crosshair; display: block; width: 100%; touch-action: none; background: #fff; }
    .ds-draw-actions { display: flex; gap: 8px; margin-top: 10px; }
    /* Upload */
    .ds-upload-zone { border: 2px dashed #d1d5db; border-radius: 8px; padding: 30px; text-align: center; cursor: pointer; transition: border-color 0.15s; }
    .ds-upload-zone:hover { border-color: #3b82f6; }
    .ds-upload-zone input { display: none; }
    .ds-upload-preview { max-height: 80px; margin-top: 12px; }
    /* Toast */
    .ds-toast-container { position: fixed; top: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 8px; }
    .ds-toast { padding: 12px 18px; border-radius: 8px; color: #fff; font-size: 13px; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: ds-slideIn 0.3s ease; }
    .ds-toast-info { background: #3b82f6; }
    .ds-toast-success { background: #059669; }
    .ds-toast-error { background: #dc2626; }
    @keyframes ds-slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    /* Create modal extras */
    .ds-create-field { margin-bottom: 14px; }
    .ds-create-field label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 4px; }
    .ds-create-field input[type="text"], .ds-create-field textarea { width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; box-sizing: border-box; font-family: inherit; }
    .ds-create-field textarea { min-height: 80px; resize: vertical; }
    .ds-file-upload { border: 2px dashed #d1d5db; border-radius: 8px; padding: 24px; text-align: center; cursor: pointer; transition: border-color 0.15s; margin-bottom: 10px; }
    .ds-file-upload:hover { border-color: #3b82f6; }
    .ds-file-upload.ds-has-file { border-color: #34d399; background: #ecfdf5; }
    .ds-file-upload input[type="file"] { display: none; }
    .ds-file-info { font-size: 12px; color: #059669; margin-top: 6px; }
    .ds-file-formats { font-size: 11px; color: #9ca3af; margin-top: 4px; }
    .ds-signer-row { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
    .ds-signer-row input { flex: 1; padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px; }
    .ds-signer-row button { flex-shrink: 0; }
    .ds-add-signer { font-size: 12px; color: #3b82f6; cursor: pointer; background: none; border: none; font-weight: 600; padding: 4px 0; }
    .ds-legal { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 14px; margin-top: 16px; }
    .ds-legal-text { font-size: 11px; color: #4b5563; line-height: 1.6; margin-bottom: 10px; max-height: 100px; overflow-y: auto; }
    .ds-legal-check { display: flex; align-items: flex-start; gap: 8px; cursor: pointer; }
    .ds-legal-check input[type="checkbox"] { margin-top: 2px; accent-color: #3b82f6; width: 16px; height: 16px; flex-shrink: 0; cursor: pointer; }
    .ds-legal-check label { font-size: 12px; color: #374151; line-height: 1.4; cursor: pointer; user-select: none; }
    .ds-btn-primary:disabled { background: #93c5fd; cursor: not-allowed; }
    .ds-preview-content { max-height: 200px; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; font-size: 12px; line-height: 1.5; background: #fafafa; margin-top: 8px; }
    .ds-preview-content img { max-width: 100%; }
    .ds-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid #d1d5db; border-top-color: #3b82f6; border-radius: 50%; animation: ds-spin 0.6s linear infinite; margin-right: 6px; vertical-align: middle; }
    @keyframes ds-spin { to { transform: rotate(360deg); } }
    /* Fonts for typed signatures */
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script&family=Great+Vibes&family=Pacifico&family=Caveat&display=swap');
  `;

  var CONSENT_VERSION = 'esign-consent-v1';

  var CONSENT_TEXT =
    'By signing this document electronically, you agree to the following:\n\n' +
    '1. Consent to Electronic Signature. You consent to use an electronic signature in lieu of a handwritten signature. ' +
    'You acknowledge that your electronic signature on this document is as legally binding as a handwritten signature, ' +
    'in accordance with the Electronic Signatures in Global and National Commerce Act (E-SIGN Act, 15 U.S.C. \u00A77001 et seq.) ' +
    'and applicable state laws, including the Uniform Electronic Transactions Act (UETA).\n\n' +
    '2. Intent to Sign. You confirm that you intend to sign this document and that your signature represents ' +
    'your voluntary agreement to the terms contained herein.\n\n' +
    '3. Identity Verification. You represent that you are the person identified as the signer and that you are ' +
    'authorized to execute this document. You understand that your signature will be cryptographically recorded with a timestamp ' +
    'and unique hash for verification purposes.\n\n' +
    '4. Document Integrity. You acknowledge that you have reviewed the document in its entirety prior to signing. ' +
    'Any modifications to the document after your signature will be detected and flagged by the system.\n\n' +
    '5. Record Retention. You consent to the electronic storage of this signed document and acknowledge that ' +
    'a copy will be made available to all parties.';

  var FONTS = [
    { name: 'Dancing Script', css: "'Dancing Script', cursive" },
    { name: 'Great Vibes', css: "'Great Vibes', cursive" },
    { name: 'Pacifico', css: "'Pacifico', cursive" },
    { name: 'Caveat', css: "'Caveat', cursive" }
  ];

  var styleInjected = false;
  function injectCSS() {
    if (styleInjected) return;
    var s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
    styleInjected = true;
  }

  // --- Dynamic script loader ---
  var loadedScripts = {};
  function loadScript(url) {
    if (loadedScripts[url]) return loadedScripts[url];
    loadedScripts[url] = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = url;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('Failed to load ' + url)); };
      document.head.appendChild(s);
    });
    return loadedScripts[url];
  }

  function loadPDFLibs() {
    return loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
      .then(function () {
        return loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      });
  }

  // --- Helpers ---
  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'className') e.className = attrs[k];
      else if (k === 'innerHTML') e.innerHTML = attrs[k];
      else if (k === 'textContent') e.textContent = attrs[k];
      else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    });
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(function (c) {
        if (typeof c === 'string') e.appendChild(document.createTextNode(c));
        else if (c) e.appendChild(c);
      });
    }
    return e;
  }

  function formatTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return d.toLocaleString();
  }

  function truncHash(h) {
    return h ? h.slice(0, 8) + '...' + h.slice(-8) : '';
  }

  function initials(name) {
    return (name || '??').split(' ').map(function (w) { return w[0]; }).join('').toUpperCase().slice(0, 2);
  }

  // --- Toast ---
  var toastContainer = null;
  function toast(msg, type) {
    if (!toastContainer) {
      toastContainer = el('div', { className: 'ds-toast-container' });
      document.body.appendChild(toastContainer);
    }
    var t = el('div', { className: 'ds-toast ds-toast-' + (type || 'info'), textContent: msg });
    toastContainer.appendChild(t);
    setTimeout(function () { t.remove(); }, 4000);
  }

  // --- DocSign Instance ---
  function DocSignInstance(container, opts) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.opts = opts || {};
    this.userId = opts.userId;
    this.userName = opts.userName;
    this.doc = null;
    this.socket = null;

    this.onSigned = null;
    this.onCompleted = null;
    this.onError = null;
    this.onDocLoaded = null;

    this._init();
  }

  DocSignInstance.prototype._init = function () {
    injectCSS();
    this._buildUI();
    this._connectSocket();
  };

  DocSignInstance.prototype._connectSocket = function () {
    var self = this;
    if (typeof io === 'undefined') {
      console.error('DocSign: Socket.IO client not loaded. Include it before docsign.js.');
      return;
    }
    this.socket = io(this.opts.serverUrl || 'http://localhost:3500');

    this.socket.on('doc:loaded', function (data) {
      self.doc = data.doc;
      self._render();
      toast('Document loaded: ' + data.doc.title, 'info');
      if (self.onDocLoaded) self.onDocLoaded(data.doc);
    });

    this.socket.on('doc:signed', function (data) {
      self.doc = data.doc;
      self._render();
      toast(data.signedBy + ' signed the document', 'success');
      if (self.onSigned) self.onSigned(data);
    });

    this.socket.on('doc:completed', function (data) {
      self.doc = data.doc;
      self._render();
      toast('All parties have signed! Document complete.', 'success');
      if (self.onCompleted) self.onCompleted(data);
    });

    this.socket.on('doc:verified', function (data) {
      if (data.valid) {
        toast('Document integrity verified', 'success');
      } else {
        toast('WARNING: Document integrity check FAILED!', 'error');
      }
    });

    this.socket.on('doc:error', function (data) {
      toast(data.message, 'error');
      if (self.onError) self.onError(data.message);
    });

    this.socket.on('party:joined', function (data) {
      toast(data.userName + ' joined', 'info');
    });
  };

  DocSignInstance.prototype._buildUI = function () {
    this.root = el('div', { className: 'ds-root' });
    this.headerEl = el('div', { className: 'ds-header' });
    this.bodyEl = el('div', { className: 'ds-body' });
    this.mainEl = el('div', { className: 'ds-main' });
    this.sidebarEl = el('div', { className: 'ds-sidebar' });
    this.bodyEl.appendChild(this.mainEl);
    this.bodyEl.appendChild(this.sidebarEl);
    this.root.appendChild(this.headerEl);
    this.root.appendChild(this.bodyEl);
    this.container.innerHTML = '';
    this.container.appendChild(this.root);
    this._renderEmpty();
  };

  DocSignInstance.prototype._renderEmpty = function () {
    var self = this;
    this.headerEl.innerHTML = '';
    this.headerEl.appendChild(el('h2', { textContent: 'DocSign' }));
    var emptyState = el('div', { style: 'text-align:center;padding:60px;' });
    emptyState.appendChild(el('div', { style: 'font-size:48px;margin-bottom:16px;', textContent: '\uD83D\uDCDD' }));
    emptyState.appendChild(el('div', { style: 'color:#6b7280;margin-bottom:20px;', textContent: 'No document loaded. Create or join a document to begin.' }));
    emptyState.appendChild(el('button', { className: 'ds-btn ds-btn-primary', textContent: 'Create Document', onClick: function () { self._openCreateModal(); } }));
    this.mainEl.innerHTML = '';
    this.mainEl.appendChild(emptyState);
    this.sidebarEl.innerHTML = '';
  };

  DocSignInstance.prototype._render = function () {
    if (!this.doc) { this._renderEmpty(); return; }
    var doc = this.doc;

    // Header
    this.headerEl.innerHTML = '';
    this.headerEl.appendChild(el('h2', { textContent: doc.title }));
    var statusClass = 'ds-status ds-status-' + doc.status;
    var statusText = doc.status === 'partial' ? 'Partially Signed' : doc.status.charAt(0).toUpperCase() + doc.status.slice(1);
    this.headerEl.appendChild(el('span', { className: statusClass, textContent: statusText }));

    // Main - document + signature placeholders
    this._renderDocument();

    // Sidebar - signers, hash, audit, actions
    this._renderSidebar();
  };

  DocSignInstance.prototype._renderDocument = function () {
    var self = this;
    var doc = this.doc;
    this.mainEl.innerHTML = '';

    var viewer = el('div', { className: 'ds-doc-viewer', innerHTML: doc.content });

    // Add signature placeholders at the bottom
    var sigArea = el('div', { className: 'ds-sig-area', style: 'margin-top: 30px; border-top: 2px solid #e5e7eb; padding-top: 20px;' });
    sigArea.appendChild(el('div', { style: 'font-size:13px;color:#6b7280;margin-bottom:12px;font-weight:600;', textContent: 'SIGNATURES' }));

    doc.signers.forEach(function (signer) {
      var isMine = signer.id === self.userId;
      var cls = 'ds-sig-placeholder' + (signer.signed ? ' ds-signed' : '') + (isMine && !signer.signed ? ' ds-mine' : '');
      var ph = el('div', { className: cls });

      ph.appendChild(el('div', { className: 'ds-sig-label', textContent: signer.name + (isMine ? ' (You)' : '') }));

      if (signer.signed) {
        if (signer.signatureType === 'drawn' || signer.signatureType === 'uploaded') {
          ph.appendChild(el('img', { className: 'ds-sig-image', src: signer.signatureData, alt: 'Signature' }));
        } else {
          ph.appendChild(el('div', { className: 'ds-sig-name', textContent: signer.signatureData, style: "font-family: 'Dancing Script', cursive;" }));
        }
        ph.appendChild(el('div', { className: 'ds-sig-stamp', textContent: 'Signed ' + formatTime(signer.signedAt) }));
        if (signer.ipAddress) {
          ph.appendChild(el('div', { className: 'ds-sig-stamp', textContent: 'IP: ' + signer.ipAddress }));
        }
        if (signer.consentVersion) {
          ph.appendChild(el('div', { className: 'ds-sig-stamp', textContent: 'E-Sign consent: ' + signer.consentVersion + ' at ' + formatTime(signer.consentedAt) }));
        }
      } else if (isMine) {
        ph.appendChild(el('div', { className: 'ds-sig-name', textContent: 'Click to sign' }));
        ph.addEventListener('click', function () { self._openSignModal(); });
      } else {
        ph.appendChild(el('div', { className: 'ds-sig-name', style: 'color:#9ca3af;', textContent: 'Awaiting signature' }));
      }
      sigArea.appendChild(ph);
    });

    viewer.appendChild(sigArea);
    this.mainEl.appendChild(viewer);
  };

  DocSignInstance.prototype._renderSidebar = function () {
    var self = this;
    var doc = this.doc;
    this.sidebarEl.innerHTML = '';

    // Signers section
    var signersSection = el('div', { className: 'ds-section' });
    signersSection.appendChild(el('h3', { textContent: 'Signers' }));
    doc.signers.forEach(function (s) {
      var item = el('div', { className: 'ds-signer-item' });
      item.appendChild(el('div', { className: 'ds-signer-avatar', textContent: initials(s.name) }));
      var info = el('div', { className: 'ds-signer-info' });
      info.appendChild(el('div', { className: 'name', textContent: s.name + (s.id === self.userId ? ' (You)' : '') }));
      info.appendChild(el('div', { className: 'status ' + (s.signed ? 'signed' : 'pending'), textContent: s.signed ? 'Signed ' + formatTime(s.signedAt) : 'Pending' }));
      item.appendChild(info);
      signersSection.appendChild(item);
    });
    this.sidebarEl.appendChild(signersSection);

    // Document info
    var infoSection = el('div', { className: 'ds-section' });
    infoSection.appendChild(el('h3', { textContent: 'Document Info' }));
    infoSection.appendChild(el('div', { style: 'font-size:12px;color:#6b7280;margin-bottom:4px;', textContent: 'Document ID' }));
    infoSection.appendChild(el('div', { className: 'ds-hash', textContent: doc.id }));
    infoSection.appendChild(el('div', { style: 'font-size:12px;color:#6b7280;margin:8px 0 4px;', textContent: 'Content Hash (SHA-256)' }));
    infoSection.appendChild(el('div', { className: 'ds-hash', textContent: truncHash(doc.contentHash) }));
    infoSection.appendChild(el('div', { style: 'font-size:12px;color:#6b7280;margin-top:8px;', textContent: 'Created: ' + formatTime(doc.createdAt) }));
    if (doc.completedAt) {
      infoSection.appendChild(el('div', { style: 'font-size:12px;color:#059669;', textContent: 'Completed: ' + formatTime(doc.completedAt) }));
    }
    this.sidebarEl.appendChild(infoSection);

    // Audit trail
    var auditSection = el('div', { className: 'ds-section' });
    var auditHeader = el('h3', { textContent: 'Audit Trail', style: 'cursor:pointer;', onClick: function () {
      auditList.style.display = auditList.style.display === 'none' ? 'block' : 'none';
    }});
    auditSection.appendChild(auditHeader);
    var auditList = el('div');
    (doc.audit || []).slice().reverse().forEach(function (a) {
      var item = el('div', { className: 'ds-audit-item' });
      item.appendChild(el('div', { textContent: a.action.toUpperCase() + ' — ' + (a.userId || '') }));
      if (a.details) item.appendChild(el('div', { style: 'color:#6b7280;', textContent: a.details }));
      var metaLine = formatTime(a.timestamp);
      if (a.ipAddress) metaLine += ' | IP: ' + a.ipAddress;
      item.appendChild(el('div', { className: 'time', textContent: metaLine }));
      auditList.appendChild(item);
    });
    auditSection.appendChild(auditList);
    this.sidebarEl.appendChild(auditSection);

    // Actions
    var actions = el('div', { className: 'ds-actions', style: 'flex-wrap:wrap;' });
    actions.appendChild(el('button', { className: 'ds-btn ds-btn-secondary ds-btn-sm', textContent: 'Verify Integrity', onClick: function () { self.verify(); } }));
    actions.appendChild(el('button', { className: 'ds-btn ds-btn-primary ds-btn-sm', textContent: 'Download PDF', onClick: function () { self.downloadPDF(); } }));
    this.sidebarEl.appendChild(actions);
  };

  // --- Signature Modal ---
  DocSignInstance.prototype._openSignModal = function () {
    var self = this;
    if (this._modal) return;

    var overlay = el('div', { className: 'ds-overlay' });
    var modal = el('div', { className: 'ds-modal' });

    // Header
    var header = el('div', { className: 'ds-modal-header' });
    header.appendChild(el('h3', { textContent: 'Sign Document' }));
    header.appendChild(el('button', { className: 'ds-modal-close', innerHTML: '&times;', onClick: function () { self._closeSignModal(); } }));
    modal.appendChild(header);

    // Tabs
    var body = el('div', { className: 'ds-modal-body' });
    var tabs = el('div', { className: 'ds-tabs' });
    var tabType = el('button', { className: 'ds-tab active', textContent: 'Type', 'data-tab': 'type' });
    var tabDraw = el('button', { className: 'ds-tab', textContent: 'Draw', 'data-tab': 'draw' });
    var tabUpload = el('button', { className: 'ds-tab', textContent: 'Upload', 'data-tab': 'upload' });
    tabs.appendChild(tabType);
    tabs.appendChild(tabDraw);
    tabs.appendChild(tabUpload);
    body.appendChild(tabs);

    // Tab panels
    var panels = {};
    var activeTab = 'type';

    // Type panel
    var typePanel = el('div', { 'data-panel': 'type' });
    var selectedFont = FONTS[0].css;
    var typeInput = el('input', { className: 'ds-type-input', type: 'text', placeholder: 'Type your full name...', value: self.userName || '' });
    var typePreview = el('div', { className: 'ds-type-preview' });
    var fontOptions = el('div', { className: 'ds-font-options' });

    function updateTypePreview() {
      typePreview.innerHTML = '';
      typePreview.appendChild(el('span', { textContent: typeInput.value || 'Your Name', style: 'font-family:' + selectedFont + ';font-size:28px;' }));
    }

    typeInput.addEventListener('input', updateTypePreview);

    FONTS.forEach(function (f, i) {
      var opt = el('button', { className: 'ds-font-opt' + (i === 0 ? ' active' : ''), textContent: 'Abc', style: 'font-family:' + f.css, onClick: function () {
        fontOptions.querySelectorAll('.ds-font-opt').forEach(function (o) { o.classList.remove('active'); });
        opt.classList.add('active');
        selectedFont = f.css;
        updateTypePreview();
      }});
      fontOptions.appendChild(opt);
    });

    typePanel.appendChild(typeInput);
    typePanel.appendChild(typePreview);
    typePanel.appendChild(fontOptions);
    updateTypePreview();
    panels.type = typePanel;
    body.appendChild(typePanel);

    // Draw panel
    var drawPanel = el('div', { 'data-panel': 'draw', style: 'display:none;' });
    var canvas = el('canvas', { className: 'ds-draw-canvas', width: '476', height: '150' });
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    var drawing = false;
    var paths = [];
    var currentPath = [];

    function getPos(e) {
      var rect = canvas.getBoundingClientRect();
      var t = e.touches ? e.touches[0] : e;
      return { x: (t.clientX - rect.left) * (canvas.width / rect.width), y: (t.clientY - rect.top) * (canvas.height / rect.height) };
    }

    function startDraw(e) {
      e.preventDefault();
      drawing = true;
      currentPath = [getPos(e)];
    }
    function moveDraw(e) {
      if (!drawing) return;
      e.preventDefault();
      var p = getPos(e);
      currentPath.push(p);
      redrawCanvas();
    }
    function endDraw(e) {
      if (!drawing) return;
      drawing = false;
      if (currentPath.length > 1) paths.push(currentPath.slice());
      currentPath = [];
    }
    function redrawCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var allPaths = paths.concat(currentPath.length > 1 ? [currentPath] : []);
      allPaths.forEach(function (p) {
        ctx.beginPath();
        ctx.moveTo(p[0].x, p[0].y);
        for (var i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
        ctx.stroke();
      });
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);
    canvas.addEventListener('touchstart', startDraw);
    canvas.addEventListener('touchmove', moveDraw);
    canvas.addEventListener('touchend', endDraw);

    var drawActions = el('div', { className: 'ds-draw-actions' });
    drawActions.appendChild(el('button', { className: 'ds-btn ds-btn-secondary ds-btn-sm', textContent: 'Undo', onClick: function () { paths.pop(); redrawCanvas(); } }));
    drawActions.appendChild(el('button', { className: 'ds-btn ds-btn-secondary ds-btn-sm', textContent: 'Clear', onClick: function () { paths = []; currentPath = []; redrawCanvas(); } }));

    drawPanel.appendChild(canvas);
    drawPanel.appendChild(drawActions);
    panels.draw = drawPanel;
    body.appendChild(drawPanel);

    // Upload panel
    var uploadPanel = el('div', { 'data-panel': 'upload', style: 'display:none;' });
    var uploadPreviewImg = null;
    var uploadData = null;
    var fileInput = el('input', { type: 'file', accept: 'image/png,image/jpeg' });
    var uploadZone = el('div', { className: 'ds-upload-zone', onClick: function () { fileInput.click(); } });
    uploadZone.appendChild(el('div', { textContent: 'Click to upload signature image', style: 'font-size:14px;color:#6b7280;' }));
    uploadZone.appendChild(el('div', { textContent: 'PNG or JPG', style: 'font-size:12px;color:#9ca3af;margin-top:4px;' }));
    uploadZone.appendChild(fileInput);

    fileInput.addEventListener('change', function () {
      var file = fileInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        uploadData = e.target.result;
        if (uploadPreviewImg) uploadPreviewImg.remove();
        uploadPreviewImg = el('img', { className: 'ds-upload-preview', src: uploadData });
        uploadZone.appendChild(uploadPreviewImg);
      };
      reader.readAsDataURL(file);
    });

    uploadPanel.appendChild(uploadZone);
    panels.upload = uploadPanel;
    body.appendChild(uploadPanel);

    // Tab switching
    [tabType, tabDraw, tabUpload].forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.querySelectorAll('.ds-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        activeTab = tab.getAttribute('data-tab');
        Object.keys(panels).forEach(function (k) { panels[k].style.display = k === activeTab ? 'block' : 'none'; });
      });
    });

    // Legal acknowledgment
    var legalSection = el('div', { className: 'ds-legal' });
    var legalText = el('div', { className: 'ds-legal-text' });
    legalText.innerHTML = CONSENT_TEXT
      .replace(/\n\n/g, '<br><br>')
      .replace(/(\d+\.\s+[A-Z][^.]+\.)/g, '<strong>$1</strong>');
    legalSection.appendChild(legalText);
    legalSection.appendChild(el('div', { style: 'font-size:10px;color:#9ca3af;margin-bottom:8px;', textContent: 'Disclosure version: ' + CONSENT_VERSION }));

    var checkRow = el('div', { className: 'ds-legal-check' });
    var legalCheckbox = el('input', { type: 'checkbox', id: 'ds-legal-agree' });
    var legalLabel = el('label', { 'for': 'ds-legal-agree',
      textContent: 'I have read and agree to the above terms. I understand that my electronic signature is legally binding.' });
    checkRow.appendChild(legalCheckbox);
    checkRow.appendChild(legalLabel);
    legalSection.appendChild(checkRow);
    body.appendChild(legalSection);

    modal.appendChild(body);

    // Footer
    var footer = el('div', { className: 'ds-modal-footer' });
    footer.appendChild(el('button', { className: 'ds-btn ds-btn-secondary', textContent: 'Cancel', onClick: function () { self._closeSignModal(); } }));
    var applyBtn = el('button', { className: 'ds-btn ds-btn-primary', textContent: 'Apply Signature', disabled: 'disabled', onClick: function () {
      var sigData = null;
      var sigType = activeTab;

      if (activeTab === 'type') {
        var text = typeInput.value.trim();
        if (!text) { toast('Please type your name', 'error'); return; }
        sigData = text;
        sigType = 'typed';
      } else if (activeTab === 'draw') {
        if (paths.length === 0) { toast('Please draw your signature', 'error'); return; }
        sigData = canvas.toDataURL('image/png');
        sigType = 'drawn';
      } else if (activeTab === 'upload') {
        if (!uploadData) { toast('Please upload an image', 'error'); return; }
        sigData = uploadData;
        sigType = 'uploaded';
      }

      self.socket.emit('sign', {
        docId: self.doc.id,
        userId: self.userId,
        userName: self.userName,
        signatureData: sigData,
        signatureType: sigType,
        consentVersion: CONSENT_VERSION,
        consentedAt: new Date().toISOString()
      });
      self._closeSignModal();
    }});
    footer.appendChild(applyBtn);

    legalCheckbox.addEventListener('change', function () {
      if (legalCheckbox.checked) {
        applyBtn.removeAttribute('disabled');
      } else {
        applyBtn.setAttribute('disabled', 'disabled');
      }
    });

    modal.appendChild(footer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    this._modal = overlay;

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) self._closeSignModal();
    });
  };

  DocSignInstance.prototype._closeSignModal = function () {
    if (this._modal) {
      this._modal.remove();
      this._modal = null;
    }
  };

  // --- File conversion helpers ---
  function convertFile(file) {
    return new Promise(function (resolve, reject) {
      var name = file.name.toLowerCase();
      var ext = name.split('.').pop();

      if (ext === 'html' || ext === 'htm') {
        var reader = new FileReader();
        reader.onload = function (e) { resolve(e.target.result); };
        reader.onerror = function () { reject(new Error('Failed to read HTML file')); };
        reader.readAsText(file);

      } else if (ext === 'txt') {
        var reader = new FileReader();
        reader.onload = function (e) {
          var text = e.target.result;
          var html = '<div style="white-space:pre-wrap;font-family:monospace;">' + escapeHTML(text) + '</div>';
          resolve(html);
        };
        reader.onerror = function () { reject(new Error('Failed to read text file')); };
        reader.readAsText(file);

      } else if (ext === 'md' || ext === 'markdown') {
        var reader = new FileReader();
        reader.onload = function (e) {
          var md = e.target.result;
          if (typeof marked !== 'undefined') {
            resolve(marked.parse(md));
          } else {
            // Basic fallback: preserve structure
            var html = escapeHTML(md)
              .replace(/^### (.+)$/gm, '<h3>$1</h3>')
              .replace(/^## (.+)$/gm, '<h2>$1</h2>')
              .replace(/^# (.+)$/gm, '<h1>$1</h1>')
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.+?)\*/g, '<em>$1</em>')
              .replace(/\n/g, '<br>');
            resolve(html);
          }
        };
        reader.onerror = function () { reject(new Error('Failed to read Markdown file')); };
        reader.readAsText(file);

      } else if (ext === 'docx') {
        if (typeof mammoth === 'undefined') {
          reject(new Error('mammoth.js is required for DOCX support. Include it via CDN.'));
          return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
          mammoth.convertToHtml({ arrayBuffer: e.target.result })
            .then(function (result) { resolve(result.value); })
            .catch(function (err) { reject(new Error('DOCX conversion failed: ' + err.message)); });
        };
        reader.onerror = function () { reject(new Error('Failed to read DOCX file')); };
        reader.readAsArrayBuffer(file);

      } else if (ext === 'pdf') {
        if (typeof pdfjsLib === 'undefined') {
          reject(new Error('PDF.js is required for PDF support. Include it via CDN.'));
          return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
          var typedArray = new Uint8Array(e.target.result);
          pdfjsLib.getDocument(typedArray).promise.then(function (pdf) {
            var pages = [];
            var scale = 1.5;
            function renderPage(num) {
              return pdf.getPage(num).then(function (page) {
                var viewport = page.getViewport({ scale: scale });
                var canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                var ctx = canvas.getContext('2d');
                return page.render({ canvasContext: ctx, viewport: viewport }).promise.then(function () {
                  pages.push('<div style="margin-bottom:20px;"><img src="' + canvas.toDataURL('image/png') + '" style="max-width:100%;box-shadow:0 1px 3px rgba(0,0,0,0.1);" alt="Page ' + num + '"></div>');
                });
              });
            }
            var chain = Promise.resolve();
            for (var i = 1; i <= pdf.numPages; i++) {
              (function (pageNum) {
                chain = chain.then(function () { return renderPage(pageNum); });
              })(i);
            }
            chain.then(function () { resolve(pages.join('\n')); })
              .catch(function (err) { reject(new Error('PDF rendering failed: ' + err.message)); });
          }).catch(function (err) { reject(new Error('PDF parsing failed: ' + err.message)); });
        };
        reader.onerror = function () { reject(new Error('Failed to read PDF file')); };
        reader.readAsArrayBuffer(file);

      } else {
        reject(new Error('Unsupported file format: .' + ext));
      }
    });
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Create Document Modal ---
  DocSignInstance.prototype._openCreateModal = function () {
    var self = this;
    if (this._modal) return;

    var overlay = el('div', { className: 'ds-overlay' });
    var modal = el('div', { className: 'ds-modal', style: 'width:600px;' });

    // Header
    var header = el('div', { className: 'ds-modal-header' });
    header.appendChild(el('h3', { textContent: 'Create Document' }));
    header.appendChild(el('button', { className: 'ds-modal-close', innerHTML: '&times;', onClick: function () { self._closeSignModal(); } }));
    modal.appendChild(header);

    var body = el('div', { className: 'ds-modal-body' });

    // Title
    var titleField = el('div', { className: 'ds-create-field' });
    titleField.appendChild(el('label', { textContent: 'Document Title' }));
    var titleInput = el('input', { type: 'text', placeholder: 'e.g. Service Agreement' });
    titleField.appendChild(titleInput);
    body.appendChild(titleField);

    // File upload
    var fileField = el('div', { className: 'ds-create-field' });
    fileField.appendChild(el('label', { textContent: 'Upload Document' }));
    var fileInput = el('input', { type: 'file', accept: '.html,.htm,.txt,.md,.markdown,.docx,.pdf' });
    var fileZone = el('div', { className: 'ds-file-upload', onClick: function () { fileInput.click(); } });
    fileZone.appendChild(el('div', { textContent: 'Click to upload a document', style: 'font-size:14px;color:#6b7280;' }));
    fileZone.appendChild(el('div', { className: 'ds-file-formats', textContent: 'HTML, TXT, Markdown, DOCX, PDF' }));
    fileZone.appendChild(fileInput);
    fileField.appendChild(fileZone);

    var fileInfoEl = el('div', { className: 'ds-file-info', style: 'display:none;' });
    fileField.appendChild(fileInfoEl);

    // Or paste content
    var pasteField = el('div', { className: 'ds-create-field' });
    pasteField.appendChild(el('label', { textContent: '— or paste HTML content —' }));
    var contentTextarea = el('textarea', { placeholder: '<h1>Document Title</h1>\n<p>Content here...</p>' });
    pasteField.appendChild(contentTextarea);
    body.appendChild(fileField);
    body.appendChild(pasteField);

    // Preview
    var previewContainer = el('div', { className: 'ds-create-field', style: 'display:none;' });
    previewContainer.appendChild(el('label', { textContent: 'Preview' }));
    var previewContent = el('div', { className: 'ds-preview-content' });
    previewContainer.appendChild(previewContent);
    body.appendChild(previewContainer);

    var convertedHTML = null;

    fileInput.addEventListener('change', function () {
      var file = fileInput.files[0];
      if (!file) return;
      fileZone.classList.add('ds-has-file');
      fileInfoEl.style.display = 'block';
      fileInfoEl.innerHTML = '<span class="ds-spinner"></span>Converting ' + escapeHTML(file.name) + '...';

      convertFile(file).then(function (html) {
        convertedHTML = html;
        fileInfoEl.textContent = file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB) — Ready';
        previewContent.innerHTML = html;
        previewContainer.style.display = 'block';
        if (!titleInput.value) {
          titleInput.value = file.name.replace(/\.[^.]+$/, '');
        }
      }).catch(function (err) {
        fileInfoEl.textContent = 'Error: ' + err.message;
        fileInfoEl.style.color = '#dc2626';
        convertedHTML = null;
        toast(err.message, 'error');
      });
    });

    // Signers
    var signersField = el('div', { className: 'ds-create-field' });
    signersField.appendChild(el('label', { textContent: 'Signers' }));
    var signersList = el('div');
    var signerRows = [];

    function addSignerRow(id, name, email) {
      var row = el('div', { className: 'ds-signer-row' });
      var idInput = el('input', { type: 'text', placeholder: 'ID', value: id || '' });
      var nameInput = el('input', { type: 'text', placeholder: 'Name', value: name || '' });
      var emailInput = el('input', { type: 'text', placeholder: 'Email', value: email || '' });
      var removeBtn = el('button', { className: 'ds-btn ds-btn-secondary ds-btn-sm', textContent: 'X', onClick: function () {
        row.remove();
        signerRows = signerRows.filter(function (r) { return r.row !== row; });
      }});
      row.appendChild(idInput);
      row.appendChild(nameInput);
      row.appendChild(emailInput);
      row.appendChild(removeBtn);
      signersList.appendChild(row);
      signerRows.push({ row: row, id: idInput, name: nameInput, email: emailInput });
    }

    // Pre-populate with current user
    addSignerRow(self.userId, self.userName, '');
    addSignerRow('', '', '');

    signersField.appendChild(signersList);
    signersField.appendChild(el('button', { className: 'ds-add-signer', textContent: '+ Add signer', onClick: function () { addSignerRow('', '', ''); } }));
    body.appendChild(signersField);

    modal.appendChild(body);

    // Footer
    var footer = el('div', { className: 'ds-modal-footer' });
    footer.appendChild(el('button', { className: 'ds-btn ds-btn-secondary', textContent: 'Cancel', onClick: function () { self._closeSignModal(); } }));
    footer.appendChild(el('button', { className: 'ds-btn ds-btn-primary', textContent: 'Create Document', onClick: function () {
      var title = titleInput.value.trim();
      if (!title) { toast('Please enter a document title', 'error'); return; }

      var content = convertedHTML || contentTextarea.value.trim();
      if (!content) { toast('Please upload a file or paste content', 'error'); return; }

      var signers = signerRows
        .filter(function (r) { return r.id.value.trim() && r.name.value.trim(); })
        .map(function (r) { return { id: r.id.value.trim(), name: r.name.value.trim(), email: r.email.value.trim() }; });

      if (signers.length === 0) { toast('Add at least one signer', 'error'); return; }

      self.create({ title: title, content: content, signers: signers });
      self._closeSignModal();
    }}));
    modal.appendChild(footer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    this._modal = overlay;

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) self._closeSignModal();
    });
  };

  // --- Public API ---
  DocSignInstance.prototype.create = function (opts) {
    this.socket.emit('create', {
      title: opts.title,
      content: opts.content,
      signers: opts.signers,
      userId: this.userId
    });
  };

  DocSignInstance.prototype.join = function (docId) {
    this.socket.emit('join', {
      docId: docId,
      userId: this.userId,
      userName: this.userName
    });
  };

  DocSignInstance.prototype.verify = function () {
    if (!this.doc) return;
    this.socket.emit('verify', { docId: this.doc.id, userId: this.userId });
  };

  DocSignInstance.prototype.getAuditTrail = function () {
    return this.doc ? this.doc.audit : [];
  };

  DocSignInstance.prototype.getDocument = function () {
    return this.doc;
  };

  DocSignInstance.prototype.downloadPDF = function () {
    if (!this.doc) return;
    var self = this;
    var viewer = this.mainEl.querySelector('.ds-doc-viewer');
    if (!viewer) return;
    var sigArea = viewer.querySelector('.ds-sig-area');

    toast('Preparing PDF...', 'info');

    loadPDFLibs().then(function () {
      var canvasOpts = { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false };

      // Temporarily style for clean capture
      var origBg = viewer.style.background;
      var origShadow = viewer.style.boxShadow;
      viewer.style.background = '#fff';
      viewer.style.boxShadow = 'none';

      // Hide sig area, capture document content only
      var origSigDisplay = sigArea ? sigArea.style.display : null;
      if (sigArea) sigArea.style.display = 'none';

      var contentCapture = html2canvas(viewer, canvasOpts);

      // Capture sig area separately
      var sigCapture;
      if (sigArea) {
        sigArea.style.display = '';
        // Temporarily detach from viewer flow so we can capture it standalone
        var sigClone = sigArea.cloneNode(true);
        sigClone.style.background = '#fff';
        sigClone.style.padding = '20px';
        sigClone.style.position = 'absolute';
        sigClone.style.left = '-9999px';
        sigClone.style.width = viewer.offsetWidth + 'px';
        document.body.appendChild(sigClone);
        sigCapture = html2canvas(sigClone, canvasOpts).then(function (c) {
          sigClone.remove();
          return c;
        });
      } else {
        sigCapture = Promise.resolve(null);
      }

      return Promise.all([contentCapture, sigCapture]).then(function (results) {
        viewer.style.background = origBg;
        viewer.style.boxShadow = origShadow;
        if (sigArea && origSigDisplay !== null) sigArea.style.display = origSigDisplay;

        var contentCanvas = results[0];
        var sigCanvas = results[1];

        var jsPDF = window.jspdf.jsPDF;
        var pageWidth = 210; // A4 mm
        var pageHeight = 297;
        var margin = 10;
        var usableWidth = pageWidth - margin * 2;
        var usableHeight = pageHeight - margin * 2;
        var footerHeight = 16; // mm reserved for hash footer

        // Content dimensions in mm
        var contentMmHeight = usableWidth * (contentCanvas.height / contentCanvas.width);

        // Signature dimensions in mm
        var sigMmHeight = 0;
        if (sigCanvas) {
          sigMmHeight = usableWidth * (sigCanvas.height / sigCanvas.width);
        }

        var pdf = new jsPDF('p', 'mm', 'a4');

        // Render document content across pages
        var pxPerMm = contentCanvas.width / usableWidth;
        var sliceHeightMm = usableHeight;
        var yOffsetPx = 0;
        var lastPageBottomMm = margin; // tracks where content ends on last page

        if (contentMmHeight <= usableHeight) {
          // Fits on one page
          pdf.addImage(contentCanvas.toDataURL('image/png'), 'PNG', margin, margin, usableWidth, contentMmHeight);
          lastPageBottomMm = margin + contentMmHeight;
        } else {
          // Multi-page: slice content canvas into page-sized chunks
          var totalPx = contentCanvas.height;
          var pageSlicePx = Math.floor(usableHeight * pxPerMm);
          var pageNum = 0;

          while (yOffsetPx < totalPx) {
            if (pageNum > 0) pdf.addPage();
            var remainPx = totalPx - yOffsetPx;
            var thisSlicePx = Math.min(pageSlicePx, remainPx);
            var thisSliceMm = thisSlicePx / pxPerMm;

            var sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = contentCanvas.width;
            sliceCanvas.height = thisSlicePx;
            var ctx = sliceCanvas.getContext('2d');
            ctx.drawImage(contentCanvas, 0, yOffsetPx, contentCanvas.width, thisSlicePx, 0, 0, contentCanvas.width, thisSlicePx);

            pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', margin, margin, usableWidth, thisSliceMm);
            lastPageBottomMm = margin + thisSliceMm;
            yOffsetPx += thisSlicePx;
            pageNum++;
          }
        }

        // Place signatures: try to fit on last page, otherwise new page
        if (sigCanvas && sigMmHeight > 0) {
          var spaceLeft = pageHeight - lastPageBottomMm - footerHeight;

          if (sigMmHeight <= spaceLeft) {
            // Fits on the current last page
            pdf.addImage(sigCanvas.toDataURL('image/png'), 'PNG', margin, lastPageBottomMm, usableWidth, sigMmHeight);
            lastPageBottomMm += sigMmHeight;
          } else {
            // Need a new page for signatures
            pdf.addPage();
            pdf.addImage(sigCanvas.toDataURL('image/png'), 'PNG', margin, margin, usableWidth, sigMmHeight);
            lastPageBottomMm = margin + sigMmHeight;
          }
        }

        // --- Certificate of Completion ---
        var doc = self.doc;
        pdf.addPage();
        var y = margin;

        // Header bar
        pdf.setFillColor(26, 26, 46);
        pdf.rect(0, 0, pageWidth, 28, 'F');
        pdf.setFontSize(16);
        pdf.setTextColor(255, 255, 255);
        pdf.text('Certificate of Completion', margin, 18);

        y = 38;

        // Document info section
        pdf.setFontSize(10);
        pdf.setTextColor(107, 114, 128);
        pdf.text('DOCUMENT DETAILS', margin, y);
        y += 6;
        pdf.setDrawColor(229, 231, 235);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 8;

        pdf.setFontSize(9);
        pdf.setTextColor(55, 65, 81);
        var docInfo = [
          ['Title', doc.title],
          ['Document ID', doc.id],
          ['Content Hash (SHA-256)', doc.contentHash],
          ['Status', (doc.status || '').toUpperCase()],
          ['Created', formatTime(doc.createdAt)],
          ['Completed', doc.completedAt ? formatTime(doc.completedAt) : 'Pending']
        ];
        docInfo.forEach(function (row) {
          pdf.setFont(undefined, 'bold');
          pdf.text(row[0] + ':', margin, y);
          pdf.setFont(undefined, 'normal');
          var labelWidth = pdf.getTextWidth(row[0] + ': ');
          pdf.text(row[1], margin + labelWidth, y);
          y += 5.5;
        });

        y += 6;

        // Signers section
        pdf.setFontSize(10);
        pdf.setTextColor(107, 114, 128);
        pdf.text('SIGNER DETAILS', margin, y);
        y += 6;
        pdf.line(margin, y, pageWidth - margin, y);
        y += 6;

        doc.signers.forEach(function (s, idx) {
          // Check if we need a new page
          if (y > pageHeight - 60) {
            pdf.addPage();
            y = margin;
          }

          pdf.setFontSize(9);
          pdf.setFont(undefined, 'bold');
          pdf.setTextColor(26, 26, 46);
          pdf.text('Signer ' + (idx + 1) + ': ' + s.name, margin, y);
          y += 5.5;

          pdf.setFont(undefined, 'normal');
          pdf.setTextColor(55, 65, 81);

          var signerInfo = [
            ['Email', s.email || 'N/A'],
            ['Status', s.signed ? 'SIGNED' : 'PENDING'],
            ['Signed At', s.signedAt ? formatTime(s.signedAt) : 'N/A'],
            ['Signature Type', s.signatureType || 'N/A'],
            ['IP Address', s.ipAddress || 'N/A'],
            ['User Agent', s.userAgent ? s.userAgent.substring(0, 80) : 'N/A'],
            ['Consent Version', s.consentVersion || 'N/A'],
            ['Consented At', s.consentedAt ? formatTime(s.consentedAt) : 'N/A'],
            ['Signature Hash', s.signatureHash || 'N/A']
          ];
          signerInfo.forEach(function (row) {
            pdf.setFont(undefined, 'bold');
            pdf.text('  ' + row[0] + ':', margin, y);
            pdf.setFont(undefined, 'normal');
            var lw = pdf.getTextWidth('  ' + row[0] + ': ');
            // Truncate long values to fit page
            var val = row[1];
            var maxW = usableWidth - lw;
            while (pdf.getTextWidth(val) > maxW && val.length > 10) {
              val = val.substring(0, val.length - 4) + '...';
            }
            pdf.text(val, margin + lw, y);
            y += 4.5;
          });

          y += 4;
        });

        // Audit trail section
        if (y > pageHeight - 40) {
          pdf.addPage();
          y = margin;
        }

        y += 4;
        pdf.setFontSize(10);
        pdf.setTextColor(107, 114, 128);
        pdf.text('AUDIT TRAIL', margin, y);
        y += 6;
        pdf.line(margin, y, pageWidth - margin, y);
        y += 6;

        pdf.setFontSize(7.5);
        pdf.setTextColor(55, 65, 81);
        (doc.audit || []).forEach(function (a) {
          if (y > pageHeight - 15) {
            pdf.addPage();
            y = margin;
          }
          var line = formatTime(a.timestamp) + '  |  ' + a.action.toUpperCase() + '  |  ' + (a.userId || '');
          if (a.ipAddress) line += '  |  IP: ' + a.ipAddress;
          if (a.details) line += '  |  ' + a.details;
          pdf.text(line, margin, y);
          y += 4;
        });

        // Legal statement
        if (y > pageHeight - 30) {
          pdf.addPage();
          y = margin;
        }
        y += 8;
        pdf.setDrawColor(229, 231, 235);
        pdf.line(margin, y, pageWidth - margin, y);
        y += 8;
        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128);
        var legalLines = [
          'All signers consented to electronic signatures in accordance with the Electronic Signatures in',
          'Global and National Commerce Act (E-SIGN Act, 15 U.S.C. \u00A77001 et seq.) and the Uniform',
          'Electronic Transactions Act (UETA). Each signer\'s identity, IP address, user agent, timestamp,',
          'and consent acknowledgment have been cryptographically recorded.',
          '',
          'This certificate was generated on ' + new Date().toISOString() + ' and attests to the',
          'integrity and authenticity of the above signing ceremony.'
        ];
        legalLines.forEach(function (l) {
          pdf.text(l, margin, y);
          y += 4;
        });

        var filename = (doc.title || 'document').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-').toLowerCase();
        pdf.save(filename + '-signed.pdf');
        toast('PDF downloaded', 'success');
      });
    }).catch(function (err) {
      toast('PDF export failed: ' + err.message, 'error');
      console.error('PDF export error:', err);
    });
  };

  DocSignInstance.prototype.switchUser = function (userId, userName) {
    this.userId = userId;
    this.userName = userName;
    if (this.doc) {
      this.join(this.doc.id);
    }
  };

  DocSignInstance.prototype.openCreateModal = function () {
    this._openCreateModal();
  };

  DocSignInstance.prototype.destroy = function () {
    if (this.socket) this.socket.disconnect();
    if (this._modal) this._closeSignModal();
    if (this.container) this.container.innerHTML = '';
    this.doc = null;
  };

  // --- Static init ---
  return {
    init: function (container, opts) {
      return new DocSignInstance(container, opts);
    }
  };
});
