import { getCountryEmojiFlag } from "../../../utils/svrUtils"
import RoundedCard from "../../shared/RoundedCard"
import SecondaryText from "../../shared/SecondaryText";

type Props = {
    countryName?: string
}

export default function CountryCard({ countryName }: Props) {

    const flag = getCountryEmojiFlag(countryName, true);

    if (!flag) {
        return null;
    }

    return (
        <RoundedCard className="h-[80px] cursor-pointer dark:border-none p-4 flex flex-col items-center justify-center" >
            <p className="text-2xl" >{flag}</p>
            <SecondaryText className="text-xs" >{countryName}</SecondaryText>
        </RoundedCard>
    )
}
