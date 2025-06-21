import { Button } from "./ui/button";
import { GitBranchPlus } from "lucide-react";
import usePartySocket from "partysocket/react";
import { env } from "@/env/client";
import type { BranchDraftMessage } from "party";
import { useLoaderData } from "@tanstack/react-router";

export function BranchDraft() {
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
    ws.send(JSON.stringify({ type: "branch_draft" } as BranchDraftMessage));
  }
  return (
    <Button variant="outline" size="sm" onClick={handleClick}>
      <GitBranchPlus /> Branch Draft
    </Button>
  );
}
