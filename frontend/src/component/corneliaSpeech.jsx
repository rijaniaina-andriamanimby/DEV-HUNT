import { useState, useRef, useEffect } from "react";
import React from "react";
import { FaMicrophone } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CorneliaSpeech.css";

export default function CorneliaSpeech() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [response, setResponse] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscription(text);
      generateResponse(text);
    };

    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const generateResponse = (text) => {
    let reply = "Je ne suis pas sûr de comprendre.";
    if (text.toLowerCase().includes("bonjour")) {
      reply = "Bonjour ! Comment puis-je vous aider ?";
    } else if (text.toLowerCase().includes("comment ça va")) {
      reply = "Je vais bien, merci ! Et vous ?";
    } else if (text.toLowerCase().includes("quel est ton nom")) {
      reply = "Je suis Cornelia, votre assistante vocale.";
    }

    setResponse(reply);
    speakResponse(reply);
  };

  const speakResponse = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    synth.speak(utterance);
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 vw-100 custom-background">
      <div className="position-absolute top-0 start-0 m-4 text-start">
        <img 
          src="/img/finalcor.png"  
          alt="Cornelia Speech Logo" 
          style={{ width: "250px", borderRadius: "50%" }} 
        />
      </div>

      <div className="bg-white shadow-lg rounded-4 p-4 text-center d-flex flex-column align-items-center justify-content-center" style={{ width: "100vw", height: "100vh" }}>
        <div className="mb-5">
          <h5>Vous avez dit :</h5>
          <p className="fw-bold text-dark">{transcription || "..."}</p>
        </div>

        <div
          className={`position-relative d-flex align-items-center justify-content-center microphone-container ${isRecording ? "recording" : ""}`}
          style={{ width: "200px", height: "200px", cursor: "pointer" }}
          onClick={toggleRecording}
        >
          <div className="d-flex align-items-center justify-content-center bg-primary rounded-circle" style={{ width: "150px", height: "150px", zIndex: "100" }}>
            <FaMicrophone className="text-white fs-1" />
          </div>
          <div className="circle circle1"></div>
          <div className="circle circle2"></div>
          <div className="circle circle3"></div>
        </div>

        <div className="mt-5">
          <h5>Réponse :</h5>
          <p className="text-primary fw-bold">{response || "..."}</p>
        </div>

        <div className="mt-3 w-100 d-flex justify-content-center">
          <div className="wave-container">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="wave-bar"></div>
            ))}
          </div>
        </div>
      </div>
      {/* Section Audio en bas à droite */}
      <div
      className="position-absolute bottom-0 end-0 m-4 p-4 bg-white rounded-4 shadow-lg d-flex align-items-center"
      style={{
        width: "350px",
        height: "100px",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease-in-out",
      }}>
      {/* Image de l'album */}
      <div
        className="audio-cover"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <img
          src="img/icons8-volume-élevé-64.png"
          alt="Cover"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div className="d-flex flex-column ms-3" style={{ flex: 1 }}>

        {/* Barre de progression de l'audio */}
        <audio ref={audioRef} controls className="w-100">
          <source src="audio/Lewis_Capaldi_-_Hold_Me_While_You_Wait_(Lyrics)(128k).mp3" />
        </audio>
      </div>

      {/* Bouton Play/Pause */}
      
    </div>
    </div>
  );
}
