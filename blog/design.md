# Blog System — Design

## Visual Design

Minimal, clean interface. Dark theme consistent with the existing workspace.

- Background: `#1a1a2e`
- Card/surface: `#16213e`
- Accent: `#0f3460`
- Text: `#e0e0e0`
- Links/buttons: `#533483`
- Success: `#4caf50`
- Error: `#f44336`

## Layout

All pages share `base.html`:
- Top nav bar with title + login/logout/register links
- Main content area centered (max-width 700px)
- Footer with minimal credit

## Pages

### Home (`/`)
- Heading: "All Posts"
- If logged in, show "New Post" button
- List of posts in reverse chronological order
- Each post shows: title, author, date, body preview

### Register (`/register`)
- Form fields: username, password, confirm password
- Client-side validation: all fields required, passwords must match
- Server-side: username uniqueness check, hash password, insert, redirect to login

### Login (`/login`)
- Form fields: username, password
- Server-side: verify hash, set session, redirect to home
- Show error on failure

### New Post (`/post/new`)
- Form fields: title, body (textarea)
- Server-side: insert with `user_id` from session, redirect to home

## Security Notes

- Passwords never stored in plaintext
- Session cookie is Flask default (signed, not encrypted) — fine for MVP
- No CSRF protection in MVP (acceptable for local use)
- SQL injection prevented by parameterized queries in models.py
