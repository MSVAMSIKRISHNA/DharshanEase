import nodemailer from 'nodemailer';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Create reusable transporter
 * Uses Ethereal for development, configure real SMTP for production
 */
const createTransporter = async () => {
  if (config.nodeEnv === 'development' && (!config.smtp.user || config.smtp.user === 'your_ethereal_user')) {
    const testAccount = await nodemailer.createTestAccount();
    logger.info('Created Ethereal test account', { user: testAccount.user });

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
};

let transporter = null;

const getTransporter = async () => {
  if (!transporter) {
    transporter = await createTransporter();
  }
  return transporter;
};

/**
 * Send an email
 * @param {Object} options - { to, subject, html }
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transport = await getTransporter();

    const mailOptions = {
      from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
      to,
      subject,
      html,
    };

    const info = await transport.sendMail(mailOptions);

    if (config.nodeEnv === 'development') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        logger.info(`📧 Email preview URL: ${previewUrl}`);
      }
    }

    logger.info(`Email sent to ${to}`, { messageId: info.messageId });
    return info;
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    throw error;
  }
};

/**
 * Send verification email
 */
export const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${config.clientUrl}/verify-email/${token}`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FFFFF0;">
      <div style="text-align: center; padding: 24px 0; border-bottom: 3px solid #FF9933;">
        <h1 style="color: #800020; margin: 0; font-size: 28px;">🙏 DarshanEase</h1>
        <p style="color: #708090; margin: 8px 0 0;">Temple Darshan Ticket Booking</p>
      </div>
      <div style="padding: 32px 0;">
        <h2 style="color: #3E2723;">Namaste ${name},</h2>
        <p style="color: #36454F; line-height: 1.6;">Thank you for registering with DarshanEase. Please verify your email address to complete your registration.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}" style="background: #FF9933; color: #fff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Verify Email Address</a>
        </div>
        <p style="color: #708090; font-size: 13px;">If you did not create an account, please ignore this email. This link expires in 24 hours.</p>
      </div>
      <div style="border-top: 1px solid #F5F5DC; padding-top: 16px; text-align: center;">
        <p style="color: #708090; font-size: 12px;">© ${new Date().getFullYear()} DarshanEase. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail({ to: email, subject: 'DarshanEase - Verify Your Email', html });
};

/**
 * Send password reset email
 */
export const sendResetPasswordEmail = async (email, name, token) => {
  const resetUrl = `${config.clientUrl}/reset-password/${token}`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FFFFF0;">
      <div style="text-align: center; padding: 24px 0; border-bottom: 3px solid #FF9933;">
        <h1 style="color: #800020; margin: 0; font-size: 28px;">🙏 DarshanEase</h1>
        <p style="color: #708090; margin: 8px 0 0;">Temple Darshan Ticket Booking</p>
      </div>
      <div style="padding: 32px 0;">
        <h2 style="color: #3E2723;">Hello ${name},</h2>
        <p style="color: #36454F; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="background: #C41E3A; color: #fff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Reset Password</a>
        </div>
        <p style="color: #708090; font-size: 13px;">If you did not request a password reset, please ignore this email. This link expires in 1 hour.</p>
      </div>
      <div style="border-top: 1px solid #F5F5DC; padding-top: 16px; text-align: center;">
        <p style="color: #708090; font-size: 12px;">© ${new Date().getFullYear()} DarshanEase. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail({ to: email, subject: 'DarshanEase - Reset Your Password', html });
};

/**
 * Send booking confirmation email
 */
export const sendBookingConfirmationEmail = async (email, name, booking) => {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FFFFF0;">
      <div style="text-align: center; padding: 24px 0; border-bottom: 3px solid #FF9933;">
        <h1 style="color: #800020; margin: 0; font-size: 28px;">🙏 DarshanEase</h1>
        <p style="color: #708090; margin: 8px 0 0;">Booking Confirmation</p>
      </div>
      <div style="padding: 32px 0;">
        <h2 style="color: #3E2723;">Namaste ${name},</h2>
        <p style="color: #36454F; line-height: 1.6;">Your darshan booking has been confirmed! Here are your booking details:</p>
        <div style="background: #F5F5DC; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #708090;">Booking ID</td><td style="padding: 8px 0; color: #3E2723; font-weight: 600;">${booking.bookingId}</td></tr>
            <tr><td style="padding: 8px 0; color: #708090;">Temple</td><td style="padding: 8px 0; color: #3E2723; font-weight: 600;">${booking.templeName}</td></tr>
            <tr><td style="padding: 8px 0; color: #708090;">Date</td><td style="padding: 8px 0; color: #3E2723; font-weight: 600;">${booking.visitDate}</td></tr>
            <tr><td style="padding: 8px 0; color: #708090;">Time</td><td style="padding: 8px 0; color: #3E2723; font-weight: 600;">${booking.timeSlot}</td></tr>
            <tr><td style="padding: 8px 0; color: #708090;">Devotees</td><td style="padding: 8px 0; color: #3E2723; font-weight: 600;">${booking.devoteeCount}</td></tr>
            <tr><td style="padding: 8px 0; color: #708090;">Amount</td><td style="padding: 8px 0; color: #3E2723; font-weight: 600;">₹${booking.totalAmount}</td></tr>
          </table>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${config.clientUrl}/ticket/${booking.bookingId}" style="background: #FF9933; color: #fff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">View Ticket</a>
        </div>
      </div>
      <div style="border-top: 1px solid #F5F5DC; padding-top: 16px; text-align: center;">
        <p style="color: #708090; font-size: 12px;">© ${new Date().getFullYear()} DarshanEase. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail({ to: email, subject: `DarshanEase - Booking Confirmed (${booking.bookingId})`, html });
};

export default sendEmail;
