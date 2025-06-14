import { type Draft, type ExportedMachineState } from "@/lib/state-machine";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { Snapshot } from "xstate";

export const drafts = sqliteTable("drafts", {
  id: text().primaryKey(),
  name: text().notNull().default(""),
  persistedMachineSnapshot: text({ mode: "json" })
    .$type<Snapshot<unknown>>()
    .notNull(),
});
