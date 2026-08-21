# EventPulse API

Backend API for an Event Management Platform built with Node.js, Express, MongoDB, and Socket.io.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **Auth**: JWT + bcrypt
- **Validation**: express-validator
- **Testing**: Jest + Supertest
- **Docs**: Swagger UI

## Local Installation

```bash
git clone https://github.com/username/StudentID-EventPulse.git
cd StudentID-EventPulse
npm install
```

Create a `.env` file:
```
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/eventpulse
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

Seed the database and start:
```bash
npm run seed
npm run dev
```

## API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register a new user | Public |
| POST | /api/auth/login | Login | Public |
| GET | /api/events | List events (filter, pagination, search) | Public |
| GET | /api/events/:id | Get single event | Public |
| POST | /api/events | Create event | Admin |
| PATCH | /api/events/:id | Update event | Admin |
| DELETE | /api/events/:id | Delete event | Admin |
| POST | /api/registrations | Register for event | Auth |
| GET | /api/registrations/my | My registrations | Auth |
| DELETE | /api/registrations/:id | Cancel registration | Auth |
| POST | /api/announcements | Send announcement | Admin |
| GET | /api/announcements/:eventId | Get announcements | Public |
| GET | /health | Health check | Public |

## Live Deployment

[Deployment Link](https://your-vercel-url.vercel.app)

## License

ISC
