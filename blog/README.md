# Blog — Flask + SQLite MVP

A simple blog with user registration, login, and post creation.

## Quick Start

```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run the app
python app.py
```

Open http://127.0.0.1:5000 in your browser.

## Running Tests

```bash
pytest tests/ -v
```

## Project Structure

| File                | Purpose                          |
|---------------------|----------------------------------|
| `app.py`            | Flask app and routes             |
| `models.py`         | Database helpers                 |
| `schema.sql`        | SQLite schema                    |
| `templates/`        | Jinja2 HTML templates            |
| `tests/`            | pytest test suite                |

## Features

- Register with unique username
- Login / logout with session auth
- Create posts (authenticated only)
- All posts listed on home page
