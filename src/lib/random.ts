export const randomIdGenerator = (length: number) => {
  return () =>
    Math.random()
      .toString(36)
      .substring(2, length + 2);
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
