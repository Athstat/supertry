import { getCountryEmojiFlag } from "../../../utils/svrUtils"
import RoundedCard from "../../shared/RoundedCard"
import SecondaryText from "../../shared/SecondaryText";

type Props = {
    countryName?: string,
    onClick?: (countryName: string) => void
}

export default function CountryCard({ countryName, onClick }: Props) {

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
            className="h-[80px] cursor-pointer dark:border-none p-4 flex flex-col items-center justify-center"
            onClick={handleOnClick}
        >
            <p className="text-2xl" >{flag}</p>
            <SecondaryText className="text-xs" >{countryName}</SecondaryText>
        </RoundedCard>
    )
}
