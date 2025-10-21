import React, { useState, useRef } from "react";

const Recorder = () => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const ws = useRef(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    ws.current = new WebSocket("ws://127.0.0.1:8000/ws/transcribe");
    ws.current.onmessage = (event) => setTranscript((prev) => prev + " " + event.data);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });
    mediaRecorderRef.current = mediaRecorder;

    // ✅ Envoi des chunks audio sous forme de bytes purs
    mediaRecorder.ondataavailable = async (e) => {
      if (ws.current.readyState === WebSocket.OPEN) {
        const arrayBuffer = await e.data.arrayBuffer();
        ws.current.send(arrayBuffer);
      }
    };

    mediaRecorder.start(500); // envoie un chunk toutes les 500 ms
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current?.stop();
    ws.current?.close();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Transcripto 🎙️</h1>
      <button
        className={`px-4 py-2 rounded ${recording ? "bg-red-500" : "bg-green-500"} text-white`}
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? "Stop" : "Start"} Recording
      </button>

      <div className="mt-4 p-2 bg-gray-100 rounded min-h-[100px]">
        <p className="whitespace-pre-wrap">{transcript || "🎧 En attente de transcription..."}</p>
      </div>
    </div>
  );
};

export default Recorder;
