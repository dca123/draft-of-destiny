import { drizzle } from "drizzle-orm/libsql";

export const dotaDb = drizzle({
  connection: {
    url: process.env.TURSO_URL!,
    authToken: process.env.TURSO_API_KEY!,
  },
});
