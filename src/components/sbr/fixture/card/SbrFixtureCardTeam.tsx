import { ISbrFixture } from '../../../../types/sbr'
import SbrTeamLogo from '../../fixtures/SbrTeamLogo'

type Props = {
    fixture: ISbrFixture,
    showLogos?: boolean,
    isHome?: boolean
}

/** Renders a single team on the sbr fixture card */
export default function SbrFixtureCardTeam({fixture, showLogos, isHome = true} : Props) {
    
    const team = isHome ? fixture.home_team : fixture.away_team;
    const teamScore = isHome ? fixture.home_score : fixture.away_score;
    const showScore = fixture.status === "completed";
    
    return (
        <div className="flex-1 flex gap-2 flex-col items-center justify-start">
            
            {showLogos && (
                <SbrTeamLogo
                    className="w-10 h-10 lg:w-10 lg:h-10"
                    teamName={team.team_name}
                />
            )}

            <p className="text-[10px] md:text-xs lg-text-sm truncate text-wrap text-center">
                {team.team_name}
            </p>

            {showScore && <p className="text-slate-700 text-xs dark:text-slate-400">
                {teamScore || '-'}
            </p>}
            
        </div>
    )
}
