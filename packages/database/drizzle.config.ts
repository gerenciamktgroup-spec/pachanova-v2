import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env.demo" });
dotenv.config({ path: "../../.env.demo.local" });

import { validateDemoDatabaseUrl } from "./src/utils/demoValidation";

const dbUrl = process.env.DATABASE_URL;
validateDemoDatabaseUrl(dbUrl);

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: false,
});
