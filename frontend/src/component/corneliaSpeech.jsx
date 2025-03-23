import { useState, useRef, useEffect } from "react";
import React from "react";
import { FaMicrophone } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CorneliaSpeech.css";
import axios from "axios"; // Importation d'Axios pour les requêtes HTTP

export default function CorneliaSpeech() {
  const [transcription, setTranscription] = useState("");  // État pour la transcription
  const [response, setResponse] = useState("");  // État pour la réponse
  const [isRecording, setIsRecording] = useState(false);  // État pour l'enregistrement
  const audioRef = useRef(null);  // Référence pour l'élément audio

  let recognition;

  // Vérifie si la reconnaissance vocale est supportée
  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.lang = "fr-FR";
    recognition.continuous = true; // Écoute en continu
    recognition.interimResults = false;

    recognition.onresult = function (event) {
      let transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log("Vous avez dit:", transcript); // Affichage de la transcription
      setTranscription(transcript);  // Mise à jour de la transcription dans l'état

      recognition.stop(); // Pause pour éviter de capter la réponse
      respondToSpeech(transcript);  // Répondre à la transcription
    };

    // Fonction pour répondre à la transcription
    function respondToSpeech(transcript) {
      if (!window.speechSynthesis) {
        console.error("Synthèse vocale non supportée.");
        return;
      }

      let responseText = "Je n'ai pas compris. Pouvez-vous reformuler ?";

      if (transcript.includes("bonjour")) {
        responseText = "Bonjour ! Comment puis-je vous aider ?";
      } else if (transcript.includes("comment ça va")) {
        responseText = "Je vais bien, merci ! Et vous ?";
      } else if (transcript.includes("audio")) {
        responseText = "Voici l'audio que vous cherchez";
        fetchAudioFromBackend(transcript);  // Envoie la requête au backend pour récupérer l'audio
      } else if (transcript.includes("quelle heure est-il")) {
        let now = new Date();
        responseText = `Il est ${now.getHours()} heures et ${now.getMinutes()} minutes.`;
      } else if (transcript.includes("quitter la page")) {
        window.location.href = "about:blank"; // Charger une page vide
        return;
      }

      console.log("Réponse:", responseText);
      setResponse(responseText);  // Mise à jour de la réponse dans l'état

      const utterance = new SpeechSynthesisUtterance(responseText);
      utterance.lang = "fr-FR";
      utterance.volume = 1;
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onend = function () {
        console.log("Reprise de l'écoute...");
        recognition.start(); // 🔥 Redémarre après la réponse
      };

      speechSynthesis.speak(utterance);
    }

    // Utilisation d'Axios pour récupérer l'audio depuis le backend
    function fetchAudioFromBackend(transcript) {
      axios
        .get(`http://localhost:3000/searchAudio?title=${encodeURIComponent(transcript)}`)
        .then((response) => {
          const data = response.data;
          if (data.audio) {
            playAudio(data.audio);  // Si un audio est trouvé, joue-le
          } else {
            alert("Aucun audio trouvé pour ce titre.");
          }
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération de l\'audio:', error);
        });
    }

    // Fonction pour jouer l'audio
    function playAudio(audioFileName) {
      if (audioRef.current) {
        audioRef.current.src = `http://localhost:3000/audios/${audioFileName}`;
        audioRef.current.play();
      }
    }

    recognition.onerror = function (event) {
      console.error("Erreur de reconnaissance vocale:", event.error);
      setTimeout(() => recognition.start(), 1000); // Redémarre en cas d'erreur
    };

    recognition.start(); // 🔥 Démarrage automatique de l'écoute
  } else {
    alert("Votre navigateur ne prend pas en charge la reconnaissance vocale.");
  }

  // Fonction pour démarrer ou arrêter l'enregistrement
  const toggleRecording = () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 vw-100 custom-background">
      <div className="position-absolute top-0 start-0 m-4 text-start">
        <img
          src="/img/finalco.JPG"
          alt="Cornelia Speech Logo"
          style={{ width: "350px", borderRadius: "" }}
        />
      </div>

      <div
        className="bg-white shadow-lg rounded-4 p-4 text-center d-flex flex-column align-items-center justify-content-center"
        style={{ width: "100vw", height: "100vh" }}
      >
        <div className="mb-5">
          <h5>Vous avez dit :</h5>
          <p className="fw-bold text-dark">{transcription || "..."}</p>
        </div>

        <div
          className={`position-relative d-flex align-items-center justify-content-center microphone-container ${
            isRecording ? "recording" : ""
          }`}
          style={{ width: "200px", height: "200px", cursor: "pointer" }}
          onClick={toggleRecording}
        >
          <div
            className="d-flex align-items-center justify-content-center bg-primary rounded-circle"
            style={{ width: "150px", height: "150px", zIndex: "100" }}
          >
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
        }}
      >
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
          <audio ref={audioRef} controls className="w-100" />
        </div>
      </div>
    </div>
  );
}
