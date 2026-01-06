import { Info, Lock, Trophy } from 'lucide-react'
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup'
import { InfoCard } from '../ui/cards/StatCard';
import { UserCog2 } from 'lucide-react';
import { abbreviateSeasonName } from '../players/compare/PlayerCompareSeasonPicker';
import { Hash } from 'lucide-react';
import PrimaryButton from '../ui/buttons/PrimaryButton';
import { Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toast } from '../ui/Toast';
import { fantasyAnalytics } from '../../services/analytics/fantasyAnalytics';

export default function LeagueInfoTab() {

    const { league, members, rounds } = useFantasyLeagueGroup();
    const commisioner = members.find((m) => {
        return m.user_id === league?.creator_id
    })

    const [message, setMessage] = useState<string>();

    useEffect(() => {
        fantasyAnalytics.trackViewedLeagueInfo();
    }, []);

    const handleCopyEntryCode = () => {

        if (league) {   
            navigator.clipboard.writeText(league.entry_code ?? "");
            setMessage("Entry code was copied to clip board")
        }
    }

    return (
        <div className='flex flex-col gap-4 pb-8' >

            <div className='flex flex-row gap-2 items-center' >
                <Info />
                <p className='font-bold text-lg' >League Info</p>
            </div>

            <div className='grid grid-cols-2 gap-2' >
                <InfoCard
                    label='League Name'
                    value={league?.title}
                    icon={<Info className='w-4 h-4' />}
                />

                <InfoCard
                    label='Commissioner'
                    value={commisioner?.user.username}
                    icon={<UserCog2 className='w-4 h-4' />}
                />

                <InfoCard
                    label='Season'
                    value={league?.season.name ? abbreviateSeasonName(league?.season.name) : "-"}
                    icon={<Trophy className='w-4 h-4' />}
                />

                <InfoCard
                    label='Rounds'
                    value={rounds.length ?? "-"}
                    icon={<Hash className='w-4 h-4' />}
                />

            </div>

            <div className='flex flex-col gap-4' >
                <InfoCard
                    label='Entry Code'
                    value={league?.entry_code ?? "-"}
                    icon={<Lock className='w-4 h-4' />}
                />

                <PrimaryButton onClick={handleCopyEntryCode} >
                    <Copy />
                    Copy Entry Code
                </PrimaryButton>

                <Toast 
                    isVisible={message !== undefined}
                    onClose={() => setMessage(undefined)}
                    message={message ?? ""}
                    type='info'
                />
            </div>

        </div>
    )
}
