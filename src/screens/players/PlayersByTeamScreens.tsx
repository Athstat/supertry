import { ArrowLeft, ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import CircleButton from "../../components/shared/buttons/BackButton";
import RoundedCard from "../../components/shared/RoundedCard";
import { AppColours } from "../../types/constants";
import PageView from "../PageView";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useProTeam } from "../../hooks/teams/useProTeam";
import TeamLogo from "../../components/team/TeamLogo";
import { useSupportedAthletes } from "../../hooks/athletes/useSupportedAthletes";
import PlayersList from "../../components/players/PlayersList";
import PlayersTeamsSheet from "../../components/players/teams/PlayersTeamsSheet";
import { useHideTopNavBar } from "../../hooks/navigation/useNavigationBars";


/** Renders a page for players by team screen */
export default function PlayersByTeamScreens() {

    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();

    useHideTopNavBar();

    const { team, isLoading: loadingTeam } = useProTeam(teamId);
    const { athletes, isLoading: loadingAthletes } = useSupportedAthletes();

    const [showModal, setShowModal] = useState(false);
    const toggle = () => setShowModal(prev => !prev);

    const teamAthletes = useMemo(() => {
        return [...athletes].filter((a) => {
            return a.team?.athstat_id === team?.athstat_id;
        })
    }, [team, athletes]);


    const handleBack = () => {
        navigate('/players');
    }

    const isLoading = loadingTeam || loadingAthletes;

    if (isLoading) {
        return (
            <LoadingSkeleton />
        )
    }

    return (
        <PageView className="py-4" >
            <div className={twMerge(
                'flex sticky w-full p-2 top-0 z-[10] left-0 flex-row items-center justify-between',
                AppColours.BACKGROUND
            )} >
                <div className='flex flex-row items-center gap-2' >
                    <CircleButton
                        onClick={handleBack}
                    >
                        <ArrowLeft />
                    </CircleButton>
                    <p className='font-bold' >Players By Team</p>
                </div>

                <div>
                    <RoundedCard
                        onClick={toggle}
                        className='w-fit py-2 cursor-pointer px-3 rounded-md flex flex-row items-center gap-2'
                    >
                        <TeamLogo
                            url={team?.image_url}
                            className="w-5 h-5"
                        />

                        <p className='text-sm' >{team?.athstat_name}</p>
                        <ChevronDown className='w-4 h-4' />
                    </RoundedCard>
                </div>
            </div>


            <PlayersList
                players={teamAthletes}
            />

            {showModal && <PlayersTeamsSheet 
                isOpen={showModal}
                onClose={toggle}
                onSuccess={() => setShowModal(false)}
            />}
        </PageView>
    )
}


function LoadingSkeleton() {
    return (
        <PageView>
            <div className={twMerge(
                'flex sticky w-full p-2 top-0 z-[10] left-0 flex-row items-center justify-between',
                AppColours.BACKGROUND
            )} >
                <div className='flex flex-row items-center gap-2' >
                    <CircleButton
                    >
                        <ArrowLeft />
                    </CircleButton>
                    <p className='font-bold' >Players By Team</p>
                </div>

                <div>
                    <RoundedCard
                        className='h-[35px] w-[100px] animate-pulse cursor-pointer px-3 rounded-md flex flex-row items-center gap-2'
                    >
                    </RoundedCard>
                </div>
            </div>

            <div className="px-4 flex flex-col gap-4" >
                <RoundedCard className="w-full mt-4 h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full mt-4 h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[40px] animate-pulse border-none" />
            </div>
        </PageView>
    )
}