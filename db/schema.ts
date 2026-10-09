import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const feedback = sqliteTable("feedback", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
  reply: text("reply"),
  repliedAt: text("replied_at"),
});
