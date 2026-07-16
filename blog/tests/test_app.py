import pytest


class TestPages:
    def test_home_page(self, client):
        resp = client.get("/")
        assert resp.status_code == 200
        assert b"All Posts" in resp.data

    def test_login_page(self, client):
        resp = client.get("/login")
        assert resp.status_code == 200
        assert b"Login" in resp.data

    def test_register_page(self, client):
        resp = client.get("/register")
        assert resp.status_code == 200
        assert b"Register" in resp.data

    def test_new_post_requires_login(self, client):
        resp = client.get("/post/new", follow_redirects=True)
        assert b"Login" in resp.data


class TestRegistration:
    def test_register_success(self, client):
        resp = client.post("/register", data={
            "username": "alice", "password": "pass123", "confirm": "pass123"
        }, follow_redirects=True)
        assert resp.status_code == 200

    def test_register_duplicate_username(self, client):
        client.post("/register", data={
            "username": "bob", "password": "pass123", "confirm": "pass123"
        })
        resp = client.post("/register", data={
            "username": "bob", "password": "pass456", "confirm": "pass456"
        }, follow_redirects=True)
        assert b"already taken" in resp.data

    def test_register_password_mismatch(self, client):
        resp = client.post("/register", data={
            "username": "charlie", "password": "pass1", "confirm": "pass2"
        }, follow_redirects=True)
        assert b"do not match" in resp.data

    def test_register_empty_fields(self, client):
        resp = client.post("/register", data={
            "username": "", "password": "", "confirm": ""
        }, follow_redirects=True)
        assert b"required" in resp.data


class TestLogin:
    def test_login_success(self, client):
        client.post("/register", data={
            "username": "dave", "password": "pass", "confirm": "pass"
        })
        resp = client.post("/login", data={
            "username": "dave", "password": "pass"
        }, follow_redirects=True)
        assert b"All Posts" in resp.data

    def test_login_wrong_password(self, client):
        client.post("/register", data={
            "username": "eve", "password": "pass", "confirm": "pass"
        })
        resp = client.post("/login", data={
            "username": "eve", "password": "wrong"
        }, follow_redirects=True)
        assert b"Invalid credentials" in resp.data

    def test_login_nonexistent_user(self, client):
        resp = client.post("/login", data={
            "username": "nobody", "password": "pass"
        }, follow_redirects=True)
        assert b"Invalid credentials" in resp.data


class TestPosts:
    def test_create_post(self, client, auth):
        auth()
        resp = client.post("/post/new", data={
            "title": "Hello", "body": "World"
        }, follow_redirects=True)
        assert b"Hello" in resp.data
        assert b"World" in resp.data

    def test_create_post_empty_title(self, client, auth):
        auth()
        resp = client.post("/post/new", data={
            "title": "", "body": "some content"
        }, follow_redirects=True)
        assert b"required" in resp.data

    def test_post_requires_auth(self, client):
        resp = client.post("/post/new", data={
            "title": "Nope", "body": "Nope"
        }, follow_redirects=True)
        assert b"Login" in resp.data

    def test_posts_appear_on_home(self, client, auth):
        auth()
        client.post("/post/new", data={"title": "My Post", "body": "Content"})
        resp = client.get("/")
        assert b"My Post" in resp.data

    def test_unique_username_enforced(self, client):
        client.post("/register", data={
            "username": "same", "password": "a", "confirm": "a"
        })
        resp = client.post("/register", data={
            "username": "same", "password": "b", "confirm": "b"
        }, follow_redirects=True)
        assert b"already taken" in resp.data


class TestLogout:
    def test_logout(self, client, auth):
        auth()
        resp = client.get("/logout", follow_redirects=True)
        assert b"Login" in resp.data
        resp = client.get("/post/new", follow_redirects=True)
        assert b"Login" in resp.data
