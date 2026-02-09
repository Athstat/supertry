import useSWR from "swr";
import { GameKeyEvent, IFixture } from "../../../../types/games"
import { gamesService } from "../../../../services/gamesService";
import RoundedCard from "../../../ui/cards/RoundedCard";
import { twMerge } from "tailwind-merge";
import SecondaryText from "../../../ui/typography/SecondaryText";
import { getGameKeyEventName, getPeriodMarkerName } from "../../../../utils/fixtureUtils";
import WhistleIcon from "../../../ui/icons/WhistleIcon";
import { MdSportsRugby } from "react-icons/md";
import RugbyGoalPostIcon from "../../../ui/icons/RugbyGoalPostIcon";

type Props = {
    fixture: IFixture
}

/** Renders a fixture key events card */
export default function FixtureKeyEventsCard({ fixture }: Props) {
    const key = `/fixtures/${fixture.game_id}/key-events`;
    const { data, isLoading } = useSWR(key, () => gamesService.getKeyEvents(fixture.game_id));

    const events = [...(data || [])].sort((a, b) => {
        return ((b.time * 60) + b.secs) - ((a.time * 60) + a.secs);
    });

    if (events.length === 0) {
        return null;
    }

    if (isLoading) {
        return (
            <RoundedCard className="w-full h-[100px] rounded-md" />
        )
    }

    return (
        <RoundedCard className="p-4 flex flex-col gap-2 " >

            <div className="flex flex-col gap-1" >
                {events.map((e) => {
                    return (
                        <EventCard
                            event={e}
                            fixture={fixture}
                        />
                    )
                })}
            </div>
        </RoundedCard>
    )
}

type EventCardProps = {
    event: GameKeyEvent,
    fixture: IFixture,
}

function EventCard({ event, fixture }: EventCardProps) {

    const isHome = event.team_id === fixture.team?.athstat_id;
    const actionName = getGameKeyEventName(event.action);

    if (['END', 'START'].includes(event.action)) {
        return (
            <GamePeriodMarker event={event} fixture={fixture} />
        )
    }

    return (
        <div className={twMerge(
            "w-full flex flex-row items-center justify-start",
            !isHome && "justify-end"
        )} >
            <div className="flex flex-row items-center gap-2" >
                {isHome && <p className="text-sm font-extrabold" >{event.time}'</p>}
                {isHome && <EventIcon event={event} />}

                {!isHome && <SecondaryText className="text-xs text-slate-400" >{actionName}</SecondaryText>}
                <p className="text-sm" >{event.athlete?.player_name}</p>
                {isHome && <SecondaryText className="text-xs text-slate-400" >{actionName}</SecondaryText>}

                {!isHome && <p className="text-sm font-extrabold" >{event.time}'</p>}
                {!isHome && <EventIcon event={event} />}
            </div>
        </div>
    )
}

function GamePeriodMarker({ event }: EventCardProps) {

    const periodMarkerName = getPeriodMarkerName(event);

    if (!periodMarkerName) {
        return null;
    }

    return (
        <div className="flex flex-row items-center justify-center gap-2 py-2" >
            <div className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full flex flex-row items-center gap-2" >
                <SecondaryText className="text-nowrap min-w-fit dark:text-slate-200" >{periodMarkerName}</SecondaryText>
                <WhistleIcon className="fill-slate-400 dark:fill-slate-200" />
            </div>
            {/* <div className="w-full h-[1px] bg-slate-200 " ></div> */}
        </div>
    )
}

type EventIconProps = {
    event: GameKeyEvent
}

function EventIcon({ event }: EventIconProps) {

    if (event.action === "YELC") {
        return (
            <div className="w-3 h-4 rounded-[1px] bg-yellow-500" ></div>
        )
    }

    if (event.action === "TRY") {
        return (
            <MdSportsRugby />
        )
    }

    if (["CONV", "PENK"].includes(event.action)) {
        return (
            <RugbyGoalPostIcon className=" stroke-black dark:stroke-white" />
        )
    }

    return (
        <div></div>
    )
}