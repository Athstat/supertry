import React from 'react'
import useSWR from 'swr'
import { sbrService } from '../../services/sbrService';
import { LoadingState } from '../ui/LoadingState';
import SbrFixtureCard from '../sbr/SbrFixtureCard';

export default function SbrMatchCenter() {

    const key = 'sbr-fixtures';
    let {data: fixtures, isLoading} = useSWR(key, () => sbrService.getAllFixtures());

    if (isLoading) {
        return <LoadingState />
    }

    fixtures = fixtures ?? [];

    return (
        <div className='flex flex-col gap-2' >
            <h1 className='font-bold text-lg' >Sbr Games</h1>

            <div>
                {fixtures.map((fixture, index) => {
                    return <SbrFixtureCard 
                        fixture={fixture}
                        key={index}
                    />
                })}
            </div>
        </div>
    )
}
