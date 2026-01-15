import { ChevronRight, Shield } from "lucide-react";
import RoundedCard from "../ui/cards/RoundedCard";
import SecondaryText from "../ui/typography/SecondaryText";
import { useNavigate } from "react-router-dom";

/** Renders a CTA for the user to customize their fantasy club */
export default function EditFantasyClubCTA() {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/fantasy/my-club`);
    }

    return (
        <RoundedCard onClick={handleClick} className="p-2 cursor-pointer hover:bg-slate-200 flex flex-row items-center justify-between dark:border-slate-600" >

            <div className="flex flex-row items-center gap-2" >
                <Shield  />

                <div>
                    <p className="font-semibold text-sm" >Personilise your Team!</p>
                    <SecondaryText className="text-xs" >Make your team stand out on leaderboards</SecondaryText>
                </div>

            </div>

            <div>
                <ChevronRight />
            </div>
        </RoundedCard>
    )
}
