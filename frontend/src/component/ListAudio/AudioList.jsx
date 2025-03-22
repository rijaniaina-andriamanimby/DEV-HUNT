import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Table, Button, Form } from "react-bootstrap";
import { BsTrash, BsPencil, BsPlusCircle } from "react-icons/bs"; // ✅ Import correct
import "./css/AdminAudioPage.css";

export default function AdminAudioPage() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAudio, setNewAudio] = useState({ name: "", author: "", level: "Débutant", type: "MP3" });
  const [editAudio, setEditAudio] = useState(null);

  // Ajout d'audio
  const handleAddAudio = () => {
    if (newAudio.name && newAudio.author) {
      setAudioFiles([...audioFiles, { ...newAudio, id: Date.now(), file: newAudio.file }]);
      setNewAudio({ name: "", author: "", level: "Débutant", type: "MP3", file: null });
      setShowModal(false);
    }
  };

  // get Modifier audio
  const handleEditAudio = (audio) => {
    setEditAudio(audio);
    setNewAudio({ name: audio.name, author: audio.author, level: audio.level, type: audio.type, file: audio.file });
    setShowModal(true);
  };

  // Modifer audio
  const handleUpdateAudio = () => {
    setAudioFiles(audioFiles.map(audio => (audio.id === editAudio.id ? newAudio : audio)));
    setShowModal(false);
    setEditAudio(null);
    setNewAudio({ name: "", author: "", level: "Débutant", type: "MP3", file: null });
  };

  // Suppression audio
  const handleDeleteAudio = (id) => {
    setAudioFiles(audioFiles.filter((audio) => audio.id !== id));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary">Gestion des Fichiers Audio</h1>
      <Button
        variant="success"
        onClick={() => setShowModal(true)}
        className="mb-4"
      >
        <BsPlusCircle size={20} /> Ajouter un Fichier Audio
      </Button>
      <Table striped bordered hover className="custom-table">
        <thead className="bg-primary text-white">
          <tr>
            <th>Nom</th>
            <th>Auteur</th>
            <th>Niveau</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {audioFiles.map((audio) => (
            <tr key={audio.id}>
              <td>{audio.name}</td>
              <td>{audio.author}</td>
              <td>{audio.level}</td>
              <td>{audio.type}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditAudio(audio)}
                >
                  <BsPencil />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteAudio(audio.id)}
                >
                  <BsTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for adding/editing audio files */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editAudio ? "Modifier le Fichier Audio" : "Ajouter un Fichier Audio"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nom du Fichier Audio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nom du fichier audio"
                value={newAudio.name}
                onChange={(e) => setNewAudio({ ...newAudio, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Auteur</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nom de l'auteur"
                value={newAudio.author}
                onChange={(e) => setNewAudio({ ...newAudio, author: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Niveau</Form.Label>
              <Form.Control
                as="select"
                value={newAudio.level}
                onChange={(e) => setNewAudio({ ...newAudio, level: e.target.value })}
              >
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Type de Fichier</Form.Label>
              <Form.Control
                as="select"
                value={newAudio.type}
                onChange={(e) => setNewAudio({ ...newAudio, type: e.target.value })}
              >
                <option value="MP3">MP3</option>
                <option value="WAV">WAV</option>
                <option value="OGG">OGG</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Ajouter un fichier audio</Form.Label>
              <Form.Control
                type="file"
                accept="audio/*"
                onChange={(e) => setNewAudio({ ...newAudio, file: e.target.files[0] })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          <Button
            variant="primary"
            onClick={editAudio ? handleUpdateAudio : handleAddAudio}
          >
            {editAudio ? "Mettre à jour" : "Ajouter"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
