import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import usePartySocket from "partysocket/react";
import { env } from "@/env/client";
import type { UndoMessage } from "party";
import { useLoaderData } from "@tanstack/react-router";
import { useLobbyStore } from "./lobby-state";
import { toast } from "sonner";

export function UndoDraft() {
  const draftId = useLoaderData({
    from: "/drafts/$draftId",
    select: (data) => data.draft.id,
  });
  const side = useLobbyStore((state) => state.side);
  const playerSide = useLobbyStore((state) => state.playerSide);
  const machineValue = useLobbyStore((state) => state.state);
  
  const ws = usePartySocket({
    host: import.meta.env.DEV ? "localhost:1999" : env.VITE_PARTYKIT_URL,
    room: draftId,
    query: () => ({
      draftName: "hellowWorld",
    }),
    onOpen() {
      console.log("connected");
    },
    onMessage(e) {
      console.log("message", e.data);
    },
    onClose() {
      console.log("closed");
    },
    onError() {
      console.log("error");
    },
  });

  function handleUndo() {
    const message = {
      type: "undo",
    } satisfies UndoMessage;
    ws.send(JSON.stringify(message));
    toast("Undoing last selection");
  }

  return (
    <Button 
      variant="secondary" 
      size="icon" 
      onClick={handleUndo}
      disabled={
        side !== playerSide ||
        machineValue === "SELECTION_1" ||
        machineValue === "DRAFT_END"
      }
      aria-description="Undo Last Selection"
    >
      <RotateCcw />
    </Button>
  );
}