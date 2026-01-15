const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { sendEmail, createNotification } = require('../config/notifications');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, full_name, phone } = req.body;
    
    console.log('Registration attempt:', { email, role, full_name, phone, hasPassword: !!password });

    // Validate input
    if (!email || !password || !role) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    // Check if user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('Creating user...');

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password, role, full_name, phone, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
       RETURNING id, email, role, full_name, phone, status, created_at`,
      [email, hashedPassword, role, full_name, phone, role === 'customer' ? 'active' : 'pending']
    );

    const user = result.rows[0];
    console.log('User created:', user.id);

    // Send welcome email
    try {
      await sendEmail(user.email, 'registration', {
        userName: user.full_name || user.email,
        userRole: role
      });
      console.log('Welcome email sent');
    } catch (emailError) {
      console.error('Email send failed (non-critical):', emailError.message);
    }

    // Create system notification
    createNotification(
      user.id,
      'success',
      'Welcome to AutoFlow Pro!',
      role === 'customer' ? 'Your account is ready. Start booking services now!' : 'Your account is pending approval.'
    );

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log('Registration successful');
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        phone: user.phone,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email, hasPassword: !!password });

    // Validate input
    if (!email || !password) {
      console.log('Validation failed - missing credentials');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    console.log('User found:', { id: user.id, email: user.email, role: user.role, status: user.status });

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Password valid');

    // Check if user is suspended
    if (user.status === 'suspended') {
      console.log('User suspended:', email);
      return res.status(403).json({ error: 'Account suspended. Contact administrator.' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log('Login successful');
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        phone: user.phone,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, role, full_name, phone, status, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
