import { useMemo, useState } from "react";
import { usePlayerData } from "../../../../providers/PlayerDataProvider";
import { IProAthlete } from "../../../../types/athletes"
import Dropdown from "../../../ui/forms/Dropdown";
import NoContentCard from "../../../ui/typography/NoContentMessage";
import { DropdownOption } from "../../../../types/ui";
import { IProSeason } from "../../../../types/season";
import { abbreviateSeasonName } from "../../../players/compare/PlayerCompareSeasonPicker";

type Props = {
    player: IProAthlete
}

export default function PlayerSeasonStatsTab({ player }: Props) {


    const { sortedSeasons } = usePlayerData();
    
    const defaultSeason = useMemo(() => {
        if (sortedSeasons.length > 0) {
            return sortedSeasons[0];
        }

        return undefined;
    }, [sortedSeasons]);

    const [selectedSeason, setSelectedSeason] = useState<IProSeason | undefined>(defaultSeason);

    const dropdownOptions: DropdownOption[] = useMemo(() => {
        return sortedSeasons.map((s) => {
            return {
                label: s.name ? abbreviateSeasonName(s.name) : s.name,
                value: s.id
            }
        })
    }, [sortedSeasons]);

    const handleChangeSeason = (seasonId?: string) => {
        const foundSeason = sortedSeasons.find((s) => s.id === seasonId);

        if (foundSeason) {
            setSelectedSeason(foundSeason);
        }
    }

    return (
        <div>
            {sortedSeasons.length === 0 && (
                <NoContentCard message={`Career stats for ${player.player_name} are not available`} />
            )}

            {sortedSeasons.length > 0 && (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-2 justify-between" >
                        
                        <div>
                            <p>Season Stats</p>
                        </div>

                        <div>
                            <Dropdown 
                                options={dropdownOptions}
                                className="max-w-[230px] min-w-[150px]"
                                onChange={handleChangeSeason}
                                value={selectedSeason?.id}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
