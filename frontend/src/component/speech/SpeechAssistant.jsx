import React, { useState } from 'react';

const SpeechAssistant = () => {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

    // Fonction pour analyser le message et générer une réponse locale
    const getLocalResponse = (text) => {
        if (text.includes("bonjour")) {
            return "Bonjour ! Comment puis-je vous aider ?";
        } else if (text.includes("heure")) {
            return `Il est actuellement ${new Date().toLocaleTimeString()}.`;
        } else if (text.includes("météo")) {
            return "Aujourd'hui, il fait beau et ensoleillé !";
        } else if (text.includes("au revoir")) {
            return "Au revoir ! Passez une excellente journée.";
        }
        return "Désolé, je ne comprends pas.";
    };

    // Fonction pour démarrer la reconnaissance vocale
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; // Compatibilité navigateur
        if (!SpeechRecognition) {
            alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
            return;
        }
    
        const recognition = new SpeechRecognition();
        recognition.lang = 'fr-FR';
        console.log("Commencer");
    
        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setMessage(text);
            const reply = getLocalResponse(text);
            setResponse(reply);
            speakResponse(reply);
        };
    
        recognition.start();
    };
    

    // Fonction pour faire parler l'assistant
    const speakResponse = (text) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        synth.speak(utterance);
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Assistant Vocal 🎙️</h1>
            <button onClick={startListening} style={{ padding: '10px', fontSize: '16px' }}>
                🎤 Parler
            </button>
            <p><b>Vous :</b> {message}</p>
            <p><b>Assistant :</b> {response}</p>
        </div>
    );
};

export default SpeechAssistant;
