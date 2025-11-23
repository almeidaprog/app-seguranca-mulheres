import os
import warnings
warnings.filterwarnings("ignore")

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import sounddevice as sd
from scipy.io.wavfile import write
import numpy as np
import librosa
from tensorflow.keras.models import load_model
import whisper
import json
import time

MODEL_PATH = "risk_audio_model_v2.keras"
DURATION = 30
SAMPLE_RATE = 44100
TEMP_FILE = "temp_audio.wav"

model = load_model(MODEL_PATH)
whisper_model = whisper.load_model("base")


def gravar_audio(path, duration=DURATION):
    audio = sd.rec(
        int(duration * SAMPLE_RATE),
        samplerate=SAMPLE_RATE,
        channels=1,
        dtype='float32'
    )
    sd.wait()
    write(path, SAMPLE_RATE, audio)
    return path


def extract_features(file_path, sr=22050):
    y, _ = librosa.load(file_path, sr=sr, mono=True)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=27)
    mfccs_mean = np.mean(mfccs.T, axis=0)
    return mfccs_mean.reshape(1, -1)


def transcribe_audio(path):
    result = whisper_model.transcribe(path)
    return result["text"]


def monitorar():
    while True:
        # grava
        gravar_audio(TEMP_FILE)

        # features + modelo
        feats = extract_features(TEMP_FILE)
        prob = float(model.predict(feats)[0][0])

        # transcrição
        texto = transcribe_audio(TEMP_FILE).strip()

        # se risco
        if prob > 0.5:
            return {
                "risco": True,
                "prob": prob,
                "texto": texto
            }

        # se não risco → continua
        # mas devolve informação parcial também
        # Node decide se quer continuar ou parar
        return {
            "risco": False,
            "prob": prob,
            "texto": texto
        }


if __name__ == "__main__":
    resultado = monitorar()
    print(json.dumps(resultado))
