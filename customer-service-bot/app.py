import os
from flask import Flask, render_template, request, jsonify, session
from scraper import discover_links, extract_text_from_url
from rag import build_index, save_index, load_index, search
from chatbot import ask_deepseek

app = Flask(__name__)
app.secret_key = os.urandom(24)

INDEXED_URLS = []


@app.route("/")
def index():
    return render_template("index.html", urls=INDEXED_URLS)


@app.route("/admin")
def admin():
    chunks, sources, _ = load_index()
    count = len(chunks) if chunks else 0
    return render_template("admin.html", urls=INDEXED_URLS, chunk_count=count)


@app.route("/api/index", methods=["POST"])
def api_index():
    global INDEXED_URLS
    data = request.get_json()
    url = data.get("url", "").strip()
    if not url:
        return jsonify({"error": "URL required"}), 400

    pages = [(url, extract_text_from_url(url))]
    if not pages[0][1]:
        return jsonify({"error": "Failed to fetch content from URL"}), 400

    links = discover_links(url, max_pages=20)
    for link in links:
        if link != url:
            text = extract_text_from_url(link)
            if text:
                pages.append((link, text))

    chunks, sources, embeddings = build_index(pages)
    save_index(chunks, sources, embeddings)
    INDEXED_URLS = list(dict.fromkeys([s for s in sources]))
    return jsonify({"pages_indexed": len(pages), "chunks": len(chunks)})


@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.get_json()
    question = data.get("message", "").strip()
    if not question:
        return jsonify({"error": "Message required"}), 400

    results = search(question, top_k=5)
    if not results:
        return jsonify({"answer": "No content has been indexed yet. Please index a website first from the admin panel."})

    context = "\n\n".join(
        f"Source: {r['source']}\n{r['chunk']}" for r in results
    )

    system_prompt = (
        "You are a helpful customer service assistant. Answer the user's question "
        "based ONLY on the provided context. If the context doesn't contain the answer, "
        "say you don't have that information. Be concise and professional."
    )
    user_message = f"Context:\n{context}\n\nQuestion: {question}"

    try:
        answer = ask_deepseek(system_prompt, user_message)
    except Exception as e:
        answer = f"Error contacting AI: {e}"

    return jsonify({
        "answer": answer,
        "sources": list(set(r["source"] for r in results)),
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
