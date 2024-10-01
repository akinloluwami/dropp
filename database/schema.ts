import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  originalName: text("original_name"),
  generatedName: text("generated_name"),
  type: text("type"),
  size: numeric("size"),
  url: text("url"),
  secureUrl: text("secure_url"),
  extension: text("extension"),
  userId: text("user_id"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});
