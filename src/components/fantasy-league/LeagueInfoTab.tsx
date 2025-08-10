import { Info, Trophy, User } from 'lucide-react'
import SecondaryText from '../shared/SecondaryText'
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup'

export default function LeagueInfoTab() {

    const { league, members, rounds } = useFantasyLeagueGroup();
    const commisioner = members.find((m) => {
        return m.user_id === league?.creator_id
    })

    return (
        <div className='flex flex-col gap-4' >
            <div className='flex flex-row gap-2 items-center' >
                <Info />
                <p className='font-bold text-lg' >League Info</p>
            </div>

            <div>
                <SecondaryText>League Name</SecondaryText>
                <p>{league?.title}</p>
            </div>

            <div>
                <SecondaryText>Commisioner</SecondaryText>
                <div className='flex flex-row items-center gap-2' >
                    <User className='w-4 h-4' />
                    <p>{commisioner?.user.username}</p>
                </div>
            </div>

            <div>
                <SecondaryText>Season</SecondaryText>
                <div className='flex flex-row items-center gap-2' >
                    <Trophy className='w-4 h-4' />
                    <p>{league?.season.name}</p>
                </div>
            </div>

            <div>
                <SecondaryText>Rounds</SecondaryText>
                <div className='flex flex-row items-center gap-2' >
                    <p>{rounds.length ?? "-"}</p>
                </div>
            </div>

            <div>
                <SecondaryText>Entry Code</SecondaryText>
                <div className='flex flex-row items-center gap-2' >
                    <p>{league?.entry_code ?? "-"}</p>
                </div>
            </div>

        </div>
    )
}
