import { ChevronRight, Image, Pencil } from 'lucide-react'
import SecondaryText from '../../ui/typography/SecondaryText'
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup'
import RoundedCard from '../../ui/cards/RoundedCard'
import { ShieldUser } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { EditLeagueInfoModal } from './EditLeagueInfoModal'
import { EditLeagueBannerModal } from './EditLeagueBannerModal'
import EditLeagueLogoModal from './EditLeagueLogoModal'
import { useFantasyLeagueScreen } from '../../../hooks/fantasy/useFantasyLeagueScreen'

export default function CommissionerZone() {

    const { authUser } = useAuth();
    const { league } = useFantasyLeagueGroup();

    const isCommissioner = authUser?.kc_id === league?.creator_id;

    const {
        toggleEditBanner, toggleEditLogo, toggleShowEditInfo,
        showEditBanner, showEditInfo, showEditLogo
    } = useFantasyLeagueScreen();

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

            <div className='flex flex-col gap-2 text-sm' >
                <RoundedCard
                    className='py-2 px-4 cursor-pointer flex flex-col gap-1'
                    onClick={toggleShowEditInfo}
                >
                    <div className='flex flex-row items-center gap-2 justify-between' >
                        <div>
                            <div className='flex flex-row items-center gap-2' >
                                <Pencil className='w-4 h-4' />
                                <p>Edit League Info</p>
                            </div>

                            <SecondaryText>Edit your leagues banner</SecondaryText>
                        </div>

                        <div>
                            <ChevronRight />
                        </div>
                    </div>

                </RoundedCard>

                <RoundedCard
                    className='py-2 px-4 cursor-pointer flex flex-col gap-1'
                    onClick={toggleEditBanner}
                >
                    <div className='flex flex-row items-center gap-2 justify-between' >
                        <div>
                            <div className='flex flex-row items-center gap-2' >
                                <Image className='w-4 h-4' />
                                <p>Edit Banner</p>
                            </div>

                            <SecondaryText>Edit your league's banner</SecondaryText>
                        </div>

                        <div>
                            <ChevronRight />
                        </div>
                    </div>

                </RoundedCard>


                <RoundedCard
                    className='py-2 px-4 cursor-pointer flex flex-col gap-1'
                    onClick={toggleEditLogo}
                >
                    <div className='flex flex-row items-center gap-2 justify-between' >
                        <div>
                            <div className='flex flex-row items-center gap-2' >
                                <Image className='w-4 h-4' />
                                <p>Edit League Logo</p>
                            </div>

                            <SecondaryText>Edit your league's logo</SecondaryText>
                        </div>

                        <div>
                            <ChevronRight />
                        </div>
                    </div>

                </RoundedCard>
            </div>


            <EditLeagueInfoModal
                isOpen={showEditInfo}
                onClose={toggleShowEditInfo}
            />

            <EditLeagueBannerModal 
                isOpen={showEditBanner}
                onClose={toggleEditBanner} 
            />

            <EditLeagueLogoModal 
                isOpen={showEditLogo}
                onClose={toggleEditLogo}
            />
        </div>
    )
}





