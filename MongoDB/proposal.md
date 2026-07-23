# AI-Powered Blog Platform - Project Proposal

## 1. Product Vision
A student-friendly, full-stack blog platform with AI features, built with Next.js and MongoDB. Users can sign up, create posts with optional images, like/dislike posts, comment on posts, and get AI-powered writing assistance via a chatbot while creating new posts.

## 2. Core Features
- **User Authentication:** Sign up and login (buttons in top-right corner)
- **All Posts:** View all posts from online users (dedicated "All Posts" button)
- **My Posts:** View all posts created by the logged-in user (dedicated "My Posts" button)
- **New Post:** Create a new post with optional image upload
- **Edit Post:** Circular edit button under each post in "My Posts" to modify the post
- **Delete Post:** Circular delete button under each post in "My Posts" to remove the post
- **Like/Dislike:** Users can like or dislike posts (with counts displayed)
- **Comments:** Users can comment on any post
- **Back Navigation:** Back button at top-left corner on all pages
- **AI Chatbot:** Chatbot appears while writing a post to give ideas or answer questions
- **Settings:** User preferences for theme, display, etc.
- **Animated Background:** Pastel gradient that changes color over time with floating bubbles

## 3. User Stories
- As a user, I can sign up and log in to the blog platform
- As a user, I can click "All Posts" to see all posts from online users
- As a user, I can click "My Posts" to see all posts I have written
- As a user, I can click "New Post" to write a new blog post
- As a user, I can add an optional picture when creating a post
- As a user, I can edit my posts using the circular edit button
- As a user, I can delete my posts using the circular delete button
- As a user, I can like or dislike a post, and see the total counts
- As a user, I can comment on any post
- As a user, I can go back to the previous page using the back button
- As a user, I can open an AI chatbot while writing a post to get ideas or ask questions
- As a user, I can access settings to customize my experience

## 4. Tech Stack
- **Frontend:** Next.js (React framework) + Tailwind CSS (styling)
- **Backend:** Next.js API Routes (no separate backend server)
- **Database:** MongoDB (Atlas cloud, free tier)
- **AI:** OpenAI API (GPT-3.5-turbo) for the AI chatbot
- **Tools:** Mongoose (MongoDB ODM), Axios (API calls)

## 5. Brief Notes on AI Integration
- **AI Chatbot:** When a user is creating a new post, an AI chatbot panel appears. The user can:
  - Ask the AI for post ideas (e.g., "Give me ideas for a tech blog post")
  - Ask questions about writing (e.g., "How do I make my post more engaging?")
  - Get suggestions for content, titles, or structure
- The chatbot uses OpenAI's GPT model to provide helpful, context-aware responses

## 6. Settings Feature
The settings button allows users to customize:
- **Theme:** Light or Dark mode
- **Font Size:** Small, Medium, or Large
- **Notifications:** Toggle post/comment notifications
- **Language:** English (expandable later)

## 7. Font Preferences
- **Post text:** Courier New (monospace font for all blog post content)
- **All other text:** Montserrat (clean, modern font for UI elements, headings, buttons, etc.)

## 8. Animated Background
- **Gradient:** Pastel colored gradient (soft pinks, blues, purples, greens) that slowly transitions and changes color over time
- **Bubbles:** Infinite bubbles floating from the bottom of the screen to the top
- **Bubble Interaction:** When a user clicks on a bubble, it pops in a realistic way (shrinks and fades with a smooth animation)
- **Performance:** Bubbles are lightweight CSS/JS animations that don't slow down the app

## 9. Project Structure (High-Level)
```
ai-blog/
├── app/              # Next.js pages (App Router)
├── components/       # Reusable UI components
├── models/           # MongoDB models (User, Post, Comment)
├── lib/              # MongoDB connection, utilities
└── public/           # Static assets (images, icons)
```

---

*This project is designed for learning full-stack development with AI. Code will be simple, well-commented, and runnable locally.*
