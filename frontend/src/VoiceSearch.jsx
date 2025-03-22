import React, { useState, useEffect } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (!recognition) {
  alert("Votre navigateur ne supporte pas la reconnaissance vocale !");
}

recognition.continuous = false;
recognition.lang = "fr-FR";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const VoiceSearch = () => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!recognition) return;

    console.log("Démarrage de la reconnaissance vocale...");
    recognition.start();

    recognition.onresult = (event) => {
      console.log("Résultat reçu :", event.results);
      const speechResult = event.results[0][0].transcript;
      console.log("Texte détecté :", speechResult);
      setText(speechResult);
    };

    recognition.onerror = (event) => {
      console.error("Erreur de reconnaissance vocale :", event.error);
    };

    return () => {
      recognition.stop();
      console.log("Reconnaissance vocale arrêtée.");
    };
  }, []);

  return (
    <div className="container text-center mt-5">
      <h2>Reconnaissance Vocale</h2>
      <p>Parlez, l'écoute est en cours...</p>
      <div className="mt-3 alert alert-info">{text || "En attente de parole..."}</div>
    </div>
  );
};

export default VoiceSearch;
