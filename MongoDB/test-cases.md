# Test Cases - AI-Powered Blog Platform

## Manual Test Steps

### 1. User Authentication
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1.1 | Go to `/signup` | Signup form appears |
| 1.2 | Enter username, email, password | Form accepts input |
| 1.3 | Click "Sign Up" | Redirects to home page, user is logged in |
| 1.4 | Click "Logout" | User is logged out |
| 1.5 | Go to `/login` | Login form appears |
| 1.6 | Enter email and password | Form accepts input |
| 1.7 | Click "Login" | Redirects to home page, user is logged in |

### 2. Posts - Create
| Step | Action | Expected Result |
|------|--------|-----------------|
| 2.1 | Click "New Post" | New post form appears |
| 2.2 | Enter title and content | Form accepts input |
| 2.3 | Upload an image (optional) | Image preview appears |
| 2.4 | Click "Publish Post" | Post is created, redirects to All Posts |
| 2.5 | Try creating post without login | Error: "You must be logged in" |

### 3. Posts - View
| Step | Action | Expected Result |
|------|--------|-----------------|
| 3.1 | Click "All Posts" | All posts from all users are displayed |
| 3.2 | Click "My Posts" | Only posts by current user are displayed |
| 3.3 | Click "View Details" on a post | Full post with comments is shown |
| 3.4 | Click back button (←) | Returns to previous page |

### 4. Posts - Edit/Delete
| Step | Action | Expected Result |
|------|--------|-----------------|
| 4.1 | Go to "My Posts" | Posts by current user are shown |
| 4.2 | Click edit button (✏️) | Edit form appears with current data |
| 4.3 | Change title/content, click "Save Changes" | Post is updated |
| 4.4 | Click delete button (🗑️) | Confirmation dialog appears |
| 4.5 | Confirm delete | Post is deleted |
| 4.6 | Try editing someone else's post | Error: "You can only edit your own posts" |

### 5. Likes/Dislikes
| Step | Action | Expected Result |
|------|--------|-----------------|
| 5.1 | Click 👍 on a post | Like count increases |
| 5.2 | Click 👍 again on same post | Like is toggled (unliked) |
| 5.3 | Click 👎 on a post | Dislike count increases |
| 5.4 | Like a post that was disliked | Dislike is removed, like is added |

### 6. Comments
| Step | Action | Expected Result |
|------|--------|-----------------|
| 6.1 | On a post detail page, type a comment | Comment input accepts text |
| 6.2 | Click "Post Comment" | Comment appears in the list |
| 6.3 | Click "Delete" on own comment | Comment is removed |
| 6.4 | View comments on a post | All comments are displayed with author name |

### 7. AI Chatbot
| Step | Action | Expected Result |
|------|--------|-----------------|
| 7.1 | Go to "New Post" page | AI chatbot button (🤖) appears at bottom-right |
| 7.2 | Click the 🤖 button | Chat panel opens |
| 7.3 | Type "Give me blog post ideas" | AI responds with suggestions |
| 7.4 | Click "Insert into post" | AI response is inserted into post content |
| 7.5 | Click ✕ to close chatbot | Chat panel closes |

### 8. Settings
| Step | Action | Expected Result |
|------|--------|-----------------|
| 8.1 | Click "Settings" | Settings page appears |
| 8.2 | Change theme to Dark | Theme dropdown changes |
| 8.3 | Click "Save Settings" | Settings are saved |
| 8.4 | Change font size | Font size dropdown changes |

### 9. Animated Background
| Step | Action | Expected Result |
|------|--------|-----------------|
| 9.1 | Visit any page | Pastel gradient background is visible |
| 9.2 | Watch for a few seconds | Bubbles float from bottom to top |
| 9.3 | Click on a bubble | Bubble pops with animation |

---

## API Test Steps (using browser or Postman)

### Auth API
```bash
# Signup
POST http://localhost:3000/api/auth/signup
Body: { "username": "testuser", "email": "test@test.com", "password": "password123" }

# Login
POST http://localhost:3000/api/auth/login
Body: { "email": "test@test.com", "password": "password123" }

# Logout
POST http://localhost:3000/api/auth/logout
```

### Posts API
```bash
# Get all posts
GET http://localhost:3000/api/posts

# Get my posts
GET http://localhost:3000/api/posts/myposts

# Get single post
GET http://localhost:3000/api/posts/[postId]

# Create post
POST http://localhost:3000/api/posts
Body: { "title": "My Post", "content": "Hello world!" }

# Update post
PUT http://localhost:3000/api/posts/[postId]
Body: { "title": "Updated Title", "content": "Updated content" }

# Delete post
DELETE http://localhost:3000/api/posts/[postId]
```

### Likes/Dislikes API
```bash
# Like a post
POST http://localhost:3000/api/posts/[postId]/like

# Dislike a post
POST http://localhost:3000/api/posts/[postId]/dislike
```

### Comments API
```bash
# Get comments for a post
GET http://localhost:3000/api/posts/[postId]/comments

# Add comment
POST http://localhost:3000/api/posts/[postId]/comments
Body: { "content": "Great post!" }

# Delete comment
DELETE http://localhost:3000/api/comments/[commentId]
```

### AI API
```bash
# Chat with AI
POST http://localhost:3000/api/ai/chat
Body: { "message": "Give me blog post ideas about technology" }
```

### Settings API
```bash
# Get settings
GET http://localhost:3000/api/settings

# Update settings
PUT http://localhost:3000/api/settings
Body: { "theme": "dark", "fontSize": "large", "notifications": true }
```

---

## Automated Testing (Optional - Jest Setup)

For students who want to go further with automated testing:

### Install Jest
```bash
npm install -D jest @types/jest ts-jest
```

### Create `jest.config.js`
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterSetup: [],
};
```

### Example Test File: `__tests__/auth.test.ts`
```typescript
import { generateToken, verifyToken } from '../lib/auth';

describe('Auth', () => {
  test('generateToken returns a string', () => {
    const token = generateToken('user123');
    expect(typeof token).toBe('string');
  });

  test('verifyToken decodes valid token', () => {
    const token = generateToken('user123');
    const decoded = verifyToken(token);
    expect(decoded?.userId).toBe('user123');
  });

  test('verifyToken returns null for invalid token', () => {
    const decoded = verifyToken('invalid-token');
    expect(decoded).toBeNull();
  });
});
```

### Run Tests
```bash
npx jest
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check `MONGODB_URI` in `.env.local` |
| OpenAI API error | Check `OPENAI_API_KEY` in `.env.local` |
| Port already in use | Run `npm run dev -- -p 3001` to use different port |
| Module not found errors | Run `npm install` to install dependencies |
| Auth not working | Clear cookies and try again |
