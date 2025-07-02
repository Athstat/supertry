import useSWR from 'swr'
import { sbrService } from '../../services/sbrService';
import { LoadingState } from '../ui/LoadingState';
import SbrFixtureCard from '../sbr/SbrFixtureCard';
import MatchSeasonFilterBar from './MatcheSeasonFilterBar';
import { useQueryState } from '../../hooks/useQueryState';
import { SeasonFilterBarItem } from '../../types/games';
import { ArrowRight } from 'lucide-react';

export default function SbrMatchCenter() {

    const key = 'sbr-fixtures';
    let { data: fixtures, isLoading } = useSWR(key, () => sbrService.getAllFixtures());
    const [season, setSeason] = useQueryState('sbrcs', { init: 'all' });

    if (isLoading) {
        return <LoadingState />
    }

    fixtures = fixtures ?? [];
    const seasons: SeasonFilterBarItem[] = [];

    fixtures.forEach((f) => {
        if (f.season && !seasons.some(s => s.id === f.season)) {
            seasons.push({ name: f.season, id: f.season });
        }
    })

    const filteredFixtures = fixtures.filter((f) => {
        if (!season || season === 'all') {
            return true;
        }

        return f.season === season;
    });

    const upcomingFixtures = fixtures.filter((f) => {
        const kickoff = f.kickoff_time ? new Date(f.kickoff_time) : undefined;

        if (kickoff) {
            const now = (new Date()).valueOf();
            return kickoff.valueOf() > now;
        }

        return false;
    })

    return (
        <div className='flex flex-col gap-4' >
            <h1 className='font-bold text-lg' >Sbr Games</h1>

            <MatchSeasonFilterBar
                seasons={seasons}
                onChange={setSeason}
                value={season}
            />

            <div className='flex flex-col gap-4' >
                <div className='flex flex-row items-center justify-between' >
                    <p className='font-semibold text-lg' >Upcoming Fixtures</p>
                    <ArrowRight />
                </div>

                <div className='flex flex-row gap-2 max-h-62 overflow-y-hidden overflow-x-auto ' >
                    {upcomingFixtures.map((fixture, index) => {
                        return <SbrFixtureCard
                            fixture={fixture}
                            key={index}
                            showLogos
                            className='min-w-[350px] max-h-[270px]'
                        />
                    })}
                </div>

            </div>


        </div>
    )
}
