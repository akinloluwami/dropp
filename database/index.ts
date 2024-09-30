import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const dbUrl =
  "postgresql://akinloluwami:z9Fi4CHsoyDq@ep-broken-fog-64079012.us-east-2.aws.neon.tech/dropp?sslmode=require";

console.log(dbUrl);
const sql = neon(dbUrl);
export const db = drizzle(sql);
