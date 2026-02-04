import { twMerge } from "tailwind-merge";
import { getCountryByName, getCountryEmojiFlag } from "../../../utils/svrUtils"
import SecondaryText from "../../ui/typography/SecondaryText";
import RoundedCard from "../../ui/cards/RoundedCard";
import CountryFlag from "./CountryFlag";

type Props = {
    countryName?: string,
    onClick?: (countryName: string) => void,
    isSelected?: boolean
}

export default function CountryCard({ countryName, onClick, isSelected = false }: Props) {

    const flag = getCountryEmojiFlag(countryName, true);
    const country = getCountryByName(countryName, true);

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
                "h-[90px] cursor-pointer dark:border-none p-4 flex flex-col items-center justify-center gap-2",
                isSelected && "bg-blue-500 dark:bg-blue-500 text-white"
            )}
            onClick={handleOnClick}
        >
            
            <CountryFlag 
                countryCode={country?.code}
                className="w-8 h-8"
            />

            <SecondaryText className={twMerge(
                "text-[10px] text-center",
                isSelected && "text-white dark:text-white"
            )} >{countryName}</SecondaryText>
        </RoundedCard>
    )
}
