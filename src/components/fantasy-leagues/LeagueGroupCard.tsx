import { preload } from "react-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUserOverallStandings } from "../../hooks/fantasy/standings/useUserOverallStandings";
import { FantasyLeagueGroup, FantasyLeagueGroupType } from "../../types/fantasyLeagueGroups";
import LeagueGroupLogo from "../fantasy_league/LeagueGroupLogo";
import RoundedCard from "../ui/cards/RoundedCard";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { useLeagueGroupMembersCount } from "../../hooks/leagues/useLeagueGroupMembersCount";
import LeagueMembersIcon from "../ui/icons/LeagueMembersIcon";
import SecondaryText from "../ui/typography/SecondaryText";
import { Verified } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { seperateNumberParts } from "../../utils/intUtils";

type CardProps = {
    leagueGroup: FantasyLeagueGroup,
    onClick?: (league: FantasyLeagueGroup) => void,
    custom?: number
}

/** Renders a fantasy league group card */
export function LeagueGroupCard({ leagueGroup, onClick }: CardProps) {

    const { authUser } = useAuth();
    const { userRanking, isLoading: loadingStandings } = useUserOverallStandings(authUser?.kc_id, leagueGroup.id);
    const { ref, inView } = useInView({ triggerOnce: true });

    const { formattedCount, isLoading: loadingMembers } = useLeagueGroupMembersCount(leagueGroup.id);
    const isLoading = loadingStandings || loadingMembers;

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
                className="py-2 cursor-pointer rounded-md pl-2 pr-4 bg-[#F4F7F9] dark:bg-slate-700 shadow-[0px_1px_4px_rgba(0,0,0,0.25)] border-none flex flex-row items-center justify-between"
            >
                <div className="flex flex-row items-center gap-4 " >

                    <div className="w-12 h-12 overflow-clip bg-white dark:bg-slate-800 rounded-md" >
                        <LeagueGroupLogo
                            className="overflow-visible"
                            objectClassName="h-12 w-12"
                            league={leagueGroup}
                        />
                    </div>

                    <div>
                        <p className="text-base text-gray-900 dark:text-white truncate">
                            {leagueGroup.title}
                        </p>

                        <div className="flex flex-row items-center gap-1.5" >
                            <LeagueMembersIcon />
                            {!isLoading && <SecondaryText>{formattedCount}</SecondaryText>}
                        </div>
                    </div>
                </div>


                <div className="flex flex-row items-center gap-6" >

                    <LeagueVisibityBadge 
                        isPrivate={leagueGroup.is_private}
                        type={leagueGroup.type}
                    />

                    {!isLoading && <div className="text-slate-600 dark:text-slate-200 text-[14px]" >
                        <p>{seperateNumberParts(userRanking?.league_rank)}</p>
                    </div>}

                    {isLoading && <div className="text-slate-600 animate-pulse dark:text-slate-200 font-semibold text-sm" >
                        <div className="w-4 h-4 rounded-xl bg-slate-200 dark:bg-slate-600" ></div>
                    </div>}

                </div>

            </RoundedCard>
        </div>
    );
}

type LeagueVisibityBadgeProps = {
    type?: FantasyLeagueGroupType,
    isPrivate?: boolean
}

function LeagueVisibityBadge({type, isPrivate} : LeagueVisibityBadgeProps) {
    
    const status = useMemo(() => {
        if (type === "official_league" || type === "system_created") {
            return "Official"
        }

        if (isPrivate) {
            return "Invite Only"
        }

        return "Public"
    }, [isPrivate, type]);

    return (
        <div className={twMerge(
            "flex flex-row items-center gap-2 text-xs py-1 px-2 rounded-full",
            status === "Official" && "bg-[#DDEDF9]  text-[#2BA1F5] dark:bg-[#2BA1F5]  dark:text-[#DDEDF9]",
            status === "Invite Only" && "bg-[#E5E3F8] text-[#6B47F0] dark:bg-[#6B47F0] dark:text-[#E5E3F8]",
            status === "Public" && "bg-[#DEEFE8] text-[#34AF62] dark:bg-[#34AF62] dark:text-[#DEEFE8]",
        )} >
            <p>{status}</p>

            {status === "Official" && <Verified className="w-4 h-4" />}
        </div>
    )
}