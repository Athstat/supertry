import { format } from "date-fns"
import { IFixture } from "../../../types/fixtures"

type Props = {
    fixture: IFixture
}

/** Renders the pickem card header */
export default function PickemCardHeader({fixture} : Props) {
    return (
        <div className="w-full items-center justify-center flex flex-col gap-0.5">
            {fixture.competition_name && (
                <p className="text-[10px] text-slate-500 dark:text-slate-500">
                    {fixture.competition_name}
                    {fixture.round !== null ? `, Week ${fixture.round}` : ''}
                </p>
            )}
            {fixture.kickoff_time && (
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {format(fixture.kickoff_time, 'EEE, dd MMM')} • {format(fixture.kickoff_time, 'h:mm a')}
                </p>
            )}
        </div>
    )
}
