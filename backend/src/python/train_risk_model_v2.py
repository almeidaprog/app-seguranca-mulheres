import os
import librosa
import numpy as np
from tensorflow.keras.models import Sequential, save_model
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
import warnings

warnings.filterwarnings("ignore")

# --- Config ---
DATA_DIR = "augmented_audios_v2"
CATEGORIES = ["normal", "risk"]
SUBFOLDERS = ["", "bibia"]
EPOCHS = 250
BATCH_SIZE = 16
MODEL_SAVE_PATH = "risk_audio_model_v2.keras"

# --- Função para carregar e extrair features ---
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
                        mfccs = librosa.feature.mfcc(y=y_audio, sr=sr, n_mfcc=40)
                        mfccs_mean = np.mean(mfccs.T, axis=0)
                        X.append(mfccs_mean)
                        y.append(label)
                    except Exception as e:
                        print(f"⚠️ Erro ao processar {file_path}: {e}")

    if len(X) == 0:
        raise ValueError("Nenhum arquivo de áudio válido encontrado.")

    X = np.array(X)
    X = (X - np.mean(X, axis=0)) / (np.std(X, axis=0) + 1e-10)
    y = np.array(y)

    indices = np.arange(len(X))
    np.random.shuffle(indices)
    return X[indices], y[indices]

# --- Carrega dados ---
X, y = load_data(DATA_DIR)
print(f"✅ Dados carregados: {len(X)} áudios encontrados.")

# --- Cria modelo ---
model = Sequential([
    Dense(128, input_shape=(40,), activation="relu"),
    Dropout(0.3),
    Dense(64, activation="relu"),
    Dropout(0.3),
    Dense(1, activation="sigmoid")
])

model.compile(optimizer=Adam(learning_rate=0.0005), loss="binary_crossentropy", metrics=["accuracy"])
print("🛠 Modelo compilado.")

# --- Early stopping ---
early_stop = EarlyStopping(
    monitor='val_loss',
    patience=20,
    restore_best_weights=True
)

# --- Treina modelo ---
print(f"🏋️ Iniciando treinamento por {EPOCHS} epochs...")
history = model.fit(
    X, y,
    epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    validation_split=0.2,
    verbose=2  # sem callbacks
)

# --- Salva modelo ---
save_model(model, MODEL_SAVE_PATH)
print(f"✅ Treinamento concluído e modelo salvo em {MODEL_SAVE_PATH}!")
