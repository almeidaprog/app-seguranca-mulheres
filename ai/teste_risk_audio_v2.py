import os

# --- SILENCIAR LOGS DO TENSORFLOW ---
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import warnings
warnings.filterwarnings("ignore")

import librosa
import numpy as np
from tensorflow.keras.models import load_model
import whisper

# --- CONFIGURAÇÕES ---
MODEL_PATH = "risk_audio_model_v2.keras"
AUDIO_BASENAME = "sample"  # nome sem extensão

# --- CARREGA MODELO ---
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Modelo não encontrado em: {MODEL_PATH}")

model = load_model(MODEL_PATH)

# --- INICIALIZA WHISPER ---
whisper_model = whisper.load_model("base")

# --- FUNÇÃO PARA ACHAR ARQUIVO DE ÁUDIO ---
def find_audio_file(base_name):
    exts = [".wav", ".m4a", ".mp3", ".flac", ".ogg", ".mov"]
    for ext in exts:
        file = base_name + ext
        if os.path.exists(file):
            return file
    raise FileNotFoundError(
        f"Nenhuma versão do arquivo '{base_name}' encontrada "
        f"com extensões: {', '.join(exts)}"
    )

# --- FUNÇÃO DE EXTRAÇÃO DE FEATURES ---
def extract_features(file_path, sr=22050):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Áudio não encontrado: {file_path}")
    y, _ = librosa.load(file_path, sr=sr, mono=True)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=27)  # igual ao treino
    mfccs_mean = np.mean(mfccs.T, axis=0)
    return mfccs_mean.reshape(1, -1)

# --- FUNÇÃO DE TRANSCRIÇÃO ---
def transcribe(file_path):
    result = whisper_model.transcribe(file_path)
    return result['text']


# --- EXECUÇÃO ---
TEST_AUDIO_PATH = find_audio_file(AUDIO_BASENAME)

# extrai features
full_feat = extract_features(TEST_AUDIO_PATH)

# predição
prob = model.predict(full_feat)[0][0]

# transcrição
text = transcribe(TEST_AUDIO_PATH)

# saída
print(f"🗣️ Transcrição: {text}")

if prob > 0.5:
    print(f"⚠️ Risco detectado! Probabilidade: {prob*100:.2f}%")
else:
    print(f"🎯 Resultado: Normal ({prob*100:.2f}% de chance de risco)")
