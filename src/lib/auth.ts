import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oneTapClient } from "better-auth/client/plugins";
import { oneTap } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react";
import { db } from "../db/drizzle"; // Adjust the import path as necessary

const isDev = process.env.NODE_ENV === "development";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
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

export const authClient = createAuthClient({
  baseURL: isDev ? "http://localhost:3000" : "",
  plugins: [
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    }),
  ],
});
