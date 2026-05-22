const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendResetPasswordEmail = async (email, token) => {
  try {
    // Ensure we use the production URL for deployment
    const baseUrl = "https://alert-naija-green.vercel.app";
    const resetUrl = `${baseUrl}/reset/${token}`;
    
    const mailOptions = {
      from: `"AlertNaija Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your AlertNaija Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #00BA88; text-align: center;">AlertNaija</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Please click the button below to set a new one. This link will expire in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #00BA88; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you did not request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777; text-align: center;">&copy; 2026 AlertNaija. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Reset email sent successfully to", email);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

exports.sendWelcomeEmail = async (email, fullName) => {
  try {
    const mailOptions = {
      from: `"AlertNaija Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to AlertNaija - Your Safety is Our Priority",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 1px solid #eee; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          <div style="background-color: #0b1220; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Alert<span style="color: #00BA88;">Naija</span></h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Unified National Emergency System</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin-top: 0;">Welcome, ${fullName}!</h2>
            <p style="color: #475569; line-height: 1.6;">Thank you for joining AlertNaija. You are now part of a nationwide network dedicated to faster emergency response and community safety.</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #00BA88; padding: 20px; margin: 25px 0;">
              <h3 style="color: #1e293b; margin-top: 0; font-size: 16px;">💡 Safety Tip of the Day</h3>
              <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">In any emergency, stay calm. Use the <strong>SOS</strong> button on your dashboard to instantly broadcast your location to the nearest responders.</p>
            </div>

            <h3 style="color: #1e293b; font-size: 18px;">How to use AlertNaija:</h3>
            <ul style="color: #475569; line-height: 1.8; padding-left: 20px;">
              <li><strong>Report:</strong> Submit incidents with photos and descriptions.</li>
              <li><strong>Live Map:</strong> View real-time alerts in your state.</li>
              <li><strong>SOS:</strong> One-tap emergency calling to local authorities.</li>
            </ul>

            <div style="text-align: center; margin-top: 40px;">
              <a href="https://alert-naija-green.vercel.app/dashboard" style="background-color: #00BA88; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Go to My Dashboard</a>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; 2026 AlertNaija National Emergency Response Platform.</p>
            <p style="font-size: 11px; color: #cbd5e1; margin-top: 5px;">If you have any questions, reply to this email or contact support.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully to", email);
  } catch (error) {
    console.error("Welcome email failed:", error);
  }
};
