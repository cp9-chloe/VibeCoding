import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "blog.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "schema.sql")) as f:
        conn.executescript(f.read())
    conn.close()


def create_user(username, password):
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, generate_password_hash(password)),
        )
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()


def get_user_by_username(username):
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    conn.close()
    return user


def verify_user(username, password):
    user = get_user_by_username(username)
    if user and check_password_hash(user["password"], password):
        return user
    return None


def create_post(user_id, title, body):
    conn = get_db()
    conn.execute(
        "INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)",
        (user_id, title, body),
    )
    conn.commit()
    conn.close()


def get_all_posts():
    conn = get_db()
    posts = conn.execute(
        "SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created DESC"
    ).fetchall()
    conn.close()
    return posts
