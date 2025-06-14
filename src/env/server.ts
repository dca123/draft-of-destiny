import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DOTA_DB_URL: z.string().url(),
    DOTA_DB_API_KEY: z.string().jwt(),
    APP_DB_URL: z.string().url(),
    APP_DB_TOKEN: z.string().jwt(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
