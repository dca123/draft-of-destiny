import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const heroes = sqliteTable("heroes", {
  id: integer("id").primaryKey(),
  displayName: text("display_name").notNull(),
  shortName: text("short_name").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
  primaryAttribute: text("primary_attribute", {
    enum: ["AGI", "STR", "INT", "ALL"],
  }).notNull(),
});

// 3. items
export const items = sqliteTable("items", {
  id: integer("id").primaryKey(),
  displayName: text("display_name").notNull(),
  shortName: text("short_name").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});
