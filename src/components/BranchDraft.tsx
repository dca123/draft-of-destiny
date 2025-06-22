import { Button } from "./ui/button";
import { GitBranchPlus } from "lucide-react";
import usePartySocket from "partysocket/react";
import { env } from "@/env/client";
import type { BranchDraftMessage, Broadcast } from "party";
import { useLoaderData, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export function BranchDraft() {
  const draftId = useLoaderData({
    from: "/drafts/$draftId",
    select: (data) => data.draft.id,
  });
  const router = useRouter();
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
      const message = JSON.parse(e.data) as Broadcast;
      if (message.type === "draft_branched") {
        const location = router.buildLocation({
          to: "/drafts/$draftId",
          params: { draftId: message.id },
        });
        toast("Draft has been branched", {
          action: {
            label: "Open",
            onClick: () => window.open(location.href, "_blank"),
          },
        });
      }
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
    <Button
      variant="secondary"
      size="icon"
      onClick={handleClick}
      aria-description="Branch Draft"
    >
      <GitBranchPlus />
    </Button>
  );
}
