import os
import sys
import json
import random
from datetime import datetime
import sounddevice as sd
import soundfile as sf
import librosa
import numpy as np

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

from tensorflow.keras.models import load_model
import whisper
import time

# --- Config ---
DURATION = 10
SAMPLERATE = 44100
CHANNELS = 1
MODEL_FILENAME = "risk_audio_model_v2.keras"
FILENAME = "teste_audio.wav"

# --- Define caminhos absolutos ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, MODEL_FILENAME)

print(f" Procurando modelo em: {MODEL_PATH}", file=sys.stderr)

# --- Verifica se modelo existe ---
if not os.path.exists(MODEL_PATH):
    error_msg = f"Modelo nao encontrado: {MODEL_PATH}"
    print(error_msg, file=sys.stderr)
    sys.exit(1)

# --- Carrega modelo ---
try:
    print("Carregando modelo de audio...", file=sys.stderr)
    model = load_model(MODEL_PATH)
    print("Modelo carregado com sucesso!", file=sys.stderr)
except Exception as e:
    error_msg = f"Erro ao carregar modelo: {e}"
    print(error_msg, file=sys.stderr)
    sys.exit(1)

# --- Inicializa Whisper ---
try:
    print("Carregando modelo Whisper...", file=sys.stderr)
    whisper_model = whisper.load_model("base")
    print("Whisper carregado com sucesso!", file=sys.stderr)
except Exception as e:
    error_msg = f"Erro ao carregar Whisper: {e}"
    print(error_msg, file=sys.stderr)
    sys.exit(1)

# --- Funções ---
def gravar_audio(filename):
    print(f"Gravando {DURATION}s de audio...", file=sys.stderr)
    recording = sd.rec(int(DURATION * SAMPLERATE), samplerate=SAMPLERATE, channels=CHANNELS)
    sd.wait()
    sf.write(filename, recording, SAMPLERATE)
    print(f" Audio salvo em {filename}", file=sys.stderr)

def extract_features(file_path, sr=22050):
    try:
        y, _ = librosa.load(file_path, sr=sr, mono=True)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
        mfccs_mean = np.mean(mfccs.T, axis=0)
        return mfccs_mean.reshape(1, -1)
    except Exception as e:
        print(f"Erro ao extrair features: {e}", file=sys.stderr)
        return None

def transcribe(file_path):
    try:
        result = whisper_model.transcribe(file_path)
        return result['text'].strip()
    except Exception as e:
        print(f"Erro na transcricao: {e}", file=sys.stderr)
        return ""

def send_to_nodejs(risk_level, spoken_words):
    result = {
        "risk_level": risk_level,
        "spoken_words": spoken_words,
        "timestamp": datetime.now().isoformat(),
        "confidence": round(random.uniform(0.7, 0.99), 2)
    }
    print(json.dumps(result, ensure_ascii=False))
    sys.stdout.flush()
    print(f"[{datetime.now().strftime('%H:%M:%S')}] ALERTA {risk_level.upper()} - '{spoken_words}'", file=sys.stderr)

# --- Loop principal ---
print("Iniciando monitoramento de audio...", file=sys.stderr)

while True:
    try:
        # Sempre sobrescreve o arquivo
        gravar_audio(FILENAME)


        features = extract_features(FILENAME)
        if features is None:
            print(" Erro na extracao de features - continuando...", file=sys.stderr)
            # Limpa arquivo mesmo com erro
            try:
                if os.path.exists(FILENAME):
                    os.remove(FILENAME)
            except:
                pass
            time.sleep(1)
            continue


        prob = model.predict(features, verbose=0)[0][0]

        text = transcribe(FILENAME)
        if not text:
            text = "Nao foi possivel transcrever o audio"

        risk_level = None
        if prob > 0.9:
            risk_level = "critical"
        elif prob > 0.7:
            risk_level = "high"


        if risk_level in ["high", "critical"]:
            send_to_nodejs(risk_level, text)
        else:
            # Apenas log no console para normais/baixos
            print(f"[{datetime.now().strftime('%H:%M:%S')}]  Normal - Prob: {prob:.2f} - '{text}'", file=sys.stderr)


        try:
            if os.path.exists(FILENAME):
                os.remove(FILENAME)
        except:
            pass

        time.sleep(0.5)

    except KeyboardInterrupt:
        print("Interrompido pelo usuario.", file=sys.stderr)
        break
    except Exception as e:
        print(f" Erro no loop principal: {e}", file=sys.stderr)
        # Limpa arquivo mesmo com erro
        try:
            if os.path.exists(FILENAME):
                os.remove(FILENAME)
        except:
            pass
        time.sleep(2)
        
    except KeyboardInterrupt:
        print("Interrompido pelo usuario.", file=sys.stderr)
        break
    except Exception as e:
        print(f"Erro no loop principal: {e}", file=sys.stderr)
        time.sleep(2)