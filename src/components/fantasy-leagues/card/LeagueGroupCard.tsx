import { preload } from "react-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useUserOverallStandings } from "../../../hooks/fantasy/standings/useUserOverallStandings";
import { FantasyLeagueGroup } from "../../../types/fantasyLeagueGroups";
import LeagueGroupLogo from "../../fantasy_league/LeagueGroupLogo";
import RoundedCard from "../../ui/cards/RoundedCard";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Users } from "lucide-react";

type CardProps = {
    leagueGroup: FantasyLeagueGroup,
    onClick?: (league: FantasyLeagueGroup) => void,
    custom?: number
}

/** Renders a fantasy league group card */
export function LeagueGroupCard({ leagueGroup, onClick }: CardProps) {

    const { authUser } = useAuth();
    const { userRanking, isLoading } = useUserOverallStandings(authUser?.kc_id, leagueGroup.id);
    const { ref, inView } = useInView({ triggerOnce: true });

    const getStatusBadge = () => {
        const isPrivate = leagueGroup.is_private;

        if (isPrivate) {
            return <Badge variant="invite">Invite Only</Badge>;
        }

        return <Badge variant="success">Public</Badge>;
    };

    const handleOnClick = () => {
        if (onClick) {
            onClick(leagueGroup);
        }
    }

    useEffect(() => {
        const prefetchBanner = () => {
            if (leagueGroup && inView) {

                if (leagueGroup.banner) {
                    preload(leagueGroup.banner, { as: 'image' });
                }

                if (leagueGroup.logo) {
                    preload(leagueGroup.logo, { as: 'image' });
                }
            }
        }

        prefetchBanner();
    }, [inView, leagueGroup]);

    return (
        <div ref={ref} >

            <RoundedCard
                onClick={handleOnClick}
                className="py-2 cursor-pointer rounded-md px-4 bg-slate-100 border-none flex flex-row items-center justify-between"
            >
                <div className="flex flex-row items-center gap-3" >
                    <LeagueGroupLogo className="w-6 h-6" league={leagueGroup} />

                    <div className="flex flex-col gap-0.5" >
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {leagueGroup.title}
                        </h3>

                        {leagueGroup.members_count && <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Users className='w-4 h-4' />
                            <span className='text-xs' > {leagueGroup.members_count}</span>
                        </div>}
                    </div>
                    {getStatusBadge()}
                </div>


                <div className="" >

                    {!isLoading && <div className="text-slate-600 dark:text-slate-200 font-semibold text-sm" >
                        <p>{userRanking?.league_rank}</p>
                    </div>}

                    {isLoading && <div className="text-slate-600 animate-pulse dark:text-slate-200 font-semibold text-sm" >
                        <div className="w-4 h-4 rounded-xl bg-slate-200 dark:bg-slate-600" ></div>
                    </div>}

                    {/* <button onClick={handleOnClick} >
                    <ChevronRight className="w-4 h-4" />
                    </button> */}
                </div>

            </RoundedCard>
        </div>
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