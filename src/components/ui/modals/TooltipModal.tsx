import { X } from "lucide-react";
import CircleButton from "../buttons/BackButton";
import BottomSheetView from "./BottomSheetView";
import SecondaryText from "../typography/SecondaryText";
import { useTooltip } from "../../../hooks/ui/useTooltip";

/** Renders a tooltip modal */
export default function TooltipModal() {

    const { data, closeTooltipModal, isTooltipModalOpen } = useTooltip();

    const handleClose = () => {
        closeTooltipModal();
    }

    if (!isTooltipModalOpen) {
        return;
    }

    return (
        <div className="fixed top-0 bottom-0 z-[300]" >
            <BottomSheetView
                hideHandle
                className="p-4 min-h-[160px] flex flex-col gap-4"
                onClickOutside={handleClose}
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
