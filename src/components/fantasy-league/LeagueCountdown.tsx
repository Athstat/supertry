import { useEffect, useMemo, useState } from "react";
import { IFantasyLeagueRound } from "../../types/fantasyLeague"
import { TranslucentButton } from "../shared/buttons/PrimaryButton";
import { twMerge } from "tailwind-merge";

type Props = {
    leagueRound: IFantasyLeagueRound,
    className?: string,
    leagueTitleClassName?: string
}

export default function LeagueRoundCountdown({ leagueRound }: Props) {

    const deadlineMillis = new Date(leagueRound.join_deadline ?? new Date()).valueOf();
    const dateNow = new Date().valueOf();
    const startMillis = deadlineMillis - dateNow;

    const [secondsLeft, setSecondsLeft] = useState(Math.floor(startMillis / 1000)); // total seconds

    useEffect(() => {

        // if the seconds left is 0 then don't start time
        // if new count down value is less than 0 can we
        // stop the interval and return 0

        const timer = setInterval(() => {
            setSecondsLeft(prev => {
                const nextVal = prev - 1;

                if (nextVal <= 0) {
                    clearInterval(timer);
                    return 0;
                }

                return nextVal;
            });
        }, 1000);

        if (secondsLeft <= 0) {
            clearInterval(secondsLeft);
            return;
        };


        return () => clearInterval(timer);

    }, [secondsLeft]);

    const isCountdownFinished = secondsLeft <= 0;

    const days = !isCountdownFinished ? Math.floor(secondsLeft / (60 * 60 * 24)) : 0;
    const hours = !isCountdownFinished ? Math.floor((secondsLeft % (60 * 60 * 24)) / (60 * 60)) : 0;
    const minutes = !isCountdownFinished ? Math.floor((secondsLeft % (60 * 60)) / 60) : 0;
    const seconds = !isCountdownFinished ? secondsLeft % 60 : 0;

    const timeBlocks = useMemo(() => {
        return [
            { value: days, label: 'Days' },
            { value: hours, label: 'Hours' },
            { value: minutes, label: 'Minutes' },
            { value: seconds, label: 'Seconds' },
        ];
    }, [days, hours, minutes, seconds]);

    return (
        <div className='flex flex-col gap-2 py-2' >

            {/* <p className='font-medium text-lg' >{currentRound?.title} Deadline</p> */}
            <TranslucentButton className="flex hover:bg-blue-100/10 hover:dark:bg-blue-100/10  flex-row items-center p-1 justify-center" >
                <p>{leagueRound?.title} Team Selection Deadline</p>
            </TranslucentButton>
            <div className="grid grid-cols-4 sm:flex sm:flex-row gap-2 sm:gap-4 items-center justify-start">
                {timeBlocks.map(block => (
                    <div
                        key={block.label}
                        className="p-2 sm:p-3 md:min-w-[80px] items-center justify-center flex flex-col rounded-xl bg-white/10 dark:bg-white/10 border border-white/10 dark:border-white/10"
                    >
                        <p className="font-bold text-sm sm:text-xl md:text-2xl">
                            {block.value.toString().padStart(2, '0')}
                        </p>
                        <p className="text-[10px] sm:text-xs dark:text-primary-100">{block.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}


/** Renders a league count down 2 */
export function LeagueRoundCountdown2({ leagueRound, className,leagueTitleClassName }: Props) {

    const deadlineMillis = new Date(leagueRound.join_deadline ?? new Date()).valueOf();
    const dateNow = new Date().valueOf();
    const startMillis = deadlineMillis - dateNow;

    const [secondsLeft, setSecondsLeft] = useState(Math.floor(startMillis / 1000)); // total seconds

    useEffect(() => {

        // if the seconds left is 0 then don't start time
        // if new count down value is less than 0 can we
        // stop the interval and return 0

        const timer = setInterval(() => {
            setSecondsLeft(prev => {
                const nextVal = prev - 1;

                if (nextVal <= 0) {
                    clearInterval(timer);
                    return 0;
                }

                return nextVal;
            });
        }, 1000);

        if (secondsLeft <= 0) {
            clearInterval(secondsLeft);
            return;
        };


        return () => clearInterval(timer);

    }, [secondsLeft]);

    const isCountdownFinished = secondsLeft <= 0;

    const days = !isCountdownFinished ? Math.floor(secondsLeft / (60 * 60 * 24)) : 0;
    const hours = !isCountdownFinished ? Math.floor((secondsLeft % (60 * 60 * 24)) / (60 * 60)) : 0;
    const minutes = !isCountdownFinished ? Math.floor((secondsLeft % (60 * 60)) / 60) : 0;
    const seconds = !isCountdownFinished ? secondsLeft % 60 : 0;

    const timeBlocks = useMemo(() => {
        return [
            { value: days, label: 'Days' },
            { value: hours, label: 'Hours' },
            { value: minutes, label: 'Minutes' },
            { value: seconds, label: 'Seconds' },
        ];
    }, [days, hours, minutes, seconds]);

    const isTimeLeft = days + hours + minutes + seconds > 0;

    return (
        <div className={twMerge(
            'flex flex-row gap-2 min-h-[30px] max-h-[30px] items-center justify-between',
            className
        )} >

            {/* <p className='font-medium text-lg' >{currentRound?.title} Deadline</p> */}
            <div>
                <p className={twMerge(
                    "font-semibold",
                    leagueTitleClassName
                )} > ⏰ GW {leagueRound.start_round} Deadline</p>
            </div>

            {isTimeLeft && <div className="flex flex-row items-center gap-2">
                {timeBlocks.map((block, index) => {

                    if (days > 0 && (block.label === "Seconds" || block.label === "Minutes")) {
                        return;
                    }

                    if (hours > 0 && (block.label === "Seconds")) {
                        return;
                    }

                    if (block.label === "Days" && block.value === 0) {
                        return;
                    }

                    if (block.label === "Hours" && block.value === 0 && (days === 0)) {
                        return;
                    }

                    return (
                        <div
                            key={index}
                            className="flex flex-row gap-1"
                        >
                            <p className="font-bold text-sm">
                                {block.value.toString().padStart(2, '0')}
                            </p>
                            <p className="text-sm dark:text-primary-100">{block.label}</p>
                        </div>
                    )
                })}
            </div>}

            {!isTimeLeft && (
                <div>
                    <p>Times Up!</p>
                </div>
            )}

        </div>
    )
}
