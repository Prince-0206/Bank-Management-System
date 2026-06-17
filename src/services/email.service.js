require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Bank Management System" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
async function sendRegistrationEmail(userEmail, name) {
    const subject = 'Welcome to Backend Ledger!';
     const text = `Hello ${name},\n\nThank you for registering at Bank Management System.
We're excited to have you on board!\n\nBest regards,\nThe Bank Management System Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering at Bank Management System. We're excited to have you on board!</p><p>Best regards,<br>Bank Management System</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransacationEmail(userEmail, name , amount , toaccount){
    const subject = 'Transaction Successful ✅ — Bank Management System';

const text = `Hello ${name},

Your transaction has been completed successfully.

Transaction Details:
- From Account : ${fromaccount}
- To Account   : ${toaccount}
- Amount       : $${amount}
- Status       : SUCCESSFUL
- Reference ID : ${idempotencyKey}

If you did not authorize this transaction, please contact our support team immediately.

Best regards,
The Bank Management System Team`;

const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">

  <h2 style="color: #1a1a1a;">Transaction Successful ✅</h2>
  <p>Hello <strong>${name}</strong>,</p>
  <p>Your transaction has been completed successfully. Here are the details:</p>

  <div style="background: #f4f4f4; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #666;">From Account</td>
        <td style="padding: 8px 0; font-weight: bold;">${fromaccount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">To Account</td>
        <td style="padding: 8px 0; font-weight: bold;">${toaccount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Amount</td>
        <td style="padding: 8px 0; font-weight: bold; color: #2e7d32;">$${amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Status</td>
        <td style="padding: 8px 0;">
          <span style="background: #e8f5e9; color: #2e7d32; padding: 2px 10px; border-radius: 99px; font-size: 13px;">SUCCESSFUL</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Reference ID</td>
        <td style="padding: 8px 0; font-size: 13px; color: #999;">${idempotencyKey}</td>
      </tr>
    </table>
  </div>

  <p style="color: #999; font-size: 13px;">If you did not authorize this transaction, please contact our support team immediately.</p>

  <p>Best regards,<br><strong>Bank Management System</strong></p>
</div>
`;
 await sendEmail(userEmail, subject, text, html);
}

async function failedtransactionMail(userEmail , name , amount , toaccount) {
    const subject = 'Transaction Failed ❌ — Bank Management System';

const text = `Hello ${name},

Unfortunately, your transaction could not be completed.

Transaction Details:
- From Account : ${fromaccount}
- To Account   : ${toaccount}
- Amount       : $${amount}
- Status       : FAILED
- Reference ID : ${idempotencyKey}

Possible reasons:
- Insufficient balance in your account
- Account is frozen or inactive
- Technical error occurred

Please try again or contact our support team if the issue persists.

Best regards,
The Bank Management System Team`;

const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">

  <h2 style="color: #1a1a1a;">Transaction Failed ❌</h2>
  <p>Hello <strong>${name}</strong>,</p>
  <p>Unfortunately, your transaction could not be completed. Here are the details:</p>

  <div style="background: #f4f4f4; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #666;">From Account</td>
        <td style="padding: 8px 0; font-weight: bold;">${fromaccount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">To Account</td>
        <td style="padding: 8px 0; font-weight: bold;">${toaccount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Amount</td>
        <td style="padding: 8px 0; font-weight: bold; color: #c62828;">$${amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Status</td>
        <td style="padding: 8px 0;">
          <span style="background: #ffebee; color: #c62828; padding: 2px 10px; border-radius: 99px; font-size: 13px;">FAILED</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #666;">Reference ID</td>
        <td style="padding: 8px 0; font-size: 13px; color: #999;">${idempotencyKey}</td>
      </tr>
    </table>
  </div>

  <div style="background: #fff8e1; border-left: 4px solid #f9a825; border-radius: 4px; padding: 12px 16px; margin: 20px 0;">
    <p style="margin: 0; color: #555; font-size: 14px;"><strong>Possible reasons:</strong></p>
    <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #555; font-size: 14px;">
      <li>Insufficient balance in your account</li>
      <li>Account is frozen or inactive</li>
      <li>Technical error occurred</li>
    </ul>
  </div>

  <p style="color: #999; font-size: 13px;">Please try again or contact our support team if the issue persists.</p>

  <p>Best regards,<br><strong>Bank Management System</strong></p>
</div>
`;
    await sendEmail(userEmail, subject, text, html);
}
module.exports = {sendRegistrationEmail , sendTransacationEmail , failedtransactionMail};