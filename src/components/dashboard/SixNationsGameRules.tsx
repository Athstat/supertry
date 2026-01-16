import { twMerge } from 'tailwind-merge'
import RoundedCard from '../ui/cards/RoundedCard'
import SecondaryText from '../ui/typography/SecondaryText'
import { useState } from 'react'

type Props = {
    className?: string
}

/** Renders siz nations game rules */
export default function SixNationsGameRules({ className }: Props) {

    const [showGameRules, setShowGameRules] = useState(false);

    const toggleShowGameRules = () => {
        setShowGameRules(prev => !prev);
    }

    return (
        <RoundedCard className={twMerge(
            "flex bg-[#F0F3F7] flex-col gap-4 pt-5 pb-5 pl-3 pr-3",
            className
        )}>
            <h1 className="font-[510] text-[20px] text-[#011E5C] dark:text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>SCRUMMY M6N Fantasy</h1>
            
            <SecondaryText>Compete for glory and exclusive rewards in this year's M6N Fantasy challenge. Build your roster, track the leaderboard, and win big.</SecondaryText>
            
            {showGameRules && <div className='flex flex-col gap-4' >
                <div>
                    <SecondaryText>1. <strong>Entry Deadline:</strong> Feb 21, 2:00 PM BST (Prize Eligibility).</SecondaryText>
                </div>

                <div>
                    <SecondaryText>2. <strong>Match Lock:</strong> Rosters lock while games are live.</SecondaryText>
                </div>

                <div>
                    <SecondaryText>2. <strong>Prizes:</strong> Top 10 on the leaderboard by Mar 15, 11:59 PM BST win.</SecondaryText>
                </div>

                <div className='pl-4 flex flex-col gap-2' >

                    <SecondaryText>a. <strong>1st place:</strong> 2 tickets to <strong>EPRC Champions Cup Final</strong> on Friday 22 May 2026</SecondaryText>
                    <SecondaryText>b. <strong>2nd/3rd place:</strong> SCRUMMY branded rugby jerseys</SecondaryText>
                    <SecondaryText>c. <strong>4th-10th place:</strong> Shoutouts on SCRUMMY leaderboard</SecondaryText>
                </div>

            </div>}

            <button
                onClick={toggleShowGameRules}
                className="px-2 py-2.5 w-fit rounded-md bg-transparent border border-[#011E5C] dark:border-white font-semibold text-xs text-[#011E5C] dark:text-white uppercase shadow-md transition-colors hover:bg-[#011E5C] hover:text-white dark:hover:bg-white dark:hover:text-[#011E5C] whitespace-nowrap flex-shrink-0"
            >
                {showGameRules ? "Hide Game Rules" : "Game Rules" }
            </button>
        </RoundedCard>
    )
}
