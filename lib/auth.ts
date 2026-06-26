import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
  },
  // emailVerification: {
  //   sendOnSignUp: true,
  //   sendOnSignIn: true,
  //   autoSignInAfterVerification: false,
  //   sendVerificationEmail: async ({ user, url }) => {
  //     void sendEmail({
  //       to: user.email,
  //       subject: "Verify your Eway account",
  //       text: `Welcome to Eway Digital Library.\n\nClick the link below to verify your school email:\n${url}\n\nIf you did not create an account, you can ignore this email.`,
  //     });
  //   },
  // },
  // trustedOrigins: [
  //   process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  // ],
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
