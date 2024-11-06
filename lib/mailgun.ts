import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!, 
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/verify?token=${token}&identifier=${encodeURIComponent(email)}`;
  console.log("Verification URL:", verificationUrl); 

  const data = {
    from: "YourApp <no-reply@yourdomain.com>",
    to: email,
    subject: "Verify your email address",
    text: `Please verify your email by clicking the following link: ${verificationUrl}`,
    html: `<p>Please verify your email by clicking the following link: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
  };

  console.log("Email data:", data); 

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, data);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/reset-password?token=${token}&identifier=${encodeURIComponent(email)}`;
  console.log("Reset Password URL:", resetUrl); 

  const data = {
    from: "YourApp <no-reply@yourdomain.com>",
    to: email,
    subject: "Reset your password",
    text: `Please reset your password by clicking the following link: ${resetUrl}`,
    html: `<p>Please reset your password by clicking the following link: <a href="${resetUrl}">${resetUrl}</a></p>`,
  };

  console.log("Email data:", data); 

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, data);
    console.log(`Reset password email sent to ${email}`);
  } catch (error) {
    console.error("Error sending reset password email:", error);
  }
};


const testEmail = async () => {
  const testData = {
    from: "YourApp <no-reply@yourdomain.com>",
    to: "gagijebasmesnat@gmail.com",
    subject: "Test Email",
    text: "This is a test email from Mailgun.",
    html: "<p>This is a test email from Mailgun.</p>",
  };

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, testData);
    console.log("Test email sent successfully.");
  } catch (error) {
    console.error("Error sending test email:", error);
  }
};

