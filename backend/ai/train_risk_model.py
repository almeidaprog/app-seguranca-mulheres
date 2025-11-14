import os
import numpy as np
import librosa
import whisper
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping

# Caminho pro dataset
DATASET_PATH = "augmented_audios_v2"
CATEGORIES = ["normal", "risk"]

# Carrega o modelo do Whisper (base = equilibrado entre velocidade e precisão)
whisper_model = whisper.load_model("base")

# Extrai características de áudio
def extract_mfcc_stats(y, sr=22050):
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
    return np.concatenate((np.mean(mfcc, axis=1), np.std(mfcc, axis=1)))

# Transcreve o áudio e cria uma feature textual
def transcrever_audio(path):
    try:
        result = whisper_model.transcribe(path)
        texto = result["text"].lower()
        # Feature: presença de palavras relacionadas a perigo
        palavras_risco = ["socorro", "ajuda", "violência", "me ajuda", "estupro", "gritar", "corre"]
        return 1 if any(p in texto for p in palavras_risco) else 0
    except Exception as e:
        print(f"Erro ao transcrever {path}: {e}")
        return 0

# Carrega e processa os áudios
X, y = [], []
for label, category in enumerate(CATEGORIES):
    folder = os.path.join(DATASET_PATH, category)
    for root, dirs, files in os.walk(folder):
        for filename in files:
            if filename.endswith(".wav"):
                path = os.path.join(root, filename)
                try:
                    audio, sr = librosa.load(path, sr=22050, mono=True)
                    feats = extract_mfcc_stats(audio, sr)
                    text_feat = transcrever_audio(path)
                    full_feat = np.append(feats, text_feat)
                    X.append(full_feat)
                    y.append(label)
                except Exception as e:
                    print(f"Erro ao processar {path}: {e}")

X = np.array(X)
y = np.array(y)

# Divide os dados
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Modelo neural
model = Sequential([
    Dense(128, activation="relu", input_shape=(X.shape[1],)),
    Dropout(0.3),
    Dense(64, activation="relu"),
    Dropout(0.3),
    Dense(1, activation="sigmoid")
])

model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])

# Early stopping pra evitar overfitting
callback = EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True)

# Treina
model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=40, batch_size=32, callbacks=[callback])

# Salva o modelo
model.save("risk_audio_model_whisper.h5")
print("✅ Modelo treinado e salvo como risk_audio_model_whisper.h5")
