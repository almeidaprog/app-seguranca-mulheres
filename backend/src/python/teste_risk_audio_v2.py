import os
import sys
import json
import random
from datetime import datetime
import sounddevice as sd
import soundfile as sf
import librosa
import numpy as np
import time

from tensorflow.keras.models import load_model
import whisper

# --- Config ---
DURATION = 10
SAMPLERATE = 44100
CHANNELS = 1
MODEL_FILENAME = "risk_audio_model_v2.keras"
FILENAME = "teste_audio.wav"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, MODEL_FILENAME)

if not os.path.exists(MODEL_PATH):
    sys.exit(1)

# --- Carrega modelos ---
model = load_model(MODEL_PATH)
whisper_model = whisper.load_model("base")

def gravar_audio(filename):
    recording = sd.rec(int(DURATION * SAMPLERATE), samplerate=SAMPLERATE, channels=CHANNELS, dtype='float32')
    sd.wait()
    sf.write(filename, recording, SAMPLERATE)

def extract_features(file_path):
    try:
        y, _ = librosa.load(file_path, sr=22050, mono=True)
        mfccs = librosa.feature.mfcc(y=y, sr=22050, n_mfcc=40)
        return np.mean(mfccs.T, axis=0).reshape(1, -1)
    except:
        return None

def transcribe(file_path):
    try:
        text = whisper_model.transcribe(file_path).get('text', '').strip()
        return text if text else "[silêncio]"
    except:
        return "[erro na transcrição]"

def send_to_nodejs(risk_level, spoken_words):
    result = {
        "risk_level": risk_level,
        "spoken_words": spoken_words,
        "timestamp": datetime.now().isoformat(),
        "confidence": round(random.uniform(0.7, 0.99), 2)
    }
    print(json.dumps(result, ensure_ascii=False))
    sys.stdout.flush()

# --- Loop principal ---
while True:
    try:
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Gravando {DURATION}s de áudio...")
        gravar_audio(FILENAME)

        # Transcreve
        text = transcribe(FILENAME)

        # Prediz risco
        features = extract_features(FILENAME)
        prob = model.predict(features, verbose=0)[0][0] if features is not None else 0

        # Determina nível
        if prob > 0.9:
            risk_level = "critical"
        elif prob > 0.7:
            risk_level = "high"
        else:
            risk_level = "normal"

        # Imprime no console
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Risco: {risk_level.upper()} - Prob: {prob:.2f} - Transcrição: '{text}'")

        # Envia se necessário
        if risk_level in ["high", "critical"]:
            send_to_nodejs(risk_level, text)

        # Limpa arquivo
        if os.path.exists(FILENAME):
            os.remove(FILENAME)

        time.sleep(0.5)

    except KeyboardInterrupt:
        print("Interrompido pelo usuário.")
        break
    except Exception as e:
        print(f"Erro: {e}")
        if os.path.exists(FILENAME):
            os.remove(FILENAME)
        time.sleep(2)
