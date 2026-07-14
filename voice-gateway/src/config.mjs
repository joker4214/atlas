// Voice-gateway configuration, read from the environment (see ../../.env.example).
import 'dotenv/config';

export const config = {
  transport: process.env.VOICE_TRANSPORT || 'browser',   // browser | twilio
  port: Number(process.env.VOICE_PORT || 5111),

  // Hands-free wake word. Say it to start a turn without touching the mic.
  // Empty string disables hands-free (push-to-talk only).
  wakeWord: (process.env.WAKE_WORD ?? 'Atlas').trim(),

  stt: {
    provider: process.env.STT_PROVIDER || 'browser',      // browser | deepgram | whisper-local | openai
    deepgramKey: process.env.DEEPGRAM_API_KEY || '',
    whisperEndpoint: process.env.WHISPER_ENDPOINT || 'http://127.0.0.1:9000',
  },
  tts: {
    provider: process.env.TTS_PROVIDER || 'browser',      // browser | elevenlabs | cartesia | openai
    elevenKey: process.env.ELEVENLABS_API_KEY || '',
    elevenVoice: process.env.ELEVENLABS_VOICE_ID || '',
    cartesiaKey: process.env.CARTESIA_API_KEY || '',
    cartesiaVoice: process.env.CARTESIA_VOICE_ID || '',
  },
  bus: {
    home: process.env.CORTEXTOS_HOME || './.cortextos',
    agent: 'boss',                                        // the orchestrator instance we talk to
    // If the fleet isn't running (e.g. local dev), the bridge returns a mock
    // reply so the voice loop is still testable end-to-end.
    mock: process.env.ATLAS_VOICE_MOCK === '1',
    replyTimeoutMs: Number(process.env.ATLAS_REPLY_TIMEOUT_MS || 60000),
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    number: process.env.TWILIO_PHONE_NUMBER || '',
    publicUrl: process.env.VOICE_PUBLIC_URL || '',
  },
};

/** True when no server-side STT/TTS keys are set — the browser does speech itself. */
export const isClientSpeech = () =>
  (config.stt.provider === 'browser') && (config.tts.provider === 'browser');
