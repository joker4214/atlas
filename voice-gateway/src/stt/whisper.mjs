// Local Whisper STT adapter (whisper.cpp / faster-whisper HTTP server).
// transcribe(audioBuffer, mime) -> text. Keeps audio on your own machine.
export function whisperLocal({ whisperEndpoint }) {
  return {
    name: 'whisper-local',
    async transcribe(audioBuffer, mime = 'audio/webm') {
      // Most local whisper servers accept multipart/form-data with an audio file.
      const form = new FormData();
      form.append('file', new Blob([audioBuffer], { type: mime }), 'utterance.webm');
      form.append('response_format', 'json');
      const res = await fetch(`${whisperEndpoint.replace(/\/$/, '')}/inference`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`whisper-local ${res.status}: ${await res.text()}`);
      const json = await res.json();
      return json.text ?? json.transcription ?? '';
    },
  };
}
