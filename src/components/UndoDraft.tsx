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
  const machineValue = useLobbyStore((state) => state.currentSelection);
  const optimisticUndoUpdate = useLobbyStore(
    (state) => state.optimisticUndoUpdate,
  );

  const ws = usePartySocket({
    host: import.meta.env.DEV ? "localhost:1999" : env.VITE_PARTYKIT_URL,
    room: draftId,
    onMessage(e) {
      const message = JSON.parse(e.data) as Broadcast;
      if (message.type === "draft_undo") {
        toast("Previous selection was undone");
      }
    },
  });

  function handleUndo() {
    if (machineValue === "DRAFT_END") return;
    optimisticUndoUpdate(machineValue);

    const message = {
      type: "undo",
    } satisfies UndoMessage;
    ws.send(JSON.stringify(message));
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
