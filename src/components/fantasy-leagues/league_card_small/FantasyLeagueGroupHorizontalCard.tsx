import { FantasyLeagueGroup } from "../../../types/fantasyLeagueGroups";

import RoundedCard from "../../shared/RoundedCard";
import { ChevronRight } from "lucide-react";

type Props = {
    leagueGroup: FantasyLeagueGroup,
    onClick?: (league: FantasyLeagueGroup) => void,
    custom?: number
}

/** Renders a fantasy league group card */
export function FantasyLeagueGroupHorizontalCard({ leagueGroup, onClick }: Props) {

    const getStatusBadge = () => {
        const isPrivate = leagueGroup.is_private;

        if (isPrivate) {
            return <Badge variant="invite">Invite Only</Badge>;
        }

        return <Badge variant="success">Public</Badge>;

        // if (league.has_ended) {
        //   return <Badge variant="secondary">Ended</Badge>;
        // } else if (league.is_open) {
        //   return 
        // } else {
        //   return <Badge variant="destructive">Locked</Badge>;
        // }
    };

    const handleOnClick = () => {
        if (onClick) {
            onClick(leagueGroup);
        }
    }

    return (
        <RoundedCard 
            onClick={handleOnClick}
            className="py-2 cursor-pointer px-4 border none flex flex-row items-center justify-between" 
        >


            {/* Header Row */}
            <div className="flex justify-between items-start">
                
                <div className="flex-1 flex min-w-0 flex-col">

                    <div className="flex flex-row items-center gap-2" >

                        {/* <Trophy /> */}

                        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {leagueGroup.title}
                        </h3>
                    </div>

                    <div className="flex flex-row items-center gap-1" >
                        {leagueGroup.season.name && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 tracking-wide truncate">
                                {leagueGroup.season.name}
                            </p>
                        )}

                        {getStatusBadge()}
                    </div>

                </div>

            </div>

            <div className="" >
                <button onClick={handleOnClick} >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

        </RoundedCard>
    );
}


const Badge = ({ variant, children }: { variant: string; children: React.ReactNode }) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'success':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'destructive':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'secondary':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
            case 'invite':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    return (
        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getVariantClasses()}`}>
            {children}
        </span>
    );
};