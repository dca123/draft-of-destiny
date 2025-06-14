import { assign, setup } from "xstate";

type NumsGenerator<
  T extends Number,
  R extends Array<unknown> = [unknown],
  Re = never,
> = T extends R["length"]
  ? Re | R["length"]
  : NumsGenerator<T, [...R, unknown], Re | R["length"]>;
type Bans = `BAN_${NumsGenerator<14>}`;
type Picks = `PICK_${NumsGenerator<10>}`;

export type Selections = Bans | Picks;
export type Draft = Record<Selections, string>;
export type ExportedMachineState = {
  side: "team_1" | "team_2";
  draft: Draft;
};

export const machine = setup({
  types: {
    context: {} as ExportedMachineState & {
      banIdx: number;
      pickIdx: number;
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
    addToDraft: assign({
      draft: ({ context, event }) => {
        return context.draft;
      },
    }),
    addToPicks: assign({
      pickIdx: ({ context }) => context.pickIdx + 1,
      draft: ({ context, event }) => ({
        ...context.draft,
        [`PICK_${context.pickIdx}`]: event.hero,
      }),
    }),
    addToBans: assign({
      banIdx: ({ context }) => context.banIdx + 1,
      draft: ({ context, event }) => ({
        ...context.draft,
        [`BAN_${context.banIdx}`]: event.hero,
      }),
    }),
  },
}).createMachine({
  initial: "BAN_1",
  context: {
    side: "team_1",
    banIdx: 1,
    pickIdx: 1,
    draft: {} as Record<Picks | Bans, string>,
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
