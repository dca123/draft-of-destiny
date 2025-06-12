import { drizzle } from "drizzle-orm/libsql";

const fs = require("fs");
const path = require("path");

const folderPath = process.cwd();

fs.readdir(folderPath, (err: unknown, files: Array<unknown>) => {
  if (err) {
    return console.error("Unable to scan directory:", err);
  }
  files.forEach((file) => {
    console.log(file);
  });
});

const dbLocation = path.join(process.cwd(), "dota.db");
export const dotaDb = drizzle({
  connection: {
    url: "file:" + dbLocation,
  },
});
