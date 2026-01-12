const express = require('express');
const pool = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get customer's vehicles
router.get('/', authenticateToken, authorizeRole('customer'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM vehicles WHERE customer_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ vehicles: result.rows });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Add vehicle
router.post('/', authenticateToken, authorizeRole('customer'), async (req, res) => {
  try {
    const { make, model, year, license_plate, color } = req.body;

    if (!model || !license_plate) {
      return res.status(400).json({ error: 'Model and license plate are required' });
    }

    const result = await pool.query(
      `INSERT INTO vehicles (customer_id, make, model, year, license_plate, color, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [req.user.id, make, model, year, license_plate, color]
    );

    res.status(201).json({ vehicle: result.rows[0], message: 'Vehicle added successfully' });
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

// Update vehicle
router.put('/:id', authenticateToken, authorizeRole('customer'), async (req, res) => {
  try {
    const { make, model, year, license_plate, color } = req.body;

    // Verify ownership
    const ownershipCheck = await pool.query(
      'SELECT * FROM vehicles WHERE id = $1 AND customer_id = $2',
      [req.params.id, req.user.id]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const result = await pool.query(
      `UPDATE vehicles 
       SET make = COALESCE($1, make),
           model = COALESCE($2, model),
           year = COALESCE($3, year),
           license_plate = COALESCE($4, license_plate),
           color = COALESCE($5, color),
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [make, model, year, license_plate, color, req.params.id]
    );

    res.json({ vehicle: result.rows[0], message: 'Vehicle updated successfully' });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

// Delete vehicle
router.delete('/:id', authenticateToken, authorizeRole('customer'), async (req, res) => {
  try {
    // Verify ownership
    const result = await pool.query(
      'DELETE FROM vehicles WHERE id = $1 AND customer_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

module.exports = router;
