import { useAtomValue } from "jotai"
import { sbrFixtureTimelineAtom } from "../../../state/sbrFixtureScreen.atoms"
import TitledCard from "../../ui/cards/TitledCard";
import { twMerge } from "tailwind-merge";
import SecondaryText from "../../ui/typography/SecondaryText";
import { ReactNode } from "react";
import { XIcon } from "lucide-react";
import { MdSportsRugby } from "react-icons/md";

const timelineEvents = ["Try", "Conversion", "Conversion Missed", "Full-Time", "Half-Time", "Yellow Card", "Red Card", "Penalty Kick Scored"];

/** Renders a summary card showing timeline of events for an sbr fixture */
export default function SbrFixtureTimeline() {

    const events = useAtomValue(sbrFixtureTimelineAtom)
        .filter((e) => {
            return timelineEvents.includes(e.event_name);
        });
    const hasEvents = events.length > 0;

    if (!hasEvents) return;

    return (
        <TitledCard title="Timeline" >
            <div className="grid grid-cols-1" >

                <TimelineHeading  >
                    <p>Kick Off</p>
                </TimelineHeading>

                {events.map((event, index) => {
                    return <TimelineItem
                        eventName={event.event_name}
                        timestamp={event.event_timestamp}
                        isHomeTeamEvent={event.team_id === 1}
                        isMiss={event.event_name === "Conversion Missed"}
                        isTry={event.event_name === "Try"}
                        key={index}
                    />
                })}
            </div>
        </TitledCard>
    )
}

type ItemProps = {
    eventName: string,
    timestamp: number,
    isHomeTeamEvent: boolean,
    isBad?: boolean,
    isMiss?: boolean,
    isTry?: boolean
}

function TimelineItem({ eventName, timestamp, isHomeTeamEvent, isBad, isMiss, isTry }: ItemProps) {

    const formatedTimestamp = () => {
        const minutes = Math.floor(timestamp / 60);
        return `'${minutes}`;
    }

    if (eventName === "Half-Time") {
        return (
            <TimelineHeading  >
                <p>Half Time</p>
            </TimelineHeading>
        )
    }

    if (eventName === "Full-Time") {
        return (
            <TimelineHeading  >
                <p>Full Time</p>
            </TimelineHeading>
        )
    }

    const eventLowerCase = eventName.toLowerCase();
    const isYellowCard = eventLowerCase.includes("yellow") && eventLowerCase.includes("card");
    const isRedCard = eventLowerCase.includes("red") && eventLowerCase.includes("card");

    return (
        <div className={twMerge(
            "rounded-xl flex flex-row items-center justify-end gap-2",
            isHomeTeamEvent && "justify-start",

        )} >
            {isHomeTeamEvent && <SecondaryText className="" >{formatedTimestamp()}</SecondaryText>}

            <div className="flex flex-row text-slate-700 dark:text-white items-center gap-1" >

                {isYellowCard && <YellowCard />}
                {isRedCard && <RedCard />}
                {isMiss && <XIcon className="w-4 h-4 text-red-500" />}
                {isTry && <MdSportsRugby className="w-4 h-4" />}
                <p className={twMerge(
                    isBad && "",
                    isYellowCard && "text-yellow-500",
                    isRedCard && "text-red-500",
                )} >{eventName}</p>
            </div>

            {!isHomeTeamEvent && <SecondaryText className="" >{formatedTimestamp()}</SecondaryText>}
        </div>
    )
}

type HeadingProps = {
    children?: ReactNode
}

function TimelineHeading({ children }: HeadingProps) {
    return (
        <div className="flex py-1.5 border my-2 dark:border-slate-700 rounded-xl bg-slate-100 border-slate-300 dark:bg-slate-800/40 flex-row gap-3 items-center justify-center text-slate-700 dark:text-slate-400" >

            {/* <div className="flex-1 border-t  dark:border-slate-400 border-slate-700" /> */}
            {children}
            {/* <div className="flex-1 border-t dark:border-slate-400 border-slate-700" /> */}
        </div>
    )
}

type YellowCardProps = {
    className?: string
}

function YellowCard({className} : YellowCardProps) {
    return (
        <div className={twMerge(
            "bg-yellow-500 w-3 h-4 rounded-sm",
            className
        )} >

        </div>
    )
}

type RedCardProps = {
    className?: string
}

function RedCard({className} : RedCardProps) {
    return (
        <div className={twMerge(
            "bg-red-500 w-3 h-4 rounded-sm",
            className
        )} >

        </div>
    )
}