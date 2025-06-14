import { appDb } from "@/db";
import { drafts } from "@/db/schema/drafts";
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

type Message = SaveMessage | SelectHeroMessage;

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
    }
    console.log(`connection ${sender.id} sent message: ${message}`);
  }
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
    });
}

Server satisfies Party.Worker;
