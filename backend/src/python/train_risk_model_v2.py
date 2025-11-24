import os
import sys
import json
import random
from datetime import datetime
import time
import sounddevice as sd
import soundfile as sf
import librosa
import numpy as np
from tensorflow.keras.models import load_model
import whisper

# --- Configurações ---
DURATION = 10
SAMPLERATE = 44100
CHANNELS = 1
FILENAME = "teste_audio.wav"
MODEL_PATH = "risk_audio_model_v2.keras"
KEYWORDS_RISCO = ["socorro", "ladrão", "fogo", "ajuda", "perigo"]  # palavras que forçam risco

# --- Carrega modelo ---
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Modelo não encontrado: {MODEL_PATH}")
model = load_model(MODEL_PATH)

# --- Inicializa Whisper ---
whisper_model = whisper.load_model("base")

# --- Funções ---
def gravar_audio(filename):
    print(f"🎤 Gravando {DURATION}s de áudio...")
    recording = sd.rec(int(DURATION * SAMPLERATE), samplerate=SAMPLERATE, channels=CHANNELS)
    sd.wait()
    sf.write(filename, recording, SAMPLERATE)
    print(f"✅ Áudio salvo em {filename}")

def extract_features(file_path, sr=22050):
    y, _ = librosa.load(file_path, sr=sr, mono=True)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
    mfccs_mean = np.mean(mfccs.T, axis=0)
    return mfccs_mean.reshape(1, -1)

def transcribe(file_path):
    result = whisper_model.transcribe(file_path)
    return result['text']

def send_to_nodejs(risk_level, spoken_words):
    result = {
        "risk_level": risk_level,
        "spoken_words": spoken_words,
        "timestamp": datetime.now().isoformat(),
        "confidence": round(random.uniform(0.7, 0.99), 2)
    }
    # envia JSON pro Node.js
    print(json.dumps(result, ensure_ascii=False))
    sys.stdout.flush()
    # log no stderr
    print(f"[{datetime.now().strftime('%H:%M:%S')}] 🎧 Detectado: {risk_level.upper()} - '{spoken_words}'", file=sys.stderr)

def check_keywords(text):
    text_lower = text.lower()
    for kw in KEYWORDS_RISCO:
        if kw in text_lower:
            return True
    return False

# --- Loop principal ---
while True:
    try:
        gravar_audio(FILENAME)
        full_feat = extract_features(FILENAME)
        prob = model.predict(full_feat)[0][0]
        text = transcribe(FILENAME)

        # risco se modelo detectar ou se alguma palavra-chave aparecer
        if prob > 0.5 or check_keywords(text):
            send_to_nodejs("risk", text)
        else:
            send_to_nodejs("normal", text)

        time.sleep(1)  # pequeno intervalo antes da próxima gravação
    except KeyboardInterrupt:
        print("🛑 Interrompido pelo usuário.")
        break
    except Exception as e:
        print(f"❌ Erro: {e}", file=sys.stderr)
        time.sleep(2)
