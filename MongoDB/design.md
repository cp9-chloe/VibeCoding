# AI-Powered Blog Platform - Design & Implementation Doc

## 1. System Architecture
```
Frontend (Next.js + Tailwind CSS)
        ↓
Next.js API Routes (Backend)
        ↓
MongoDB Atlas (Database)  ←→  OpenAI API (AI Chatbot)
```
- **Frontend:** Renders UI, handles user interactions, calls API routes
- **Backend:** Processes requests, connects to MongoDB, calls OpenAI API, returns data to frontend
- **Database:** Stores users, posts, comments, likes/dislikes
- **AI:** OpenAI API powers the chatbot for writing assistance

## 2. Pages (Next.js App Router)
| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with animated background, nav buttons |
| `/login` | Login | User login form |
| `/signup` | Signup | User registration form |
| `/posts` | All Posts | Shows all posts from all users |
| `/posts/myposts` | My Posts | Shows posts by logged-in user (edit/delete buttons) |
| `/posts/new` | New Post | Create a new post (AI chatbot panel available) |
| `/posts/[id]` | Post Detail | View single post with comments, like/dislike |
| `/posts/[id]/edit` | Edit Post | Edit an existing post |
| `/settings` | Settings | User preferences (theme, font size, etc.) |

## 3. Database Schema (MongoDB Collections)

### Collection 1: users
```javascript
{
  _id: ObjectId (auto-generated),
  username: String (required, unique),
  email: String (required, unique),
  password: String (hashed with bcrypt),
  createdAt: Date (auto-set)
}
```

### Collection 2: posts
```javascript
{
  _id: ObjectId (auto-generated),
  userId: ObjectId (refers to users._id, required),
  title: String (required),
  content: String (required),
  image: String (URL or base64, optional),
  likes: Number (default: 0),
  dislikes: Number (default: 0),
  likedBy: [ObjectId] (array of user IDs who liked),
  dislikedBy: [ObjectId] (array of user IDs who disliked),
  createdAt: Date (auto-set),
  updatedAt: Date (auto-set)
}
```

### Collection 3: comments
```javascript
{
  _id: ObjectId (auto-generated),
  postId: ObjectId (refers to posts._id, required),
  userId: ObjectId (refers to users._id, required),
  content: String (required),
  createdAt: Date (auto-set)
}
```

## 4. API Endpoints (Next.js API Routes)

### Authentication
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Log in a user (returns session/token) |
| POST | `/api/auth/logout` | Log out a user |

### Posts
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/posts` | Fetch all posts (for All Posts page) |
| GET | `/api/posts/myposts` | Fetch posts by logged-in user |
| GET | `/api/posts/[id]` | Fetch single post by ID |
| POST | `/api/posts` | Create a new post |
| PUT | `/api/posts/[id]` | Update/edit a post |
| DELETE | `/api/posts/[id]` | Delete a post |

### Likes/Dislikes
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/posts/[id]/like` | Like a post (toggle) |
| POST | `/api/posts/[id]/dislike` | Dislike a post (toggle) |

### Comments
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/posts/[id]/comments` | Fetch comments for a post |
| POST | `/api/posts/[id]/comments` | Add a comment to a post |
| DELETE | `/api/comments/[id]` | Delete a comment |

### AI
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/ai/chat` | Send message to AI chatbot, get response |

### Settings
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/settings` | Get user settings |
| PUT | `/api/settings` | Update user settings |

## 5. UI Components (Reusable)

| Component | Description |
|-----------|-------------|
| `Navbar` | Top navigation bar: back button (left), logo, All Posts, My Posts, New Post, Settings, Login/Signup or Logout (right) |
| `PostCard` | Displays post preview: title, content snippet, image, like/dislike counts, comment count |
| `PostDetail` | Full post view: title, content (Courier New), image, like/dislike buttons, comments section |
| `CommentSection` | List of comments + input form to add new comment |
| `LikeDislikeButton` | Thumbs up/down buttons with counts |
| `CircularButton` | Reusable circular button (used for edit, delete) |
| `AIChatbot` | Floating chat panel that appears on New Post page |
| `PostForm` | Form for creating/editing posts (title, content, image upload) |
| `SettingsPanel` | Settings form (theme, font size, notifications) |
| `AnimatedBackground` | Pastel gradient + floating bubbles component |
| `Bubble` | Individual bubble with click-to-pop animation |
| `AuthForm` | Reusable form for login/signup |
| `BackButton` | Circular back button at top-left corner |

## 6. AI Integration Flow

### AI Chatbot Flow:
1. User navigates to `/posts/new` (New Post page)
2. AI Chatbot panel appears on the right side of the screen
3. User types a message (e.g., "Give me blog post ideas about travel")
4. Frontend sends POST request to `/api/ai/chat` with the message
5. Backend receives request, calls OpenAI API with system prompt:
   - "You are a helpful blog writing assistant. Help users with post ideas, writing tips, and content suggestions."
6. OpenAI returns a response
7. Backend sends response back to frontend
8. Chatbot displays the AI response in the chat panel
9. User can continue the conversation or close the chatbot

### AI System Prompt:
```
You are a friendly blog writing assistant. Help users with:
- Generating blog post ideas
- Writing tips and suggestions
- Improving their writing
- Answering questions about blogging
Keep responses concise and helpful.
```

## 7. Implementation Notes

### Setup Steps:
1. **Create Next.js app:** `npx create-next-app@latest ai-blog --typescript --tailwind --app`
2. **Install dependencies:**
   ```bash
   npm install mongoose axios openai bcryptjs jsonwebtoken
   npm install -D @types/bcryptjs @types/jsonwebtoken
   ```
3. **Create `.env.local`:**
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-blog
   OPENAI_API_KEY=sk-...
   JWT_SECRET=your-secret-key-here
   ```
4. **MongoDB Atlas:** Create free account, create cluster, get connection string

### File Structure:
```
ai-blog/
├── app/
│   ├── page.tsx              # Home page
│   ├── login/page.tsx        # Login page
│   ├── signup/page.tsx       # Signup page
│   ├── posts/
│   │   ├── page.tsx          # All Posts
│   │   ├── myposts/page.tsx  # My Posts
│   │   ├── new/page.tsx      # New Post
│   │   └── [id]/
│   │       ├── page.tsx      # Post Detail
│   │       └── edit/page.tsx # Edit Post
│   ├── settings/page.tsx     # Settings
│   └── api/
│       ├── auth/
│       │   ├── signup/route.ts
│       │   ├── login/route.ts
│       │   └── logout/route.ts
│       ├── posts/
│       │   ├── route.ts          # GET all, POST new
│       │   ├── myposts/route.ts  # GET my posts
│       │   └── [id]/
│       │       ├── route.ts      # GET, PUT, DELETE single
│       │       ├── like/route.ts
│       │       ├── dislike/route.ts
│       │       └── comments/route.ts
│       ├── comments/
│       │   └── [id]/route.ts     # DELETE comment
│       ├── ai/
│       │   └── chat/route.ts     # AI chatbot
│       └── settings/route.ts     # GET, PUT settings
├── components/
│   ├── Navbar.tsx
│   ├── PostCard.tsx
│   ├── PostDetail.tsx
│   ├── CommentSection.tsx
│   ├── LikeDislikeButton.tsx
│   ├── CircularButton.tsx
│   ├── AIChatbot.tsx
│   ├── PostForm.tsx
│   ├── SettingsPanel.tsx
│   ├── AnimatedBackground.tsx
│   ├── Bubble.tsx
│   ├── AuthForm.tsx
│   └── BackButton.tsx
├── models/
│   ├── User.ts
│   ├── Post.ts
│   ├── Comment.ts
│   └── Settings.ts
├── lib/
│   ├── mongodb.ts           # MongoDB connection helper
│   ├── auth.ts              # JWT auth helper
│   └── openai.ts            # OpenAI client setup
├── public/
│   └── images/
├── .env.local
├── tailwind.config.ts
└── package.json
```

### Key Implementation Details:
- **Authentication:** Use JWT tokens stored in cookies (httpOnly for security)
- **Password Hashing:** bcryptjs to hash passwords before saving to MongoDB
- **Image Upload:** Store images as base64 strings in MongoDB (simple for learning) or use a free image hosting service
- **Like/Dislike Toggle:** Check if user already liked/disliked, then toggle accordingly
- **Animated Background:** Use CSS animations for gradient and bubbles (lightweight, no library needed)
- **Font Loading:** Import Montserrat from Google Fonts, apply Courier New to post content via Tailwind
- **Settings Storage:** Store user preferences in MongoDB, apply via CSS variables/class toggles

### Environment Variables Needed:
| Variable | Where to Get |
|----------|--------------|
| `MONGODB_URI` | MongoDB Atlas → Cluster → Connect → Drivers |
| `OPENAI_API_KEY` | platform.openai.com → API Keys |
| `JWT_SECRET` | Create your own random string |

---

*This design is tailored for students learning full-stack development. Code will be simple, well-commented, and runnable locally.*
