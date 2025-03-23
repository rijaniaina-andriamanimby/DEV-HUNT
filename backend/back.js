// backend/server.js
const express = require('express');
const path = require('path');
const pool = require('./db');  // Assure-toi d'importer ton fichier db.js
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware pour servir les fichiers audio statiques
app.use('/audios', express.static(path.join(__dirname, 'audio')));

app.use(cors()); // Permet les requêtes CORS depuis le frontend

// Route pour rechercher un titre (par exemple "musique") dans la base de données
app.get('/searchAudio', (req, res) => {
    const title = req.query.title;  // Récupère le titre envoyé depuis le frontend

    if (!title) {
        return res.status(400).json({ message: 'Titre manquant' });
    }

    // Recherche dans la base de données (insensible à la casse)
    const query = 'SELECT* FROM formation WHERE titre LIKE $1';  // Utilisation de LIKE pour une recherche partielle
    pool.query(query, [`%${title}%`])  // Utilisation de LIKE pour rechercher partiellement
        .then(result => {
            if (result.rows.length > 0) {
                const audioFile = result.rows[0].audio;  // Récupère le nom du fichier audio
                res.json({ audio: audioFile });  // Renvoie le fichier audio trouvé
            } else {
                res.json({ audio: null });  // Aucun audio trouvé
            }
        })
        .catch(error => {
            console.error('Erreur de base de données:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        });
});

// Démarre le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
