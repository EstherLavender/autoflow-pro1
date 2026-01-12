const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getUserNotifications, markAsRead } = require('../config/notifications');

// Get user's notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const notifications = getUserNotifications(req.user.id);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = markAsRead(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

module.exports = router;
