import { twMerge } from "tailwind-merge"
import BottomSheetView from "../../ui/BottomSheetView"
import { lighterDarkBlueCN } from "../../../types/constants"
import CircleButton from "../../ui/buttons/BackButton"
import { X } from "lucide-react"
import PositionCard from "./PositionCard"
import { PositionClass } from "../../../types/athletes"
import { formatPosition } from "../../../utils/athleteUtils"
import { useNavigate, useParams } from "react-router-dom"

type Props = {
    isOpen?: boolean,
    onClose?: () => void
}


/** Renders a players position bottom sheet */
export default function PlayersPositionsSheet({ isOpen, onClose }: Props) {

    const navigate = useNavigate();
    const {positionClass: current} = useParams();
    
    const positionClasses: PositionClass[] = [
        'front-row',
        'second-row',
        'back-row',
        'half-back',
        'back'
    ]

    const onClickPosition = (positionClass: PositionClass) => {
        navigate(`/players/position-class/${positionClass}`);
        
        if (onClose) {
            onClose();
        }
    }

    if (!isOpen) {
        return null;
    }

    return (
        <BottomSheetView
            hideHandle
            className={twMerge(
                "min-h-[50vh] p-4 max-h-[70vh]",
                lighterDarkBlueCN
            )}
        >
            <div className="flex flex-row items-center justify-between" >
                <p className="font-bold" >Position Classes ({positionClasses.length})</p>
                <CircleButton
                    onClick={onClose}
                >
                    <X />
                </CircleButton>
            </div>

            <div className="flex flex-col gap-2" >
                {positionClasses.map((p) => {
                    return (
                        <PositionCard 
                            positionClass={p}
                            title={formatPosition(p)}
                            onClick={onClickPosition}
                            className={twMerge(
                                "dark:bg-slate-700/40",
                                p === current && "bg-blue-500 hover:bg-blue-600 hover:dark:bg-blue-600 dark:bg-blue-500 text-white"
                            )}
                        />
                    )
                })}
            </div>
        </BottomSheetView>
    )
}
