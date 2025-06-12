import { useSetAtom } from "jotai";
import { selectedHeroAtom } from "./hero-selection-state";

export function HeroGrid(props: {
  heroes: Array<{ id: number; shortName: string }>;
}) {
  const setSelectedHero = useSetAtom(selectedHeroAtom);
  return (
    <div className="grid grid-cols-11 gap-1">
      {props.heroes.map((hero) => (
        <div key={hero.id} onClick={() => setSelectedHero(hero.shortName)}>
          <img
            src={`https://courier.spectral.gg/images/dota/portraits_vert/${hero.shortName}`}
            className="rounded"
          />
        </div>
      ))}
    </div>
  );
}
