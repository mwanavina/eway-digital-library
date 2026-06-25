type SendEmailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  if (process.env.NODE_ENV === "development") {
    console.log("\n--- Email (dev) ---");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(text);
    console.log("-------------------\n");
    return;
  }

  // Wire up your production email provider (Resend, SendGrid, etc.)
  console.warn(
    `[email] No production provider configured. Would send to ${to}: ${subject}`,
  );
  void html;
}
