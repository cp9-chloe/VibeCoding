import os
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
CHUNKS_FILE = os.path.join(DATA_DIR, "chunks.pkl")
EMBEDDINGS_FILE = os.path.join(DATA_DIR, "embeddings.npy")

_model = None


def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def chunk_text(text, max_chars=500, overlap=50):
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + max_chars
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += max_chars - overlap
    return chunks


def build_index(pages):
    model = get_model()
    all_chunks = []
    chunk_sources = []

    for url, text in pages:
        chunks = chunk_text(text)
        for chunk in chunks:
            all_chunks.append(chunk)
            chunk_sources.append(url)

    if not all_chunks:
        return [], [], []

    embeddings = model.encode(all_chunks, show_progress_bar=True, normalize_embeddings=True)
    return all_chunks, chunk_sources, embeddings


def save_index(chunks, sources, embeddings):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(CHUNKS_FILE, "wb") as f:
        pickle.dump({"chunks": chunks, "sources": sources}, f)
    np.save(EMBEDDINGS_FILE, embeddings)


def load_index():
    if not os.path.exists(CHUNKS_FILE) or not os.path.exists(EMBEDDINGS_FILE):
        return None, None, None
    with open(CHUNKS_FILE, "rb") as f:
        data = pickle.load(f)
    embeddings = np.load(EMBEDDINGS_FILE)
    return data["chunks"], data["sources"], embeddings


def search(query, top_k=5):
    chunks, sources, embeddings = load_index()
    if chunks is None:
        return []

    model = get_model()
    query_vec = model.encode([query], normalize_embeddings=True)[0]
    scores = embeddings @ query_vec
    top_indices = np.argsort(scores)[-top_k:][::-1]

    results = []
    for idx in top_indices:
        results.append({
            "chunk": chunks[idx],
            "source": sources[idx],
            "score": float(scores[idx]),
        })
    return results
