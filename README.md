# Pastebin Lite

A lightweight, secure text-sharing application with optional expiry and view limits. Built with Next.js, React, and Redis.

## ✨ Features

- 📝 **Create Pastes** - Share text snippets instantly
- 🔗 **Shareable Links** - Get unique URLs for each paste
- ⏰ **TTL Expiry** - Pastes auto-delete after X seconds
- 👀 **View Limits** - Set maximum number of views per paste
- 🔒 **Safe Rendering** - No XSS vulnerabilities, content is sanitized
- 🚀 **Instant Sharing** - Copy link and share with anyone
- 📱 **Responsive Design** - Works on desktop, tablet, mobile
- ⚡ **Lightning Fast** - Sub-millisecond database lookups

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16+) - [Download here](https://nodejs.org)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com)

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/pastebin-lite.git
cd pastebin-lite

# 2. Install dependencies
npm install

# 3. Create .env.local file
# Copy .env.example to .env.local
cp .env.example .env.local

# 4. Get a Redis database (free)
# Go to https://upstash.com
# Create a free Redis database
# Copy the connection URL

# 5. Edit .env.local and add your Redis URL
# REDIS_URL=redis://default:YOUR_PASSWORD@YOUR_HOST:PORT

# 6. Start development server
npm run dev

# 7. Open in browser
# Visit http://localhost:3000
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps. It's free and takes 5 minutes.

#### Step 1: Create GitHub Repository

```bash
git add .
git commit -m "Initial commit: Pastebin Lite"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pastebin-lite.git
git push -u origin main
```

#### Step 2: Connect to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click "Sign up" → Choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub
4. Click "New Project"
5. Select `pastebin-lite` repository
6. Click "Import"

#### Step 3: Add Environment Variables

In Vercel dashboard:

1. Click "Environment Variables"
2. Add variable:
   - **Name:** `REDIS_URL`
   - **Value:** Your Redis URL from Upstash
3. Click "Deploy"

#### Step 4: Your App is Live!

Vercel will give you a URL like: `https://pastebin-lite-abc123.vercel.app`

**Test it:**
- Visit the URL in browser
- Create a paste
- Share the link

---

## 🗄️ Persistence Layer

### Why Redis?

We use **Redis (Upstash)** as the database because:

✅ **Built-in TTL Support** - Redis automatically deletes expired keys (perfect for pastes)
✅ **Lightning Fast** - Sub-millisecond lookups (key-value store)
✅ **Serverless Compatible** - Works perfectly with Vercel
✅ **No Migrations** - No need for schema changes or migrations
✅ **Free Tier** - 10,000 commands/day on free plan
✅ **Reliability** - Built-in replication and backup

### Data Structure

Each paste is stored as a single Redis key:

```
Key: "paste:abc123xyz"
Value: {
  "id": "abc123xyz",
  "content": "The paste text...",
  "created_at": "2025-01-01T12:00:00.000Z",
  "ttl_seconds": 3600,
  "max_views": 5,
  "remaining_views": 4
}

Expiry: Automatic after ttl_seconds
```

### How It Works

1. **Create Paste** → Store in Redis with TTL
2. **TTL Expiry** → Redis automatically deletes key after time
3. **View Limit** → Counter decremented on each fetch
4. **Both Constraints** → Whichever triggers first expires the paste

---

## 🎨 Architecture

### Frontend
- **Framework:** React (via Next.js)
- **Styling:** Tailwind CSS + Custom CSS
- **State:** React hooks (useState, useEffect)
- **Pages:**
  - `/` - Create paste (home page)
  - `/p/:id` - View paste

### Backend
- **Framework:** Next.js API Routes
- **Language:** JavaScript (Node.js)
- **Database:** Redis (Upstash)

### API Endpoints

#### `POST /api/pastes`
**Create a new paste**

Request:
```json
{
  "content": "Your text here",
  "ttl_seconds": 3600,
  "max_views": 5
}
```

Response:
```json
{
  "id": "abc123xyz",
  "url": "https://your-domain.com/p/abc123xyz"
}
```

#### `GET /api/pastes/:id`
**Fetch paste content (counts as a view)**

Response:
```json
{
  "content": "Your text here",
  "remaining_views": 4,
  "expires_at": "2025-01-01T13:00:00.000Z"
}
```

#### `GET /p/:id`
**View paste in browser (HTML page)**

Returns HTML page with the paste content displayed safely.

#### `GET /api/healthz`
**Health check**

Response:
```json
{
  "ok": true
}
```

---

## 🧪 Testing

### Manual API Tests

```bash
# Health check
curl http://localhost:3000/api/healthz

# Create a paste
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello World","ttl_seconds":60}'

# Fetch the paste (replace PASTE_ID with actual ID)
curl http://localhost:3000/api/pastes/PASTE_ID

# Try to exceed view limit
# First fetch works: remaining_views decrements
# Keep fetching until limit is hit
# Final fetch returns 404
```

### UI Testing

1. Go to http://localhost:3000
2. Type some text in the textarea
3. Click "✨ Create Paste"
4. Copy the generated link
5. Open in new tab
6. Paste should be displayed
7. Click "Copy Content" to test copy functionality

---

## 📋 Design Decisions

### 1. **Redis over Traditional Database**

**Why?** 
- TTL is built-in (auto-delete expired pastes)
- No need for migrations or schema changes
- Perfect for serverless (Vercel)
- Extremely fast for this use case

### 2. **nanoid for Paste IDs**

**Why?**
- Short (10 characters)
- Unique (collision-resistant)
- URL-safe characters
- Smaller URLs than UUIDs

### 3. **Single Redis Document**

**Why?**
- Atomic updates (no race conditions)
- Simpler logic
- Faster queries
- No need for transactions

### 4. **Vercel + Next.js**

**Why?**
- Serverless (auto-scaling)
- Zero maintenance
- Free tier sufficient
- Seamless GitHub integration
- Environment variable management built-in

### 5. **Tailwind CSS**

**Why?**
- Rapid UI development
- Responsive by default
- Professional look with minimal effort
- Small bundle size

---

## 🔒 Security

### Input Validation
- ✅ Content must be non-empty string
- ✅ TTL must be integer ≥ 1
- ✅ Max views must be integer ≥ 1

### Content Safety
- ✅ Rendered as text (not HTML)
- ✅ Automatically escaped
- ✅ No script execution possible
- ✅ Safe from XSS attacks

### Environment Security
- ✅ Secrets in `.env.local` (not in code)
- ✅ `.gitignore` prevents committing secrets
- ✅ Environment variables in Vercel (not in code)

### Database Security
- ✅ Connection over TLS
- ✅ Unique Redis database (isolated)
- ✅ Authentication required
- ✅ Firewall rules

---

## 📁 Project Structure

```
pastebin-lite/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── healthz/
│   │   │   │   └── route.js          # Health check endpoint
│   │   │   └── pastes/
│   │   │       ├── route.js          # POST: Create paste
│   │   │       └── [id]/
│   │   │           └── route.js      # GET: Fetch paste
│   │   ├── p/
│   │   │   └── [id]/
│   │   │       └── page.jsx          # View paste page
│   │   ├── page.jsx                  # Home page
│   │   ├── layout.jsx                # Root layout
│   │   └── globals.css               # Global styles
│   └── lib/
│       ├── redis.js                  # Redis client setup
│       └── paste.js                  # Paste business logic
├── .env.example                      # Environment template
├── .env.local                        # Local secrets (not committed)
├── .gitignore                        # Git ignore rules
├── package.json                      # Dependencies
├── README.md                         # This file
├── vercel.json                       # Vercel config
├── next.config.js                    # Next.js config
├── tailwind.config.js                # Tailwind config
└── postcss.config.js                 # PostCSS config
```

---

## 🚨 Troubleshooting

### "Redis connection failed"
1. Check `.env.local` has correct REDIS_URL
2. Verify Redis database is running on Upstash
3. Check database status in Upstash dashboard
4. Restart dev server: `npm run dev`

### "npm: command not found"
1. Install Node.js from https://nodejs.org
2. Restart your terminal
3. Verify: `node --version`

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
# Then visit http://localhost:3001
```

### "Build fails on Vercel"
1. Check Vercel build logs (shows exact error)
2. Verify all imports are correct
3. Test locally: `npm run build`
4. Push fix to GitHub
5. Vercel auto-redeploys

### ".env.local not loading"
1. Verify file name is exactly `.env.local` (case-sensitive)
2. Verify it's in project root folder
3. Restart dev server
4. Add a test variable and log it

---

## 🎓 Learning Resources

### Understanding the Code
- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Redis Docs:** https://redis.io/docs

### Concepts Covered
- Frontend/Backend separation
- API design and RESTful endpoints
- Database persistence
- Environment variables
- Deployment pipelines
- Git version control

---

## 📝 License

This project is open source and available under the MIT License.

---

## ✅ Checklist Before Submission

- [ ] App runs locally: `npm run dev`
- [ ] Can create paste
- [ ] Can view paste
- [ ] TTL expiry works
- [ ] View limit works
- [ ] `/api/healthz` returns `{"ok":true}`
- [ ] All files pushed to GitHub
- [ ] App deployed on Vercel
- [ ] Deployed URL is live and tested
- [ ] No secrets in GitHub (check `.gitignore`)
- [ ] README.md is complete
- [ ] You have 3 submission links:
  - GitHub repo URL
  - Vercel deployed URL
  - This README (via GitHub)

---

## 🎉 Deployment Checklist

1. **Vercel URL works** - Can you visit it in browser?
2. **Create paste** - Works on deployed URL?
3. **View paste** - Can you see the paste?
4. **TTL works** - Does it actually expire?
5. **View limits** - Does it respect max views?
6. **API endpoints** - `/api/healthz` returns 200?
7. **No errors** - Check browser console (F12)
8. **Mobile works** - Responsive on phone?

---

## 👨‍💻 Author

Built as a take-home assignment for recruitment. This demonstrates:

✅ Full-stack development skills
✅ Database design and persistence
✅ Deployment and DevOps
✅ Frontend/Backend integration
✅ Testing and quality assurance
✅ Clean code and documentation

---

## 🤝 Support

If you have questions about this application:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the code comments
3. Check Next.js and React documentation
4. Search Stack Overflow for specific errors

---

**Built with ❤️ using Next.js, React, and Redis**

✨ Ready to deploy? Go to [Vercel.com](https://vercel.com) now!