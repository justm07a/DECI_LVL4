const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/announcementsController');
const requireAuth = require('../middleware/requireAuth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validate');

/**
 * @swagger
 * /api/announcements:
 *   post:
 *     tags: [Announcements]
 *     summary: Send an announcement (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eventId, text]
 *             properties:
 *               eventId:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Announcement sent
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
    body('eventId').isMongoId().withMessage('Valid event ID is required'),
    body('text').notEmpty().withMessage('Announcement text is required'),
  ],
  validate,
  ctrl.sendAnnouncement
);

/**
 * @swagger
 * /api/announcements/{eventId}:
 *   get:
 *     tags: [Announcements]
 *     summary: Get announcement history for an event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of announcements with sender details
 */
router.get('/:eventId', ctrl.getAnnouncements);

module.exports = router;
