import { useAtom, useAtomValue } from "jotai";
import { selectedHeroAtom } from "./hero-selection-state";
import { cn } from "@/lib/utils";
import { useLobbyStore } from "./lobby-state";
import { draftToTeamSelections } from "@/lib/state-machine";
import { SearchHeroAtom } from "@/routes/drafts.$draftId";

export function HeroGrid(props: {
  heroes: Array<{ id: number; shortName: string }>;
}) {
  const [selectedHero, setSelectedHero] = useAtom(selectedHeroAtom);
  const draft = useLobbyStore((state) => state.draft);
  const unavailableHeroes = Object.values(
    draftToTeamSelections({ draft }),
  ).reduce((acc, cur) => [...acc, ...cur], [] as string[]);
  const searchHero = useAtomValue(SearchHeroAtom);
  console.log(searchHero);

  function handleSelect(name: string) {
    if (unavailableHeroes.includes(name)) return;
    setSelectedHero(name);
  }
  return (
    <div className="grid grid-cols-11 gap-1">
      {props.heroes.map((hero) => (
        <div
          key={hero.id}
          onClick={() => handleSelect(hero.shortName)}
          className="relative"
        >
          <div
            className={cn(
              "absolute inset-0",
              selectedHero === hero.shortName &&
                "rounded border-2 border-blue-400",
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
      ))}
    </div>
  );
}
