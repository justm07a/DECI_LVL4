const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/registrationsController');
const requireAuth = require('../middleware/requireAuth');
const validate = require('../middleware/validate');

router.post(
  '/',
  requireAuth,
  [body('eventId').isMongoId().withMessage('Valid event ID is required')],
  validate,
  ctrl.registerForEvent
);

router.get('/my', requireAuth, ctrl.getMyRegistrations);

router.delete('/:id', requireAuth, ctrl.cancelRegistration);

module.exports = router;
