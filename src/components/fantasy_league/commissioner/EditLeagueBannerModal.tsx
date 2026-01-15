import { X } from "lucide-react";
import CircleButton from "../../ui/buttons/BackButton";
import BottomSheetView from "../../ui/modals/BottomSheetView";

type EditLeagueBannerProps = {
    isOpen?: boolean,
    onClose?: () => void
}

export function EditLeagueBannerModal({isOpen, onClose} : EditLeagueBannerProps) {
    
    if (!isOpen) {
        return null;
    }

    return (
        <BottomSheetView
            hideHandle
            className='max-h-[60vh] p-4'
        >
            <div className='flex flex-row items-center gap-2 justify-between' >
                <p className='font-semibold text-lg' >Edit Banner</p>

                <div>
                    <CircleButton>
                        <X />
                    </CircleButton>
                </div>
            </div>
        </BottomSheetView>
    )
}