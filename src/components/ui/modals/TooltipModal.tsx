import { X } from "lucide-react";
import CircleButton from "../buttons/BackButton";
import BottomSheetView from "./BottomSheetView";
import SecondaryText from "../typography/SecondaryText";
import { useTooltip } from "../../../hooks/ui/useTooltip";

/** Renders a tooltip modal */
export default function TooltipModal() {

    const {data, closeTooltipModal, isTooltipModalOpen} = useTooltip();

    const handleClose = () => {
        closeTooltipModal();
    }

    if (!isTooltipModalOpen) {
        return;
    }

    return (
        <div className="z-[200] bg-black/50 top-0 left-0 fixed w-full h-full flex flex-col" >
            {/* <div className="bg-red-500 h-full flex-1" >

            </div> */}
            <BottomSheetView
                hideHandle
                className="p-4 min-h-[120px]"
            >
                <div className="flex flex-row items-center justify-between" >
                    <p className="font-bold text-lg" >{data?.title || "Tooltip"}</p>

                    <div>
                        <CircleButton
                            onClick={handleClose}
                        >
                            <X />
                        </CircleButton>
                    </div>
                </div>

                <div>
                    <SecondaryText className="text-base" >
                        {data?.description}
                    </SecondaryText>
                </div>
            </BottomSheetView>
        </div>
    )
}
