// TTS factory. Returns a synthesizer adapter, or null when speech is done in the
// browser (the default, zero-key path).
import { config } from '../config.mjs';
import { elevenlabs } from './elevenlabs.mjs';
import { cartesia } from './cartesia.mjs';

export function getTTS() {
  switch (config.tts.provider) {
    case 'browser': return null;                 // client-side speechSynthesis
    case 'elevenlabs': return elevenlabs(config.tts);
    case 'cartesia': return cartesia(config.tts);
    default:
      console.warn(`[tts] unknown provider "${config.tts.provider}" — falling back to browser speech`);
      return null;
  }
}
