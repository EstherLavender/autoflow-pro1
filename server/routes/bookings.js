const express = require('express');
const pool = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get all bookings (Admin and Detailer see all, Customer sees own)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = `
      SELECT b.*, 
             c.full_name as customer_name, c.email as customer_email,
             d.full_name as detailer_name,
             v.model as vehicle_model, v.license_plate,
             s.name as service_name, s.price as service_price
      FROM bookings b
      LEFT JOIN users c ON b.customer_id = c.id
      LEFT JOIN users d ON b.assigned_detailer_id = d.id
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      LEFT JOIN services s ON b.service_id = s.id
    `;
    
    const params = [];
    
    if (req.user.role === 'customer') {
      query += ' WHERE b.customer_id = $1';
      params.push(req.user.id);
    } else if (req.user.role === 'detailer') {
      query += ' WHERE b.assigned_detailer_id = $1';
      params.push(req.user.id);
    }
    
    query += ' ORDER BY b.created_at DESC';
    
    const result = await pool.query(query, params);
    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, 
              c.full_name as customer_name, c.email as customer_email, c.phone as customer_phone,
              d.full_name as detailer_name,
              v.model as vehicle_model, v.license_plate, v.color as vehicle_color,
              s.name as service_name, s.price as service_price, s.duration
       FROM bookings b
       LEFT JOIN users c ON b.customer_id = c.id
       LEFT JOIN users d ON b.assigned_detailer_id = d.id
       LEFT JOIN vehicles v ON b.vehicle_id = v.id
       LEFT JOIN services s ON b.service_id = s.id
       WHERE b.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = result.rows[0];

    // Check authorization
    if (req.user.role === 'customer' && booking.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (req.user.role === 'detailer' && booking.assigned_detailer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Create booking (Customer only)
router.post('/', authenticateToken, authorizeRole('customer'), async (req, res) => {
  try {
    const { vehicle_id, service_id, scheduled_at, notes } = req.body;

    if (!vehicle_id || !service_id) {
      return res.status(400).json({ error: 'Vehicle and service are required' });
    }

    // Get service price
    const serviceResult = await pool.query('SELECT price FROM services WHERE id = $1', [service_id]);
    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const amount = serviceResult.rows[0].price;

    const result = await pool.query(
      `INSERT INTO bookings (customer_id, vehicle_id, service_id, amount, scheduled_at, notes, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'requested', NOW(), NOW())
       RETURNING *`,
      [req.user.id, vehicle_id, service_id, amount, scheduled_at, notes]
    );

    res.status(201).json({ booking: result.rows[0], message: 'Booking created successfully' });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking status (Admin and Detailer)
router.patch('/:id/status', authenticateToken, authorizeRole('admin', 'detailer'), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['requested', 'assigned', 'in_progress', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updates = { status, updated_at: 'NOW()' };

    if (status === 'in_progress') {
      updates.started_at = 'NOW()';
    } else if (status === 'completed') {
      updates.completed_at = 'NOW()';
    }

    const result = await pool.query(
      `UPDATE bookings 
       SET status = $1, 
           started_at = COALESCE(started_at, ${status === 'in_progress' ? 'NOW()' : 'started_at'}),
           completed_at = ${status === 'completed' ? 'NOW()' : 'completed_at'},
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking: result.rows[0], message: 'Booking status updated' });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Assign detailer (Admin only)
router.patch('/:id/assign', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { detailer_id } = req.body;

    if (!detailer_id) {
      return res.status(400).json({ error: 'Detailer ID is required' });
    }

    // Verify detailer exists and is active
    const detailerCheck = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND role = $2 AND status = $3',
      [detailer_id, 'detailer', 'active']
    );

    if (detailerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Active detailer not found' });
    }

    const result = await pool.query(
      `UPDATE bookings 
       SET assigned_detailer_id = $1, status = 'assigned', updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [detailer_id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking: result.rows[0], message: 'Detailer assigned successfully' });
  } catch (error) {
    console.error('Assign detailer error:', error);
    res.status(500).json({ error: 'Failed to assign detailer' });
  }
});

// Cancel booking (Customer and Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Get booking
    const bookingResult = await pool.query('SELECT * FROM bookings WHERE id = $1', [req.params.id]);
    
    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // Check authorization
    if (req.user.role === 'customer' && booking.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Can't cancel completed bookings
    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed booking' });
    }

    await pool.query(
      `UPDATE bookings SET status = 'cancelled', updated_at = NOW() WHERE id = $1`,
      [req.params.id]
    );

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
