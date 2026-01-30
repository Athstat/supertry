import React from 'react'
import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups';
import { Verified } from 'lucide-react';

type Props = {
    leagueGroup: FantasyLeagueGroup
}

export default function LeagueBadge({leagueGroup} : Props) {

    const getStatusBadge = () => {

        const isPrivate = leagueGroup.is_private;

        if (isPrivate) {
            return <Badge variant="invite">Invite Only</Badge>;
        }

        if (leagueGroup.type === "official_league" || leagueGroup.type === "system_created") {
            return <Badge variant="official" >
                <div className='flex flex-row items-center gap-1' >
                    <p>Official</p>
                    <Verified className="w-3 h-3" />
                </div>
            </Badge>
        }

        return <Badge variant="success">Public</Badge>;
    };


    

    return (
        <div>{ getStatusBadge() }</div>
    )
}

const Badge = ({ variant, children }: { variant: string; children: React.ReactNode }) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'success':
                return 'bg-[#DEEFE8] text-[#1CA64F] dark:bg-[#1CA64F] dark:text-[#DEEFE8]';
            case 'invite':
                return 'bg-[#E5E3F8] text-[#5A30EF] dark:bg-[#5A30EF] dark:text-[#E5E3F8]';
            case 'official':
                return 'bg-[#DDEDF9] text-[#1196F5] dark:bg-blue-600 dark:text-[#DDEDF9]';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    return (
        <div className={`px-2 py-0.5 text-xs rounded-full font-medium ${getVariantClasses()}`}>
            {children}
        </div>
    );
};
