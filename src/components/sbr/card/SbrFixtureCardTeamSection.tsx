import SbrTeamLogo from '../fixtures/SbrTeamLogo'
import { ISbrFixture } from '../../../types/sbr'
import { twMerge } from 'tailwind-merge'

type Props = {
    showLogos?: boolean,
    fixture: ISbrFixture,
    isAwayTeam?: boolean
}

/** Renders an SbrFixtureTeamAndLogo section*/
export default function SbrFixtureCardTeamSection({ showLogos, fixture, isAwayTeam }: Props) {

    const { home_score, away_score } = fixture;
    const gameCompleted = fixture.status === 'completed';

    const teamName = isAwayTeam ? fixture.away_team.team_name:  fixture.home_team.team_name;
    const teamScore = isAwayTeam ? away_score : home_score;

    return (
        <div className={twMerge(
            "flex-1 flex gap-2 flex-col items-center justify-start",
            isAwayTeam && "justify-end"
        )}>
            {showLogos && (
                <SbrTeamLogo
                    className="w-10 h-10 lg:w-10 lg:h-10"
                    teamName={teamName}
                />
            )}

            <p className="text-[10px] md:text-xs lg-text-sm truncate text-wrap text-center">
                {teamName}
            </p>

            <p className="text-slate-700 text-xs dark:text-slate-400">
                {gameCompleted && teamScore !== undefined ? teamScore : '-'}
            </p>
        </div>
    )
}
