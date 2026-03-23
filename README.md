# 🎬 MoviesAPI

A production-ready RESTful API for managing a movie catalog and personal watchlists. Built with **Node.js**, **Express**, and **PostgreSQL** via **Prisma ORM**, featuring JWT-based authentication, request validation, and security best practices.

---

## 🚀 Features

- 🔐 **JWT Authentication** — Secure cookie-based token auth (register, login, logout)
- 🎥 **Movie Catalog** — Full CRUD for movies with genre filtering, search, and pagination
- 📋 **Personal Watchlist** — Track movies with statuses: `PLANNED`, `WATCHING`, `COMPLETED`, `DROPPED`
- ✅ **Input Validation** — Schema validation with [Zod](https://zod.dev/)
- 🛡️ **Security** — Helmet headers, CORS, bcrypt password hashing, httpOnly cookies
- 🗄️ **Prisma ORM** — Type-safe database access with PostgreSQL
- 🔄 **Graceful Shutdown** — Handles `SIGTERM`, `SIGINT`, and uncaught exceptions cleanly

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcryptjs |
| Validation | Zod |
| Security | Helmet, CORS, cookie-parser |

---

## 📁 Project Structure

```
src/
├── config/         # Database connection
├── controllers/    # Route handlers (auth, movie, watchlist)
├── middleware/     # Auth guard, request validation
├── routes/         # Express routers
├── schemas/        # Zod validation schemas
├── services/       # Business logic layer
├── utils/          # Helpers (token generation)
└── server.js       # App entry point

prisma/
├── schema.prisma   # Database schema (User, Movie, WatchlistItem)
├── seed.js         # Database seeder
└── migrations/     # Prisma migration history
```

---

## 📡 API Endpoints

### Auth — `/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `GET` | `/auth/health` | Health check | ❌ |
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | Login | ❌ |
| `POST` | `/auth/logout` | Logout (clears cookie) | ❌ |

### Movies — `/movie`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `GET` | `/movie` | Get all movies (supports `?search`, `?genre`, `?page`, `?limit`) | ❌ |
| `GET` | `/movie/:id` | Get movie by ID | ❌ |
| `POST` | `/movie` | Create a new movie | ✅ |
| `PUT` | `/movie/:id` | Update a movie (owner only) | ✅ |
| `DELETE` | `/movie/:id` | Delete a movie (owner only) | ✅ |

### Watchlist — `/watchlist`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `GET` | `/watchlist` | Get your watchlist | ✅ |
| `POST` | `/watchlist` | Add movie to watchlist | ✅ |
| `PUT` | `/watchlist/:id` | Update watchlist item | ✅ |
| `DELETE` | `/watchlist/:id` | Remove from watchlist | ✅ |

---

## 🗃️ Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String   // bcrypt hashed
  createdAt DateTime @default(now())
}

model Movie {
  id          String   @id @default(uuid())
  title       String
  overview    String?
  releaseYear Int
  genre       String[]
  runtime     Int?
  posterUrl   String?
  createdBy   String   // FK → User
  createdAt   DateTime @default(now())
}

model WatchistItem {
  id        String          @id @default(uuid())
  userId    String
  movieId   String
  status    WatchistStatus @default(PLANNED)
  rating    Int?
  Ttes     String?

  @@unique([userId, movieId])
}

enum WatchlistStatus { PLANNED | WATCHING | COMPLETED | DROPPED }
