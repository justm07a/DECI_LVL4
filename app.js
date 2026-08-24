require('dotenv').config();
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const registrationsRoutes = require('./routes/registrationsRoutes');
const announcementsRoutes = require('./routes/announcementsRoutes');
const setupSwagger = require('./config/swagger');

require('./models/user.model');
require('./models/category.model');
require('./models/event.model');
require('./models/registration.model');
require('./models/message.model');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(mongoSanitize());

app.get('/health', async (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    database: dbStatus,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/registrations', registrationsRoutes);
app.use('/api/announcements', announcementsRoutes);

setupSwagger(app);

app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

app.use(errorHandler);

if (process.env.VERCEL !== '1') {
  const server = http.createServer(app);
  const { Server } = require('socket.io');
  const io = new Server(server);

  app.set('io', io);

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join-event', (eventId) => {
      socket.join(eventId);
      console.log(`Socket ${socket.id} joined room: ${eventId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  async function start() {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }

  start();

  module.exports = { app, server };
} else {
  const mongoose = require('mongoose');
  let connected = false;

  const ensureDB = async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  };

  app.use('/api', ensureDB);
  app.use('/health', ensureDB);

  module.exports = app;
}
