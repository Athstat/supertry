import { ArrowLeft, ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import CircleButton from "../../components/shared/buttons/BackButton";
import RoundedCard from "../../components/shared/RoundedCard";
import { AppColours } from "../../types/constants";
import PageView from "../PageView";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";


/** Renders a page for players by team screen */
export default function PlayersByTeamScreens() {

    const {teamId} = useParams();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const toggle = () => setShowModal(prev => !prev);

    const handleBack = () => {
        navigate('/players');
    }

    return (
        <PageView>
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
                        <p className='text-sm' >{teamId}</p>
                        <ChevronDown className='w-4 h-4' />
                    </RoundedCard>
                </div>
            </div>
        </PageView>
    )
}
