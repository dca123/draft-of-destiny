import { drizzle } from "drizzle-orm/libsql";

export const dotaDb = drizzle({
  connection: {
    url: "file:./dota.db",
  },
});
