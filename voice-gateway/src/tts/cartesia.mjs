// Cartesia TTS adapter. synthesize(text) -> { audio: Buffer, mime: string }.
export function cartesia({ cartesiaKey, cartesiaVoice }) {
  if (!cartesiaKey || !cartesiaVoice) {
    console.warn('[tts:cartesia] CARTESIA_API_KEY / CARTESIA_VOICE_ID not set — this adapter will error if used.');
  }
  return {
    name: 'cartesia',
    async synthesize(text) {
      const res = await fetch('https://api.cartesia.ai/tts/bytes', {
        method: 'POST',
        headers: {
          'X-API-Key': cartesiaKey,
          'Cartesia-Version': '2024-06-10',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model_id: 'sonic-english',
          transcript: text,
          voice: { mode: 'id', id: cartesiaVoice },
          output_format: { container: 'mp3', encoding: 'mp3', sample_rate: 44100 },
        }),
      });
      if (!res.ok) throw new Error(`cartesia ${res.status}: ${await res.text()}`);
      const audio = Buffer.from(await res.arrayBuffer());
      return { audio, mime: 'audio/mpeg' };
    },
  };
}
