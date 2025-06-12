import { drizzle } from "drizzle-orm/libsql";
import path from "path";

import { readdir } from "fs/promises";

const folderPath = process.cwd();
const files = await readdir(folderPath);

for (const file of files) {
  console.log(file);
}

const dbLocation = path.join(process.cwd(), "dota.db");
export const dotaDb = drizzle({
  connection: {
    url: "file:" + dbLocation,
  },
});
