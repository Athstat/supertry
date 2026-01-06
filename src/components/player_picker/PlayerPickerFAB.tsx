/** Renders a floating action button  */

import { ChevronUp } from "lucide-react";
import PrimaryButton from "../shared/buttons/PrimaryButton";

type Props = {
    onClick?: () => void;
    show?: boolean
}

/** Renders a floating action button for player picker */
export default function PlayerPickerFAB({ onClick, show }: Props) {

    if (!show) {
        return;
    }

    return (
        <div className="fixed p-8 bottom-0 flex flex-row items-center justify-end right-0 w-full" >
            <PrimaryButton
                onClick={onClick}
                className="w-10 h-10 hover:rounded-full transition-all "
            >
                <ChevronUp />
            </PrimaryButton>
        </div>
    )
}
