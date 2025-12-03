import { useMemo } from "react";
import { useSupportedAthletes } from "../../../hooks/athletes/useSupportedAthletes"
import CountryCard from "../../teams/countries/CountryCard";
import { useNavigate } from "react-router-dom";

/** Renders a list of countries for available players through use athletes */
export default function PlayersCountryGridList() {

    const {athletes} = useSupportedAthletes();
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
    }
    

    return (
        <div  className="grid grid-cols-4 gap-2" >
            {countries.map((c) => {
                return (
                    <CountryCard 
                        countryName={c}
                        onClick={onClick}
                    />
                )
            })}
        </div>
    )
}
