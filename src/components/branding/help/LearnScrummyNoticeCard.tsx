import { X } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { BlueInfoCard } from "../../shared/WarningCard"
import { useState } from "react"
import ScrummyGamePlayModal from "./ScrummyGamePlayModal"
import { BadgeInfo } from "lucide-react"

type Props = {
    className?: string
}

/** Renders a notifice to learn the basics of scrummy to a user */
export default function LearnScrummyNoticeCard({ className }: Props) {

    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(prev => !prev);

    return (
        <BlueInfoCard className={twMerge(
            "flex flex-row cursor-pointer items-center gap-2 py-2 px-3 justify-between",
            className
        )} >

            <div className="flex flex-row items-center gap-2" >
                <button><X className="w-4 h-4" /></button>

                <div onClick={toggleModal} >
                    <p className="text-sm" >New to SCRUMMY? Learn how the game works</p>
                </div>
            </div>

            <div onClick={toggleModal} >
                <BadgeInfo className='w-4 h-4' />
            </div>


            <ScrummyGamePlayModal
                isOpen={showModal}
                onClose={toggleModal}
            />

        </BlueInfoCard>
    )

}
