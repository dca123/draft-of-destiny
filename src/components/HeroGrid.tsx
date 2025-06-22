import { useAtom, useSetAtom } from "jotai";
import { selectedHeroAtom } from "./hero-selection-state";
import { cn } from "@/lib/utils";

export function HeroGrid(props: {
  heroes: Array<{ id: number; shortName: string }>;
}) {
  const [selectedHero, setSelectedHero] = useAtom(selectedHeroAtom);
  return (
    <div className="grid grid-cols-11 gap-1">
      {props.heroes.map((hero) => (
        <div
          key={hero.id}
          onClick={() => setSelectedHero(hero.shortName)}
          className="relative"
        >
          <div
            className={cn(
              "absolute inset-0",
              selectedHero === hero.shortName && "border-3 border-blue-300",
            )}
          />
          <img
            src={`https://courier.spectral.gg/images/dota/portraits_vert/${hero.shortName}?size=smaller`}
            className="rounded object-cover w-12"
          />
        </div>
      ))}
      {props.heroes.length}
    </div>
  );
}
