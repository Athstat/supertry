import { twMerge } from "tailwind-merge";
import { getCountryEmojiFlag } from "../../../utils/svrUtils"
import SecondaryText from "../../ui/typography/SecondaryText";

type Props = {
    countryName?: string,
    onClick?: (countryName: string) => void,
    isSelected?: boolean
}

export default function CountryCard({ countryName, onClick, isSelected = false }: Props) {

    const flag = getCountryEmojiFlag(countryName, true);

    const handleOnClick = () => {
        if (countryName && flag && onClick) {
            onClick(countryName);
        }
    }

    if (!flag) {
        return null;
    }

    return (
        <div
            className={twMerge(
                "shadow-[0px_0px_5px_rgba(0,0,0,0.25)] bg-[#F8FAFC80] w-full rounded-md h-[100px] flex flex-col items-center gap-2 justify-center",
                isSelected && "bg-blue-500 dark:bg-blue-500 text-white"
            )}
            onClick={handleOnClick}
        >
            <p className="text-4xl" >{flag}</p>

            <SecondaryText className={twMerge(
                "text-[12px] text-center",
                isSelected && "text-white dark:text-white"
            )} >{countryName}</SecondaryText>
        </div>
    )
}
