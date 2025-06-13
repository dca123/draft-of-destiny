import { machine } from "@/lib/state-machine";
import type * as Party from "partykit/server";
import { Actor } from "xstate";

export default class Server implements Party.Server {
  draftActor: Actor<typeof machine>;
  constructor(readonly room: Party.Room) {
    const actor = new Actor(machine);
    this.draftActor = actor;

    this.draftActor.subscribe((snapshot) => {
      console.log("update");
      this.room.broadcast(JSON.stringify(snapshot.context));
    });
    this.draftActor.start();
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`,
    );
    console.log(this.room.parties);

    // let's send a message to the connection
    const snapshot = this.draftActor.getSnapshot();
    conn.send(JSON.stringify(snapshot.context));
  }

  onMessage(message: string, sender: Party.Connection) {
    this.draftActor.send({ type: "NEXT", hero: message });
    console.log(`connection ${sender.id} sent message: ${message}`);
  }
}

Server satisfies Party.Worker;
