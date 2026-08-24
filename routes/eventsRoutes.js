const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/eventsController');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: List events with filtering, pagination, sorting, and search
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city name
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter events from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter events up to this date
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, capacity]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of events with pagination metadata
 */
router.get('/', ctrl.getEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Get a single event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details with populated category and organizer
 *       404:
 *         description: Event not found
 */
router.get('/:id', ctrl.getEventById);

/**
 * @swagger
 * /api/events:
 *   post:
 *     tags: [Events]
 *     summary: Create a new event (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, category, date, city, venue, capacity]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               city:
 *                 type: string
 *               venue:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Event created
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (admin only)
 *       422:
 *         description: Validation error
 */
router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('category').isMongoId().withMessage('Valid category ID is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
    body('city').notEmpty().withMessage('City is required'),
    body('venue').notEmpty().withMessage('Venue is required'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  validate,
  ctrl.createEvent
);

/**
 * @swagger
 * /api/events/{id}:
 *   patch:
 *     tags: [Events]
 *     summary: Update an event (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *               city:
 *                 type: string
 *               venue:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Event updated
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Event not found
 */
router.patch(
  '/:id',
  requireAuth,
  requireRole('admin'),
  [
    body('category').optional().isMongoId().withMessage('Valid category ID is required'),
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
  ],
  validate,
  ctrl.updateEvent
);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     tags: [Events]
 *     summary: Delete an event (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Event not found
 */
router.delete('/:id', requireAuth, requireRole('admin'), ctrl.deleteEvent);

module.exports = router;
