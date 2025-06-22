import { Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { atom, useAtom, useSetAtom } from "jotai";

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

export const SearchHeroAtom = atom("");

function RouteComponent() {
  const { draft, heroes } = Route.useLoaderData();
  const [heroSearch, setSearch] = useAtom(SearchHeroAtom);

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
          <span className="text-xl">-</span>
          <CurrentSide />
        </div>
        <div className="col-span-2 justify-self-end space-x-2">
          <SaveDraft />
          <BranchDraft />
        </div>
      </div>
      <Separator className="mb-8 mt-2" />
      <div className="flex flex-row justify-evenly ">
        <div className="space-y-2">
          <div className="relative">
            <Input
              className="w-40 pl-8"
              placeholder="Search"
              onBlur={() => setSearch("")}
              onChange={(e) => setSearch(e.currentTarget.value)}
              value={heroSearch}
            />
            <Search className="absolute pointer-events-none top-1/2 -translate-y-1/2 left-2 size-4 opacity-50 select-none" />
          </div>
          <div className="max-w-5xl gap-4 grid grid-cols-2 h-min place-items-start">
            <HeroGrid heroes={heroes.STR} />
            <HeroGrid heroes={heroes.AGI} />
            <HeroGrid heroes={heroes.INT} />
            <HeroGrid heroes={heroes.ALL} />
          </div>
        </div>
        <Draft />
      </div>
    </div>
  );
}

function CurrentSelection() {
  const state = useLobbyStore((s) => s.state);
  return (
    <h1 className="text-xl font-semibold">
      {machineValueToHumanReadable[state]}
    </h1>
  );
}

function CurrentSide() {
  const side = useLobbyStore((s) => s.side);
  const displayText = side === "team_1" ? "Team 1" : "Team 2";
  return <h1 className="text-xl font-semibold">{displayText}</h1>;
}
