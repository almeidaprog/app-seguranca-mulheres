import os
import librosa
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.models import save_model
import warnings

warnings.filterwarnings("ignore")

# Pasta de dados
DATA_DIR = "augmented_audios_v2"
CATEGORIES = ["normal", "risk"]
SUBFOLDERS = ["", "bibia"]  # Pasta principal + bibia

# Função para carregar e extrair features de todos os áudios
def load_data(base_dir):
    X = []
    y = []
    print("🔍 Procurando arquivos de áudio...")
    for category in CATEGORIES:
        label = 0 if category == "normal" else 1
        for sub in SUBFOLDERS:
            folder_path = os.path.join(base_dir, category, sub)
            if not os.path.exists(folder_path):
                continue
            for file in os.listdir(folder_path):
                if file.endswith(".wav"):
                    file_path = os.path.join(folder_path, file)
                    try:
                        y_audio, sr = librosa.load(file_path, sr=22050, mono=True)
                        mfccs = librosa.feature.mfcc(y=y_audio, sr=sr, n_mfcc=27)
                        mfccs_mean = np.mean(mfccs.T, axis=0)
                        X.append(mfccs_mean)
                        y.append(label)
                    except Exception as e:
                        print(f"⚠️ Erro ao processar {file_path}: {e}")
    if len(X) == 0:
        raise ValueError("Nenhum arquivo de áudio válido encontrado. Checa as pastas e arquivos .wav!")
    return np.array(X), np.array(y)

# Carrega dados
X, y = load_data(DATA_DIR)

# Cria modelo simples
model = Sequential()
model.add(Dense(128, input_shape=(27,), activation="relu"))
model.add(Dropout(0.3))
model.add(Dense(64, activation="relu"))
model.add(Dropout(0.3))
model.add(Dense(1, activation="sigmoid"))

# Compila
model.compile(optimizer=Adam(learning_rate=0.0005), loss="binary_crossentropy", metrics=["accuracy"])

# Treina
print("🏋️‍♂️ Iniciando treinamento...")
history = model.fit(X, y, epochs=50, batch_size=16, validation_split=0.2)

# Salva modelo
MODEL_SAVE_PATH = "risk_audio_model_v2.keras"
save_model(model, MODEL_SAVE_PATH)
print(f"✅ Treinamento concluído e modelo salvo em {MODEL_SAVE_PATH}!")
