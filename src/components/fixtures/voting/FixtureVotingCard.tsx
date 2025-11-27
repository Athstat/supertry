import { twMerge } from "tailwind-merge";
import { IFixture } from "../../../types/games";
import { IProTeam } from "../../../types/team";
import RoundedCard from "../../shared/RoundedCard";
import SecondaryText from "../../shared/SecondaryText";
import TeamLogo from "../../team/TeamLogo";

type Props = {
    fixture: IFixture;
    className?: string;
};

/** Renders  Standalone Voting */
export function FixtureVotingCard({ fixture }: Props) {

    const { team, opposition_team } = fixture;

    if (!team || !opposition_team) {
        return;
    }

    return (
        <RoundedCard className='p-3 flex flex-col gap-2' >

            <div className='flex flex-row text-sm items-center justify-between' >
                <div>
                    <p className="font-semibold" >Who you got winning?</p>
                </div>

                <div>
                    <SecondaryText>Votes Made: 12.4k</SecondaryText>
                </div>
            </div>

            <div className='flex flex-row items-center gap-2' >
                <VotingOption team={team} className="" />
                <VotingOption team={opposition_team} className="" />
            </div>
        </RoundedCard>
    )
}

type VotingOptionProps = {
    team: IProTeam,
    className?: string
}

function VotingOption({ team, className }: VotingOptionProps) {



    return (
        <div className={twMerge(
            "flex flex-row items-center border dark:border-slate-600 rounded-xl gap-2 flex-1 justify-center p-2",
            className
        )} >
            <TeamLogo url={team.image_url} className="w-5 h-5" />
            <p className="text-sm" >{team.athstat_name}</p>
        </div>
    )
}