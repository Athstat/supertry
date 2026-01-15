import { ChevronRight, Pencil, X } from 'lucide-react'
import LeagueVisibilityInput from '../../fantasy-leagues/create_league_modal/LeagueVisibilityInput'
import PrimaryButton from '../../ui/buttons/PrimaryButton'
import { ErrorState } from '../../ui/ErrorState'
import InputField, { TextField } from '../../ui/forms/InputField'
import SecondaryText from '../../ui/typography/SecondaryText'
import { useState } from 'react'
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup'
import { fantasyLeagueGroupsService } from '../../../services/fantasy/fantasyLeagueGroupsService'
import { logger } from '../../../services/logger'
import { useInView } from 'react-intersection-observer'
import BottomSheetView from '../../ui/modals/BottomSheetView'
import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups'
import CircleButton from '../../ui/buttons/BackButton'
import RoundedCard from '../../ui/cards/RoundedCard'
import { ShieldUser } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { EditLeagueBannerModal } from './EditLeagueBannerModal'
import { Image } from 'lucide-react'
import { EditLeagueInfoModal } from './EditLeagueInfoModal'

export default function CommissionerZone() {

    const { authUser } = useAuth();
    const { league } = useFantasyLeagueGroup();

    const isCommissioner = authUser?.kc_id === league?.creator_id;

    const [showEditInfo, setShowEditInfo] = useState(false);
    const [showEditBanner, setShowEditBanner] = useState(false);
    const toggleShowEditInfo = () => setShowEditInfo(prev => !prev);
    const toggleEditBanner = () => setShowEditBanner(prev => !prev);

    if (!isCommissioner) {
        return;
    }

    return (
        <div className='flex flex-col gap-2' >

            <div className='flex flex-col gap-2' >
                <div className='flex flex-row items-center justify-between' >
                    <div className="flex flex-row items-center gap-2" >
                        <ShieldUser className='w-6 h-6' />
                        <p className="font-bold" >Commissioner Zone</p>
                    </div>

                </div>

                <div>
                    <SecondaryText>Customize your fantasy league.</SecondaryText>
                </div>
            </div>

            <div className='flex flex-col gap-2' >
                <RoundedCard
                    className='py-2 px-4 cursor-pointer flex flex-col gap-1'
                    onClick={toggleShowEditInfo}
                >
                    <div className='flex flex-row items-center gap-2 justify-between' >
                        <div className='flex flex-row items-center gap-2' >
                            <Pencil className='w-4 h-4' />
                            <p>Edit League info</p>
                        </div>

                        <div>
                            <ChevronRight />
                        </div>
                    </div>

                    <SecondaryText>Edit your leagues name, description and visibility</SecondaryText>
                </RoundedCard>

                <RoundedCard
                    className='py-2 px-4 cursor-pointer flex flex-col gap-1'
                    onClick={toggleEditBanner}
                >
                    <div className='flex flex-row items-center gap-2 justify-between' >
                        <div className='flex flex-row items-center gap-2' >
                            <Image className='w-4 h-4' />
                            <p>Edit Banner</p>
                        </div>

                        <div>
                            <ChevronRight />
                        </div>
                    </div>

                    <SecondaryText>Edit your leagues banner</SecondaryText>
                </RoundedCard>
            </div>

            <EditLeagueInfoModal
                isOpen={showEditInfo}
                onClose={toggleShowEditInfo}
            />

            <EditLeagueBannerModal isOpen={showEditBanner} onClose={toggleEditBanner} />
        </div>
    )
}





