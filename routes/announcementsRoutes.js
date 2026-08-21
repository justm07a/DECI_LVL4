const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/announcementsController');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');

router.post(
  '/',
  requireAuth,
  requireRole('admin'),
  [
    body('eventId').isMongoId().withMessage('Valid event ID is required'),
    body('text').notEmpty().withMessage('Announcement text is required'),
  ],
  validate,
  ctrl.sendAnnouncement
);

router.get('/:eventId', ctrl.getAnnouncements);

module.exports = router;
