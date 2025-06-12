import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { HeroGrid } from "@/components/HeroGrid";
import { dotaDb } from "@/db";
import { heroes } from "@/db/schema/heroesItems";
import { asc } from "drizzle-orm";
import { Draft } from "@/components/Draft";

type Heroes = typeof heroes.$inferSelect;
const getHeroes = createServerFn().handler(async () => {
  const data = await dotaDb
    .select()
    .from(heroes)
    .orderBy(asc(heroes.shortName));
  const groupedBy = Object.groupBy(data, (i) => i.primaryAttribute);
  return groupedBy as Record<Heroes["primaryAttribute"], Heroes[]>;
});

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => await getHeroes(),
});

function Home() {
  const state = Route.useLoaderData();

  return (
    <div className="flex flex-row justify-between">
      <div className="max-w-lg gap-1 flex flex-col">
        <HeroGrid heroes={state.STR} />
        <HeroGrid heroes={state.AGI} />
        <HeroGrid heroes={state.INT} />
        <HeroGrid heroes={state.ALL} />
      </div>
      <Draft />
    </div>
  );
}
