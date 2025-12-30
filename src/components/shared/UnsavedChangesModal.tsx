import { TriangleAlert } from "lucide-react"
import DialogModal from "./DialogModal"
import SecondaryText from "./SecondaryText"
import WarningCard from "./WarningCard"
import PrimaryButton, { TranslucentButton } from "./buttons/PrimaryButton"

type Props = {
    onDiscard?: () => void,
    onCancel?: () => void,
    message?: string,
    title?: string,
    isOpen?: boolean
}

/** Renders a modal that shows up when the user has unsaved changes */
export default function UnsavedChangesWarningModal({ message, title, onDiscard, onCancel, isOpen }: Props) {
    return (
        <DialogModal
            open={isOpen}
            hideCloseButton
            title={title || "Unsaved Changes"}
            outerCon=""
            className="flex flex-col gap-6"
        >

            <div className="flex flex-row gap-2 items-center" >
                <WarningCard className="h-[50px]">
                    <TriangleAlert />
                </WarningCard>

                <div className="h-full items-center justify-center flex flex-col" >
                    <SecondaryText className="text-sm">{message}</SecondaryText>
                </div>
            </div>

            <div className="flex flex-col items-center justify-end gap-2" >
                <TranslucentButton
                    onClick={onCancel}
                    className="text-slate-800 border-slate-300"
                >
                    Cancle
                </TranslucentButton>

                <PrimaryButton
                    onClick={onDiscard}
                    destroy
                    className=""
                >
                    Discard
                </PrimaryButton>
            </div>

        </DialogModal>
    )
}
