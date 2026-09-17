# iMessage

A real-time, two-person chat web app styled after Apple's iMessage — text, image, and video messages, live delivery over WebSockets, online-presence indicators, and iMessage-style theming (light/dark, color presets, wallpapers).

**Live app:** https://imessage-1-i1ao.onrender.com

## Features

- **Authentication** via [Clerk](https://clerk.com) (sign up / sign in, session management, user profile)
- **Real-time messaging** with Socket.IO — messages, online/offline presence, and typing feel are pushed instantly, no polling
- **Media messages** — send images and videos, uploaded to [ImageKit](https://imagekit.io) and rendered inline in the chat
- **Conversations & people list** — a "Chats" tab for existing conversations sorted by recency, and a "Users" tab to start a new one
- **iMessage-style UI** — light/dark mode, selectable color themes, wallpapers, keystroke sounds, and a responsive layout that collapses to a single pane on mobile

## Tech stack

**Frontend** — React 19 + Vite, Zustand for state, React Router, HeroUI components, Tailwind CSS, Socket.IO client, Clerk React SDK.

**Backend** — Node.js + Express 5, MongoDB with Mongoose, Socket.IO, Clerk (auth + user-sync webhook), ImageKit (media storage), Multer (upload handling), node-cron (keep-alive ping for the free-tier deployment).

## Project structure

```
backend/    Express API + Socket.IO server, MongoDB models, Clerk webhook
frontend/   React SPA (Vite)
Dockerfile  Multi-stage build: builds the frontend, builds the backend,
            then serves both from a single Express process
```

In production the backend serves the built frontend as static files, so the whole app runs as one process/container — which is how it's deployed on Render.

## Running locally

### Prerequisites
- Node.js 22+
- A MongoDB connection string
- A [Clerk](https://clerk.com) application (publishable + secret key, and a webhook signing secret for user sync)
- An [ImageKit](https://imagekit.io) account (private key) for media uploads

### Backend

```bash
cd backend
npm install
# create a .env with MONGO_URI, PORT, CLERK_SECRET_KEY, CLERK_WEBHOOK_SIGNIN_SECRET,
# IMAGEKIT_PRIVATE_KEY, FRONTED_URL
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# create a .env with VITE_CLERK_PUBLISHABLE_KEY
npm run dev
```

The frontend expects the API at `http://localhost:3000/api` in development (see [frontend/src/lib/axios.js](frontend/src/lib/axios.js)).

## Deployment

The root [Dockerfile](Dockerfile) builds both apps and produces a single runtime image (Express serving the API under `/api` and the built SPA for everything else). This is the image deployed at [imessage-1-i1ao.onrender.com](https://imessage-1-i1ao.onrender.com).
