const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/registrationsController');
const requireAuth = require('../middleware/requireAuth');
const validate = require('../middleware/validate');

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     tags: [Registrations]
 *     summary: Register for an event
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eventId]
 *             properties:
 *               eventId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Already registered or event full
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Event not found
 *       422:
 *         description: Validation error
 */
router.post(
  '/',
  requireAuth,
  [body('eventId').isMongoId().withMessage('Valid event ID is required')],
  validate,
  ctrl.registerForEvent
);

/**
 * @swagger
 * /api/registrations/my:
 *   get:
 *     tags: [Registrations]
 *     summary: Get my registrations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's registrations with event details
 *       401:
 *         description: Not authenticated
 */
router.get('/my', requireAuth, ctrl.getMyRegistrations);

/**
 * @swagger
 * /api/registrations/{id}:
 *   delete:
 *     tags: [Registrations]
 *     summary: Cancel a registration
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
 *         description: Registration cancelled
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not your registration
 *       404:
 *         description: Registration not found
 */
router.delete('/:id', requireAuth, ctrl.cancelRegistration);

module.exports = router;
