import { twMerge } from "tailwind-merge";
import { getCountryEmojiFlag } from "../../../utils/svrUtils"
import RoundedCard from "../../shared/RoundedCard"
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
        <RoundedCard
            className={twMerge(
                "h-[80px] cursor-pointer dark:border-none p-4 flex flex-col items-center justify-center",
                isSelected && "bg-blue-500 dark:bg-blue-500 text-white"
            )}
            onClick={handleOnClick}
        >
            <p className="text-2xl" >{flag}</p>
            <SecondaryText className={twMerge(
                "text-xs text-center",
                isSelected && "text-white dark:text-white"
            )} >{countryName}</SecondaryText>
        </RoundedCard>
    )
}
