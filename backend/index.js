// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

// Middleware pour gérer les requêtes JSON
app.use(express.json());

// Middleware pour autoriser les requêtes CORS
app.use(cors());

// Route pour recevoir la transcription du client
app.post('/transcription', (req, res) => {
    const { transcription } = req.body; // La transcription reçue du client
    console.log('Transcription reçue :', transcription);

    // Répondre au client pour confirmer la réception
    res.status(200).send({ message: 'Transcription reçue' });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
