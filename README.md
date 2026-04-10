# MERN Realtime Platform

Full-stack web application built with the MERN stack featuring JWT authentication with refresh token rotation, real-time notifications via WebSockets, and a clean, responsive UI.

## Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Socket.io Client, Axios
- **Backend:** Node.js, Express.js, MongoDB with Mongoose, Socket.io, Passport.js
- **Auth:** JWT with access/refresh token rotation, Google OAuth 2.0
- **Testing:** Jest, Supertest, MongoDB Memory Server

## Features

### Authentication
- Email/password registration and login
- JWT access tokens (15min) + refresh tokens (7d) with automatic rotation
- Refresh token stored in httpOnly secure cookies
- Google OAuth 2.0 social login
- Protected routes on both frontend and backend
- Rate limiting on API endpoints

### Real-Time Notifications
- WebSocket connection via Socket.io with JWT authentication
- Instant push notifications to connected users
- Fallback polling for offline/reconnection scenarios
- Toast notifications on new events
- Notification management: mark as read, mark all, delete
- Unread badge counter with live updates
- Paginated notification history

### API
- RESTful endpoints with consistent response format
- Input validation with express-validator
- Global error handler with environment-aware stack traces
- Mongoose duplicate key and validation error handling
- Helmet security headers + CORS configuration

### UI/UX
- Clean, modern design with CSS custom properties
- Responsive layout across all screen sizes
- Loading states and error feedback
- Connection status indicator (live/offline)
- Dashboard with system stats overview

## Project Structure

```
mern-realtime-platform/
├── server/
│   ├── src/
│   │   ├── config/        # DB, Passport, Socket.io setup
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/     # Auth, error handler, validation
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # Express routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Token helpers
│   │   ├── __tests__/     # Jest test suites
│   │   └── index.js       # App entry point
│   ├── package.json
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client with interceptors
│   │   ├── styles/        # Global CSS
│   │   ├── App.jsx        # Root component with routing
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/mern-realtime-platform.git
cd mern-realtime-platform

# Install server dependencies
cd server
npm install
cp .env.example .env    # Edit with your values

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Edit `server/.env` with your configuration:

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
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### Running Tests

```bash
cd server
npm test
```

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| POST | `/api/auth/refresh` | Refresh access token | Cookie |
| POST | `/api/auth/logout` | Logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/auth/google` | Google OAuth redirect | No |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | List users (paginated, searchable) | Yes |
| GET | `/api/users/:id` | Get user by ID | Yes |
| PATCH | `/api/users/profile` | Update profile | Yes |
| PATCH | `/api/users/password` | Change password | Yes |

### Notifications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | Get notifications (paginated) | Yes |
| GET | `/api/notifications/unread-count` | Get unread count | Yes |
| PATCH | `/api/notifications/:id/read` | Mark as read | Yes |
| PATCH | `/api/notifications/read-all` | Mark all as read | Yes |
| DELETE | `/api/notifications/:id` | Delete notification | Yes |
| POST | `/api/notifications` | Create notification | Admin |

### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `notification:new` | Server -> Client | New notification pushed |

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with short-lived access + long-lived refresh rotation
- httpOnly + secure + sameSite cookies for refresh tokens
- Helmet security headers
- CORS with explicit origin
- Rate limiting (100 req/15min)
- Input sanitization and validation
- MongoDB injection prevention via Mongoose

## License

MIT
