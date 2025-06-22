import type { Draft } from "@/lib/state-machine";
import type { LobbyUpdate } from "party";
import { create } from "zustand";

type LobbyState = {
  lobbyName: string;
  playerSide: "team_1" | "team_2";
} & DraftState;

type DraftState = LobbyUpdate;

type Actions = {
  optimisticDraftUpdate: (selection: DraftState["state"], hero: string) => void;
  updateDraftState: (state: DraftState) => void;
  setTeam: (team: "team_1" | "team_2") => void;
  resetLobby: (lobbyName: string) => void;
};

const initialDraft: DraftState = {
  side: "team_1",
  state: "BAN_1",
  draft: {
    BAN_1: "",
    BAN_2: "",
    BAN_3: "",
    BAN_4: "",
    BAN_5: "",
    BAN_6: "",
    BAN_7: "",
    BAN_8: "",
    BAN_9: "",
    BAN_10: "",
    BAN_11: "",
    BAN_12: "",
    BAN_13: "",
    BAN_14: "",
    PICK_1: "",
    PICK_2: "",
    PICK_3: "",
    PICK_4: "",
    PICK_5: "",
    PICK_6: "",
    PICK_7: "",
    PICK_8: "",
    PICK_9: "",
    PICK_10: "",
  } satisfies Draft,
};
const initialState: LobbyState = {
  lobbyName: generatePartyName(),
  playerSide: "team_1",
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
  updateDraftState: (draft) => set(draft),
  setTeam: (team) => set({ playerSide: team }),
  resetLobby: (lobbyName) =>
    set({
      ...initialDraft,
      lobbyName,
    }),
}));

export const machineValueToHumanReadable = {
  BAN_1: "Ban 1",
  BAN_2: "Ban 2",
  BAN_3: "Ban 3",
  BAN_4: "Ban 4",
  BAN_5: "Ban 5",
  BAN_6: "Ban 6",
  BAN_7: "Ban 7",

  PICK_1: "Pick 1",
  PICK_2: "Pick 2",

  BAN_8: "Ban 8",
  BAN_9: "Ban 9",
  BAN_10: "Ban 10",

  PICK_3: "Pick 3",
  PICK_4: "Pick 4",
  PICK_5: "Pick 5",
  PICK_6: "Pick 6",
  PICK_7: "Pick 7",
  PICK_8: "Pick 8",

  BAN_11: "Ban 11",
  BAN_12: "Ban 12",
  BAN_13: "Ban 13",
  BAN_14: "Ban 14",

  PICK_9: "Pick 9",
  PICK_10: "Pick 10",

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
