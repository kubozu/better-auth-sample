import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  // 接続するDBの情報
  dbCredentials: {
    ssl: false,
    host: "localhost",
    user: "postgres",
    password: "postgres",
    port: 5432,
    database: "better_auth",
  },
});
