import { appDb } from "@/db";
import { drafts, generateDraftId } from "@/db/schema/drafts";
import { generatePartyName } from "@/lib/random";
import {
  machine,
  type ExportedMachineState,
  type Selections,
} from "@/lib/state-machine";
import { eq, sql } from "drizzle-orm";
import type * as Party from "partykit/server";
import { Actor, type Snapshot } from "xstate";

export type LobbyUpdate = ExportedMachineState & {
  state: Selections;
};

export type SaveMessage = {
  type: "save_message";
};
export type SelectHeroMessage = {
  type: "select_hero";
  payload: {
    hero: string;
  };
};

export type BranchDraftMessage = {
  type: "branch_draft";
};

type Message = SaveMessage | BranchDraftMessage | SelectHeroMessage;

export type CreateDraftMessage = {
  type: "create_draft";
  paylaod: {
    name: string;
  };
};

export default class Server implements Party.Server {
  draftActor: Actor<typeof machine>;
  draftName: string | undefined;
  isSetup: boolean = false;

  constructor(readonly room: Party.Room) {
    const actor = new Actor(machine);
    this.draftActor = actor;
    this.room = room;
    this.setup();
  }

  async setup() {
    if (this.isSetup) return;
    console.log("setting up");
    const snapshot = await loadPersistedState({ id: this.room.id });
    if (snapshot !== undefined) {
      this.draftActor = new Actor(machine, {
        snapshot,
      });
    }
    this.draftActor.subscribe((snapshot) => {
      const payload = {
        ...snapshot.context,
        state: snapshot.value,
      };
      this.room.broadcast(JSON.stringify(payload));
    });
    this.draftActor.start();

    this.isSetup = true;
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    await this.setup();
    const url = new URL(ctx.request.url);

    this.draftName = url.searchParams.get("draftName") ?? undefined;
    const snapshot = this.draftActor.getSnapshot();

    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}
  draftName: ${this.draftName}
  `,
    );
    conn.send(JSON.stringify(snapshot.context));
  }

  async onMessage(message: string, sender: Party.Connection) {
    await this.setup();
    const parsedMessage = JSON.parse(message) as Message;
    if (parsedMessage.type === "select_hero") {
      this.draftActor.send({ type: "NEXT", hero: parsedMessage.payload.hero });
    } else if (parsedMessage.type === "save_message") {
      await upsertDraft({
        id: this.room.id,
        name: this.draftName ?? "",
        persistedMachineSnapshot: this.draftActor.getPersistedSnapshot(),
      });
    } else if (parsedMessage.type === "branch_draft") {
      await upsertDraft({
        id: this.room.id,
        name: this.draftName ?? "",
        persistedMachineSnapshot: this.draftActor.getPersistedSnapshot(),
      });
      await branchDraft({
        id: this.room.id,
        persistedMachineSnapshot: this.draftActor.getPersistedSnapshot(),
      });
    }
    console.log(`connection ${sender.id} sent message: ${message}`);
  }

  async onRequest(req: Party.Request) {
    await this.setup();
    if (req.method === "POST") {
      const { paylaod } = (await req.json()) as CreateDraftMessage;
      const result = await upsertDraft({
        id: this.room.id,
        name: paylaod.name,
        persistedMachineSnapshot: this.draftActor.getPersistedSnapshot(),
      });
      return new Response(JSON.stringify({ id: result.id }), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    return new Response("Invalid method", { status: 405 });
  }
}

async function branchDraft(opts: {
  id: string;
  persistedMachineSnapshot: Snapshot<unknown>;
}) {
  const name = `${opts.id}.${generatePartyName()}`;
  const branchedDraft = await appDb
    .insert(drafts)
    .values({
      persistedMachineSnapshot: opts.persistedMachineSnapshot,
      name,
      parentDraft: opts.id,
    })
    .returning({
      id: drafts.id,
    });
  return branchedDraft;
}

async function loadPersistedState(opts: { id: string }) {
  const result = await appDb
    .select({
      state: drafts.persistedMachineSnapshot,
    })
    .from(drafts)
    .where(eq(drafts.id, opts.id));

  if (result.length > 0) {
    return result[0]?.state;
  }
  return undefined;
}

async function upsertDraft(opts: {
  id: string;
  name: string;
  persistedMachineSnapshot: Snapshot<unknown>;
}) {
  const result = await appDb
    .insert(drafts)
    .values(opts)
    .onConflictDoUpdate({
      target: drafts.id,
      set: { persistedMachineSnapshot: opts.persistedMachineSnapshot },
    })
    .returning({
      id: drafts.id,
    });
  if (!result[0]) {
    throw new Error("No result was returned after upsert");
  }
  return result[0];
}

Server satisfies Party.Worker;
