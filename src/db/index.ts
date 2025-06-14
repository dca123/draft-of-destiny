import { env } from "@/env/server";
import { drizzle } from "drizzle-orm/libsql";

export const dotaDb = drizzle({
  connection: {
    url: env.DOTA_DB_URL,
    authToken: env.DOTA_DB_API_KEY,
  },
});

export const appDb = drizzle({
  connection: {
    url: env.APP_DB_URL,
    authToken: env.APP_DB_TOKEN,
  },
});
