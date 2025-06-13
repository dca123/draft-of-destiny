import { create } from "zustand";

type LobbyState = {
  lobbyName: string;
  playerSide: "team_1" | "team_2";
} & DraftState;

type DraftState = {
  side: "team_1" | "team_2";
  team_1_heroes: Array<string>;
  team_2_heroes: Array<string>;
  team_1_bans: Array<string>;
  team_2_bans: Array<string>;
};

type Actions = {
  updateDraftState: (state: DraftState) => void;
  setTeam: (team: "team_1" | "team_2") => void;
  resetLobby: (lobbyName: string) => void;
};

const initialDraft: DraftState = {
  side: "team_1",
  team_1_heroes: [],
  team_2_heroes: [],
  team_1_bans: [],
  team_2_bans: [],
};
const initialState: LobbyState = {
  lobbyName: generatePartyName(),
  playerSide: "team_1",
  ...initialDraft,
};

export const useLobbyStore = create<LobbyState & Actions>((set) => ({
  ...initialState,
  updateDraftState: (draft) => set(draft),
  setTeam: (team) => set({ playerSide: team }),
  resetLobby: (lobbyName) =>
    set({
      ...initialDraft,
      lobbyName,
    }),
}));

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
