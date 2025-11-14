import os
import librosa
import soundfile as sf
import numpy as np

INPUT_FOLDER = "meus_audios"
OUTPUT_FOLDER = "augmented_audios_v2"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def change_speed(y, rate=1.0):
    return librosa.effects.time_stretch(y=y, rate=rate)

def change_pitch(y, sr, n_steps=0):
    return librosa.effects.pitch_shift(y=y, sr=sr, n_steps=n_steps)

def add_noise(y, noise_factor=0.005):
    noise = np.random.randn(len(y))
    return y + noise_factor * noise

def save_audio(y, sr, filename):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    sf.write(filename, y, sr)

for root, dirs, files in os.walk(INPUT_FOLDER):
    for fname in files:
        if not fname.lower().endswith((".wav", ".mp3", ".m4a")):
            continue

        path = os.path.join(root, fname)
        y, sr = librosa.load(path, sr=16000, mono=True)

        # cria o caminho de saída mantendo a estrutura original
        rel_path = os.path.relpath(root, INPUT_FOLDER)
        output_dir = os.path.join(OUTPUT_FOLDER, rel_path)
        os.makedirs(output_dir, exist_ok=True)

        base_name = os.path.splitext(fname)[0]

        # salva original
        save_audio(y, sr, os.path.join(output_dir, f"{base_name}_orig.wav"))

        # variações de velocidade
        for rate in [0.9, 1.1]:
            y_speed = change_speed(y, rate=rate)
            save_audio(y_speed, sr, os.path.join(output_dir, f"{base_name}_speed{rate}.wav"))

        # variações de pitch
        for n_steps in [-2, 2]:
            y_pitch = change_pitch(y, sr=sr, n_steps=n_steps)
            save_audio(y_pitch, sr, os.path.join(output_dir, f"{base_name}_pitch{n_steps}.wav"))

        # adicionar ruído
        y_noise = add_noise(y)
        save_audio(y_noise, sr, os.path.join(output_dir, f"{base_name}_noise.wav"))

print("Data augmentation concluído! Todos os áudios estão em", OUTPUT_FOLDER)
