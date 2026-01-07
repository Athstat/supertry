import { twMerge } from 'tailwind-merge'
import { useNavigate } from 'react-router-dom'
import RoundedCard from '../ui/cards/RoundedCard';

type Props = {
    className?: string
}

/** Renders dominate scrum card component */
export default function DominateScrumCard({className } : Props) {
    
    const navigate = useNavigate();


    const handleClick = () => {
        navigate('/leagues');
    }
    
    return (
        <RoundedCard className={twMerge(
            "flex bg-[#F0F3F7] flex-col gap-2 pt-5 pb-5 pl-3 pr-3",
            className
        )}>
            <h1 className="font-bold text-lg text-[#011E5C] dark:text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>Dominate the Scrum!</h1>
            <div className="flex flex-row gap-2 sm:gap-4 items-center">
                <p className="text-xs text-gray-600 dark:text-gray-300 flex-1">
                    Create your own league, or join one. Challenge your friends, invite your crew!
                </p>
                <button
                    onClick={handleClick}
                    className="px-2 py-2.5 rounded-md bg-transparent border border-[#011E5C] dark:border-white font-semibold text-xs text-[#011E5C] dark:text-white uppercase shadow-md transition-colors hover:bg-[#011E5C] hover:text-white dark:hover:bg-white dark:hover:text-[#011E5C] whitespace-nowrap flex-shrink-0"
                >
                    Get Started
                </button>
            </div>
        </RoundedCard>
    )
}
