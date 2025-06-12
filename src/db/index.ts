import { drizzle } from "drizzle-orm/libsql";
import path from "path";

const dbLocation = path.join(process.cwd(), "dota.db");
export const dotaDb = drizzle({
  connection: {
    url: "file:" + dbLocation,
  },
});
