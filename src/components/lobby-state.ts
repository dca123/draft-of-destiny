import type { Draft, MachineValues, Selections } from "@/lib/state-machine";
import type { LobbyUpdateBroadcast as LobbyUpdate } from "party";
import { create } from "zustand";

type DraftState = Omit<LobbyUpdate, "type">;
type Actions = {
  optimisticDraftUpdate: (selection: Selections, hero: string) => void;
  optimisticUndoUpdate: (prevSelection: Selections) => void;
  updateDraftState: (state: DraftState) => void;
  resetLobby: (lobbyName: string) => void;
};

const initialDraft: DraftState = {
  side: "team_1",
  currentSelection: "SELECTION_1",
  draft: {
    SELECTION_1: "",
    SELECTION_2: "",
    SELECTION_3: "",
    SELECTION_4: "",
    SELECTION_5: "",
    SELECTION_6: "",
    SELECTION_7: "",
    SELECTION_8: "",
    SELECTION_9: "",
    SELECTION_10: "",
    SELECTION_11: "",
    SELECTION_12: "",
    SELECTION_13: "",
    SELECTION_14: "",
    SELECTION_15: "",
    SELECTION_16: "",
    SELECTION_17: "",
    SELECTION_18: "",
    SELECTION_19: "",
    SELECTION_20: "",
    SELECTION_21: "",
    SELECTION_22: "",
    SELECTION_23: "",
    SELECTION_24: "",
  } satisfies Draft,
};

type LobbyState = {
  lobbyName: string;
  selectionIdx: number;
} & DraftState;

const initialState: LobbyState = {
  lobbyName: generatePartyName(),
  selectionIdx: 1,
  ...initialDraft,
};

export const useLobbyStore = create<LobbyState & Actions>((set) => ({
  ...initialState,
  optimisticDraftUpdate: (selection, hero) =>
    set((state) => ({
      draft: {
        ...state.draft,
        [selection]: hero,
      },
    })),
  optimisticUndoUpdate: (prevSelection) =>
    set((state) => {
      const newDraft = { ...state.draft };
      newDraft[prevSelection] = "";
      const newSelectionIdx = state.selectionIdx - 1;

      return {
        draft: newDraft,
        currentSelection: `SELECTION_${newSelectionIdx}` as MachineValues,
        selectionIdx: newSelectionIdx,
      };
    }),
  updateDraftState: (draft) => set(draft),

  resetLobby: (lobbyName) =>
    set({
      ...initialDraft,
      lobbyName,
    }),
}));

export const machineValueToHumanReadable = {
  SELECTION_1: "Pick 1",
  SELECTION_2: "Pick 2",
  SELECTION_3: "Pick 3",
  SELECTION_4: "Pick 4",
  SELECTION_5: "Pick 5",
  SELECTION_6: "Pick 6",
  SELECTION_7: "Pick 7",
  SELECTION_8: "Pick 8",
  SELECTION_9: "Pick 9",
  SELECTION_10: "Pick 10",
  SELECTION_11: "Pick 11",
  SELECTION_12: "Pick 12",
  SELECTION_13: "Pick 13",
  SELECTION_14: "Pick 14",
  SELECTION_15: "Pick 15",
  SELECTION_16: "Pick 16",
  SELECTION_17: "Pick 17",
  SELECTION_18: "Pick 18",
  SELECTION_19: "Pick 19",
  SELECTION_20: "Pick 20",
  SELECTION_21: "Pick 21",
  SELECTION_22: "Pick 22",
  SELECTION_23: "Pick 23",
  SELECTION_24: "Pick 24",
  DRAFT_END: "Draft Complete",
};

export function generatePartyName() {
  const adjectives = [
    "cool",
    "fun",
    "happy",
    "super",
    "crazy",
    "mega",
    "chill",
    "lucky",
    "fast",
    "smart",
  ];
  const colors = [
    "red",
    "blue",
    "green",
    "gold",
    "pink",
    "lime",
    "aqua",
    "gray",
    "mint",
    "rose",
  ];
  const nouns = [
    "party",
    "bash",
    "night",
    "jam",
    "club",
    "event",
    "meet",
    "mixer",
    "fest",
    "hang",
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adj}${color}${noun}`;
}
