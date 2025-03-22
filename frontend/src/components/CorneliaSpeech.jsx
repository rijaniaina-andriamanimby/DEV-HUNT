import { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { BsFillPlayFill } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CorneliaSpeech() {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <div className="bg-white shadow-lg rounded-4 p-4 text-center">
        <h1 className="fs-4 fw-bold text-decoration-underline mb-4">
          CORNELIA SPEECH
        </h1>

        {/* Bouton Microphone avec cercles animés */}
        <div
          className="position-relative d-flex align-items-center justify-content-center"
          style={{ width: "150px", height: "150px", cursor: "pointer" }}
          onClick={toggleRecording}
        >
          <div
            className="position-absolute bg-danger rounded-circle"
            style={{
              width: "180px",
              height: "180px",
              opacity: "0.3",
            }}
          ></div>
          <div
            className="position-absolute bg-danger rounded-circle"
            style={{
              width: "160px",
              height: "160px",
              opacity: "0.4",
            }}
          ></div>
          <div
            className="d-flex align-items-center justify-content-center bg-danger rounded-circle"
            style={{ width: "120px", height: "120px" }}
          >
            <FaMicrophone className="text-white fs-2" />
          </div>
        </div>

        {/* Section Audio */}
        <div className="mt-4 d-flex align-items-center p-3 bg-light rounded-3">
          <div className="bg-warning p-3 rounded-circle me-3">
            <BsFillPlayFill className="text-white fs-4" />
          </div>
          <div className="text-start">
            <p className="fw-semibold mb-0">Bernardo - Blandin.mp3</p>
            <p className="text-muted small">Gasy mifety</p>
          </div>
        </div>

        {/* Ondes sonores (Barre de visualisation) */}
        <div className="mt-4 d-flex justify-content-center">
          <div
            className="bg-black rounded-3"
            style={{ width: "200px", height: "10px" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
