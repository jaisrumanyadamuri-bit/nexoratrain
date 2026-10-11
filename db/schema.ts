import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const enquiries = pgTable("enquiries", {
  id: serial().primaryKey(),
  studentName: text("student_name").notNull(),
  phone: text().notNull(),
  email: text().notNull(),
  course: text().notNull(),
  message: text().notNull().default(""),
  status: text().notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
