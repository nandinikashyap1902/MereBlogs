# 📝 MereBlogs — Full-Stack Blog Application

A modern, full-stack blog platform built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js). MereBlogs lets users create, edit, delete and browse blog posts — with **AI-powered blog generation**, full-text **search**, **pagination**, and secure **JWT authentication**.

> **Live Demo:** [mereblogs.netlify.app](https://mereblogs.netlify.app)

---

## ✨ Features

### Core
- **Full CRUD** — Create, read, update, and delete blog posts with cover image uploads.
- **Rich-Text Editor** — Write and format posts with [React Quill](https://github.com/zenoamaro/react-quill).
- **Public Feed** — Browse all published posts without logging in (`/feed`).
- **Pagination** — Server-side paginated feeds, search results, and user posts.
- **Full-Text Search** — Search posts by title or summary via MongoDB text index (`/search?q=keyword`).

### AI Integration
- **AI Blog Generator** — Generate blog drafts using **Google Gemini AI**. Choose a title, keywords, tone (Casual / Formal / Technical), and word limit — then edit the generated content in the post editor.
- **AI Blog Improver** — Pass existing content with custom instructions to refine and improve drafts.

### Authentication & Security
- **JWT Authentication** — Secure login/signup with HTTP-only cookies.
- **Password Hashing** — All passwords hashed with **bcrypt**.
- **Rate Limiting** — Brute-force protection on auth routes (10 req/15 min) and a general API limiter (100 req/15 min).
- **Helmet** — Secure HTTP headers (HSTS, X-Frame-Options, Referrer-Policy, etc.).
- **HTML Sanitization** — All user-generated content sanitized with `sanitize-html` to prevent XSS.
- **Protected Routes** — Frontend route guards that redirect unauthenticated users.
- **Error Boundary** — Graceful error handling in the React component tree.

### UI/UX
- **Dark Glassmorphism Theme** — Premium design with electric indigo/violet accents, smooth gradients, and animated backgrounds.
- **Lottie Animations** — Engaging animated illustrations on the landing page and loading states.
- **Responsive Design** — Adapts seamlessly from desktop to mobile screens.
- **SweetAlert2 Notifications** — Beautiful, non-intrusive alerts for user feedback.
- **Animated Blob Buttons** — Custom reusable button component with hover effects.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library (Create React App) |
| **React Router v6** | Client-side routing |
| **React Context API** | Global auth state management |
| **React Quill** | Rich-text editor |
| **SweetAlert2** | Alert/toast notifications |
| **Lottie React** | Animation rendering |
| **DOMPurify** | Client-side HTML sanitization |
| **date-fns** | Date formatting |
| **CSS / SCSS** | Styling (Glassmorphism theme) |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Token-based authentication |
| **bcrypt** | Password hashing |
| **Multer** | File upload handling |
| **Helmet** | Security headers |
| **express-rate-limit** | Rate limiting |
| **express-validator** | Input validation |
| **sanitize-html** | Server-side XSS prevention |
| **Google Generative AI** | AI blog generation (Gemini) |

### Deployment
| Service | Purpose |
|---|---|
| **Netlify** | Frontend hosting |
| **Render** | Backend API hosting |
| **MongoDB Atlas** | Cloud database |

---

## 📁 Project Structure

```
FullStack-BlogApp/
├── api/                          # Backend (Express.js)
│   ├── index.js                  # Entry point — server, DB, middleware setup
│   ├── models/
│   │   ├── Post.js               # Post schema (title, summary, content, cover, author)
│   │   └── User.js               # User schema (username/email, hashed password)
│   ├── routes/
│   │   ├── auth.js               # /register, /login, /profile, /logout
│   │   └── posts.js              # /feed, /search, /post CRUD, /generate-blog, /improve-blog
│   ├── middleware/
│   │   ├── auth.js               # JWT verification middleware
│   │   └── security.js           # Rate limiters + HTML sanitizer
│   ├── uploads/                  # Uploaded cover images (served statically)
│   └── package.json
│
├── client/                       # Frontend (React)
│   ├── src/
│   │   ├── App.js                # Route definitions
│   │   ├── components/
│   │   │   ├── Header.js         # Navigation bar with search & auth state
│   │   │   ├── Background.js     # Landing page with Lottie animations
│   │   │   ├── Layout.js         # Shared layout wrapper
│   │   │   ├── Post.js           # Blog post card component
│   │   │   ├── Pagination.js     # Reusable pagination controls
│   │   │   ├── BlobButton.js     # Animated blob button component
│   │   │   ├── Spinner.js        # Loading spinner
│   │   │   ├── Editor.js         # React Quill wrapper
│   │   │   ├── ErrorBoundary.js  # Catches component-level errors
│   │   │   └── ProtectedRoute.js # Auth guard for private routes
│   │   ├── pages/
│   │   │   ├── Feed.js           # Public feed (all posts, paginated)
│   │   │   ├── SearchResults.js  # Search results page
│   │   │   ├── Posts.js          # User's own posts (authenticated)
│   │   │   ├── PostPage.js       # Single post detail view
│   │   │   ├── CreatePost.js     # Post creation form
│   │   │   ├── EditPost.js       # Post editing form
│   │   │   ├── BlogGenerator.js  # AI blog generator form
│   │   │   ├── LoginPage.js      # Login form
│   │   │   └── RegisterPage.js   # Registration form
│   │   ├── context/
│   │   │   └── UserContext.js    # Auth context provider
│   │   ├── utils/
│   │   │   └── api.js            # Centralized fetch wrapper (apiFetch, apiUpload, assetUrl)
│   │   ├── styles/               # CSS / SCSS stylesheets
│   │   └── assets/               # Lottie animation JSON files
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/register` | Create a new account | ❌ |
| `POST` | `/login` | Log in and receive JWT cookie | ❌ |
| `GET` | `/profile` | Get current user info from token | ✅ |
| `POST` | `/logout` | Clear auth cookie | ❌ |

### Posts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/feed?page=1&limit=10` | Public feed — all posts, paginated | ❌ |
| `GET` | `/search?q=keyword&page=1` | Full-text search on title & summary | ❌ |
| `GET` | `/post` | Logged-in user's posts (paginated) | ✅ |
| `GET` | `/post/:id` | Single post by ID | ❌ |
| `POST` | `/post` | Create a new post (multipart) | ✅ |
| `PUT` | `/post` | Update an existing post | ✅ |
| `DELETE` | `/post/:id` | Delete a post | ✅ |

### AI
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/generate-blog` | Generate a blog draft with Gemini AI | ❌ |
| `POST` | `/improve-blog` | Improve existing content with AI | ❌ |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 16.20.0
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Google Gemini API Key** (for AI features — [get one here](https://aistudio.google.com/app/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/nandinikashyap1902/MereBlogs.git
cd MereBlogs
```

### 2. Setup the Backend

```bash
cd api
npm install
```

Create an `.env` file in the `api/` directory:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
PORT=4000
```

Start the backend development server:

```bash
npm run dev
```

The API will be available at `http://localhost:4000`.

### 3. Setup the Frontend

```bash
cd ../client
npm install
```

Create an `.env` file in the `client/` directory:

```env
REACT_APP_API_URL=http://localhost:4000
```

Start the frontend development server:

```bash
npm start
```

The app will open at `http://localhost:3000`.

---

## ☁️ Deployment

### Backend (Render)

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set the following:
   - **Root Directory:** `api`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables in the **Environment** tab:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — your JWT secret
   - `GEMINI_API_KEY` — your Gemini API key
   - `NODE_ENV` — `production`

### Frontend (Netlify)

1. Create a new site on [Netlify](https://www.netlify.com).
2. Connect your GitHub repository.
3. Set the following:
   - **Base Directory:** `client`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `client/build`
4. Add the environment variable:
   - `REACT_APP_API_URL` — your Render backend URL (e.g. `https://your-api.onrender.com`)

---

## 🔒 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `MONGO_URI` | `api/.env` | MongoDB connection string |
| `JWT_SECRET` | `api/.env` | Secret key for signing JWT tokens |
| `GEMINI_API_KEY` | `api/.env` | Google Gemini API key for AI features |
| `NODE_ENV` | `api/.env` | `development` or `production` |
| `PORT` | `api/.env` | Server port (default: `4000`) |
| `REACT_APP_API_URL` | `client/.env` | Backend API base URL |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/nandinikashyap1902">Nandini Kashyap</a>
</p>
