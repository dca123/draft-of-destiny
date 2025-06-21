import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appDb } from "@/db";
import { drafts } from "@/db/schema/drafts";
import {
  draftToTeamSelections,
  type Draft,
  type TeamSelections,
} from "@/lib/state-machine";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ChevronRight, Plus } from "lucide-react";

const getDrafts = createServerFn().handler(async () => {
  const result = await appDb.select().from(drafts);
  const selections = result.map((d) => ({
    id: d.id,
    name: d.name,
    selections: draftToTeamSelections({
      draft: d.persistedMachineSnapshot.context.draft,
    }),
    isCompleted: d.persistedMachineSnapshot.value === "DRAFT_END",
  }));
  return selections;
});
export const Route = createFileRoute("/")({
  component: Home,
  loader: () => getDrafts(),
});

function Home() {
  const drafts = Route.useLoaderData();
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3">
        <h1 className="font-semibold text-2xl">Drafts of Destiny</h1>
        <div>
          <Button>
            <Plus />
            <Link to={"/drafts/new"}>Create Draft</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-4">
        {drafts.map((draft) => (
          <DraftCard
            draft={draft.selections}
            key={draft.id}
            id={draft.id}
            name={draft.name}
            isCompleted={draft.isCompleted}
          />
        ))}
      </div>
    </div>
  );
}

function DraftCard(props: {
  draft: TeamSelections;
  name: string;
  id: string;
  isCompleted: boolean;
}) {
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle className="row-span-2">{props.name}</CardTitle>
        <CardAction>
          <Button variant="link" asChild>
            <Link to="/drafts/$draftId" params={{ draftId: props.id }}>
              Open
              <ChevronRight />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-0.5">
          <p className="text-sm text-muted-foreground"> Radiant</p>
          <div className="space-y-1">
            <div className="flex flex-row space-x-1">
              {props.draft.team_1_bans.map((hero) => (
                <BannedHero shortName={hero} />
              ))}
            </div>
            <div className="flex flex-row space-x-1">
              {props.draft.team_1_picks.map((hero) => (
                <PickedHero shortName={hero} />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-0.5">
          <p className="text-sm text-muted-foreground">Dire</p>
          <div className="space-y-1">
            <div className="flex flex-row space-x-1">
              {props.draft.team_2_bans.map((hero) => (
                <BannedHero shortName={hero} />
              ))}
            </div>
            <div className="flex flex-row space-x-1">
              {props.draft.team_2_picks.map((hero) => (
                <PickedHero shortName={hero} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {props.isCompleted ? <Badge variant="outline">Completed</Badge> : null}
      </CardFooter>
    </Card>
  );
}

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
    <div className="relative">
      <img
        src={`https://courier.spectral.gg/images/dota/portraits/${props.shortName}?size=smaller`}
        className="rounded-lg w-12"
      />
      <div className="absolute inset-0 bg-red-700 opacity-50 rounded-lg mix-blend-hard-light" />
    </div>
  );
}
