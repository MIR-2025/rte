const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const PORT = process.env.DOCSIGN_PORT || 3500;
const SECRET = process.env.DOCSIGN_SECRET || crypto.randomBytes(32).toString('hex');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Serve static files from this directory
app.use(express.static(path.join(__dirname)));

// In-memory document store
const documents = new Map();

// --- Helpers ---

function hashContent(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function signatureHMAC(contentHash, signatureData, userId, timestamp) {
  const payload = contentHash + '|' + signatureData + '|' + userId + '|' + timestamp;
  return crypto.createHmac('sha256', SECRET).update(payload, 'utf8').digest('hex');
}

function verifyDocument(doc) {
  const currentHash = hashContent(doc.content);
  const contentValid = currentHash === doc.contentHash;

  const signatures = doc.signers
    .filter(s => s.signed)
    .map(s => {
      const expectedHMAC = signatureHMAC(doc.contentHash, s.signatureData, s.id, s.signedAt);
      return {
        userId: s.id,
        name: s.name,
        signedAt: s.signedAt,
        signatureType: s.signatureType,
        valid: expectedHMAC === s.signatureHash
      };
    });

  return { valid: contentValid && signatures.every(s => s.valid), contentValid, hash: currentHash, signatures };
}

function getSocketMeta(socket) {
  const handshake = socket.handshake;
  const ip = handshake.headers['x-forwarded-for']
    || handshake.headers['x-real-ip']
    || handshake.address
    || 'unknown';
  const userAgent = handshake.headers['user-agent'] || 'unknown';
  return { ipAddress: ip, userAgent };
}

// --- Socket.IO ---

io.on('connection', (socket) => {
  const meta = getSocketMeta(socket);
  console.log(`[connect] ${socket.id} ip=${meta.ipAddress}`);

  socket.on('create', (payload) => {
    const { title, content, signers } = payload;
    if (!title || !content || !Array.isArray(signers) || signers.length === 0) {
      socket.emit('doc:error', { message: 'Invalid create payload: title, content, and signers required.' });
      return;
    }

    const contentHash = hashContent(content);
    const id = contentHash;
    const now = new Date().toISOString();

    const doc = {
      id,
      title,
      content,
      contentHash,
      status: 'pending',
      createdAt: now,
      completedAt: null,
      signers: signers.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email || null,
        signed: false,
        signatureData: null,
        signatureType: null,
        signedAt: null,
        signatureHash: null,
        ipAddress: null,
        userAgent: null,
        consentedAt: null,
        consentVersion: null
      })),
      audit: [
        { action: 'created', userId: payload.userId || signers[0].id, timestamp: now, details: `Document "${title}" created`, ipAddress: meta.ipAddress, userAgent: meta.userAgent }
      ]
    };

    documents.set(id, doc);
    socket.join(id);

    doc.audit.push({ action: 'viewed', userId: payload.userId || signers[0].id, timestamp: new Date().toISOString(), ipAddress: meta.ipAddress, userAgent: meta.userAgent });

    socket.emit('doc:loaded', { doc });
    console.log(`[create] doc=${id} title="${title}" signers=${signers.length}`);
  });

  socket.on('join', (payload) => {
    const { docId, userId, userName } = payload;
    const doc = documents.get(docId);
    if (!doc) {
      socket.emit('doc:error', { message: `Document ${docId} not found.` });
      return;
    }

    socket.join(docId);
    doc.audit.push({ action: 'viewed', userId, timestamp: new Date().toISOString(), ipAddress: meta.ipAddress, userAgent: meta.userAgent });

    socket.emit('doc:loaded', { doc });
    socket.to(docId).emit('party:joined', { userId, userName });
    console.log(`[join] doc=${docId} user=${userName}(${userId}) ip=${meta.ipAddress}`);
  });

  socket.on('sign', (payload) => {
    const { docId, userId, userName, signatureData, signatureType, consentVersion, consentedAt } = payload;
    const doc = documents.get(docId);
    if (!doc) {
      socket.emit('doc:error', { message: `Document ${docId} not found.` });
      return;
    }

    const signer = doc.signers.find(s => s.id === userId);
    if (!signer) {
      socket.emit('doc:error', { message: `User ${userId} is not a signer on this document.` });
      return;
    }
    if (signer.signed) {
      socket.emit('doc:error', { message: `User ${userId} has already signed this document.` });
      return;
    }
    if (!signatureData) {
      socket.emit('doc:error', { message: 'Signature data is required.' });
      return;
    }
    if (!consentVersion) {
      socket.emit('doc:error', { message: 'Electronic signature consent is required.' });
      return;
    }

    const now = new Date().toISOString();
    const sigHash = signatureHMAC(doc.contentHash, signatureData, userId, now);

    signer.signed = true;
    signer.signatureData = signatureData;
    signer.signatureType = signatureType || 'typed';
    signer.signedAt = now;
    signer.signatureHash = sigHash;
    signer.ipAddress = meta.ipAddress;
    signer.userAgent = meta.userAgent;
    signer.consentedAt = consentedAt || now;
    signer.consentVersion = consentVersion;

    doc.audit.push({
      action: 'consent',
      userId,
      timestamp: signer.consentedAt,
      details: `Agreed to electronic signature disclosure (${consentVersion})`,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent
    });
    doc.audit.push({
      action: 'signed',
      userId,
      timestamp: now,
      signatureHash: sigHash,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent
    });

    const allSigned = doc.signers.every(s => s.signed);
    if (allSigned) {
      doc.status = 'completed';
      doc.completedAt = now;
      doc.audit.push({ action: 'completed', userId: 'system', timestamp: now, details: 'All parties signed' });
      io.to(docId).emit('doc:completed', { doc, completedAt: now });
      console.log(`[completed] doc=${docId}`);
    } else {
      doc.status = 'partial';
      io.to(docId).emit('doc:signed', { doc, signedBy: userId, signature: { data: signatureData, type: signatureType, hash: sigHash }, timestamp: now });
      console.log(`[signed] doc=${docId} user=${userName}(${userId}) ip=${meta.ipAddress} consent=${consentVersion}`);
    }
  });

  socket.on('verify', (payload) => {
    const { docId } = payload;
    const doc = documents.get(docId);
    if (!doc) {
      socket.emit('doc:error', { message: `Document ${docId} not found.` });
      return;
    }

    const result = verifyDocument(doc);
    socket.emit('doc:verified', result);
    doc.audit.push({ action: 'verified', userId: payload.userId || 'unknown', timestamp: new Date().toISOString(), details: result.valid ? 'Passed' : 'Failed', ipAddress: meta.ipAddress, userAgent: meta.userAgent });
    console.log(`[verify] doc=${docId} valid=${result.valid}`);
  });

  socket.on('disconnect', () => {
    console.log(`[disconnect] ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`DocSign server running on http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/test-docsign.html to test`);
});
