// ElevenLabs TTS adapter. synthesize(text) -> { audio: Buffer, mime: string }.
export function elevenlabs({ elevenKey, elevenVoice }) {
  if (!elevenKey || !elevenVoice) {
    console.warn('[tts:elevenlabs] ELEVENLABS_API_KEY / ELEVENLABS_VOICE_ID not set — this adapter will error if used.');
  }
  return {
    name: 'elevenlabs',
    async synthesize(text) {
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${elevenVoice}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'xi-api-key': elevenKey, 'content-type': 'application/json', accept: 'audio/mpeg' },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',           // low-latency, good for conversation
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      });
      if (!res.ok) throw new Error(`elevenlabs ${res.status}: ${await res.text()}`);
      const audio = Buffer.from(await res.arrayBuffer());
      return { audio, mime: 'audio/mpeg' };
    },
  };
}
