from fastapi import FastAPI, WebSocket
import tempfile
import whisper
import torch
import io
import wave
import os
import ffmpeg

app = FastAPI()

device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("base", device=device)

@app.websocket("/ws/transcribe")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connecté 🔊")

    audio_buffer = io.BytesIO()

    try:
        while True:
            data = await websocket.receive_bytes()
            audio_buffer.write(data)

            if audio_buffer.tell() > 16000 * 4 * 3:
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
                except Exception as e:
                    print("Erreur conversion ffmpeg:", e)
                    continue

                # ✅ Transcription Whisper
                print("🎙️ Traitement Whisper...")
                result = model.transcribe(tmp_wav, fp16=torch.cuda.is_available())
                print("✅ Transcrit :", result["text"])
                await websocket.send_text(result["text"])

                # Nettoyage
                audio_buffer = io.BytesIO()
                os.remove(tmp_input)
                os.remove(tmp_wav)

    except Exception as e:
        print("❌ Déconnexion du client :", e)
    finally:
        await websocket.close()
