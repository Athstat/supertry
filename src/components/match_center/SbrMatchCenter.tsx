import useSWR from 'swr'
import { sbrService } from '../../services/sbrService';
import { LoadingState } from '../ui/LoadingState';
import SbrFixtureCard from '../sbr/SbrFixtureCard';
import MatchSeasonFilterBar from './MatcheSeasonFilterBar';
import { useQueryState } from '../../hooks/useQueryState';
import { SeasonFilterBarItem } from '../../types/games';

export default function SbrMatchCenter() {

    const key = 'sbr-fixtures';
    let { data: fixtures, isLoading } = useSWR(key, () => sbrService.getAllFixtures());
    const [season, setSeason] = useQueryState('sbrcs', {init: 'all'});

    if (isLoading) {
        return <LoadingState />
    }

    fixtures = fixtures ?? [];
    const seasons: SeasonFilterBarItem[] = [];
    
    fixtures.forEach((f) => {
        if (f.season && !seasons.some(s => s.id === f.season)) {
            seasons.push({name: f.season, id: f.season});
        }
    })

    return (
        <div className='flex flex-col gap-4' >
            <h1 className='font-bold text-lg' >Sbr Games</h1>

            <MatchSeasonFilterBar
                seasons={seasons}
                onChange={setSeason}
                value={season}
            />

            <div className='flex flex-col gap-2' >
                {fixtures.map((fixture, index) => {
                    return <SbrFixtureCard
                        fixture={fixture}
                        key={index}
                        showLogos
                    />
                })}
            </div>
        </div>
    )
}
