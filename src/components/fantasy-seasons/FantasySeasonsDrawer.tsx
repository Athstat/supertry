import { X } from "lucide-react";
import { useFantasySeasons } from "../../hooks/dashboard/useFantasySeasons"
import CircleButton from "../ui/buttons/BackButton";
import BottomSheetView from "../ui/modals/BottomSheetView"
import { IProSeason } from "../../types/season";
import RoundedCard from "../ui/cards/RoundedCard";
import { twMerge } from "tailwind-merge";

/** Renders a fantasy seasons drawer */
export function FantasySeasonsDrawer() {

    const { selectedSeason, fantasySeasons, setSelectedSeason } = useFantasySeasons();

    return (
        <BottomSheetView
            className='p-4 max-h-[90vh] min-h-[35vh] flex flex-col gap-6'
            hideHandle
        >
            <div className="flex flex-row items-center justify-between" >
                <p className="font-semibold text-lg" >Select Competition</p>
                <CircleButton>
                    <X />
                </CircleButton>
            </div>

            <div className="flex flex-col gap-2" >
                {fantasySeasons.map((fs) => {
                    return (
                        <OptionItem
                            season={fs}
                            isSelected={selectedSeason?.id === fs.id}
                            onClick={setSelectedSeason}
                        />
                    )
                })}
            </div>

        </BottomSheetView>
    )
}

type OptionProp = {
    onClick?: (season: IProSeason) => void,
    isSelected?: boolean,
    season: IProSeason
}

function OptionItem({ onClick, isSelected, season }: OptionProp) {
    
    const handleOnClick = () => {
        if (season && onClick) {
            onClick(season)
        }
    }
    
    return (
        <RoundedCard
            onClick={handleOnClick}
            className={twMerge(
                "py-2 px-4 cursor-pointer hover:bg-slate-100",
                isSelected && "bg-blue-500 dark:bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600 text-white dark:text-white"
            )}
        >
            <p>{season.name}</p>
        </RoundedCard>
    )
}