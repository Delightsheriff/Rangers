const nodemailer = require('nodemailer');

// Email templates
const emailTemplates = {
  welcome: (firstName) => ({
    subject: 'Welcome to $plitwise! 🎉',
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to $plitwise, ${firstName}! 🎉</h2>
                <p>We're excited to have you join our community of smart expense sharing.</p>
                <p>With $plitwise, you can:</p>
                <ul>
                    <li>Split expenses with friends and family</li>
                    <li>Track who owes what</li>
                    <li>Manage group expenses effortlessly</li>
                    <li>Keep your finances organized</li>
                </ul>
                <p>Get started by adding your first expense or creating a group!</p>
                <p>If you have any questions, feel free to reach out to our support team.</p>
                <p>Happy expense sharing!</p>
                <p>Best regards,<br>The $plitwise Team</p>
            </div>
        `,
  }),

  login: (firstName) => ({
    subject: 'New Login to Your $plitwise Account',
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>New Login Alert</h2>
                <p>Hi ${firstName},</p>
                <p>We noticed a new login to your $plitwise account.</p>
                <p>If this was you, you can ignore this email.</p>
                <p>If you didn't log in, please secure your account immediately by:</p>
                <ol>
                    <li>Changing your password</li>
                    <li>Enabling two-factor authentication</li>
                    <li>Contacting our support team</li>
                </ol>
                <p>Stay safe!</p>
                <p>Best regards,<br>The $plitwise Team</p>
            </div>
        `,
  }),

  passwordReset: (resetLink) => ({
    subject: 'Reset Your $plitwise Password',
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password for your $plitwise account.</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" 
                       style="background-color: #4CAF50; 
                              color: white; 
                              padding: 12px 24px; 
                              text-decoration: none; 
                              border-radius: 4px; 
                              display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p>If you didn't request this, please ignore this email or contact support if you have concerns.</p>
                <p>This link will expire in 1 hour.</p>
                <p>Best regards,<br>The $plitwise Team</p>
            </div>
        `,
  }),

  groupInvitation: (groupName, creatorName, registrationLink) => ({
    subject: `You've been invited to join ${groupName} on $plitwise!`,
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Group Invitation</h2>
                <p>Hi there!</p>
                <p><strong>${creatorName}</strong> has invited you to join the group <strong>${groupName}</strong> on $plitwise.</p>
                <p>With $plitwise, you can easily split expenses with friends and family, track who owes what, and keep your finances organized.</p>
                <p>Click the button below to create an account and join the group:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${registrationLink}" 
                       style="background-color: #4CAF50; 
                              color: white; 
                              padding: 12px 24px; 
                              text-decoration: none; 
                              border-radius: 4px; 
                              display: inline-block;">
                        Create Account
                    </a>
                </div>
                <p>Once you create an account, you'll automatically be added to the group.</p>
                <p>Best regards,<br>The $plitwise Team</p>
            </div>
        `,
  }),

  paymentReminder: (debtorName, creditorName, amount, groupName) => ({
    subject: `Payment Reminder: You owe ${creditorName} $${amount} in ${groupName}`,
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Payment Reminder</h2>
                <p>Hi ${debtorName},</p>
                <p>This is a friendly reminder that you owe <strong>${creditorName}</strong> <strong>$${amount}</strong> in the group <strong>${groupName}</strong>.</p>
                <p>Please settle this payment at your earliest convenience to keep your expense sharing smooth and hassle-free.</p>
                <p>You can log in to your $plitwise account to view the expense details and record your payment.</p>
                <p>Best regards,<br>The $plitwise Team</p>
            </div>
        `,
  }),
};

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const transporter = createTransporter();
    const { subject, html } = emailTemplates[template](...data);

    const mailOptions = {
      from: `"$plitwise" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = {
  sendEmail,
  emailTemplates,
};
