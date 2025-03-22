import { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { BsFillPlayFill } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CorneliaSpeech.css";

export default function CorneliaSpeech() {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    
    <div className="d-flex align-items-center justify-content-center vh-100 vw-100 custom-background" style={{ margin: 0, padding: 0 }}
         >
      {/* Logo en haut à gauche */}
      <div className="position-absolute top-0 start-0 m-4 text-start">
        <img 
          src="/img/finalcor.png"  
          alt="Cornelia Speech Logo" 
          style={{ width: "250px", height: "auto" ,
            borderRadius: "2000%",  // Pour rendre l'image ronde
            border: "5px ", // Ajoute une bordure noire de 5px
            objectFit: "cover"  // Pour s'assurer que l'image couvre bien l'espace sans déformer
          }} 
        />
      </div>

      <div
        className="bg-white shadow-lg rounded-4 p-4 text-center d-flex flex-column align-items-center justify-content-center"
        style={{ width: "100vw", height: "100vh" }}
      >
        {/* Bouton Microphone avec cercles animés */}
        <div
          className={`position-relative d-flex align-items-center justify-content-center microphone-container ${
            isRecording ? "recording" : ""
          }`}
          style={{ width: "250px", height: "250px", cursor: "pointer" }}
          onClick={toggleRecording}
        >
          <div
            className="d-flex align-items-center justify-content-center bg-danger rounded-circle"
            style={{ width: "200px", height: "200px", zIndex: "100" }}
          >
            <FaMicrophone className="text-white fs-1" />
          </div>
          <div className="circle circle1"></div>
          <div className="circle circle2"></div>
          <div className="circle circle3"></div>

          {/* Animation d'ondes sonores (style Messenger) */}
          <div
            className="position-absolute bottom-0 w-8000 d-flex justify-content-center"
            style={{ marginBottom: "-200px" }}
          >
            <div className="wave-container">
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Audio en bas à droite */}
      <div
        className="position-absolute bottom-0 end-0 m-4 p-4 bg-white rounded-4 shadow-lg d-flex align-items-center"
        style={{ width: "300px", height: "100px", borderRadius: "12px" }}
      >
        <div className="bg-warning p-3 rounded-circle me-3">
          <BsFillPlayFill className="text-white fs-4" />
        </div>
        <div className="text-start">
          <p className="fw-semibold mb-0">Bernardo - Blandin.mp3</p>
          <p className="text-muted small">Gasy mifety</p>
        </div>
      </div>
    </div>
    
  );
}
