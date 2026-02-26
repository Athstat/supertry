import { useEffect, useState } from "react";
import { useSupportedAthletes } from "../../../hooks/athletes/useSupportedAthletes"
import CountryCard from "../../teams/countries/CountryCard";
import { useNavigate } from "react-router-dom";
import RoundedCard from "../../ui/cards/RoundedCard";
import { useFantasySeasons } from "../../../hooks/dashboard/useFantasySeasons";

/** Renders a list of countries for available players through use athletes */
export default function PlayersCountryGridList() {

    const {selectedSeason} = useFantasySeasons();
 
    const navigate = useNavigate();
    const { athletes, isLoading: loadingSupported } = useSupportedAthletes();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [countries, setCountries] = useState<string[]>([]);

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


    const onClick = (countryName?: string) => {
        navigate(`/players/country/${countryName}`);
    }

    useEffect(() => {

        setLoading(true);

        const timer = setTimeout(() => {

            let unique_set: string[] = [];

            athletes.forEach((a) => {
                const playerCountry = a.nationality ? stripCountryName(a.nationality) : undefined;
                if (playerCountry && !unique_set.includes(playerCountry)) {
                    unique_set.push(playerCountry)
                }
            })

            unique_set = unique_set.sort();
            setCountries(unique_set)

            setLoading(false);
        }, 0);

        return () => {
            clearTimeout(timer);
        }

    }, [athletes]);

    const finalLoading = isLoading || loadingSupported;

    if (finalLoading) {
        return (
            <div className="grid grid-cols-4 gap-2 animate-pulse" >
                <RoundedCard className="border-none h-[80px]" />
                <RoundedCard className="border-none h-[80px]" />
                <RoundedCard className="border-none h-[80px]" />
                <RoundedCard className="border-none h-[80px]" />
                <RoundedCard className="border-none h-[80px]" />
                <RoundedCard className="border-none h-[80px]" />
                <RoundedCard className="border-none h-[80px]" />
                <RoundedCard className="border-none h-[80px]" />
                <RoundedCard className="border-none h-[80px]" />
                <RoundedCard className="border-none h-[80px]" />
                <RoundedCard className="border-none h-[80px]" />
                <RoundedCard className="border-none h-[80px]" />
            </div>
        )
    }

    if (countries.length === 0) {
        return null;
    }

    if (selectedSeason?.competition_name === "Six Nations") {
        return null;
    }

    return (
        <div className="flex flex-col gap-4 " >

            <div>
                <p className='font-bold text-md' >By Nationality</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4" >
                {countries.map((c) => {
                    return (
                        <CountryCard
                            countryName={c}
                            onClick={onClick}
                            key={c}
                        />
                    )
                })}
            </div>
        </div>
    )
}
