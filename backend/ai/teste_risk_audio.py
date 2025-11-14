import os
import warnings
warnings.filterwarnings("ignore")
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import numpy as np
import librosa
import tensorflow as tf
from tensorflow.keras.models import load_model
import whisper

# Carrega o modelo treinado
model = load_model("risk_audio_model.h5")

# Função pra extrair features igual no treino
def extract_features(audio_path):
    y, sr = librosa.load(audio_path, sr=22050, mono=True)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    delta = librosa.feature.delta(mfcc)
    energy = np.mean(librosa.feature.rms(y=y))
    mfcc_mean = np.mean(mfcc, axis=1)
    delta_mean = np.mean(delta, axis=1)
    features = np.concatenate((mfcc_mean, delta_mean, [energy]))
    return features

# Função pra testar o áudio
def predict_audio(audio_path):
    model_whisper = whisper.load_model("base")
    result = model_whisper.transcribe(audio_path, language="portuguese")
    print("🗣️ Transcrição:", result["text"])
    
    feat = extract_features(audio_path)
    full_feat = np.expand_dims(feat, axis=0)
    
    prob = model.predict(full_feat)[0][0]
    label = "🚨 Risco" if prob > 0.5 else "✅ Normal"
    print(f"🎯 Resultado: {label} ({prob*100:.2f}% de chance de risco)")

# Testa
audio_path = "loucura.m4a"
predict_audio(audio_path)
