import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useAtomValue } from "jotai";
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
      console.log("error");
    },
  });

  const selectedHero = useAtomValue(selectedHeroAtom);
  function buttonText(machineValue: MachineValues) {
    if (machineValue.startsWith("BAN")) {
      return "Ban Hero";
    } else if (machineValue.startsWith("PICK")) {
      return "Pick Hero";
    }
    return "Draft Complete";
  }

  function handleClick() {
    if (selectedHero === "") return;
    optimisticDraftUpdate(machineValue, selectedHero);
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
      <div className="grid grid-cols-2 grid-rows-3 gap-2 justify-end">
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
      <div className="grid grid-cols-2 grid-rows-3 gap-2 justify-end">
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
  console.log(currentSelection);
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
