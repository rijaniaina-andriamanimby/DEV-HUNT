import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Table, Button, Form } from "react-bootstrap";
import { BsTrash, BsPencil, BsPlusCircle } from "react-icons/bs"; // ✅ Import correct
import "./css/AdminAudioPage.css";
import Swal from "sweetalert2";
import axios from "axios";

export default function AdminAudioPage() {
  const [audioFiles, setAudioFiles] = useState([])
  const [audio, setAudio] = useState("")
  const [titre, setTitre] = useState("")
  const [auteur, setAuteur] = useState("")
  const [niveau, setNiveau] = useState("")
  const [type, setType] = useState("")
  const [showModal, setShowModal] = useState(false); // Pour afficher/masquer la modal
  const [editAudio, setEditAudio] = useState(null); // Pour savoir si un audio est en mode édition

  //get data
  const handleData = async () =>{
    try {
      let response = await axios.get("http://localhost:/"); // Assurez-vous que l'URL est correcte
      if (Array.isArray(response.data)) {
        setAudioFiles(response.data);
      } else {
        console.error("Les données reçues ne sont pas un tableau :", response.data);
        setAudioFiles([]); // Évite l'erreur en réinitialisant à un tableau vide
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des fichiers audio :", error);
      setAudioFiles([]); // En cas d'erreur, évite l'erreur de mapping
    }
  }
  useEffect(()=>{
    handleData();
  },[])

  // Ajout d'audio
  const handleAddAudio = async (e) => {
    let formData = new FormData();
    formData.append("audio", audio)
    formData.append("titre", titre)
    formData.append("auteur", auteur)
    formData.append("niveau", niveau)
    formData.append("type", type)

    await axios ({
      method: 'post',
      url:'',
      data : formData
    })
    .then((response) => {
      console.log(response)
      Swal.fire({
        title: "Succés!",
        text: "Ajout effectuer",
        icon: "success"
      });
    })
    .catch((err) => {
      e.preventDefault()
      console.log(err)
      Swal.fire({
        title: "Erreur !",
        text: "Une erreur est survenue. veuillez réessayer !",
        icon: "error"
      });
    })
  };

  // get Modifier audio
  const handleEditAudio = (audio) => {
    setEditAudio(audio);
    setNewAudio({ name: audio.name, author: audio.author, level: audio.level, type: audio.type, file: audio.file });
    setShowModal(true);
  };

  // Modifer audio
  const handleUpdateAudio = async (id) => {
    let formData = new FormData();
    formData.append("audio", audio)
    formData.append("titre", titre)
    formData.append("auteur", auteur)
    formData.append("niveau", niveau)
    formData.append("type", type)

    await axios ({
      method: 'put',
      url:'' + id,
      data : formData
    })
    .then((response) => {
      console.log(response)
      Swal.fire({
        title: "Succés!",
        text: "Modification effectuer",
        icon: "success"
      });
    })
    .catch((err) => {
      e.preventDefault()
      console.log(err)
      Swal.fire({
        title: "Erreur !",
        text: "Une erreur est survenue. veuillez réessayer !",
        icon: "error"
      });
    })
  };

  // Suppression audio
  const handleDeleteAudio = async (id) => {
    await axios({
      method: 'delete',
      url:'' + id,
    })
    .then(()=>{
      console.log("supprimer")
    })
    .catch((err)=>{
      console.log(err.message)
    })
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
                value={titre}
                onChange={(e) => setTitre( e.target.value )}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Niveau</Form.Label>
              <Form.Control
                as="select"
                value={niveau}
                onChange={(e) => setNiveau(e.target.value)}
              >
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Type de Fichier</Form.Label>
              <Form.Control
                as="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
              </Form.Control></Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Auteur</Form.Label>
              <Form.Control
                as="text"
                value={auteur}
                onChange={(e) => setAuteur(e.target.value)}
              >
              </Form.Control>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Ajouter un fichier audio</Form.Label>
              <Form.Control
                type="file"
                accept="audio/*"
                onChange={(e) => setAudio(e.target.files[0])}
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
