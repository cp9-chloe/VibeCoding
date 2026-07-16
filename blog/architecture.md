# Blog System — Architecture

## Tech Stack

| Layer       | Technology          |
|-------------|---------------------|
| Backend     | Python 3 / Flask    |
| Database    | SQLite3             |
| Templating  | Jinja2              |
| Auth        | Flask sessions + werkzeug password hashing |
| Testing     | pytest              |

## Directory Structure

```
blog/
├── app.py              # Flask application entry point
├── models.py           # Database init & query helpers
├── schema.sql          # SQLite schema definition
├── requirements.txt    # Python dependencies
├── templates/
│   ├── base.html       # Shared layout
│   ├── index.html      # Home / post listing
│   ├── login.html      # Login form
│   ├── register.html   # Registration form
│   └── new_post.html   # Create post form
├── tests/
│   ├── test_app.py     # Flask test client tests
│   └── conftest.py     # Shared fixtures
├── proposal.md
├── architecture.md
├── design.md
└── README.md
```

## Request Flow

```
Browser → Flask Router → View Function → models.py → SQLite → Response
                ↓
          Session (cookie)
```

## Database

Single SQLite file `blog.db` created at runtime in the app root.

### Tables

**users**
| Column   | Type    | Constraints                  |
|----------|---------|------------------------------|
| id       | INTEGER | PRIMARY KEY AUTOINCREMENT    |
| username | TEXT    | UNIQUE NOT NULL              |
| password | TEXT    | NOT NULL (werkzeug hash)     |

**posts**
| Column    | Type     | Constraints               |
|-----------|----------|---------------------------|
| id        | INTEGER  | PRIMARY KEY AUTOINCREMENT |
| user_id   | INTEGER  | FOREIGN KEY → users.id    |
| title     | TEXT     | NOT NULL                  |
| body      | TEXT     | NOT NULL                  |
| created   | DATETIME | DEFAULT CURRENT_TIMESTAMP |

## Auth Model

- Passwords hashed with `werkzeug.security.generate_password_hash` / `check_password_hash`.
- Session cookie stores `user_id` after login.
- `@login_required` decorator checks session and redirects to `/login` if unauthenticated.

## Key Routes

| Method | Path          | Auth Required | Description            |
|--------|---------------|---------------|------------------------|
| GET    | `/`           | No            | List all posts          |
| GET    | `/register`   | No            | Registration form       |
| POST   | `/register`   | No            | Create account          |
| GET    | `/login`      | No            | Login form              |
| POST   | `/login`      | No            | Authenticate & session  |
| GET    | `/logout`     | Yes           | Clear session           |
| GET    | `/post/new`   | Yes           | New post form           |
| POST   | `/post/new`   | Yes           | Create post             |
