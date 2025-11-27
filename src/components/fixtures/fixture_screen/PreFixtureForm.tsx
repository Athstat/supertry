import { useTeamLastNFixtures } from '../../../hooks/teams/useTeamLastNFixtures'
import { IFixture } from '../../../types/games'
import RoundedCard from '../../shared/RoundedCard';
import TeamFormGnatChart from '../../team/TeamFormGnatChart';

type Props = {
    fixture: IFixture
}

export default function PreFixtureForm({ fixture }: Props) {

    const {team, opposition_team} = fixture;
    const {fixtures: homeFixtures, isLoading: loadingHome} = useTeamLastNFixtures(team?.athstat_id);
    const {fixtures: awayFixtures, isLoading: loadingAway} = useTeamLastNFixtures(opposition_team?.athstat_id);

    const isLoading = loadingAway || loadingHome;

    if (isLoading) {
        return (
            <RoundedCard className='w-full h-[200px] border-none animate-pulse' >
            </RoundedCard>
        )
    }

    if (!team || !opposition_team) {
        return null;
    }

    return (
        <RoundedCard
            className='border-none p-4 flex flex-col gap-4'
        >
            <div className='flex flex-row items-center' >
                <p className='font-bold text-sm' >Head to Head Form</p>
            </div>

            <div className='flex flex-col gap-1' >
                <TeamFormGnatChart team={team} fixtures={homeFixtures} />
                <TeamFormGnatChart team={opposition_team} fixtures={awayFixtures} />
            </div>
        </RoundedCard>
    )
}
