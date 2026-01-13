const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Email templates
const emailTemplates = {
  registration: (userName, userRole) => ({
    subject: 'Welcome to AutoFlow Pro!',
    html: `
      <h2>Welcome to AutoFlow Pro, ${userName}!</h2>
      <p>Your account has been created successfully as a <strong>${userRole}</strong>.</p>
      ${userRole !== 'customer' ? '<p>Your account is pending approval. We will notify you once it has been reviewed.</p>' : '<p>You can now start booking car wash services!</p>'}
      <p>Best regards,<br>AutoFlow Pro Team</p>
    `
  }),
  
  approval: (userName) => ({
    subject: 'Your Account Has Been Approved!',
    html: `
      <h2>Great News, ${userName}!</h2>
      <p>Your account has been approved and is now active.</p>
      <p>You can now log in and start using AutoFlow Pro.</p>
      <p>Best regards,<br>AutoFlow Pro Team</p>
    `
  }),
  
  bookingConfirmation: (userName, bookingDetails) => ({
    subject: 'Booking Confirmation',
    html: `
      <h2>Booking Confirmed</h2>
      <p>Hi ${userName},</p>
      <p>Your booking has been confirmed!</p>
      <p><strong>Service:</strong> ${bookingDetails.serviceName}</p>
      <p><strong>Date:</strong> ${bookingDetails.date}</p>
      <p><strong>Time:</strong> ${bookingDetails.time}</p>
      <p><strong>Total:</strong> KSh ${bookingDetails.price}</p>
      <p>Best regards,<br>AutoFlow Pro Team</p>
    `
  }),
  
  bookingStatusUpdate: (userName, status, bookingId) => ({
    subject: `Booking ${status.toUpperCase()}`,
    html: `
      <h2>Booking Status Update</h2>
      <p>Hi ${userName},</p>
      <p>Your booking #${bookingId} status has been updated to: <strong>${status}</strong></p>
      <p>Best regards,<br>AutoFlow Pro Team</p>
    `
  }),
  
  detailerAssignment: (detailerName, bookingDetails) => ({
    subject: 'New Job Assignment',
    html: `
      <h2>New Job Assigned</h2>
      <p>Hi ${detailerName},</p>
      <p>You have been assigned a new job:</p>
      <p><strong>Service:</strong> ${bookingDetails.serviceName}</p>
      <p><strong>Date:</strong> ${bookingDetails.date}</p>
      <p><strong>Time:</strong> ${bookingDetails.time}</p>
      <p><strong>Vehicle:</strong> ${bookingDetails.vehicle}</p>
      <p>Best regards,<br>AutoFlow Pro Team</p>
    `
  }),
  
  emailVerification: (userName, verificationCode) => ({
    subject: 'Email Verification Code - AutoFlow Pro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Email Verification</h2>
        <p>Hi ${userName},</p>
        <p>Your verification code is:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="font-size: 32px; letter-spacing: 8px; margin: 0; color: #1f2937;">${verificationCode}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #6b7280; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        <p>Best regards,<br>AutoFlow Pro Team</p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const emailContent = emailTemplates[template](data.userName || data.detailerName, data);
    
    const info = await transporter.sendMail({
      from: `"AutoFlow Pro" <${process.env.SMTP_USER}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send custom email directly
const sendEmailDirect = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"AutoFlow Pro" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// System notification storage (in-memory for now, should be in database)
const notifications = [];

const createNotification = (userId, type, title, message) => {
  const notification = {
    id: Date.now().toString(),
    userId,
    type, // 'info', 'success', 'warning', 'error'
    title,
    message,
    read: false,
    createdAt: new Date()
  };
  
  notifications.push(notification);
  return notification;
};

const getUserNotifications = (userId) => {
  return notifications.filter(n => n.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
};

const markAsRead = (notificationId) => {
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
  return notification;
};

module.exports = {
  sendEmail,
  sendEmailDirect,
  emailTemplates,
  transporter,
  createNotification,
  getUserNotifications,
  markAsRead
};
