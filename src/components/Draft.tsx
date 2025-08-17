import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useAtom, useAtomValue } from "jotai";
import { selectedHeroAtom } from "./hero-selection-state";
import usePartySocket from "partysocket/react";
import { machineValueToHumanReadable, useLobbyStore } from "./lobby-state";
import { env } from "@/env/client";
import type { SelectHeroMessage } from "party";
import { useLoaderData } from "@tanstack/react-router";
import type { MachineValues } from "@/lib/state-machine";

export function Draft() {
  const draftId = useLoaderData({
    from: "/drafts/$draftId",
    select: (data) => data.draft.id,
  });
  const side = useLobbyStore((state) => state.side);
  const playerSide = useLobbyStore((state) => state.playerSide);
  const draft = useLobbyStore((state) => state.draft);
  const updateDraftState = useLobbyStore((state) => state.updateDraftState);
  const optimisticDraftUpdate = useLobbyStore(
    (state) => state.optimisticDraftUpdate,
  );
  const machineValue = useLobbyStore((state) => state.state); // renamed to avoid shadowing 'state'

  const ws = usePartySocket({
    host: import.meta.env.DEV ? "localhost:1999" : env.VITE_PARTYKIT_URL,
    room: draftId,
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
      console.log("error", e);
    },
  });

  const [selectedHero, setSelectedHero] = useAtom(selectedHeroAtom);
  function buttonText(machineValue: MachineValues) {
    if (machineValue === "DRAFT_END") {
      return "Draft Complete";
    }
    
    // Check if this selection is a ban or a pick based on the selection number
    const BAN_SELECTIONS = new Set([
      "SELECTION_1", "SELECTION_2", "SELECTION_3", "SELECTION_4", 
      "SELECTION_5", "SELECTION_6", "SELECTION_7", "SELECTION_10", 
      "SELECTION_11", "SELECTION_12", "SELECTION_19", "SELECTION_20", 
      "SELECTION_21", "SELECTION_22"
    ]);
    
    return BAN_SELECTIONS.has(machineValue) ? "Ban Hero" : "Pick Hero";
  }

  function handleClick() {
    if (selectedHero === "") return;
    optimisticDraftUpdate(machineValue, selectedHero);
    setSelectedHero("");

    const message = {
      type: "select_hero",
      payload: {
        hero: selectedHero,
      },
    } satisfies SelectHeroMessage;
    ws.send(JSON.stringify(message));
  }
  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleClick}
        disabled={
          selectedHero === "" ||
          side !== playerSide ||
          machineValue === "DRAFT_END"
        }
      >
        {buttonText(machineValue)}
      </Button>
      <div className="flex flex-row gap-2 ">
        <h1 className="w-full text-center">Team 1</h1>
        <h1 className="w-full text-center">Team 2</h1>
      </div>
      <div className="grid grid-cols-2 grid-rows-4 gap-2 justify-end">
        <HeroSlot isPick={false} selectionId="SELECTION_1" shortName={draft.SELECTION_1} />
        <HeroSlot isPick={false} selectionId="SELECTION_2" shortName={draft.SELECTION_2} />
        <HeroSlot isPick={false} selectionId="SELECTION_4" shortName={draft.SELECTION_4} />
        <HeroSlot isPick={false} selectionId="SELECTION_3" shortName={draft.SELECTION_3} />
        <HeroSlot isPick={false} selectionId="SELECTION_7" shortName={draft.SELECTION_7} />
        <HeroSlot isPick={false} selectionId="SELECTION_5" shortName={draft.SELECTION_5} />
        <HeroSlot
          className="col-start-2"
          isPick={false}
          selectionId="SELECTION_6"
          shortName={draft.SELECTION_6}
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-3 gap-2 justify-end">
        <HeroSlot isPick={true} selectionId="SELECTION_8" shortName={draft.SELECTION_8} />
        <HeroSlot isPick={true} selectionId="SELECTION_9" shortName={draft.SELECTION_9} />

        <HeroSlot isPick={false} selectionId="SELECTION_10" shortName={draft.SELECTION_10} />
        <HeroSlot
          isPick={false}
          selectionId="SELECTION_12"
          shortName={draft.SELECTION_12}
        />
        <HeroSlot isPick={false} selectionId="SELECTION_11" shortName={draft.SELECTION_11} />
      </div>
      <div className="grid grid-cols-2 grid-rows-3 gap-2 justify-end">
        <HeroSlot isPick={true} selectionId="SELECTION_14" shortName={draft.SELECTION_14} />
        <HeroSlot isPick={true} selectionId="SELECTION_13" shortName={draft.SELECTION_13} />
        <HeroSlot isPick={true} selectionId="SELECTION_15" shortName={draft.SELECTION_15} />
        <HeroSlot isPick={true} selectionId="SELECTION_16" shortName={draft.SELECTION_16} />
        <HeroSlot isPick={true} selectionId="SELECTION_18" shortName={draft.SELECTION_18} />
        <HeroSlot isPick={true} selectionId="SELECTION_17" shortName={draft.SELECTION_17} />

        <HeroSlot
          isPick={false}
          selectionId="SELECTION_19"
          shortName={draft.SELECTION_19}
        />
        <HeroSlot
          isPick={false}
          selectionId="SELECTION_20"
          shortName={draft.SELECTION_20}
        />
        <HeroSlot
          isPick={false}
          selectionId="SELECTION_22"
          shortName={draft.SELECTION_22}
        />
        <HeroSlot
          isPick={false}
          selectionId="SELECTION_21"
          shortName={draft.SELECTION_21}
        />

        <HeroSlot isPick={true} selectionId="SELECTION_23" shortName={draft.SELECTION_23} />
        <HeroSlot
          isPick={true}
          selectionId="SELECTION_24"
          shortName={draft.SELECTION_24}
        />
      </div>
    </div>
  );
}

function HeroSlot(props: {
  selectionId: MachineValues;
  shortName?: string;
  isPick: boolean;
  className?: string;
}) {
  const currentSelection = useLobbyStore((state) => state.state);
  return (
    <div
      className={cn(
        "w-18 h-10 rounded-lg flex items-center justify-center relative",
        props.className,
        props.shortName === undefined
          ? props.isPick
            ? "border-blue-400 border"
            : "border-red-400 border"
          : "",
        props.selectionId === currentSelection
          ? "border-3 border-green-300"
          : "",
      )}
    >
      {props.shortName !== undefined && !props.isPick ? (
        <div className="absolute inset-0 bg-red-700 opacity-50 rounded-lg mix-blend-hard-light" />
      ) : null}
      {props.shortName ? (
        <img
          src={`https://courier.spectral.gg/images/dota/portraits/${props.shortName}`}
          className="rounded-lg object-cover"
        />
      ) : (
        <p className="text-sm text-muted-foreground ">
          {machineValueToHumanReadable[props.selectionId]}
        </p>
      )}
    </div>
  );
}
