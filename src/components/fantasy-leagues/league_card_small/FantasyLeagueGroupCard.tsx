import { format } from "date-fns";
import { motion } from "framer-motion";
import { Check, Users, Calendar, ChevronRight } from "lucide-react";
import { FantasyLeagueGroup } from "../../../types/fantasyLeagueGroups";
import useSWR from "swr";
import { swrFetchKeys } from "../../../utils/swrKeys";
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService";
import { useAuth } from "../../../contexts/AuthContext";

type Props = {
    leagueGroup: FantasyLeagueGroup,
    onClick?: (league: FantasyLeagueGroup) => void,
    custom?: number
}

/** Renders a fantasy league group card */
export function FantasyLeagueGroupCard({ leagueGroup, custom = 0, onClick }: Props) {

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
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                        delay: custom * 0.1,
                    },
                },
            }}
            onClick={handleOnClick}
            className="bg-white dark:bg-gray-800/60 border border-slate-300 dark:border-slate-700 rounded-2xl p-4 shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 space-y-2"
            whileHover={{
                scale: 1.02,
                transition: { type: 'spring', stiffness: 300 },
            }}
        >
            {/* Header Row */}
            <div className="flex justify-between items-start">
                <div className="flex-1 flex min-w-0 flex-col gap-2">

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
                <div className="flex items-center gap-2 ml-2">
                    {isJoined && (
                        <div className="px-2 py-0.5 text-xs rounded-full bg-blue-600 dark:bg-blue-500 text-white font-semibold flex items-center gap-1">
                            <Check size={10} />
                            Joined
                        </div>
                    )}
                    {getStatusBadge()}
                </div>
            </div>

            {/* Description - Single line with truncation */}
            {leagueGroup.description && (
                <p className="text-sm italic text-gray-600 dark:text-gray-300 truncate">
                    {leagueGroup.description}
                </p>
            )}

            {/* Metadata Row - Compressed single line */}
            <div className="flex justify-between items-center">

                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">

                    {!loadingMembers && <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span>{membersCount} Team{membersCount === 1 ? "" : 's'}</span>
                    </div>}

                    {loadingMembers && (
                        <div className="w-6 h-2 rounded-full animate-pulse bg-slate-100 dark:bg-slate-800" ></div>
                    )}

                    <span className="text-gray-400">|</span>

                    {leagueGroup.created_at && <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>Created {formatCreatedDate(leagueGroup.created_at)}</span>
                    </div>}

                </div>

                <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
            </div>

            {/* Join Deadline Countdown */}
            {/* {!isLocked && adjustedDeadline && (
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <JoinDeadlineCountdown joinDeadline={adjustedDeadline} />
        </div>
      )} */}
        </motion.div>
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