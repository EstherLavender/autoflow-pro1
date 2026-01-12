const express = require('express');
const pool = require('../config/database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { status, role } = req.query;
    
    let query = 'SELECT id, email, role, full_name, phone, status, created_at, updated_at FROM users WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (role) {
      query += ` AND role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get pending users (Admin only)
router.get('/pending', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, role, full_name, phone, status, created_at 
       FROM users 
       WHERE status = 'pending' 
       ORDER BY created_at DESC`
    );
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ error: 'Failed to fetch pending users' });
  }
});

// Approve user (Admin only)
router.patch('/:id/approve', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE users 
       SET status = 'active', updated_at = NOW()
       WHERE id = $1 AND status = 'pending'
       RETURNING id, email, role, full_name, phone, status`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pending user not found' });
    }

    res.json({ user: result.rows[0], message: 'User approved successfully' });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ error: 'Failed to approve user' });
  }
});

// Reject user (Admin only)
router.delete('/:id/reject', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 AND status = $2 RETURNING *',
      [req.params.id, 'pending']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pending user not found' });
    }

    res.json({ message: 'User rejected and removed' });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ error: 'Failed to reject user' });
  }
});

// Suspend user (Admin only)
router.patch('/:id/suspend', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE users 
       SET status = 'suspended', updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, role, full_name, phone, status`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0], message: 'User suspended successfully' });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ error: 'Failed to suspend user' });
  }
});

// Activate user (Admin only)
router.patch('/:id/activate', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE users 
       SET status = 'active', updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, role, full_name, phone, status`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0], message: 'User activated successfully' });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({ error: 'Failed to activate user' });
  }
});

// Get user stats (Admin only)
router.get('/stats', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE status = 'active') as active_count,
        COUNT(*) FILTER (WHERE status = 'suspended') as suspended_count,
        COUNT(*) FILTER (WHERE role = 'customer') as customer_count,
        COUNT(*) FILTER (WHERE role = 'detailer') as detailer_count,
        COUNT(*) FILTER (WHERE role = 'admin') as admin_count
      FROM users
    `);

    res.json({ stats: stats.rows[0] });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

module.exports = router;
