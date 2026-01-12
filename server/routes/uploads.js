const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const { authenticateToken } = require('../middleware/auth');
const pool = require('../config/database');
const path = require('path');

// Upload profile picture
router.post('/profile', authenticateToken, upload.single('profile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = `/uploads/profile/${req.file.filename}`;
    const userId = req.user.id;

    // Update user profile picture in database
    await pool.query(
      'UPDATE users SET profile_picture = $1 WHERE id = $2',
      [filePath, userId]
    );

    res.json({ 
      message: 'Profile picture uploaded successfully',
      filePath
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

// Upload vehicle photo
router.post('/vehicle/:vehicleId', authenticateToken, upload.single('vehicle'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { vehicleId } = req.params;
    const filePath = `/uploads/vehicle/${req.file.filename}`;

    // Verify vehicle ownership
    const vehicleCheck = await pool.query(
      'SELECT * FROM vehicles WHERE id = $1 AND owner_id = $2',
      [vehicleId, req.user.id]
    );

    if (vehicleCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Vehicle not found or access denied' });
    }

    // Update vehicle photo in database
    await pool.query(
      'UPDATE vehicles SET photo = $1 WHERE id = $2',
      [filePath, vehicleId]
    );

    res.json({ 
      message: 'Vehicle photo uploaded successfully',
      filePath
    });
  } catch (error) {
    console.error('Error uploading vehicle photo:', error);
    res.status(500).json({ error: 'Failed to upload vehicle photo' });
  }
});

module.exports = router;
