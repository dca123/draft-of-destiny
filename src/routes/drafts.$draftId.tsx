import { BranchDraft } from "@/components/BranchDraft";
import { Draft } from "@/components/Draft";
import { HeroGrid } from "@/components/HeroGrid";
import { useLobbyStore } from "@/components/lobby-state";
import { SaveDraft } from "@/components/SaveDraft";
import { TeamSelect } from "@/components/TeamSelect";
import { appDb, dotaDb } from "@/db";
import { heroes } from "@/db/dota-db-schema/heroesItems";
import { drafts } from "@/db/schema/drafts";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";

type Heroes = typeof heroes.$inferSelect;
const getHeroes = createServerFn().handler(async () => {
  const data = await dotaDb
    .select()
    .from(heroes)
    .orderBy(asc(heroes.shortName));
  const groupedBy = Object.groupBy(data, (i) => i.primaryAttribute);
  return groupedBy as Record<Heroes["primaryAttribute"], Heroes[]>;
});
const getDraft = createServerFn()
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    const result = await appDb
      .select({ id: drafts.id, name: drafts.name })
      .from(drafts)
      .where(eq(drafts.id, data));
    if (result.length === 0 || result[0] === undefined) {
      throw notFound();
    }
    return result[0];
  });

export const Route = createFileRoute("/drafts/$draftId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const [draft, heroes] = await Promise.all([
      getDraft({ data: params.draftId }),
      getHeroes(),
    ]);
    return { draft, heroes };
  },
});

function RouteComponent() {
  const { draft, heroes } = Route.useLoaderData();

  return (
    <div>
      <TeamSelect />
      <div className="flex flex-row justify-between">
        <div className="max-w-lg gap-1 flex flex-col">
          <HeroGrid heroes={heroes.STR} />
          <HeroGrid heroes={heroes.AGI} />
          <HeroGrid heroes={heroes.INT} />
          <HeroGrid heroes={heroes.ALL} />
        </div>
        <CurrentSide />
        <SaveDraft />
        <BranchDraft />
        <Draft />
      </div>
    </div>
  );
}

function CurrentSide() {
  const side = useLobbyStore((s) => s.side);
  const displayText = side === "team_1" ? "Team 1" : "Team 2";
  return (
    <div>
      <h1>{displayText}'s turn</h1>
    </div>
  );
}
