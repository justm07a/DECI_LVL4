const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/eventsController');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');

router.get('/', ctrl.getEvents);
router.get('/:id', ctrl.getEventById);

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

router.delete('/:id', requireAuth, requireRole('admin'), ctrl.deleteEvent);

module.exports = router;
