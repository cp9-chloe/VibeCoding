# Quick Start Guide - AI-Powered Blog Platform

## Prerequisites
- Node.js 18+ installed (https://nodejs.org)
- MongoDB Atlas account (free) - https://www.mongodb.com/atlas
- OpenAI API key (optional, for AI chatbot) - https://platform.openai.com

---

## Step 1: Setup Project

```bash
# Navigate to the MongoDB folder
cd MongoDB

# Install all dependencies
npm install
```

---

## Step 2: Create `.env.local` File

Create a file called `.env.local` in the project root (`MongoDB/.env.local`):

```env
# MongoDB Atlas connection string
# Get this from: MongoDB Atlas → Cluster → Connect → Drivers
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ai-blog?retryWrites=true&w=majority

# OpenAI API key (optional - chatbot won't work without it)
# Get this from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-api-key-here

# JWT secret (any random string works)
JWT_SECRET=my-super-secret-key-12345
```

### How to Get MongoDB URI:
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a free cluster (M0 Sandbox)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<username>` and `<password>` with your database user credentials

---

## Step 3: Run the App

```bash
# Start the development server
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Step 4: Test the App

1. **Sign up** - Click "Sign Up" and create an account
2. **Create a post** - Click "New Post" and write something
3. **View all posts** - Click "All Posts"
4. **Like/dislike** - Click the like/dislike buttons
5. **Comment** - Add a comment on any post
6. **My Posts** - Click "My Posts" to see your posts
7. **Edit/Delete** - Use the circular buttons on your posts
8. **AI Chatbot** - Click the 🤖 button on the New Post page
9. **Settings** - Click "Settings" to change preferences

---

## Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Project Structure

```
MongoDB/
├── app/                 # Next.js pages and API routes
│   ├── api/            # Backend API routes
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   ├── posts/          # Posts pages
│   └── settings/       # Settings page
├── components/         # Reusable UI components
├── models/             # MongoDB models
├── lib/                # Helper functions
├── public/             # Static assets
├── .env.local          # Environment variables (create this!)
├── package.json        # Dependencies
└── tailwind.config.ts  # Tailwind CSS config
```

---

## Need Help?

If you get stuck:
1. Check the error message in the terminal
2. Make sure `.env.local` is set up correctly
3. Run `npm install` again
4. Check MongoDB Atlas is running and accessible
5. Ask AI for help with the specific error!

---

**Happy coding! 🚀**
