import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Card, Form } from "react-bootstrap";
import { Trash, Pencil } from "react-bootstrap-icons";

export default function AdminAudioPage() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [newAudio, setNewAudio] = useState(null);

  const handleAddAudio = () => {
    if (newAudio) {
      setAudioFiles([...audioFiles, { id: Date.now(), name: newAudio.name, file: newAudio }]);
      setNewAudio(null);
    }
  };

  const handleDeleteAudio = (id) => {
    setAudioFiles(audioFiles.filter((audio) => audio.id !== id));
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestion des fichiers audio</h1>
      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Control type="file" accept="audio/*" onChange={(e) => setNewAudio(e.target.files[0])} />
          </Form.Group>
          <Button className="mt-2" onClick={handleAddAudio} disabled={!newAudio}>
            Ajouter
          </Button>
        </Card.Body>
      </Card>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {audioFiles.map((audio) => (
            <tr key={audio.id}>
              <td>{audio.name}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2">
                  <Pencil />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteAudio(audio.id)}>
                  <Trash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
