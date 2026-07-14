// STT factory. Returns a transcriber adapter, or null when speech recognition is
// done in the browser (the default, zero-key path).
import { config } from '../config.mjs';
import { deepgram } from './deepgram.mjs';
import { whisperLocal } from './whisper.mjs';

export function getSTT() {
  switch (config.stt.provider) {
    case 'browser': return null;                 // client-side webkitSpeechRecognition
    case 'deepgram': return deepgram(config.stt);
    case 'whisper-local': return whisperLocal(config.stt);
    default:
      console.warn(`[stt] unknown provider "${config.stt.provider}" — falling back to browser speech`);
      return null;
  }
}
