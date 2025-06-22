import { Button } from "./ui/button";
import { Save } from "lucide-react";
import usePartySocket from "partysocket/react";
import { env } from "@/env/client";
import type { Broadcast, SaveMessage } from "party";
import { useLoaderData } from "@tanstack/react-router";
import { toast } from "sonner";

export function SaveDraft() {
  const draftId = useLoaderData({
    from: "/drafts/$draftId",
    select: (data) => data.draft.id,
  });
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
      if (message.type === "draft_saved") {
        toast("Draft saved");
      }
    },
    onClose() {
      console.log("closed");
    },
    onError(e) {
      console.log("error");
    },
  });

  function handleClick() {
    ws.send(JSON.stringify({ type: "save_message" } as SaveMessage));
  }
  return (
    <Button variant="secondary" size="icon" onClick={handleClick}>
      <Save />
    </Button>
  );
}
