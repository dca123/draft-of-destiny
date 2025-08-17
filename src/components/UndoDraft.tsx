import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";
import usePartySocket from "partysocket/react";
import { env } from "@/env/client";
import type { UndoMessage, Broadcast } from "party";
import { useLoaderData } from "@tanstack/react-router";
import { useLobbyStore } from "./lobby-state";
import { toast } from "sonner";

export function UndoDraft() {
  const draftId = useLoaderData({
    from: "/drafts/$draftId",
    select: (data) => data.draft.id,
  });
  const machineValue = useLobbyStore((state) => state.state);
  const optimisticUndoUpdate = useLobbyStore((state) => state.optimisticUndoUpdate);

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
      const message = JSON.parse(e.data) as Broadcast;
      if (message.type === "draft_undo") {
        // Show toast for other clients when someone else undoes
        toast("Previous selection was undone");
      }
    },
    onClose() {
      console.log("closed");
    },
    onError() {
      console.log("error");
    },
  });

  function handleUndo() {
    // Apply optimistic update locally first
    optimisticUndoUpdate(machineValue);
    
    // Send undo message to server
    const message = {
      type: "undo",
    } satisfies UndoMessage;
    ws.send(JSON.stringify(message));
    
    // Show toast for the user who initiated the undo
    toast("Undoing last selection");
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={handleUndo}
      disabled={machineValue === "SELECTION_1" || machineValue === "DRAFT_END"}
      aria-description="Undo Last Selection"
    >
      <RotateCcw />
    </Button>
  );
}

