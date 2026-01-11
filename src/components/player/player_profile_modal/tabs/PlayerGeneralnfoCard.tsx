import { Coins } from "lucide-react"
import { IProAthlete } from "../../../../types/athletes"
import { calculateAge } from "../../../../utils/playerUtils"
import { isNumeric, stripCountryName } from "../../../../utils/stringUtils"
import RoundedCard from "../../../ui/cards/RoundedCard"
import SecondaryText from "../../../ui/typography/SecondaryText"
import FormIndicator from "../../FormIndicator"
import { getCountryEmojiFlag } from "../../../../utils/svrUtils"
import { format } from "date-fns"
import { cmToFeetInches, kgToLbs } from "../../../../utils/intUtils"

type Props = {
    player: IProAthlete
}

export default function PlayerGeneralnfoCard({ player }: Props) {

    const { nationality } = player;
    const nationalityIsValid = nationality && !isNumeric(nationality ?? '');

    const countryFlag = nationalityIsValid ? getCountryEmojiFlag(stripCountryName(nationality)) : undefined;
    const dob = player.date_of_birth ? new Date(player.date_of_birth) : undefined;

    return (

        <RoundedCard className='p-4 dark:border-none grid grid-cols-3 gap-4' >

            {nationalityIsValid && <div className='flex flex-col items-center gap-1' >
                <SecondaryText className='text-[11px] text-center' >Nationality</SecondaryText>
                <div className='flex flex-row items-center gap-1' >
                    <p>{countryFlag}</p>
                    <p className='text-sm font-medium' >{stripCountryName(nationality)}</p>
                </div>
            </div>}

            {dob && <div className='flex flex-col items-center gap-1' >
                <SecondaryText className='text-[11px] text-center' >{format(dob, "d MMM yyyy")}</SecondaryText>
                <div className='flex flex-row items-center gap-1' >
                    <p className='text-sm font-medium' >{calculateAge(dob)} yrs</p>
                </div>
            </div>}

            {player.height && <div className='flex flex-col items-center gap-1' >
                <SecondaryText className='text-[11px] text-center' >Height</SecondaryText>
                <div className='flex flex-row items-center gap-1' >
                    <p className='text-sm font-medium' >{player.height} cm ({cmToFeetInches(player.height)})</p>
                </div>
            </div>}

            {player.weight && <div className='flex flex-col items-center gap-1' >
                <SecondaryText className='text-[11px] text-center' >Weight</SecondaryText>
                <div className='flex flex-row items-center gap-1' >
                    <p className='text-sm font-medium' >{player.weight} kg ({kgToLbs(player.weight)})</p>
                </div>
            </div>}

            {(player.gender === "F") && <div className='flex flex-col items-center gap-1' >
                <SecondaryText className='text-[11px] text-center' >Gender</SecondaryText>
                <div className='flex flex-row items-center gap-1' >
                    <p className='text-sm font-medium' >{player.gender}</p>
                </div>
            </div>}

            {player.price && <div className='flex flex-col items-center gap-1' >
                <SecondaryText className='text-[11px] text-center' >Price</SecondaryText>
                <div className='flex flex-row items-center gap-1' >
                    <p className='text-sm font-medium' >{player.price}</p>
                    <Coins className='w-4 h-4 text-yellow-500' />
                </div>
            </div>}

            {player.form && <div className='flex flex-col items-center gap-1' >
                <SecondaryText className='text-[11px] text-center' >Form</SecondaryText>
                <div className='flex flex-row items-center gap-1' >
                    <FormIndicator form={player.form} />
                </div>
            </div>}

        </RoundedCard>
    )
}


