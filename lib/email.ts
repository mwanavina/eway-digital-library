import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", 
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Update this interface right here 👇
interface SendEmailParams {
  to: string;
  subject: string;
  html: string; // Change 'text' to 'html'
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const info = await transporter.sendMail({
      from: `"Eway Digital Library" <${process.env.SMTP_USER}>`, 
      to: to,
      subject: subject,
      html: html, // Map it correctly to Nodemailer's HTML property
    });
    
    return { success: true, info };
  } catch (error) {
    console.error("Failed to send email via SMTP:", error);
    return { success: false, error };
  }
}