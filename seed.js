require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');
const Category = require('./models/category.model');
const Event = require('./models/event.model');
const Registration = require('./models/registration.model');
const Message = require('./models/message.model');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    await Message.deleteMany();
    await Registration.deleteMany();
    await Event.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    console.log('Old data cleared');

    const adminPassword = await bcrypt.hash('admin123', 12);
    const attendeePassword = await bcrypt.hash('attendee123', 12);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eventpulse.com',
      password: adminPassword,
      role: 'admin',
    });

    const attendee = await User.create({
      name: 'John Doe',
      email: 'john@eventpulse.com',
      password: attendeePassword,
      role: 'attendee',
    });

    console.log('Users created');

    const categories = await Category.insertMany([
      { name: 'Music', description: 'Live music events and concerts' },
      { name: 'Tech', description: 'Technology meetups and conferences' },
      { name: 'Sports', description: 'Sports events and tournaments' },
      { name: 'Art', description: 'Art exhibitions and workshops' },
    ]);
    console.log('Categories created');

    const events = await Event.insertMany([
      {
        title: 'Rock Night Live',
        description: 'An amazing night of live rock music featuring local bands.',
        category: categories[0]._id,
        date: new Date('2026-09-15T19:00:00'),
        city: 'Cairo',
        venue: 'Cairo Opera House',
        capacity: 200,
        organizer: admin._id,
      },
      {
        title: 'AI Workshop',
        description: 'Hands-on workshop about Artificial Intelligence and Machine Learning.',
        category: categories[1]._id,
        date: new Date('2026-09-20T10:00:00'),
        city: 'Alexandria',
        venue: 'Bibliotheca Alexandrina',
        capacity: 50,
        organizer: admin._id,
      },
      {
        title: 'Marathon Cairo 2026',
        description: 'Annual Cairo marathon for all fitness levels.',
        category: categories[2]._id,
        date: new Date('2026-10-01T06:00:00'),
        city: 'Cairo',
        venue: 'Cairo International Stadium',
        capacity: 500,
        organizer: admin._id,
      },
      {
        title: 'Modern Art Exhibition',
        description: 'Exhibition showcasing contemporary Egyptian artists.',
        category: categories[3]._id,
        date: new Date('2026-10-10T11:00:00'),
        city: 'Giza',
        venue: 'Egyptian Modern Art Museum',
        capacity: 100,
        organizer: admin._id,
      },
    ]);
    console.log('Events created');

    await Registration.create({
      event: events[0]._id,
      attendee: attendee._id,
    });
    console.log('Sample registration created');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
