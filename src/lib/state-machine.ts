import { assign, setup } from "xstate";

export const machine = setup({
  types: {
    context: {} as {
      side: "team_1" | "team_2";
      team_1_heroes: Array<string>;
      team_2_heroes: Array<string>;
      team_1_bans: Array<string>;
      team_2_bans: Array<string>;
    },
    events: {} as {
      type: "NEXT";
      hero: string;
    },
  },
  actions: {
    setSideTeam1: assign({
      side: "team_1",
    }),
    setSideTeam2: assign({
      side: "team_2",
    }),
    addToPicks: assign({
      team_1_heroes: ({ context, event }) => {
        if (context.side === "team_1") {
          return context.team_1_heroes.concat(event.hero);
        }
        return context.team_1_heroes;
      },
      team_2_heroes: ({ context, event }) => {
        if (context.side === "team_2") {
          return context.team_2_heroes.concat(event.hero);
        }
        return context.team_2_heroes;
      },
    }),
    addToBans: assign({
      team_1_bans: ({ context, event }) => {
        if (context.side === "team_1") {
          return context.team_1_bans.concat(event.hero);
        }
        return context.team_1_bans;
      },
      team_2_bans: ({ context, event }) => {
        if (context.side === "team_2") {
          return context.team_2_bans.concat(event.hero);
        }
        return context.team_2_bans;
      },
    }),
  },
}).createMachine({
  initial: "BAN_1",
  context: {
    side: "team_1",
    team_1_heroes: [] as string[],
    team_1_bans: [] as string[],
    team_2_heroes: [] as string[],
    team_2_bans: [] as string[],
  },
  states: {
    BAN_1: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "BAN_2",
          actions: "addToBans",
        },
      },
    },
    BAN_2: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "BAN_3",
          actions: "addToBans",
        },
      },
    },
    BAN_3: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "BAN_4",
          actions: "addToBans",
        },
      },
    },
    BAN_4: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "BAN_5",
          actions: "addToBans",
        },
      },
    },
    BAN_5: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "BAN_6",
          actions: "addToBans",
        },
      },
    },
    BAN_6: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "BAN_7",
          actions: "addToBans",
        },
      },
    },
    BAN_7: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "PICK_1",
          actions: "addToBans",
        },
      },
    },
    PICK_1: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "PICK_2",
          actions: "addToPicks",
        },
      },
    },
    PICK_2: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "BAN_8",
          actions: "addToPicks",
        },
      },
    },
    BAN_8: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "BAN_9",
          actions: "addToBans",
        },
      },
    },
    BAN_9: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "BAN_10",
          actions: "addToBans",
        },
      },
    },
    BAN_10: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "PICK_3",
          actions: "addToBans",
        },
      },
    },
    PICK_3: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "PICK_4",
          actions: "addToPicks",
        },
      },
    },
    PICK_4: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "PICK_5",
          actions: "addToPicks",
        },
      },
    },
    PICK_5: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "PICK_6",
          actions: "addToPicks",
        },
      },
    },
    PICK_6: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "PICK_7",
          actions: "addToPicks",
        },
      },
    },
    PICK_7: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "PICK_8",
          actions: "addToPicks",
        },
      },
    },
    PICK_8: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "BAN_11",
          actions: "addToPicks",
        },
      },
    },
    BAN_11: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "BAN_12",
          actions: "addToBans",
        },
      },
    },
    BAN_12: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "BAN_13",
          actions: "addToBans",
        },
      },
    },
    BAN_13: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "BAN_14",
          actions: "addToBans",
        },
      },
    },
    BAN_14: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "PICK_9",
          actions: "addToBans",
        },
      },
    },
    PICK_9: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "PICK_10",
          actions: "addToPicks",
        },
      },
    },
    PICK_10: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "DRAFT_END",
          actions: "addToPicks",
        },
      },
    },
    DRAFT_END: { type: "final" },
  },
});
