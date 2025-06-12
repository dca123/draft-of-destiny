import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { machine } from "@/lib/state-machine";
import { useActor } from "@xstate/react";
import { useAtomValue } from "jotai";
import { selectedHeroAtom } from "./hero-selection-state";

export function Draft() {
  const [state, send] = useActor(machine);
  const selectedHero = useAtomValue(selectedHeroAtom);
  console.log(state);

  function handleClick() {
    if (selectedHero === "") return;
    send({
      type: "NEXT",
      hero: selectedHero,
    });
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 grid-rows-4 gap-3 justify-end">
        <HeroSlot
          isPick={false}
          selectionId="BAN_1"
          shortName={state.context.team_1_bans[0]}
        />
        <HeroSlot
          isPick={false}
          selectionId="BAN_2"
          shortName={state.context.team_2_bans[0]}
        />
        <HeroSlot
          isPick={false}
          selectionId="BAN_3"
          shortName={state.context.team_1_bans[1]}
        />
        <HeroSlot
          isPick={false}
          selectionId="BAN_4"
          shortName={state.context.team_2_bans[1]}
        />
        <HeroSlot
          isPick={false}
          selectionId="BAN_5"
          shortName={state.context.team_1_bans[2]}
        />
        <HeroSlot
          isPick={false}
          selectionId="BAN_6"
          shortName={state.context.team_2_bans[2]}
        />
        <HeroSlot
          isPick={false}
          className="col-start-2"
          selectionId="BAN_7"
          shortName={state.context.team_2_bans[3]}
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-3 gap-3 justify-end">
        <HeroSlot
          isPick={true}
          selectionId="PICK_1"
          shortName={state.context.team_1_heroes[0]}
        />
        <HeroSlot
          isPick={true}
          selectionId="PICK_2"
          shortName={state.context.team_2_heroes[0]}
        />

        <HeroSlot
          isPick={false}
          selectionId="BAN_8"
          shortName={state.context.team_1_bans[3]}
        />
        <HeroSlot
          isPick={false}
          selectionId="BAN_9"
          shortName={state.context.team_2_bans[4]}
        />
        <HeroSlot
          isPick={false}
          selectionId="BAN_10"
          shortName={state.context.team_1_bans[4]}
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-3 gap-3 justify-end">
        <HeroSlot
          isPick={true}
          selectionId="PICK_4"
          shortName={state.context.team_1_heroes[1]}
        />
        <HeroSlot
          isPick={true}
          selectionId="PICK_3"
          shortName={state.context.team_2_heroes[1]}
        />
        <HeroSlot
          isPick={true}
          selectionId="PICK_5"
          shortName={state.context.team_1_heroes[2]}
        />
        <HeroSlot
          isPick={true}
          selectionId="PICK_6"
          shortName={state.context.team_2_heroes[2]}
        />
        <HeroSlot
          isPick={true}
          selectionId="PICK_8"
          shortName={state.context.team_1_heroes[3]}
        />
        <HeroSlot
          isPick={true}
          selectionId="PICK_7"
          shortName={state.context.team_2_heroes[3]}
        />

        <HeroSlot
          isPick={false}
          selectionId="BAN_11"
          shortName={state.context.team_1_bans[5]}
        />
        <HeroSlot
          isPick={false}
          selectionId="BAN_12"
          shortName={state.context.team_2_bans[5]}
        />
        <HeroSlot
          isPick={false}
          selectionId="BAN_14"
          shortName={state.context.team_1_bans[6]}
        />
        <HeroSlot
          isPick={false}
          selectionId="BAN_13"
          shortName={state.context.team_2_bans[6]}
        />

        <HeroSlot
          isPick={true}
          selectionId="PICK_9"
          shortName={state.context.team_1_heroes[4]}
        />
        <HeroSlot
          isPick={true}
          selectionId="PICK_10"
          shortName={state.context.team_2_heroes[4]}
        />
      </div>
      <Button onClick={handleClick} disabled={selectedHero === ""}>
        {state.status === "active" ? "Select Hero" : "Complete Draft"}
      </Button>
    </div>
  );
}

function HeroSlot(props: {
  selectionId: string;
  shortName?: string;
  isPick: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-24 border-2 rounded-lg h-15",
        props.className,
        props.isPick ? "border-blue-300" : "border-red-200",
      )}
    >
      {props.shortName ? (
        <img
          src={`https://courier.spectral.gg/images/dota/portraits/${props.shortName}`}
          className="rounded-lg p-1"
        />
      ) : null}
    </div>
  );
}
