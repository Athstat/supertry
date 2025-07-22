
import { IProAthlete } from '../../../types/athletes'
import { X, User, Coins, ChevronLeft } from 'lucide-react'
import { formatPosition } from '../../../utils/athleteUtils'
import { PlayerGameCard } from '../../player/PlayerGameCard'
import { useAtom } from 'jotai'
import { comparePlayersAtom, showComparePlayerInfo } from '../../../state/comparePlayers.atoms'
import Collapsable from '../../shared/containers/Collapsable'
import SecondaryText from '../../shared/SecondaryText'
import TeamLogo from '../../team/TeamLogo'
import { calculateAge } from '../../../utils/playerUtils'
import { getCountryEmojiFlag } from '../../../utils/svrUtils'
import { twMerge } from 'tailwind-merge'
import { useCallback } from 'react'

type Props = {
    player: IProAthlete,
    onRemove?: () => void
}

export default function PlayerCompareItemHeader({ player, onRemove }: Props) {

    const [showInfo, setShowInfo] = useAtom(showComparePlayerInfo);
    const toggleShowInfo = () => setShowInfo(!showInfo);

    const [comparePlayers, setComparePlayers] = useAtom(comparePlayersAtom);

    const moveLeft = useCallback(() => {
        const myIndex = comparePlayers.findIndex(a => a.tracking_id === player.tracking_id);

        if (myIndex === -1) {
            return;
        }

        if (myIndex === 0) {
            return;
        }

        const newArr = [...comparePlayers];
        newArr.splice(myIndex, 1);

        newArr.splice(myIndex - 1, 0, player);

        setComparePlayers(newArr);

    }, [comparePlayers]);

    return (
        <div className='flex flex-col gap-2' >
            <div className={twMerge(
                "flex flex-row bg-slate-100 dark:bg-slate-700/50 items-center justify-between p-1 rounded-lg",
                "border border-slate-200 dark:border-slate-600"
            )}>

                <div className='flex flex-row items-center' >
                    <button 
                        onClick={moveLeft}
                        className="flex w-fit text-sm p-1 rounded-md hover:bg-slate-100 hover:dark:bg-slate-600 text-slate-700 dark:text-white cursor-pointer items-center"
                    >
                        <ChevronLeft className='w-4 h-4' />
                    </button>
                </div>

                <button>
                    <button
                        onClick={onRemove}
                        className="flex w-fit text-sm p-1 rounded-md hover:bg-slate-100 hover:dark:bg-slate-600 text-slate-700 dark:text-white cursor-pointer items-center"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </button>
            </div>

            <PlayerGameCard className="h-[200px] lg:h-[250px]" blockGlow player={player} />

            <Collapsable
                label='Info'
                open={showInfo}
                toggle={toggleShowInfo}
                icon={<User className='w-4 h-4' />}
            >
                <div className='flex flex-col text-sm p-1 divide-y gap-2 divide-slate-100 dark:divide-slate-700' >
                    <div>
                        <SecondaryText className='text-xs' >Name</SecondaryText>
                        <p className='text-xs lg:text-sm truncate' >{player.player_name}</p>
                    </div>

                    <div>
                        <SecondaryText className='text-xs' >Team</SecondaryText>
                        <div className='flex flex-row gap-1 items-center' >
                            <TeamLogo
                                teamName={player.team.athstat_name}
                                url={player.team.image_url}
                                className='w-4 h-4'
                            />
                            <p className='text-xs lg:text-sm truncate' >{player.team.athstat_name}</p>
                        </div>
                    </div>

                    <div>
                        <SecondaryText className='text-xs' >Age</SecondaryText>
                        <p className='text-xs lg:text-sm truncate' >{player.date_of_birth ? calculateAge(player.date_of_birth) : '-'}</p>
                    </div>

                    <div>
                        <SecondaryText className='text-xs' >Price</SecondaryText>
                        <div className='flex flex-row gap-1 items-center' >
                            <Coins className='w-4 h-4 text-yellow-500' />
                            <p className='text-xs lg:text-sm truncate' >{player.price}</p>
                        </div>
                    </div>

                    <div>
                        <SecondaryText className='text-xs' >Nationality</SecondaryText>
                        <p className='text-xs lg:text-sm truncate' >{getCountryEmojiFlag(player.nationality)} {player.nationality}</p>
                    </div>

                    <div>
                        <SecondaryText className='text-xs' >Position</SecondaryText>
                        <p className='text-xs lg:text-sm truncate' >{player.position ? formatPosition(player.position) : '-'}</p>
                    </div>

                    <div>
                        <SecondaryText className='text-xs' >Position Class</SecondaryText>
                        <p className='text-xs lg:text-sm truncate' >{player.position_class ? formatPosition(player.position_class) : '-'}</p>
                    </div>
                </div>
            </Collapsable>
        </div>
    )
}
