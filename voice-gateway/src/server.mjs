#!/usr/bin/env node
// Atlas Voice Gateway — bridges spoken conversation to the orchestrator.
//
//   speech  ──STT──▶  OrchestratorBridge (file bus)  ──▶  reply text  ──TTS──▶  speech
//
// Default transport is the browser app, which does STT/TTS client-side (Web
// Speech API) so it runs with zero API keys. Set STT_PROVIDER / TTS_PROVIDER to
// move recognition/synthesis server-side (Deepgram / ElevenLabs / Cartesia).
import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { config, isClientSpeech } from './config.mjs';
import { OrchestratorBridge } from './orchestrator-bridge.mjs';
import { getSTT } from './stt/index.mjs';
import { getTTS } from './tts/index.mjs';
import { twimlIncoming, attachTwilio } from './transport/twilio.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(HERE, '..', 'public');
const bridge = new OrchestratorBridge();
const stt = getSTT();   // null => browser does STT
const tts = getTTS();   // null => browser does TTS

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ico': 'image/x-icon' };

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/config') {
    return json(res, {
      clientSpeech: isClientSpeech(),
      sttProvider: config.stt.provider,
      ttsProvider: config.tts.provider,
      transport: config.transport,
      wakeWord: config.wakeWord,
    });
  }

  // Twilio phone transport (production add-on).
  if (url.pathname === '/twilio/incoming' && config.transport === 'twilio') {
    res.writeHead(200, { 'content-type': 'text/xml' });
    return res.end(twimlIncoming(req.headers.host));
  }

  // Static: serve the browser voice app.
  let file = url.pathname === '/' ? '/index.html' : url.pathname;
  const path = join(PUBLIC, file);
  if (!path.startsWith(PUBLIC) || !existsSync(path)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' });
  res.end(readFileSync(path));
});

// WebSocket: the live voice channel with the browser.
const wss = new WebSocketServer({
  server,
  path: '/ws',
  verifyClient(info) {
    const origin = info.req.headers.origin || info.req.headers.referer;
    const host = info.req.headers.host;
    // Allow same-origin connections. For localhost/127.0.0.1, allow any origin
    // since it's a dev machine. For production, require matching origin.
    if (origin && host) {
      const originUrl = new URL(origin);
      const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('::1');
      if (!isLocalhost && !origin.includes(host)) {
        console.warn(`[ws] rejected connection from untrusted origin: ${origin}`);
        return false;
      }
    }
    return true;
  }
});
wss.on('connection', (ws) => {
  send(ws, { type: 'ready', mode: bridge.mode, clientSpeech: isClientSpeech() });

  ws.on('message', async (raw) => {
    let msg; try { msg = JSON.parse(raw.toString()); } catch { return; }
    try {
      // 1. Get the user's words — either the client already transcribed, or we run STT.
      let text = msg.text;
      if (msg.type === 'audio' && stt) {
        const audio = Buffer.from(msg.dataBase64, 'base64');
        text = await stt.transcribe(audio, msg.mime || 'audio/webm');
        send(ws, { type: 'transcript', text });      // echo what we heard
      }
      if (!text || !text.trim()) return;

      // 2. Ask the orchestrator (over the bus, or mock).
      send(ws, { type: 'thinking' });
      const { text: reply, mode } = await bridge.ask(text, { via: 'voice' });

      // 3. Speak the reply — server-side TTS if configured, else let the client speak it.
      if (tts) {
        const { audio, mime } = await tts.synthesize(reply);
        send(ws, { type: 'audio-reply', text: reply, mime, dataBase64: audio.toString('base64'), mode });
      } else {
        send(ws, { type: 'say', text: reply, mode });
      }
    } catch (err) {
      console.error('[ws] error:', err);
      send(ws, { type: 'error', message: String(err.message || err) });
    }
  });
});

if (config.transport === 'twilio') attachTwilio(server, wss);

function send(ws, obj) { if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(obj)); }
function json(res, obj) { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); }

server.listen(config.port, () => {
  console.log(`\n  Atlas Voice Gateway`);
  console.log(`  ▸ http://localhost:${config.port}   (open this and click the mic)`);
  console.log(`  ▸ transport: ${config.transport}   STT: ${config.stt.provider}   TTS: ${config.tts.provider}`);
  console.log(`  ▸ orchestrator: ${bridge.mode}${bridge.mode === 'mock' ? '  (fleet not running — mock replies; `npm run fleet:start` for the real team)' : ''}\n`);
});
