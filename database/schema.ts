import { numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const files = pgTable("files", {
  id: text("id").primaryKey(),
  name: text("name"),
  type: text("type"),
  size: numeric("size"),
  url: text("url"),
  createdAt: text("created_at"),
  userId: text("user_id"),
  extension: text("extension"),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});
