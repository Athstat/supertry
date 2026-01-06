import { useMemo } from "react";
import { useSupportedAthletes } from "../../../hooks/athletes/useSupportedAthletes"
import CountryCard from "../../teams/countries/CountryCard";
import { useNavigate, useParams } from "react-router-dom";
import BottomSheetView from "../../ui/BottomSheetView";
import CircleButton from "../../ui/buttons/BackButton";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { lighterDarkBlueCN } from "../../../types/constants";

type Props = {
    onClose?: () => void,
    isOpen?: boolean
}

/** Renders a list of countries for available players through use athletes */
export default function PlayersCountrySheet({onClose, isOpen} : Props) {

    const { athletes } = useSupportedAthletes();
    const {countryName} = useParams();
    const navigate = useNavigate();

    const stripCountryName = (name: string) => {
        if (name.endsWith(" A")) {
            name = name.replace(" A", "");
        }

        name = name.replace(" B", "");
        name = name.replace(" XV", "");
        name = name.replace(" 7s", "");
        name = name.replace(" U18", "");
        name = name.replace(" U20", "");
        name = name.replace(" U19", "");

        return name;
    }

    const countries = useMemo(() => {

        const unique_set: string[] = [];

        athletes.forEach((a) => {
            const playerCountry = a.nationality ? stripCountryName(a.nationality) : undefined;
            if (playerCountry && !unique_set.includes(playerCountry)) {
                unique_set.push(playerCountry)
            }
        })

        return unique_set.sort();
    }, [athletes]);


    const onClick = (countryName?: string) => {
        navigate(`/players/country/${countryName}`);

        if (onClose) {
            onClose();
        }
    }

    if (!isOpen) {
        return null;
    }


    return (
        <BottomSheetView className={twMerge(
            "p-4 min-h-[50vh] max-h-[70vh] no-scrollbar overflow-y-auto",
            lighterDarkBlueCN
        )} hideHandle >
            <div className="flex flex-row items-center justify-between" >
                <p className="font-bold" >Select country</p>

                <div>
                    <CircleButton
                        onClick={onClose}
                    >
                        <X />
                    </CircleButton>
                </div>
            </div>
            <div className="grid-cols-4 pb-[20px] grid gap-4" >
                {countries.map((c) => {
                    return (
                        <CountryCard
                            countryName={c}
                            onClick={onClick}
                            isSelected={c === countryName}
                        />
                    )
                })}
            </div>
        </BottomSheetView>
    )
}
