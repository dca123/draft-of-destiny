import { env } from "@/env/server";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schema",
  dbCredentials: {
    url: env.APP_DB_URL,
    authToken: env.APP_DB_TOKEN,
  },
});
