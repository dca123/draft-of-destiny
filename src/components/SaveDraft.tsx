import { Button } from "./ui/button";
import { Save } from "lucide-react";
import usePartySocket from "partysocket/react";
import { env } from "@/env/client";
import type { SaveMessage } from "party";

export function SaveDraft() {
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
