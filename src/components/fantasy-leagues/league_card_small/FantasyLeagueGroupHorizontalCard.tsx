import { format } from "date-fns";
import { motion } from "framer-motion";
import { Check, Users, Calendar, ChevronRight } from "lucide-react";
import { FantasyLeagueGroup } from "../../../types/fantasyLeagueGroups";
import useSWR from "swr";
import { swrFetchKeys } from "../../../utils/swrKeys";
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService";
import { useAuth } from "../../../contexts/AuthContext";
import RoundedCard from "../../shared/RoundedCard";

type Props = {
    leagueGroup: FantasyLeagueGroup,
    onClick?: (league: FantasyLeagueGroup) => void,
    custom?: number
}

/** Renders a fantasy league group card */
export function FantasyLeagueGroupHorizontalCard({ leagueGroup, custom = 0, onClick }: Props) {

    const key = swrFetchKeys.getLeagueGroupMembers(leagueGroup.id);
    const { data: members, isLoading: loadingMembers } = useSWR(key, () => fantasyLeagueGroupsService.getGroupMembers(leagueGroup.id));

    const membersCount = members ? members.length : '-';

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

    const formatCreatedDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return format(date, 'MMM d, yyyy');
    };

    const handleOnClick = () => {
        if (onClick) {
            onClick(leagueGroup);
        }
    }

    const { authUser } = useAuth();

    const isJoined = (members ?? []).find((m) => {
        return m.user.kc_id === authUser?.kc_id
    }) !== undefined;

    return (
        <RoundedCard className="py-2 px-4 border none" >


            {/* Header Row */}
            <div className="flex justify-between items-start">
                <div className="flex-1 flex min-w-0 flex-col">

                    <div className="flex flex-row items-center gap-12" >

                        {/* <Trophy /> */}

                        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {leagueGroup.title}
                        </h3>
                    </div>

                    <div>
                        {leagueGroup.season.name && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 tracking-wide font-medium truncate">
                                {leagueGroup.season.name}
                            </p>
                        )}
                    </div>

                </div>

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
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getVariantClasses()}`}>
            {children}
        </span>
    );
};