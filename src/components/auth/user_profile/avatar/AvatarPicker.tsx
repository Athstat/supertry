import { X } from "lucide-react";
import { DefaultImage } from "../../../../types/ui";
import CircleButton from "../../../ui/buttons/BackButton";
import BottomSheetView from "../../../ui/modals/BottomSheetView";
import PrimaryButton from "../../../ui/buttons/PrimaryButton";
import useSWR from "swr";
import { defaultImageService } from "../../../../services/ui/defaultImageService";
import RoundedCard from "../../../ui/cards/RoundedCard";
import UserAvatarCard from "./UserAvatarCard";
import { twMerge } from "tailwind-merge";
import { AppColours } from "../../../../types/constants";

type Props = {
    isOpen?: boolean,
    onClose?: () => void,

    /** Image Url of the selected avatar image url */
    value?: string,

    onChange?: (avatar: DefaultImage) => void,
    onConfirm?: () => void
}

/** Renders a user avatar picker */
export default function AvatarPicker({ isOpen, value, onClose, onChange }: Props) {

    const key = isOpen ? `/images/default/avatars` : null;
    const { data, isLoading } = useSWR(key, () => defaultImageService.getLibraryImages('avatars'));

    const images = [...(data || [])].filter((i) => i.title !== 'default');
    const selectedImage = images.find((i) => i.image === value);

    const handleChange = (defaultImage: DefaultImage) => {
        if (onChange) {
            onChange(defaultImage);
        }
    }

    if (!isOpen) {
        return;
    }

    if (isLoading) {
        return (
            <LoadingSkeleton onClose={onClose} />
        )
    }


    return (
        <BottomSheetView
            hideHandle
            showTopBorder
            className="px-4 pt-5 max-h-[90vh] min-h-[90vh] flex flex-col gap-6 items-center"
            onClickOutside={onClose}
        >

            <div className="flex flex-row items-center justify-between w-full" >
                <div className="flex flex-row items-center gap-2" >
                    <p className="dark:text-white text-xl font-bold" >Select an Avatar</p>
                </div>

                <div>
                    <CircleButton onClick={onClose} >
                        <X />
                    </CircleButton>
                </div>
            </div>

            <div className="flex flex-row items-center gap-4 flex-wrap pb-20 overflow-y-scroll justify-start w-fit" >

                {images.map((i) => {
                    return (
                        <UserAvatarCard
                            imageUrl={i.image}
                            
                            className={twMerge(
                                "hover:-rotate-12 transition-all ease-in delay-100",
                                selectedImage?.image === i.image && 'border border-blue-600 animate-glow'
                            )}

                            onClick={() => handleChange(i)}
                        />
                    )
                })}
            </div>

            <div className="absolute bottom-0 left-0 w-full" >
                <div className="w-full flex flex-col relative items-center justify-center h-[150px]" >
                    <PrimaryButton className="w-1/3 z-[10] text-base font-semibold" >
                        Save
                    </PrimaryButton>

                    <div className={twMerge(
                        "bg-gradient-to-t absolute top-0 left-0 to-transparent dark:to-transparent h-[150px] w-full",
                        AppColours.BACKGROUND_GRADIENT
                    )} ></div>

                </div>
            </div>


        </BottomSheetView>
    )
}

function LoadingSkeleton({ onClose }: Props) {

    return (
        <BottomSheetView
            hideHandle
            showTopBorder
            className="p-4 max-h-[90vh] pb-10 flex flex-col gap-6"
            onClickOutside={onClose}
        >

            <div className="flex flex-row items-center justify-between" >
                <div className="flex flex-row items-center gap-2" >
                    <p className="dark:text-white text-xl font-bold" >Select an Avatar</p>
                </div>

                <div>
                    <CircleButton
                        onClick={onClose}
                    >
                        <X />
                    </CircleButton>
                </div>
            </div>

            <div className="flex flex-row items-center gap-4 flex-wrap" >
                <RoundedCard className="h-[100px] w-[100px] rounded-full animate-pulse" />
                <RoundedCard className="h-[100px] w-[100px] rounded-full animate-pulse" />
                <RoundedCard className="h-[100px] w-[100px] rounded-full animate-pulse" />
                <RoundedCard className="h-[100px] w-[100px] rounded-full animate-pulse" />
                <RoundedCard className="h-[100px] w-[100px] rounded-full animate-pulse" />
                <RoundedCard className="h-[100px] w-[100px] rounded-full animate-pulse" />
                <RoundedCard className="h-[100px] w-[100px] rounded-full animate-pulse" />
                <RoundedCard className="h-[100px] w-[100px] rounded-full animate-pulse" />
                <RoundedCard className="h-[100px] w-[100px] rounded-full animate-pulse" />
                <RoundedCard className="h-[100px] w-[100px] rounded-full animate-pulse" />
                <RoundedCard className="h-[100px] w-[100px] rounded-full animate-pulse" />
                <RoundedCard className="h-[100px] w-[100px] rounded-full animate-pulse" />
            </div>


        </BottomSheetView>
    )
}