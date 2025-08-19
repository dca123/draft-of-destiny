import { assign, setup } from "xstate";

type NumsGenerator<
  T extends Number,
  R extends Array<unknown> = [unknown],
  Re = never,
> = T extends R["length"]
  ? Re | R["length"]
  : NumsGenerator<T, [...R, unknown], Re | R["length"]>;
export type Selections = `SELECTION_${NumsGenerator<24>}`;
export type Draft = Record<Selections, string>;

export type MachineValues = Selections | "DRAFT_END";
export type ExportedMachineState = {
  side: "team_1" | "team_2";
  draft: Draft;
};

export type TeamSelections = ReturnType<typeof draftToTeamSelections>;
export function draftToTeamSelections(opts: { draft: Draft }) {
  const selections = {
    team_1_picks: [
      opts.draft.SELECTION_8,
      opts.draft.SELECTION_13,
      opts.draft.SELECTION_14,
      opts.draft.SELECTION_19,
      opts.draft.SELECTION_23,
    ],
    team_2_picks: [
      opts.draft.SELECTION_9,
      opts.draft.SELECTION_12,
      opts.draft.SELECTION_15,
      opts.draft.SELECTION_16,
      opts.draft.SELECTION_24,
    ],
    team_1_bans: [
      opts.draft.SELECTION_1,
      opts.draft.SELECTION_4,
      opts.draft.SELECTION_7,
      opts.draft.SELECTION_10,
      opts.draft.SELECTION_11,
      opts.draft.SELECTION_17,
      opts.draft.SELECTION_22,
    ],
    team_2_bans: [
      opts.draft.SELECTION_2,
      opts.draft.SELECTION_3,
      opts.draft.SELECTION_5,
      opts.draft.SELECTION_6,
      opts.draft.SELECTION_18,
      opts.draft.SELECTION_20,
      opts.draft.SELECTION_21,
    ],
  };
  return selections;
}

export const machine = setup({
  types: {
    context: {} as ExportedMachineState & {
      selectionIdx: number;
    },
    events: {} as { type: "NEXT"; hero: string } | { type: "UNDO" },
  },
  actions: {
    setSideTeam1: assign({
      side: "team_1",
    }),
    setSideTeam2: assign({
      side: "team_2",
    }),
    addToDraft: assign({
      draft: ({ context }) => {
        return context.draft;
      },
    }),
    addToPicks: assign({
      selectionIdx: ({ context }) => context.selectionIdx + 1,
      draft: ({ context, event }) => {
        if (event.type !== "NEXT") return context.draft;
        return {
          ...context.draft,
          [`SELECTION_${context.selectionIdx}`]: event.hero,
        };
      },
    }),
    addToBans: assign({
      selectionIdx: ({ context }) => context.selectionIdx + 1,
      draft: ({ context, event }) => {
        if (event.type !== "NEXT") return context.draft;
        return {
          ...context.draft,
          [`SELECTION_${context.selectionIdx}`]: event.hero,
        };
      },
    }),
    undoLastSelection: assign({
      selectionIdx: ({ context }) => context.selectionIdx - 1,
      draft: ({ context }) => {
        const newDraft = { ...context.draft };
        // Remove the last selection from the draft
        delete newDraft[`SELECTION_${context.selectionIdx - 1}` as Selections];
        return newDraft;
      },
    }),
  },
}).createMachine({
  initial: "SELECTION_1",
  context: {
    side: "team_1",
    selectionIdx: 1,
    draft: {} as Draft,
  },
  states: {
    SELECTION_1: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "SELECTION_2",
          actions: "addToBans",
        },
      },
    },
    SELECTION_2: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "SELECTION_3",
          actions: "addToBans",
        },
        UNDO: {
          target: "SELECTION_1",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_3: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "SELECTION_4",
          actions: "addToBans",
        },
        UNDO: {
          target: "SELECTION_2",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_4: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "SELECTION_5",
          actions: "addToBans",
        },
        UNDO: {
          target: "SELECTION_3",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_5: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "SELECTION_6",
          actions: "addToBans",
        },
        UNDO: {
          target: "SELECTION_4",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_6: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "SELECTION_7",
          actions: "addToBans",
        },
        UNDO: {
          target: "SELECTION_5",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_7: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "SELECTION_8",
          actions: "addToBans",
        },
        UNDO: {
          target: "SELECTION_6",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_8: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "SELECTION_9",
          actions: "addToPicks",
        },
        UNDO: {
          target: "SELECTION_7",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_9: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "SELECTION_10",
          actions: "addToPicks",
        },
        UNDO: {
          target: "SELECTION_8",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_10: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "SELECTION_11",
          actions: "addToBans",
        },
        UNDO: {
          target: "SELECTION_9",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_11: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "SELECTION_12",
          actions: "addToBans",
        },
        UNDO: {
          target: "SELECTION_10",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_12: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "SELECTION_13",
          actions: "addToBans",
        },
        UNDO: {
          target: "SELECTION_11",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_13: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "SELECTION_14",
          actions: "addToPicks",
        },
        UNDO: {
          target: "SELECTION_12",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_14: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "SELECTION_15",
          actions: "addToPicks",
        },
        UNDO: {
          target: "SELECTION_13",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_15: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "SELECTION_16",
          actions: "addToPicks",
        },
        UNDO: {
          target: "SELECTION_14",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_16: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "SELECTION_17",
          actions: "addToPicks",
        },
        UNDO: {
          target: "SELECTION_15",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_17: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "SELECTION_18",
          actions: "addToPicks",
        },
        UNDO: {
          target: "SELECTION_16",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_18: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "SELECTION_19",
          actions: "addToPicks",
        },
        UNDO: {
          target: "SELECTION_17",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_19: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "SELECTION_20",
          actions: "addToBans",
        },
        UNDO: {
          target: "SELECTION_18",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_20: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "SELECTION_21",
          actions: "addToBans",
        },
        UNDO: {
          target: "SELECTION_19",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_21: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "SELECTION_22",
          actions: "addToBans",
        },
        UNDO: {
          target: "SELECTION_20",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_22: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "SELECTION_23",
          actions: "addToBans",
        },
        UNDO: {
          target: "SELECTION_21",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_23: {
      entry: "setSideTeam1",
      on: {
        NEXT: {
          target: "SELECTION_24",
          actions: "addToPicks",
        },
        UNDO: {
          target: "SELECTION_22",
          actions: "undoLastSelection",
        },
      },
    },
    SELECTION_24: {
      entry: "setSideTeam2",
      on: {
        NEXT: {
          target: "DRAFT_END",
          actions: "addToPicks",
        },
        UNDO: {
          target: "SELECTION_23",
          actions: "undoLastSelection",
        },
      },
    },
    DRAFT_END: {
      type: "final",
    },
  },
});
