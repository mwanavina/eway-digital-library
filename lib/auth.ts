import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { nextCookies } from "better-auth/next-js";

interface AuthEmailParams {
  user: {
    email: string;
    name?: string | null;
  };
  url: string;
  token: string;
}

interface AuthResetPasswordParams {
  user: {
    email: string;
  };
  url: string;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: "user",
				input: false, // Don't allow users to set role on signup
			},
		},
	},
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url}: AuthResetPasswordParams) => {
			const logoUrl = "https://m69autqsig.ufs.sh/f/t72WtywUos4eXLAxoQGv9WBJEhIsCXFmzL05UfyeSAo2bPQR";

			await sendEmail({
				to: user.email,
				subject: "Reset your Eway password",
				html: `
              <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
              <html dir="ltr" lang="en">
                <head>
                  <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
                  <meta name="x-apple-disable-message-reformatting" />
                  <title>Reset your Eway password</title>
                </head>
                <body dir="ltr" lang="en" style="background-color:rgb(255,255,255);margin:0;padding:0;">
                  <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
                    <tbody>
                      <tr>
                        <td dir="ltr" lang="en" style='background-color:rgb(255,255,255);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",sans-serif;margin:0 auto;'>
                          <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:37.5em;margin:0 auto;">
                            <tbody>
                              <tr style="width:100%">
                                <td style="padding:0 20px;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:32px">
                                    <tbody>
                                      <tr>
                                        <td>
                                          <img alt="Eway Digital Library" height="64" src="${logoUrl}" style="display:block;outline:none;border:none;text-decoration:none;height:64px;width:auto;" />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>

                                  <h1 style="color:rgb(29,28,29);font-size:32px;line-height:38px;font-weight:700;margin:30px 0;padding:0;">
                                    Reset your password
                                  </h1>

                                  <p style="font-size:16px;line-height:26px;margin-bottom:20px;color:rgb(45,45,45);">
                                    We received a request to reset the password for your Eway Digital Library account. Click the button below to choose a new password.
                                  </p>

                                  <p style="margin:24px 0;">
                                    <a href="${url}" target="_blank" style="background-color:#2563eb;color:white;padding:12px 24px;border-radius:4px;text-decoration:none;display:inline-block;font-weight:600;font-size:16px;">
                                      Reset Password
                                    </a>
                                  </p>

                                  <p style="font-size:14px;line-height:22px;margin-top:28px;margin-bottom:8px;color:rgb(45,45,45);">
                                    If the button above doesn’t work, copy and paste the following link into your browser:
                                  </p>
                                  <p style="font-size:14px;line-height:20px;margin-bottom:24px;word-break:break-all;">
                                    <a href="${url}" target="_blank" style="color:#2563eb;text-decoration:underline;">
                                      ${url}
                                    </a>
                                  </p>

                                  <p style="font-size:14px;line-height:22px;color:rgb(100,100,100);margin:16px 0;">
                                    If you didn’t request this change, you can safely ignore this email. Your password will remain unchanged.
                                  </p>

                                  <hr style="border-top:1px solid #e5e7eb;margin:30px 0;" />

                                  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                    <tbody>
                                      <tr>
                                        <td>
                                          <p style="font-size:12px;line-height:16px;text-align:left;margin-bottom:50px;color:rgb(150,150,150);">
                                            © ${new Date().getFullYear()} Eway Digital Library. All rights reserved.
                                          </p>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </body>
              </html>
                `,
			});
		},
		// Optional: Revoke all sessions when password is reset
		revokeSessionsOnPasswordReset: true,
		// Optional: Callback after successful reset
		onPasswordReset: async ({ user }: { user: { email: string } }) => {
			console.log(`Password reset for ${user.email}`);
      // redirect("/sign-in");
      
		},
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url }: AuthEmailParams) => {
      const logoUrl = "https://m69autqsig.ufs.sh/f/t72WtywUos4eXLAxoQGv9WBJEhIsCXFmzL05UfyeSAo2bPQR"; 

      await sendEmail({
        to: user.email,
        subject: "Verify your Eway account",
        html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html dir="ltr" lang="en">
              <head>
                <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
                <meta name="x-apple-disable-message-reformatting" />
                <title>Verify your Eway account</title>
              </head>
              <body dir="ltr" lang="en" style="background-color:rgb(255,255,255);margin:0;padding:0;">
                <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
                  <tbody>
                    <tr>
                      <td dir="ltr" lang="en" style='background-color:rgb(255,255,255);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",sans-serif;margin:0 auto;'>
                        
                        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:37.5em;margin:0 auto;">
                          <tbody>
                            <tr style="width:100%">
                              <td style="padding:0 20px;">
                                
                                <!-- App Logo Section -->
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:32px">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <!-- Increased height to 64px for visibility -->
                                        <img alt="Eway Digital Library" height="64" src="${logoUrl}" style="display:block;outline:none;border:none;text-decoration:none;height:64px;width:auto;" />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                
                                <h1 style="color:rgb(29,28,29);font-size:32px;line-height:38px;font-weight:700;margin:30px 0;padding:0;">
                                  Confirm your email address
                                </h1>
                                
                                <p style="font-size:16px;line-height:26px;margin-bottom:20px;color:rgb(45,45,45);">
                                  Welcome to Eway Digital Library! Hello ${user.name || "there"}, please verify your account by clicking the link button below.
                                </p>
                                
                                <!-- Main CTA Verification Link Button -->
                                <p style="margin:24px 0;">
                                  <a href="${url}" target="_blank" style="background-color:#2563eb;color:white;padding:12px 24px;border-radius:4px;text-decoration:none;display:inline-block;font-weight:600;font-size:16px;">
                                    Verify Email Address
                                  </a>
                                </p>

                                <!-- Plain Text URL Fallback Section -->
                                <p style="font-size:14px;line-height:22px;margin-top:28px;margin-bottom:8px;color:rgb(45,45,45);">
                                  If the button above doesn't work, copy and paste the following link into your web browser:
                                </p>
                                <p style="font-size:14px;line-height:20px;margin-bottom:24px;word-break:break-all;">
                                  <a href="${url}" target="_blank" style="color:#2563eb;text-decoration:underline;">
                                    ${url}
                                  </a>
                                </p>
                                
                                <p style="font-size:14px;line-height:22px;color:rgb(100,100,100);margin:16px 0;">
                                  If you didn't request this email, there's nothing to worry about. You can safely ignore it.
                                </p>
                                
                                <hr style="border-top:1px solid #e5e7eb;margin:30px 0;" />

                                <!-- Footer Details -->
                                <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <p style="font-size:12px;line-height:16px;text-align:left;margin-bottom:50px;color:rgb(150,150,150);">
                                          © ${new Date().getFullYear()} Eway Digital Library. All rights reserved.
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>

                              </td>
                            </tr>
                          </tbody>
                        </table>

                      </td>
                    </tr>
                  </tbody>
                </table>
              </body>
            </html>
                    `,
      });
    }
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ],
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;