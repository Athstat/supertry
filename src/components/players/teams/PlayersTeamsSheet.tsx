import { Activity } from "react"
import PlayersTeamsGridList from "./PlayersTeamsGridList"
import CircleButton from "../../ui/buttons/BackButton"
import { X } from "lucide-react"
import BottomSheetView from "../../ui/modals/BottomSheetView"

type Props = {
    isOpen?: boolean,
    onClose?: () => void,
    onSuccess?: () => void
}

/** Renders a bottom sheet of player teams */
export default function PlayersTeamsSheet({ isOpen, onClose, onSuccess }: Props) {
    
    return (
        <Activity mode={isOpen ? "visible" : "hidden"} >
            <BottomSheetView
                hideHandle
                className="p-4 min-h-[700px]"
            >

                <div className="flex flex-row items-center justify-between" >

                    <div>
                        <p className="font-semibold text-md" >Teams</p>
                    </div>

                    <div>
                        <CircleButton
                            onClick={onClose}
                        >
                            <X />
                        </CircleButton>
                    </div>

                </div>

                <PlayersTeamsGridList onSuccess={onSuccess} />

            </BottomSheetView>
        </Activity>
    )
}
