import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useAtomValue } from "jotai";
import { selectedHeroAtom } from "./hero-selection-state";
import usePartySocket from "partysocket/react";
import { useLobbyStore } from "./lobby-state";
import { env } from "@/env/client";
import type { SelectHeroMessage } from "party";

export function Draft() {
  const side = useLobbyStore((state) => state.side);
  const playerSide = useLobbyStore((state) => state.playerSide);
  const draft = useLobbyStore((state) => state.draft);
  const updateDraftState = useLobbyStore((state) => state.updateDraftState);
  const optimisticDraftUpdate = useLobbyStore(
    (state) => state.optimisticDraftUpdate,
  );
  const draftState = useLobbyStore((state) => state.state); // renamed to avoid shadowing 'state'

  const ws = usePartySocket({
    host: import.meta.env.DEV ? "localhost:1999" : env.VITE_PARTYKIT_URL,
    room: "my-room",
    // startClosed: true,
    query: () => ({
      draftName: "hellowWorld",
    }),

    onOpen() {
      console.log("connected");
    },
    onMessage(e) {
      console.log("message", e.data);
      const s = JSON.parse(e.data);
      updateDraftState(s);
    },
    onClose() {
      console.log("closed");
    },
    onError(e) {
      console.log("error");
    },
  });

  const selectedHero = useAtomValue(selectedHeroAtom);

  function handleClick() {
    if (selectedHero === "") return;
    optimisticDraftUpdate(draftState, selectedHero);
    const message = {
      type: "select_hero",
      payload: {
        hero: selectedHero,
      },
    } satisfies SelectHeroMessage;
    ws.send(JSON.stringify(message));
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 grid-rows-4 gap-3 justify-end">
        <HeroSlot isPick={false} selectionId="BAN_1" shortName={draft.BAN_1} />
        <HeroSlot isPick={false} selectionId="BAN_2" shortName={draft.BAN_2} />
        <HeroSlot isPick={false} selectionId="BAN_4" shortName={draft.BAN_4} />
        <HeroSlot isPick={false} selectionId="BAN_3" shortName={draft.BAN_3} />
        <HeroSlot isPick={false} selectionId="BAN_7" shortName={draft.BAN_7} />
        <HeroSlot isPick={false} selectionId="BAN_5" shortName={draft.BAN_5} />
        <HeroSlot
          className="col-start-2"
          isPick={false}
          selectionId="BAN_6"
          shortName={draft.BAN_6}
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-3 gap-3 justify-end">
        <HeroSlot isPick={true} selectionId="PICK_1" shortName={draft.PICK_1} />
        <HeroSlot isPick={true} selectionId="PICK_2" shortName={draft.PICK_2} />

        <HeroSlot isPick={false} selectionId="BAN_8" shortName={draft.BAN_8} />
        <HeroSlot
          isPick={false}
          selectionId="BAN_10"
          shortName={draft.BAN_10}
        />
        <HeroSlot isPick={false} selectionId="BAN_9" shortName={draft.BAN_9} />
      </div>
      <div className="grid grid-cols-2 grid-rows-3 gap-3 justify-end">
        <HeroSlot isPick={true} selectionId="PICK_4" shortName={draft.PICK_4} />
        <HeroSlot isPick={true} selectionId="PICK_3" shortName={draft.PICK_3} />
        <HeroSlot isPick={true} selectionId="PICK_5" shortName={draft.PICK_5} />
        <HeroSlot isPick={true} selectionId="PICK_6" shortName={draft.PICK_6} />
        <HeroSlot isPick={true} selectionId="PICK_8" shortName={draft.PICK_8} />
        <HeroSlot isPick={true} selectionId="PICK_7" shortName={draft.PICK_7} />

        <HeroSlot
          isPick={false}
          selectionId="BAN_11"
          shortName={draft.BAN_11}
        />
        <HeroSlot
          isPick={false}
          selectionId="BAN_12"
          shortName={draft.BAN_12}
        />
        <HeroSlot
          isPick={false}
          selectionId="BAN_14"
          shortName={draft.BAN_14}
        />
        <HeroSlot
          isPick={false}
          selectionId="BAN_13"
          shortName={draft.BAN_13}
        />

        <HeroSlot isPick={true} selectionId="PICK_9" shortName={draft.PICK_9} />
        <HeroSlot
          isPick={true}
          selectionId="PICK_10"
          shortName={draft.PICK_10}
        />
      </div>
      <Button
        onClick={handleClick}
        disabled={selectedHero === "" || side !== playerSide}
      >
        Select Hero
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
