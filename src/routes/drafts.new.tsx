import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generatePartyName } from "@/lib/random";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { FormEvent } from "react";
import PartySocket from "partysocket";
import { generateDraftId } from "@/db/schema/drafts";
import type { CreateDraftMessage } from "party";
import { env } from "@/env/client";

export const Route = createFileRoute("/drafts/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const draftName = data.get("name");
    if (draftName === null) return;
    const response = await PartySocket.fetch(
      {
        host: import.meta.env.DEV ? "localhost:1999" : env.VITE_PARTYKIT_URL,
        room: generateDraftId(),
      },
      {
        method: "POST",
        body: JSON.stringify({
          type: "create_draft",
          paylaod: {
            name: draftName.toString(),
          },
        } satisfies CreateDraftMessage),
      },
    );
    if (response.status === 200) {
      const payload = (await response.json()) as { id: string };
      console.log("payload", payload);
      navigate({
        to: "/drafts/$draftId",
        params: {
          draftId: payload.id,
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Create Lobby</CardTitle>
            <CardDescription>
              Practise drafting in your own multiplayer lobby
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  name="name"
                  id="name"
                  defaultValue={generatePartyName()}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Create Lobby
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
