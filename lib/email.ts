import nodemailer from "nodemailer";

// Initialize the SMTP transport layer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: SendEmailParams) {
  try {
    const info = await transporter.sendMail({
      // This MUST match your SMTP_USER or Gmail will block the request
      from: `"Eway Digital Library" <${process.env.SMTP_USER}>`, 
      to: to,
      subject: subject,
      text: text,
    });
    
    return { success: true, info };
  } catch (error) {
    console.error("Failed to send email via SMTP:", error);
    return { success: false, error };
  }
}
