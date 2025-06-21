import { randomIdGenerator } from "@/lib/random";
import type { Draft, Selections } from "@/lib/state-machine";
import {
  sqliteTable,
  text,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";
import type { Snapshot } from "xstate";

export type CustomSnapshot = {
  status: Snapshot<unknown>["status"];
  output: undefined;
  error: undefined;
  value: Selections | "DRAFT_END";
  context: {
    draft: Draft;
  };
};
export const generateDraftId = randomIdGenerator(10);
export const drafts = sqliteTable("drafts", {
  id: text()
    .primaryKey()
    .$defaultFn(() => generateDraftId()),
  name: text().notNull().default(""),
  persistedMachineSnapshot: text({ mode: "json" })
    .notNull()
    .$type<CustomSnapshot>(),
  parentDraft: text().references((): AnySQLiteColumn => drafts.id),
});
