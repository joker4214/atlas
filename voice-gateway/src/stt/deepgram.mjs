// Deepgram STT adapter. transcribe(audioBuffer, mime) -> text.
// Uses the prerecorded endpoint per utterance; swap to the streaming websocket
// API for lower latency once the browser streams live audio chunks.
export function deepgram({ deepgramKey }) {
  if (!deepgramKey) console.warn('[stt:deepgram] DEEPGRAM_API_KEY not set — this adapter will error if used.');
  return {
    name: 'deepgram',
    async transcribe(audioBuffer, mime = 'audio/webm') {
      const res = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true', {
        method: 'POST',
        headers: { Authorization: `Token ${deepgramKey}`, 'content-type': mime },
        body: audioBuffer,
      });
      if (!res.ok) throw new Error(`deepgram ${res.status}: ${await res.text()}`);
      const json = await res.json();
      return json?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? '';
    },
  };
}
