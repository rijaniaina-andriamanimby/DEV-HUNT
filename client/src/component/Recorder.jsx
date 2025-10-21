import React, { useState, useRef } from "react";

const Recorder = () => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("Prêt");
  const ws = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const sendIntervalRef = useRef(null);

  const startRecording = async () => {
    try {
      setStatus("Connexion au serveur...");
      console.log("🔌 Tentative de connexion WebSocket...");
      
      ws.current = new WebSocket("ws://127.0.0.1:8000/ws/transcribe");
      
      ws.current.onopen = () => {
        console.log("✅ WebSocket connecté!");
        setStatus("Connecté - En enregistrement");
      };
      
      ws.current.onmessage = (event) => {
        console.log("📩 Transcription reçue:", event.data);
        setTranscript((prev) => prev + " " + event.data);
      };
      
      ws.current.onerror = (error) => {
        console.error("❌ Erreur WebSocket:", error);
        setStatus("Erreur de connexion!");
        alert("❌ Impossible de se connecter au serveur!\n\nVérifiez que le serveur est démarré:\ncd server\nuvicorn main:app --reload --host 127.0.0.1 --port 8000");
      };
      
      ws.current.onclose = () => {
        console.log("🔌 WebSocket fermé");
        setStatus("Déconnecté");
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; // Sauvegarder le stream pour le cleanup
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;

      // ✅ Accumuler tous les chunks et envoyer à la fin
      let chunks = [];
      
      mediaRecorder.ondataavailable = async (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          console.log(`📥 Chunk reçu: ${e.data.size} bytes (total chunks: ${chunks.length})`);
        }
      };
      
      // ✅ Envoyer quand on a assez de données
      sendIntervalRef.current = setInterval(() => {
        if (chunks.length > 0 && ws.current?.readyState === WebSocket.OPEN) {
          const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
          console.log(`📤 Envoi de ${blob.size} bytes (${chunks.length} chunks)`);
          blob.arrayBuffer().then(buffer => {
            ws.current.send(buffer);
          });
          chunks = []; // Reset après envoi
        }
      }, 3000); // Envoyer toutes les 3 secondes

      mediaRecorder.start(500); // Collecter des chunks toutes les 500 ms
      setRecording(true);
    } catch (error) {
      console.error("❌ Erreur démarrage:", error);
      setStatus("Erreur!");
      alert("❌ Erreur: " + error.message);
    }
  };

  const stopRecording = () => {
    console.log("⏹️ Arrêt de l'enregistrement");
    setRecording(false);
    setStatus("Arrêté");
    
    // Arrêter l'interval d'envoi
    if (sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = null;
    }
    
    // Arrêter le MediaRecorder
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    
    // Arrêter tous les tracks audio
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Fermer le WebSocket
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Transcripto 🎙️</h1>
      
      <div className="mb-4">
        <span className={`px-3 py-1 rounded-full text-sm ${
          status.includes("Erreur") ? "bg-red-200 text-red-800" :
          status.includes("Connecté") ? "bg-green-200 text-green-800" :
          status.includes("Connexion") ? "bg-yellow-200 text-yellow-800" :
          "bg-gray-200 text-gray-800"
        }`}>
          {status}
        </span>
      </div>
      
      <button
        className={`px-4 py-2 rounded ${recording ? "bg-red-500" : "bg-green-500"} text-white`}
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? "⏹️ Stop" : "🎙️ Start"} Recording
      </button>

      <div className="mt-4 p-2 bg-gray-100 rounded min-h-[100px]">
        <p className="whitespace-pre-wrap">{transcript || "🎧 En attente de transcription..."}</p>
      </div>
    </div>
  );
};

export default Recorder;
