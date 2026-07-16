import os
from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, session
from models import init_db, create_user, verify_user, create_post, get_all_posts

app = Flask(__name__)
app.secret_key = os.urandom(24)

init_db()


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated


@app.route("/")
def index():
    posts = get_all_posts()
    return render_template("index.html", posts=posts)


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        confirm = request.form.get("confirm", "")
        if not username or not password:
            return render_template("register.html", error="Username and password required.")
        if password != confirm:
            return render_template("register.html", error="Passwords do not match.")
        if create_user(username, password):
            return redirect(url_for("login"))
        return render_template("register.html", error="Username already taken.")
    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        user = verify_user(username, password)
        if user:
            session["user_id"] = user["id"]
            session["username"] = user["username"]
            return redirect(url_for("index"))
        return render_template("login.html", error="Invalid credentials.")
    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))


@app.route("/post/new", methods=["GET", "POST"])
@login_required
def new_post():
    if request.method == "POST":
        title = request.form.get("title", "").strip()
        body = request.form.get("body", "").strip()
        if not title or not body:
            return render_template("new_post.html", error="Title and body required.")
        create_post(session["user_id"], title, body)
        return redirect(url_for("index"))
    return render_template("new_post.html")


if __name__ == "__main__":
    app.run(debug=True)
