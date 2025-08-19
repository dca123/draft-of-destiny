import { useAtom, useAtomValue } from "jotai";
import { selectedHeroAtom } from "./hero-selection-state";
import { cn } from "@/lib/utils";
import { useLobbyStore } from "./lobby-state";
import { draftToTeamSelections } from "@/lib/state-machine";
import { SearchHeroAtom } from "@/routes/drafts.$draftId";
import { memo } from "react";

const HeroItem = memo(function HeroItem(props: {
  hero: { id: number; shortName: string };
  selectedHero: string;
  unavailableHeroes: string[];
  onSelect: (name: string) => void;
}) {
  const { hero, selectedHero, unavailableHeroes, onSelect } = props;
  const searchHero = useAtomValue(SearchHeroAtom);

  return (
    <div onClick={() => onSelect(hero.shortName)} className="relative">
      <div
        className={cn(
          "absolute inset-0",
          selectedHero === hero.shortName && "rounded border-2 border-blue-400",
        )}
      />
      <img
        src={`https://courier.spectral.gg/images/dota/portraits_vert/${hero.shortName}?size=smaller`}
        className={cn(
          "rounded object-cover w-24",
          unavailableHeroes.includes(hero.shortName) ? "opacity-40" : "",
          //TODO: Replace with Leveinstein Distance
          searchHero === "" || hero.shortName.startsWith(searchHero)
            ? ""
            : "opacity-30",
        )}
      />
    </div>
  );
});

export function HeroGrid(props: {
  heroes: Array<{ id: number; shortName: string }>;
}) {
  const [selectedHero, setSelectedHero] = useAtom(selectedHeroAtom);
  const draft = useLobbyStore((state) => state.draft);
  const unavailableHeroes = Object.values(
    draftToTeamSelections({ draft }),
  ).reduce((acc, cur) => [...acc, ...cur], [] as string[]);

  function handleSelect(name: string) {
    if (unavailableHeroes.includes(name)) return;
    setSelectedHero(name);
  }

  return (
    <div className="grid grid-cols-11 gap-1">
      {props.heroes.map((hero) => (
        <HeroItem
          key={hero.id}
          hero={hero}
          selectedHero={selectedHero}
          unavailableHeroes={unavailableHeroes}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
