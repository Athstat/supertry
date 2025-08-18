import { ChevronLeft } from 'lucide-react';
import { RugbyPlayer } from '../../../types/rugbyPlayer';
import { TabButton } from '../../shared/TabButton';
import { useRouter } from '../../../hooks/useRoter';
import { StatTab } from '../../../screens/PlayerProfileScreen';
import FormIndicator from '../../shared/FormIndicator';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect } from 'react';
import { ScrummyDarkModeLogo } from '../../branding/scrummy_logo';

type Props = {
    player: RugbyPlayer,
    activeTab: string,
    handleTabClick: (key: StatTab) => void
}

export default function PlayerProfileHeader({ player, activeTab, handleTabClick }: Props) {

    const { push } = useRouter();
    const [shrink, setShrink] = useState(false);

    // Mirror PlayerGameCard fallback image chain
    const primaryImageUrl = player.image_url ?? null;
    const teamFallbackUrl = player.team_id
        ? `https://athstat-landing-assets-migrated.s3.us-east-1.amazonaws.com/logos/${player.team_id}-ph-removebg-preview.png`
        : null;
    const [src, setSrc] = useState<string | null>(primaryImageUrl ?? teamFallbackUrl);

    useEffect(() => {
        setSrc(primaryImageUrl ?? teamFallbackUrl ?? null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [primaryImageUrl, teamFallbackUrl]);

    const handleImageError = () => {
        if (src && primaryImageUrl && src === primaryImageUrl) {
            if (teamFallbackUrl) setSrc(teamFallbackUrl);
            else setSrc(null);
        } else if (src && teamFallbackUrl && src === teamFallbackUrl) {
            setSrc(null);
        } else {
            setSrc(null);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setShrink(window.scrollY > 50); // Shrink after 50px
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const backToPlayers = () => {
        console.log("Navigating back to players");
        push("/players");
    }

    return (
        <div className="fixed top-[60px] left-0 right-0 z-30">
            {/* Player Info Header */}
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 dark:from-blue-800 dark:to-blue-950 text-white shadow-md">
                <div className="container mx-auto px-4 py-3">

                    <button
                        className="flex z-40 items-center gap-2 cursor-pointer text-white/80 hover:text-white mb-2"
                        aria-label="Go back to players"
                        tabIndex={0}
                        onClick={backToPlayers}
                    >
                        <ChevronLeft size={20} />
                        Back to Players
                    </button>

                    <div className="flex justify-start flex-row items-center gap-4">
                        
                        <div className={twMerge(
                            "w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 transition-all duration-300 ease-in-out",
                            !shrink && "w-24 h-24"
                        )}>
                            {src ? (
                                <img
                                    src={src}
                                    alt={player.player_name}
                                    className="w-full h-full object-cover object-top"
                                    onError={handleImageError}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5">
                                    <ScrummyDarkModeLogo className="w-2/3 h-2/3 opacity-50" />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className='flex flex-row items-center gap-2' >
                                <h1 className={twMerge("text-lg md:text-2xl lg:text-3xl font-bold")}>{player.player_name}</h1>
                                {player.form &&
                                    <FormIndicator className='w-5 h-5' form={player.form} />
                                }
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-sm lg:text-lg">
                                <span>
                                    {player.position_class
                                        ? player.position_class
                                            .split("-")
                                            .map(
                                                (word) =>
                                                    word.charAt(0).toUpperCase() + word.slice(1)
                                            )
                                            .join(" ")
                                        : ""}
                                </span>
                                <span>•</span>
                                <span>{player.team_name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white dark:bg-dark-800 shadow-sm">
                <div className="container mx-auto">
                    <div className="flex overflow-x-auto">
                        <TabButton
                            active={activeTab === "overview"}
                            onClick={() => handleTabClick("overview")}
                        >
                            Overview
                        </TabButton>

                        <TabButton
                            active={activeTab === "attack"}
                            onClick={() => handleTabClick("attack")}
                        >
                            Attack
                        </TabButton>
                        <TabButton
                            active={activeTab === "defense"}
                            onClick={() => handleTabClick("defense")}
                        >
                            Defense
                        </TabButton>
                        <TabButton
                            active={activeTab === "kicking"}
                            onClick={() => handleTabClick("kicking")}
                        >
                            Kicking
                        </TabButton>
                    </div>
                </div>
            </div>
        </div>
    )
}
