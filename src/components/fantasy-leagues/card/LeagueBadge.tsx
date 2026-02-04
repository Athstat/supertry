import React from 'react'
import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups';
import { isLeagueOfficial } from '../../../utils/leaguesUtils';
import { useTooltip } from '../../../hooks/ui/useTooltip';

type Props = {
    leagueGroup: FantasyLeagueGroup
}

export default function LeagueBadge({ leagueGroup }: Props) {

    const getStatusBadge = () => {

        const isPrivate = leagueGroup.is_private;

        if (isPrivate) {
            return <Badge variant="invite">Invite Only</Badge>;
        }

        if (leagueGroup.type === "official_league" || leagueGroup.type === "system_created") {
            return <Badge variant="official" >
                <div className='flex flex-row items-center gap-1' >
                    <p>Official</p>
                </div>
            </Badge>
        }

        return <Badge variant="success">Public</Badge>;
    };




    return (
        <div>{getStatusBadge()}</div>
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
                return 'bg-gradient-to-r to-[#e2b617] from-[#eac83c] text-black';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    return (
        <div className={`px-2  py-0.5 text-xs rounded-full font-medium ${getVariantClasses()}`}>
            {children}
        </div>
    );
};


type GoldCheckMarkProps = {
    leagueGroup?: FantasyLeagueGroup,
    size?: string,
    checkFill?: string,
    fill?: string,
    clickable?: boolean
}

/** Renders a verified League Gold Check Mark */
export function LeagueGoldCheckMark({ leagueGroup, size = "13", checkFill = "#14171A", fill = "#DDAE00", clickable }: GoldCheckMarkProps) {

    const isOfficial = isLeagueOfficial(leagueGroup);
    const { openTooltipModal } = useTooltip();

    const handleClick = () => {

        if (clickable && leagueGroup) {
            openTooltipModal(
                'Official Fantasy League',
                `'${leagueGroup?.title}' Fantasy League is officially verified by SCRUMMY`
            )
        }
    }

    if (!isOfficial) {
        return null;
    }

    return (
        <svg
            width={size}
            className='cursor-pointer'
            height={size}
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleClick}
        >
            <g clip-path="url(#clip0_33_6)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M53.4778 15.9697C58.5112 6.47392 68.4948 0 80 0C91.5052 0 101.489 6.47391 106.522 15.9697C116.796 12.8143 128.433 15.296 136.569 23.4315C144.704 31.5669 147.186 43.2041 144.03 53.4778C153.526 58.5112 160 68.4948 160 80C160 91.5052 153.526 101.489 144.03 106.522C147.186 116.796 144.704 128.433 136.569 136.569C128.433 144.704 116.796 147.186 106.522 144.03C101.489 153.526 91.5052 160 80 160C68.4947 160 58.5112 153.526 53.4778 144.03C43.2041 147.186 31.5669 144.704 23.4314 136.569C15.2961 128.433 12.8144 116.796 15.9698 106.522C6.47392 101.489 0 91.5052 0 80C0 68.4948 6.47391 58.5112 15.9697 53.4778C12.8143 43.2041 15.296 31.5669 23.4314 23.4314C31.5669 15.296 43.2041 12.8143 53.4778 15.9697ZM118.1 59.9246C118.686 60.5104 118.686 61.4602 118.1 62.0459L70.7236 109.422C70.1378 110.008 69.1881 110.008 68.6023 109.422L42.4393 83.2591C41.8536 82.6734 41.8536 81.7236 42.4393 81.1378L50.9246 72.6525C51.5104 72.0668 52.4602 72.0668 53.0459 72.6525L68.6023 88.2089C69.1881 88.7947 70.1378 88.7947 70.7236 88.2089L107.493 51.4393C108.079 50.8536 109.029 50.8536 109.614 51.4393L118.1 59.9246Z" fill={fill} />
                <path d="M118.1 62.0459C118.686 61.4602 118.686 60.5104 118.1 59.9246L109.614 51.4393C109.029 50.8536 108.079 50.8536 107.493 51.4393L70.7236 88.2089C70.1378 88.7947 69.1881 88.7947 68.6023 88.2089L53.0459 72.6525C52.4602 72.0668 51.5104 72.0668 50.9246 72.6525L42.4393 81.1378C41.8536 81.7236 41.8536 82.6734 42.4393 83.2591L68.6023 109.422C69.1881 110.008 70.1378 110.008 70.7236 109.422L118.1 62.0459Z" fill={checkFill} />
            </g>
            <defs>
                <clipPath id="clip0_33_6">
                    <rect width="160" height="160" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}