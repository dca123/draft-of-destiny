import { dotaDb } from "@/db";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { sql } from "drizzle-orm";
import z from "zod";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

type HeroSelection = {
  is_pick: number;
  pick_order: number;
  is_radiant: number;
  short_name: string;
  match_id: number;
  radiant_team: string;
  dire_team: string;
  did_radiant_win: number;
};
const pickOrders = {
  team_1_bans: [1, 4, 7, 10, 11, 19, 22],
  team_2_bans: [2, 3, 5, 6, 12, 20, 21],
  team_1_picks: [8, 14, 15, 18, 23],
  team_2_picks: [9, 13, 16, 17, 24],
};

const getSelectionByPickOrder = (
  selections: Array<HeroSelection>,
  pickOrder: number,
) => {
  const selection = selections[pickOrder - 1];
  if (!selection)
    throw new Error(`"Could not find selection for ${pickOrder}"`);

  return selection;
};

const LIMIT = 12;

const getProDrafts = createServerFn()
  .validator((input: { page: number }) => input)
  .handler(async (ctx) => {
    const heroSelections: Array<HeroSelection> = await dotaDb.all(sql`
  WITH selected_matches AS (
    SELECT id, radiant_team_id, dire_team_id, did_radiant_win FROM matches LIMIT ${LIMIT} OFFSET ${LIMIT * ctx.data.page}
  )
    SELECT mpb.is_pick, mpb.pick_order, mpb.is_radiant, h.short_name, mpb.match_id, rt.name as radiant_team, dt.name as dire_team, sm.did_radiant_win
  FROM match_pick_bans mpb
  JOIN selected_matches sm ON mpb.match_id = sm.id
  JOIN heroes h ON mpb.hero_id = h.id
  JOIN teams rt ON rt.id = sm.radiant_team_id
  JOIN teams dt ON dt.id = sm.dire_team_id
`);

    const selectionsByMatch = Object.groupBy(
      heroSelections,
      (selection) => selection.match_id,
    ) as Record<string, Array<HeroSelection>>;
    const sortedSelections = Object.entries(selectionsByMatch).map(
      ([matchId, data]) => {
        const sortedDraft = data.sort((a, b) => a.pick_order - b.pick_order);
        const firstPick = sortedDraft[0];
        if (!firstPick) throw new Error("No first pick");
        const radiantTeam = firstPick.radiant_team;
        const direTeam = firstPick.dire_team;
        const radiantTeamHasFirstPick = firstPick.is_radiant === 1;
        const winner = firstPick.did_radiant_win === 1 ? radiantTeam : direTeam;
        let matchData = {
          firstPick: direTeam,
          secondPick: radiantTeam,
        };
        if (radiantTeamHasFirstPick) {
          matchData = {
            firstPick: radiantTeam,
            secondPick: direTeam,
          };
        }

        return [
          {
            ...matchData,
            matchId: Number(matchId),
            winner,
          },
          sortedDraft,
        ] as const;
      },
    );
    const result = sortedSelections.map(([matchData, selections]) => {
      return {
        match_id: matchData.matchId,
        team_one: matchData.firstPick,
        team_one_bans: pickOrders.team_1_bans.map(
          (i) => getSelectionByPickOrder(selections, i).short_name,
        ),
        team_one_picks: pickOrders.team_1_picks.map(
          (i) => getSelectionByPickOrder(selections, i).short_name,
        ),
        team_two: matchData.secondPick,
        team_two_bans: pickOrders.team_2_bans.map(
          (i) => getSelectionByPickOrder(selections, i).short_name,
        ),
        team_two_picks: pickOrders.team_2_picks.map(
          (i) => getSelectionByPickOrder(selections, i).short_name,
        ),
        winner: matchData.winner,
      } satisfies Draft;
    });
    console.log(result);

    return result;
  });

const pageSearchSchema = z.object({
  page: z.number().positive().catch(1),
});
export const Route = createFileRoute("/pro")({
  component: RouteComponent,
  validateSearch: zodValidator(pageSearchSchema),
  search: {
    middlewares: [stripSearchParams({ page: 1 })],
  },
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: ({ deps: { page } }) => getProDrafts({ data: { page } }),
});

type Draft = {
  match_id: number;
  team_one: string;
  team_one_picks: Array<string>;
  team_one_bans: Array<string>;
  team_two: string;
  team_two_picks: Array<string>;
  team_two_bans: Array<string>;
  winner: string;
};

const columnHelper = createColumnHelper<Draft>();

const columns = [
  columnHelper.accessor("match_id", {
    header: "Match Id",
    cell: (props) => props.getValue().toString(),
  }),
  columnHelper.accessor("team_one", {
    header: "First Pick",
    cell: (props) => {
      const didWin = props.row.original.winner === props.getValue();
      return (
        <div className="flex flex-col gap-2">
          {props.getValue()}
          {didWin ? <Badge variant="outline">Winner</Badge> : null}
        </div>
      );
    },
  }),
  columnHelper.accessor("team_one_bans", {
    header: "First Pick Bans",
    cell: (props) => {
      const firstPhaseBans = props.getValue().slice(0, 3);
      const secondPhaseBans = props.getValue().slice(3, 5);
      const thirdPhaseBans = props.getValue().slice(5);
      return (
        <div className="flex flex-row gap-2 place-items-center">
          <div className="grid grid-cols-2 grid-rows-2 gap-1">
            {firstPhaseBans.map((hero) => (
              <BannedHero shortName={hero} />
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {secondPhaseBans.map((hero) => (
              <BannedHero shortName={hero} />
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {thirdPhaseBans.map((hero) => (
              <BannedHero shortName={hero} />
            ))}
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("team_one_picks", {
    header: "First Pick Heroes",
    cell: (props) => {
      const heroes = props.getValue();
      return (
        <div className="flex flex-row gap-2 flex-wrap">
          {heroes.map((hero) => (
            <PickedHero shortName={hero} />
          ))}
        </div>
      );
    },
  }),
  columnHelper.accessor("team_two", {
    header: "Second Pick",
    cell: (props) => {
      const didWin = props.row.original.winner === props.getValue();
      return (
        <div className="flex flex-col gap-2">
          {props.getValue()}
          {didWin ? <Badge variant="outline">Winner</Badge> : null}
        </div>
      );
    },
  }),
  columnHelper.accessor("team_two_bans", {
    header: "Second Pick Bans",
    cell: (props) => {
      const firstPhaseBans = props.getValue().slice(0, 4);
      const secondPhaseBans = props.getValue().slice(4, 5);
      const thirdPhaseBans = props.getValue().slice(5);
      return (
        <div className="grid grid-cols-3 gap-2 place-items-center">
          <div className="grid grid-cols-2 grid-rows-2 gap-1">
            {firstPhaseBans.map((hero) => (
              <BannedHero shortName={hero} />
            ))}
          </div>
          <div className="flex flex-col gap-1 flex-wrap w-min">
            {secondPhaseBans.map((hero) => (
              <BannedHero shortName={hero} />
            ))}
          </div>
          <div className="flex flex-col gap-1 flex-wrap">
            {thirdPhaseBans.map((hero) => (
              <BannedHero shortName={hero} />
            ))}
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("team_two_picks", {
    header: "Second Pick Heroes",
    cell: (props) => {
      const heroes = props.getValue();
      return (
        <div className="flex flex-row gap-2 flex-wrap">
          {heroes.map((hero) => (
            <PickedHero shortName={hero} />
          ))}
        </div>
      );
    },
  }),
];
function PickedHero(props: { shortName: string | undefined }) {
  return (
    <img
      src={`https://courier.spectral.gg/images/dota/portraits/${props.shortName}?size=smaller`}
      className="rounded-lg w-14"
    />
  );
}
function BannedHero(props: { shortName: string }) {
  return (
    <div className="relative h-fit w-10">
      <img
        src={`https://courier.spectral.gg/images/dota/portraits/${props.shortName}?size=smaller`}
        className="rounded w-10"
      />
      <div className="absolute inset-0 bg-red-700 opacity-50 rounded mix-blend-hard-light" />
    </div>
  );
}

function RouteComponent() {
  const drafts = Route.useLoaderData();
  const table = useReactTable({
    data: drafts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return <DataTable table={table} />;
}
