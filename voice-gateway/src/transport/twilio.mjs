// Twilio Voice transport (production add-on): call a phone number and talk to Atlas.
//
// This is a documented stub. The browser transport is the first, zero-account
// path; wiring Twilio is the "call your employee from anywhere" upgrade and
// needs a Twilio number + a public URL (VOICE_PUBLIC_URL) Twilio can reach.
//
// Shape of the integration:
//   1. Point your Twilio number's Voice webhook at  POST {VOICE_PUBLIC_URL}/twilio/incoming
//   2. Return TwiML that opens a <Connect><Stream> to  wss://{host}/twilio/media
//   3. Twilio streams μ-law/8k audio frames over that socket; feed them to a
//      streaming STT (Deepgram), run the OrchestratorBridge on final transcripts,
//      synthesize the reply (ElevenLabs/Cartesia), and stream audio frames back.
//
// Because it shares the OrchestratorBridge and the STT/TTS adapters with the
// browser transport, only the media framing differs.
import { config } from '../config.mjs';

export function twimlIncoming(host) {
  const wsUrl = `wss://${host}/twilio/media`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Connecting you to Atlas.</Say>
  <Connect>
    <Stream url="${wsUrl}"/>
  </Connect>
</Response>`;
}

export function attachTwilio(/* server, wss */) {
  if (!config.twilio.accountSid) {
    console.warn('[transport:twilio] Twilio not configured — set TWILIO_* and VOICE_PUBLIC_URL to enable the phone transport.');
    return false;
  }
  // TODO: implement /twilio/incoming (returns twimlIncoming) and the
  // /twilio/media websocket (μ-law framing <-> STT/TTS). Left as a stub so the
  // browser transport ships first; the bridge + adapters are already reusable.
  console.log('[transport:twilio] configured; media bridge not yet implemented (see this file).');
  return true;
}
