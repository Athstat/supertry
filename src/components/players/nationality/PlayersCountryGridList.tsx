import { useMemo } from "react";
import { useSupportedAthletes } from "../../../hooks/athletes/useSupportedAthletes"
import CountryCard from "../../teams/countries/CountryCard";

/** Renders a list of countries for available players through use athletes */
export default function PlayersCountryGridList() {

    const {athletes} = useSupportedAthletes();

    const countries = useMemo(() => {
        const unique_set: string[] = [];
        athletes.forEach((a) => {
            if (a.nationality && !unique_set.includes(a.nationality)) {
                unique_set.push(a.nationality)
            }
        })

        return unique_set;
    }, [athletes]);

    return (
        <div  className="grid grid-cols-4 gap-2" >
            {countries.map((c) => {
                return (
                    <CountryCard 
                        countryName={c}
                    />
                )
            })}
        </div>
    )
}
