# Blog System — Proposal

## Overview

A simple blog platform built with Python Flask and SQLite. Users can register, log in, and create blog posts. The system enforces unique usernames and restricts posting to authenticated users only.

## Goals

- Simple, no-frills blog MVP
- User registration and login with session-based auth
- Unique username enforcement
- Only logged-in users can create posts
- SQLite for zero-config local storage

## Non-Goals (MVP)

- Comments or reactions
- User profiles or avatars
- Rich text editor (plain text posts)
- Password recovery / email verification

## User Stories

1. As a visitor, I can register an account with a username and password.
2. As a visitor, I can log in with my credentials.
3. As a logged-in user, I can create a blog post with a title and body.
4. As a logged-in user, I can see all posts on the home page.
5. As a logged-in user, I can log out.

## Constraints

- Stack: Python 3, Flask, SQLite, Jinja2 templates
- No external JS frameworks
- Single-server deployment (dev/local)
