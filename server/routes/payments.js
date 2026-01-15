const express = require('express');
const axios = require('axios');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// M-Pesa credentials
const CONSUMER_KEY = '9t9EdgWDctNpDwCAlWudZNG1GRtX5VVGu1S1EJ8cSiX9D9kU';
const CONSUMER_SECRET = 'n8YrAg9UsNoUYXdxtJxWjWnmiHYK2aGJn12wfyqbgx3kzUstN4hAIS11K4KV49sw';
const BUSINESS_SHORT_CODE = process.env.MPESA_SHORTCODE || '174379';
const PASS_KEY = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || 'https://your-domain.com/api/payments/callback';

// Get M-Pesa access token
async function getMpesaAccessToken() {
  try {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('M-Pesa token error:', error.response?.data || error.message);
    throw new Error('Failed to get M-Pesa access token');
  }
}

// Initiate STK Push (M-Pesa prompt)
router.post('/mpesa/stkpush', authenticateToken, async (req, res) => {
  try {
    const { phone, amount, booking_id } = req.body;

    // Validate input
    if (!phone || !amount) {
      return res.status(400).json({ error: 'Phone number and amount are required' });
    }

    // Format phone number (remove leading 0 or +254)
    let formattedPhone = phone.replace(/\s/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith('+254')) {
      formattedPhone = formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    const accessToken = await getMpesaAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${BUSINESS_SHORT_CODE}${PASS_KEY}${timestamp}`).toString('base64');

    const stkPushData = {
      BusinessShortCode: BUSINESS_SHORT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: BUSINESS_SHORT_CODE,
      PhoneNumber: formattedPhone,
      CallBackURL: CALLBACK_URL,
      AccountReference: booking_id || 'TRACKWASH',
      TransactionDesc: 'Car Wash Payment',
    };

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkPushData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Save transaction to database
    const result = await pool.query(
      `INSERT INTO payments (user_id, booking_id, amount, payment_method, status, mpesa_checkout_id, phone_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.user.userId,
        booking_id,
        amount,
        'mpesa',
        'pending',
        response.data.CheckoutRequestID,
        formattedPhone,
      ]
    );

    res.json({
      success: true,
      message: 'STK push sent successfully',
      checkoutRequestId: response.data.CheckoutRequestID,
      payment: result.rows[0],
    });
  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to initiate payment',
      details: error.response?.data || error.message,
    });
  }
});

// M-Pesa callback (webhook)
router.post('/mpesa/callback', async (req, res) => {
  try {
    console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2));

    const { Body } = req.body;
    const { stkCallback } = Body;

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    // Update payment status
    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      const mpesaReceiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;

      await pool.query(
        `UPDATE payments 
         SET status = $1, mpesa_receipt = $2, updated_at = NOW()
         WHERE mpesa_checkout_id = $3`,
        ['completed', mpesaReceiptNumber, checkoutRequestId]
      );

      // Update booking status if payment was for a booking
      await pool.query(
        `UPDATE bookings b
         SET status = 'confirmed'
         FROM payments p
         WHERE p.booking_id = b.id 
         AND p.mpesa_checkout_id = $1
         AND b.status = 'pending'`,
        [checkoutRequestId]
      );
    } else {
      // Payment failed
      await pool.query(
        `UPDATE payments 
         SET status = $1, error_message = $2, updated_at = NOW()
         WHERE mpesa_checkout_id = $3`,
        ['failed', resultDesc, checkoutRequestId]
      );
    }

    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('Callback error:', error);
    res.json({ ResultCode: 1, ResultDesc: 'Failed' });
  }
});

// Get all payments (Admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, user_id } = req.query;

    let query = `
      SELECT 
        p.*,
        u.email as user_email,
        u.full_name as user_name,
        b.id as booking_id,
        s.name as service_name
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN bookings b ON p.booking_id = b.id
      LEFT JOIN services s ON b.service_id = s.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND p.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (user_id) {
      query += ` AND p.user_id = $${paramCount}`;
      params.push(user_id);
      paramCount++;
    }

    query += ' ORDER BY p.created_at DESC LIMIT 100';

    const result = await pool.query(query, params);
    res.json({ payments: result.rows });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get payment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        p.*,
        u.email as user_email,
        u.full_name as user_name,
        b.id as booking_id,
        s.name as service_name
       FROM payments p
       LEFT JOIN users u ON p.user_id = u.id
       LEFT JOIN bookings b ON p.booking_id = b.id
       LEFT JOIN services s ON b.service_id = s.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment: result.rows[0] });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Check payment status
router.get('/status/:checkoutRequestId', authenticateToken, async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;

    const result = await pool.query(
      'SELECT * FROM payments WHERE mpesa_checkout_id = $1',
      [checkoutRequestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment: result.rows[0] });
  } catch (error) {
    console.error('Check payment status error:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

module.exports = router;
