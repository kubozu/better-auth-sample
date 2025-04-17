import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oneTap } from "better-auth/plugins";
import { db } from "../db/drizzle"; // Adjust the import path as necessary
import { account, session, user, verification } from "@/db/schema/auth-schema";
const isDev = process.env.NODE_ENV === "development";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    schema: {
      account,
      session,
      user,
      verification,
    },
    provider: "pg",
  }),
  // ユーザーネームとパスワード認証をONにする
  emailAndPassword: {
    enabled: true,
  },
  // Google oauthを設定する
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  // Google one tapのプラグインをONにする
  plugins: [oneTap()],
});
