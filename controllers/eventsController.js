const Event = require('../models/event.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.getEvents = asyncHandler(async (req, res, next) => {
  const { category, city, startDate, endDate, page, limit, sortBy, order, search } = req.query;

  const filter = {};

  if (category) filter.category = category;
  if (city) filter.city = city;

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const allowedSortFields = ['date', 'capacity', 'registrations'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'date';
  const sortDirection = order === 'desc' ? -1 : 1;

  const Registration = require('../models/registration.model');

  const pipeline = [
    { $match: filter },
    { $lookup: { from: 'registrations', localField: '_id', foreignField: 'event', as: 'regList' } },
    { $addFields: { registrationCount: { $size: '$regList' } } },
    { $project: { regList: 0 } },
    { $sort: { [sortField === 'registrations' ? 'registrationCount' : sortField]: sortDirection } },
    { $skip: skip },
    { $limit: limitNum },
    { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'category' } },
    { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
    { $lookup: { from: 'users', localField: 'organizer', foreignField: '_id', as: 'organizer' } },
    { $unwind: { path: '$organizer', preserveNullAndEmptyArrays: true } },
    { $project: { 'organizer.password': 0 } },
  ];

  const countPipeline = [
    { $match: filter },
    { $count: 'total' },
  ];

  const [data, countResult] = await Promise.all([
    Registration ? Event.aggregate(pipeline) : Event.find(filter).populate('category').populate('organizer', 'name email').sort({ [sortField]: sortDirection }).skip(skip).limit(limitNum),
    Registration ? Registration.aggregate(countPipeline) : Event.countDocuments(filter),
  ]);

  const total = Array.isArray(countResult) ? (countResult[0]?.total || 0) : countResult;
  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    status: 'success',
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    data,
  });
});

exports.getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id)
    .populate('category')
    .populate('organizer', 'name email');

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: event,
  });
});

exports.createEvent = asyncHandler(async (req, res, next) => {
  const { title, description, category, date, city, venue, capacity } = req.body;

  const event = await Event.create({
    title,
    description,
    category,
    date,
    city,
    venue,
    capacity,
    organizer: req.user.userId,
  });

  res.status(201).json({
    status: 'success',
    data: event,
  });
});

exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('category').populate('organizer', 'name email');

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: event,
  });
});

exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new AppError('Event not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Event deleted successfully',
  });
});
