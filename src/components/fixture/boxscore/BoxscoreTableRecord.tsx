import { useState, useEffect } from "react";
import useSWR from "swr";
import { twMerge } from "tailwind-merge";
import { djangoAthleteService } from "../../../services/athletes/djangoAthletesService";
import RoundedCard from "../../shared/RoundedCard";
import SecondaryText from "../../shared/SecondaryText";
import { BoxscoreListRecordItem } from "../../../types/boxScore";
import { useFixtureScreen } from "../../../hooks/fixtures/useFixture";

type TableRecordProps = {
    record: BoxscoreListRecordItem,
    index: number,
    className?: string
}

export function BoxscoreTableRecord({ record, index, className }: TableRecordProps) {

    const { athleteId } = record;
    const key = `/athletes/${athleteId}`;
    const { data: info, isLoading: loadingInfo, } = useSWR(key, () => djangoAthleteService.getAthleteById(athleteId), {
        revalidateOnFocus: false
    });

    const { openPlayerMatchModal } = useFixtureScreen();

    const [show, setShow] = useState(true);

    useEffect(() => {

        if (!info && !loadingInfo) {
            setShow(false);
        }

    }, [info, setShow, loadingInfo]);

    if (loadingInfo) {
        return (
            <RoundedCard
                className="h-[50px] border-t border-slate-600 bg-slate-100 dark:bg-slate-700/30 mb-1 rounded-none animate-pulse border-none"
            />
        )
    }

    if (!show || !info) return;

    const { athstat_firstname } = info;

    const playerInitial = athstat_firstname && athstat_firstname.length >= 1 ?
        `${athstat_firstname[0]}.` : "";

    const isEvenRow = ((index) % 2) === 0;

    const handleClick = () => {
        openPlayerMatchModal(info);
    }

    return (
        <div

            className={twMerge(
                'w-full cursor-pointer min-w-fit flex flex-row flex-nowrap items-center justify-start border-b border-slate-100 dark:border-slate-700/30 hover:bg-slate-50 transition-colors',
                !isEvenRow && "bg-white dark:bg-[#181e26]",
                isEvenRow && "bg-slate-100 dark:bg-[#1c2534]",
                className
            )}

            onClick={handleClick}

        >
            {/* Player Name Column - Sticky */}
            <div className={twMerge(
                "flex sticky left-0 z-10 w-[180px] min-w-[180px] px-3 py-3 flex-row border-r-2 border-slate-200 dark:border-slate-700/40 items-center gap-2",
                !isEvenRow && "bg-white dark:bg-[#181e26]",
                isEvenRow && "bg-slate-100 dark:bg-[#1c2534]",
            )}>
                <p className="text-sm hover:underline font-medium truncate">
                    {playerInitial} {info?.athstat_lastname}
                </p>
            </div>

            {/* Stats Columns */}
            {record.stats.map((stat, statIndex) => {
                return (
                    <div
                        key={statIndex}
                        className={twMerge(
                            "flex-1 min-w-[80px] flex flex-row items-center justify-center px-3 py-3",
                            statIndex === record.stats.length - 1 && "min-w-[140px]"
                        )}
                    >
                        <SecondaryText className="font-medium text-sm">{stat}</SecondaryText>
                    </div>
                )
            })}
        </div>
    )
}
