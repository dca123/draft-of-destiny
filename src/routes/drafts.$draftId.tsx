import { BranchDraft } from "@/components/BranchDraft";
import { Draft } from "@/components/Draft";
import { HeroGrid } from "@/components/HeroGrid";
import {
  machineValueToHumanReadable,
  useLobbyStore,
} from "@/components/lobby-state";
import { SaveDraft } from "@/components/SaveDraft";
import { TeamSelect } from "@/components/TeamSelect";
import { appDb, dotaDb } from "@/db";
import { heroes } from "@/db/dota-db-schema/heroesItems";
import { drafts } from "@/db/schema/drafts";
import { Separator } from "@/components/ui/separator";
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
      <div className="grid grid-cols-6 items-center">
        <div className="col-span-2 flex flex-row space-x-4 items-end">
          <div className="flex flex-col space-y-0 pb-3">
            <label className="text-sm text-muted-foreground">Draft Name</label>
            <p className="text-xl tracking-wider">{draft.name}</p>
          </div>
          <TeamSelect />
        </div>
        <div className="flex flex-row space-x-4 p-2 h-min items-center col-span-2 justify-self-center">
          <CurrentSelection />
          <CurrentSide />
        </div>
        <div className="col-span-2 justify-self-end space-x-2">
          <SaveDraft />
          <BranchDraft />
        </div>
      </div>
      <Separator className="mb-8 mt-2" />
      <div className="flex flex-row justify-around ">
        <div className="max-w-lg gap-1 flex flex-col">
          <HeroGrid heroes={heroes.STR} />
          <HeroGrid heroes={heroes.AGI} />
          <HeroGrid heroes={heroes.INT} />
          <HeroGrid heroes={heroes.ALL} />
        </div>
        <Draft />
      </div>
    </div>
  );
}

function CurrentSelection() {
  const state = useLobbyStore((s) => s.state);
  return (
    <div className="bg-card border text-card-foreground p-2 rounded-md">
      <label className="text-sm text-muted-foreground">Current Selection</label>
      <h1 className="">{machineValueToHumanReadable[state]}</h1>
    </div>
  );
}

function CurrentSide() {
  const side = useLobbyStore((s) => s.side);
  const displayText = side === "team_1" ? "Team 1" : "Team 2";
  return (
    <div className="bg-card border text-card-foreground p-2 rounded-md">
      <label className="text-sm text-muted-foreground">Current Turn</label>
      <h1>{displayText}</h1>
    </div>
  );
}
