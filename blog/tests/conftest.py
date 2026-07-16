import os
import sys
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app import app as flask_app
from models import init_db, DB_PATH


@pytest.fixture
def app(tmp_path):
    flask_app.config["TESTING"] = True
    flask_app.config["SECRET_KEY"] = "test"
    db_path = str(tmp_path / "test.db")
    import models
    models.DB_PATH = db_path
    init_db()
    yield flask_app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def auth(client):
    """Register and login a test user, return helper methods."""
    def register(username="testuser", password="testpass"):
        client.post("/register", data={"username": username, "password": password, "confirm": password})
        client.post("/login", data={"username": username, "password": password})
    return register
