from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import tempfile
import whisper
import torch
import io
import wave
import os
import ffmpeg
from fastapi.middleware.cors import CORSMiddleware
import logging

# Configuration des logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("🚀 Démarrage du serveur...")
device = "cuda" if torch.cuda.is_available() else "cpu"
logger.info(f"🔧 Utilisation du device: {device}")
logger.info("📦 Chargement du modèle Whisper...")
model = whisper.load_model("base", device=device)
logger.info("✅ Modèle Whisper chargé avec succès!")

@app.on_event("startup")
async def startup_event():
    logger.info("✅ Serveur FastAPI démarré!")
    logger.info("🎙️ WebSocket disponible sur: ws://127.0.0.1:8000/ws/transcribe")
    logger.info("🌐 CORS configuré pour: http://localhost:5173")

@app.websocket("/ws/transcribe")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("🔊 Client connecté!")

    audio_buffer = io.BytesIO()

    try:
        while True:
            data = await websocket.receive_bytes()
            audio_buffer.write(data)
            logger.debug(f"📥 Reçu {len(data)} bytes (total: {audio_buffer.tell()} bytes)")

            if audio_buffer.tell() > 16000 * 4 * 3:
                logger.info("🎵 Buffer suffisant, début du traitement...")
                with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmpfile:
                    tmpfile.write(audio_buffer.getvalue())
                    tmpfile.flush()
                    tmp_input = tmpfile.name

                # ✅ Conversion WebM → WAV mono 16kHz
                tmp_wav = tmp_input.replace(".webm", ".wav")
                try:
                    ffmpeg.input(tmp_input).output(
                        tmp_wav,
                        format="wav",
                        acodec="pcm_s16le",
                        ac=1,
                        ar="16000"
                    ).run(quiet=True, overwrite_output=True)
                    logger.info("✅ Conversion audio réussie")
                except Exception as e:
                    logger.error(f"❌ Erreur conversion ffmpeg: {e}")
                    audio_buffer = io.BytesIO()
                    if os.path.exists(tmp_input):
                        os.remove(tmp_input)
                    continue

                # ✅ Transcription Whisper
                logger.info("🎙️ Traitement Whisper en cours...")
                try:
                    result = model.transcribe(tmp_wav, fp16=torch.cuda.is_available())
                    logger.info(f"✅ Transcription: {result['text']}")
                    await websocket.send_text(result["text"])
                except Exception as e:
                    logger.error(f"❌ Erreur transcription: {e}")

                # Nettoyage
                audio_buffer = io.BytesIO()
                if os.path.exists(tmp_input):
                    os.remove(tmp_input)
                if os.path.exists(tmp_wav):
                    os.remove(tmp_wav)

    except WebSocketDisconnect:
        logger.info("👋 Client déconnecté normalement")
    except Exception as e:
        logger.error(f"❌ Erreur WebSocket: {e}")
    finally:
        try:
            await websocket.close()
            logger.info("🔌 WebSocket fermé")
        except:
            pass  # WebSocket déjà fermé
