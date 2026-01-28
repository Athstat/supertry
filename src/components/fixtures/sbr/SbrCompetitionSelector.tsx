import { useMemo } from "react";
import { useSbrFixtures } from "../../../hooks/fixtures/useSbrFixtures";
import { useQueryState } from "../../../hooks/web/useQueryState";
import Dropdown from "../../ui/forms/Dropdown";
import { DropdownOption } from "../../../types/ui";

/** Renders a competition selector for SBR */
export default function SbrCompetitionSelector() {

  const { fixtures, isLoading } = useSbrFixtures();
  const [season, setSeason] = useQueryState<string | undefined>('sbrcs', { init: 'all' });

  const seasons = useMemo(() => {
    const uniqueSeasons: Set<string> = new Set();
    fixtures.forEach((f) => {
      if (f.season && !uniqueSeasons.has(f.season)) {
        uniqueSeasons.add(f.season);
      }
    })

    return [...uniqueSeasons];
  }, [fixtures]);

  let seasonOptions: DropdownOption[] = seasons.map((s) => {
    return {
      label: s,
      value: s
    }
  });

  seasonOptions = [{ label: "All Competitions", value: "all" }, ...seasonOptions]

  if (isLoading) {
    return null;
  }

  return (
    <div className="w- px-4 flex flex-col items-center justify-center" >

      <div className="relative w-[98%]" >
        <Dropdown
          value={season}
          options={seasonOptions}
          className="w-full"
          selectedClassName="h-[45px] px-4"
          onChange={setSeason}
        />
      </div>
    </div>
  )
}
