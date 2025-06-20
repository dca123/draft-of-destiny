import { Button } from "./ui/button";
import { Save } from "lucide-react";
import usePartySocket from "partysocket/react";
import { env } from "@/env/client";
import type { SaveMessage } from "party";
import { useLoaderData } from "@tanstack/react-router";

export function SaveDraft() {
  const draftId = useLoaderData({
    from: "/drafts/$draftId",
    select: (data) => data.draft.id,
  });
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
    <Button variant="outline" size="sm" onClick={handleClick}>
      <Save /> Save Draft
    </Button>
  );
}
