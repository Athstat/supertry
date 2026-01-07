import { X } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { BlueInfoCard } from "../../ui/cards/WarningCard"
import { useState } from "react"
import ScrummyGamePlayModal from "./ScrummyGamePlayModal"
import { BadgeInfo } from "lucide-react"
import { useLocalStorage } from "../../../hooks/web/useLocalStorage"
import { GrCircleQuestion } from "react-icons/gr"

type Props = {
    className?: string,
    iconHw?: string
}

/** Renders a notifice to learn the basics of scrummy to a user */
export default function LearnScrummyNoticeCard({ className }: Props) {

    const [hasSeen, setHasSeen] = useLocalStorage('used_game_play_help', 'false');

    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(prev => !prev);

    if (hasSeen && hasSeen.toString().toUpperCase() === 'TRUE') {
        return;
    }

    const handleOnClose = () => {
        toggleModal();
        setHasSeen('true');
    }

    const handleIgnoreMessage = () => {
        setHasSeen('true');
    }

    return (
        <BlueInfoCard className={twMerge(
            "flex flex-row cursor-pointer items-center gap-2 py-2 px-3 justify-between",
            className
        )} >

            <div className="flex flex-row items-center gap-2" >
                <button onClick={handleIgnoreMessage} >
                    <X className="w-4 h-4" />
                </button>

                <div onClick={toggleModal} >
                    <p className="text-sm" >New to SCRUMMY? Learn how the game works</p>
                </div>
            </div>

            <div onClick={toggleModal} >
                <BadgeInfo className='w-4 h-4' />
            </div>


            <ScrummyGamePlayModal
                isOpen={showModal}
                onClose={handleOnClose}
            />

        </BlueInfoCard>
    )

}


export function GamePlayHelpButton({ className, iconHw }: Props) {


    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(prev => !prev);

    const handleOnClose = () => {
        toggleModal();
    }

    return (
        <div className={twMerge(
            className
        )} >

            <button onClick={toggleModal} >
                <GrCircleQuestion className={twMerge(
                    'w-6 h-6',
                    iconHw
                )} />
            </button>


            <ScrummyGamePlayModal
                isOpen={showModal}
                onClose={handleOnClose}
            />

        </div>
    )

}