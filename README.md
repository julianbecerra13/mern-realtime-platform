# Nexus — MERN Realtime Platform

Full-stack web application built with the MERN stack featuring JWT authentication with refresh token rotation, real-time notifications, task management, and a premium glassmorphism UI with dark/light mode.

**Live Demo:** https://mern-realtime-platform.web.app

## Demo Accounts

Use these pre-loaded accounts to explore the platform with existing data (tasks, notifications, user interactions):

| Name | Email | Password | Data |
|------|-------|----------|------|
| Sofia Martinez | `sofia@nexus.dev` | `sofia2024` | 5 tasks, notifications from team |
| Carlos Rivera | `carlos@nexus.dev` | `carlos2024` | 4 tasks, PR reviews, alerts |
| Ana Lopez | `ana@nexus.dev` | `ana20242` | 3 tasks, design updates |
| Diego Vargas | `diego@nexus.dev` | `diego2024` | Welcome notifications |
| Laura Gomez | `laura@nexus.dev` | `laura2024` | Welcome notifications |

> You can also register a new account to see the full onboarding experience with welcome notifications.

## Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Axios, react-hot-toast
- **Backend:** Node.js, Express.js, MongoDB (Atlas) with Mongoose, Passport.js
- **Auth:** JWT with access/refresh token rotation, Google OAuth 2.0
- **Deploy:** Firebase Hosting + Cloud Functions
- **Testing:** Jest, Supertest, MongoDB Memory Server

## Features

### Authentication
- Email/password registration and login
- JWT access tokens (15min) + refresh tokens (7d) with automatic rotation
- Google OAuth 2.0 social login via Passport.js
- Protected routes on both frontend and backend
- Rate limiting on API endpoints

### Task Management
- Full CRUD: create, update, delete tasks
- Three statuses: To Do, In Progress, Done (click to cycle)
- Priority levels: Low, Medium, High
- Due dates with calendar picker
- Filter by status with animated stat counters
- Progress tracking on dashboard

### Real-Time Notifications
- Send notifications to any user from the Users directory
- 5 notification types: info, success, warning, error, system
- Welcome notifications on registration
- Mark as read, mark all, delete
- Unread badge counter with pulse animation
- Paginated notification history

### Users Directory
- Browse all registered users
- Search by name or email
- Send notifications to any user via modal
- Avatar initials with gradient

### Dashboard
- Animated counter stats (users, tasks, notifications)
- Task progress bar with shimmer effect
- Recent activity feed
- Quick action cards
- Connection status indicator

### UI/UX
- Dark/Light mode toggle (persisted)
- Glassmorphism design with backdrop blur
- Animated gradient mesh background
- Staggered fade-in animations
- Gradient shift on buttons and brand
- Glow effects on card hover
- Responsive across all screen sizes

## Project Structure

```
mern-realtime-platform/
├── functions/               # Firebase Cloud Functions (Express API)
│   ├── src/
│   │   ├── config/          # DB, Passport setup
│   │   ├── controllers/     # Auth, tasks, notifications, users, stats
│   │   ├── middleware/      # Auth, error handler, validation
│   │   ├── models/          # User, Task, Notification schemas
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Notification service
│   │   └── utils/           # Token helpers
│   └── index.js             # Cloud Function entry point
├── server/                  # Local dev server (same codebase)
│   ├── src/
│   └── package.json
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Auth, Layout, Notifications
│   │   ├── context/         # Auth, Theme, Socket, Notification
│   │   ├── hooks/           # useCountUp
│   │   ├── pages/           # Dashboard, Tasks, Users, Profile
│   │   ├── services/        # Axios API client
│   │   └── styles/          # Global CSS
│   └── vite.config.js
├── firebase.json            # Hosting + Functions config
└── README.md
```

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/julianbecerra13/mern-realtime-platform.git
cd mern-realtime-platform

# Install server dependencies
cd server
npm install
cp .env.example .env

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-realtime
JWT_SECRET=your_secure_random_string
JWT_REFRESH_SECRET=another_secure_random_string
CLIENT_URL=http://localhost:3000

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### Running Development

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### Running Tests

```bash
cd server
npm test    # 16 tests (auth + notifications)
```

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/auth/google` | Google OAuth redirect | No |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | List tasks (filterable) | Yes |
| GET | `/api/tasks/stats` | Get task counts by status | Yes |
| POST | `/api/tasks` | Create task | Yes |
| PATCH | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | List users (searchable) | Yes |
| GET | `/api/users/:id` | Get user by ID | Yes |
| PATCH | `/api/users/profile` | Update profile | Yes |
| PATCH | `/api/users/password` | Change password | Yes |

### Notifications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | Get notifications (paginated) | Yes |
| GET | `/api/notifications/unread-count` | Get unread count | Yes |
| POST | `/api/notifications` | Send notification to user | Yes |
| PATCH | `/api/notifications/:id/read` | Mark as read | Yes |
| PATCH | `/api/notifications/read-all` | Mark all as read | Yes |
| DELETE | `/api/notifications/:id` | Delete notification | Yes |

### Stats
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/stats` | Dashboard stats (users, tasks, notifications) | Yes |

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT with short-lived access (15min) + long-lived refresh (7d) rotation
- Helmet security headers
- CORS with explicit origins
- Rate limiting (100 req/15min)
- Input sanitization via express-validator
- MongoDB injection prevention via Mongoose

## License

MIT
