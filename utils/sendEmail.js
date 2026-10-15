import nodemailer from 'nodemailer';

/**
 * Send an email with OTP or notification
 * Supports SMTP (Host/Port/User/Pass) or Service (e.g. Gmail)
 * Gracefully falls back to console output if credentials are not configured yet.
 */
export const sendOtpEmail = async ({ to, otp, userName }) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const emailPort = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f6f4; margin: 0; padding: 30px; }
        .card { max-width: 500px; margin: 0 auto; background: #ffffff; padding: 40px; border: 1px solid #e7e5e0; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .logo { text-align: center; margin-bottom: 25px; }
        .logo-title { font-size: 20px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #1c1917; margin: 0; }
        .tagline { font-size: 11px; letter-spacing: 1px; color: #b89255; text-transform: uppercase; margin-top: 4px; }
        h2 { font-size: 20px; color: #1c1917; margin-top: 0; }
        p { color: #57534e; font-size: 14px; line-height: 1.6; }
        .otp-box { background: #fafaf9; border: 2px dashed #b89255; border-radius: 6px; padding: 20px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1c1917; font-family: monospace; }
        .otp-desc { font-size: 12px; color: #78716c; margin-top: 8px; }
        .warning { font-size: 12px; color: #a8a29e; border-top: 1px solid #f5f5f4; padding-top: 20px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">
          <div class="logo-title">Aiterior Design Studio</div>
          <div class="tagline">Luxury Interior & Architecture Portal</div>
        </div>
        <h2>Password Recovery Request</h2>
        <p>Hello ${userName || 'User'},</p>
        <p>We received a request to reset your password. Use the verification code below to complete your password reset:</p>
        
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <div class="otp-desc">This code will expire in <strong>10 minutes</strong>.</div>
        </div>

        <p>If you did not request a password reset, please ignore this email or contact your administrator immediately.</p>
        
        <div class="warning">
          Security Note: Never share your OTP with anyone. The studio team will never ask for your code.
        </div>
      </div>
    </body>
    </html>
  `;

  // Check if real SMTP credentials exist
  if (emailUser && emailPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: emailPort === 465, // true for 465, false for other ports
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });

      await transporter.sendMail({
        from: `"Aiterior Studio Security" <${emailUser}>`,
        to,
        subject: `[${otp}] Your Password Reset Code - Aiterior Studio`,
        text: `Your password reset code is: ${otp}. Valid for 10 minutes.`,
        html: htmlContent
      });

      console.log(`[Email Service] Successfully sent OTP email to: ${to}`);
      return { sent: true };
    } catch (err) {
      console.error('[Email Service] Failed to send real email via SMTP:', err.message);
      // Fallback: log OTP to console so process is not completely broken
      console.log(`[DEV OTP FALLBACK] OTP for ${to} is: ${otp}`);
      return { sent: false, error: err.message, devOtp: otp };
    }
  } else {
    // Development fallback when EMAIL_USER and EMAIL_PASS are not configured yet
    console.log('----------------------------------------------------');
    console.log(`[DEV EMAIL NOTIFICATION]`);
    console.log(`To: ${to}`);
    console.log(`Reset OTP: >>> ${otp} <<< (Valid for 10 minutes)`);
    console.log('----------------------------------------------------');
    return { sent: false, notConfigured: true, devOtp: otp };
  }
};
