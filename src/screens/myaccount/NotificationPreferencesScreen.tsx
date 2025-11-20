import { ArrowLeft } from "lucide-react";
import CircleButton from "../../components/shared/buttons/BackButton";
import PageView from "../PageView";
import { useNavigate } from "react-router-dom";
import SecondaryText from "../../components/shared/SecondaryText";
import ToggleButton from "../../components/shared/buttons/ToggleButton";
import { useAuth } from "../../contexts/AuthContext";
import { notificationService } from "../../services/notificationsService";
import { useEffect, useRef, useState } from "react";
import RoundedCard from "../../components/shared/RoundedCard";
import { useDebounced } from "../../hooks/useDebounced";
import { NotificationProfile } from "../../types/notifications";
import { logger } from "../../services/logger";


/** Renders the Notification Preferences Screen */
export default function NotificationPreferencesScreen() {

    const { authUser } = useAuth();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [profile, setProfile] = useState<NotificationProfile>();
    const originalProfileRef = useRef<NotificationProfile>(null);

    useEffect(() => {
        const fetcher = async () => {

            setLoading(true);

            try {
                if (!authUser) {
                    return;
                }

                const data = await notificationService.getNotificationProfile(authUser?.kc_id);

                if (data) {
                    originalProfileRef.current = data;
                    setProfile(data);
                }

            } catch (err) {
                logger.error("Error fetching profile in efffect", err);
            } finally {
                setLoading(false);
            }
        }

        fetcher();
    }, [authUser]);

    const debouncedLoading = useDebounced(isLoading, 700);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/profile`);
    }

    if (debouncedLoading) {
        return <LoadingSkeleton />
    }

    return (
        <PageView className="px-6 flex flex-col gap-4" >
            <div className="flex flex-row items-center gap-4" >
                <CircleButton
                    onClick={handleBack}
                >
                    <ArrowLeft />
                </CircleButton>

                <div>
                    <h1 className="font-bold text-lg" >Notification Preferences</h1>
                </div>
            </div>

            {profile && (
                <div className="flex flex-col w-full gap-4" >
                    <TogglableSettingCard
                        title="Receive Notifications"
                        description="Allow SCRUMMY to send notifications"
                        value={profile.receive_notifications_enabled}
                        onChange={(newVal) => {
                            setProfile({
                                ...profile,
                                receive_notifications_enabled: newVal
                            })
                        }}
                    />

                    <TogglableSettingCard
                        title="Game Updates"
                        description="Receive updates e.g scores, tries when a game is live"
                        value={profile.game_updates_enabled}
                        onChange={(newVal) => {
                            setProfile({
                                ...profile,
                                game_updates_enabled: newVal
                            })
                        }}
                    />

                    <TogglableSettingCard
                        title="Roster Updates"
                        description={
                            "Receive updates when game rosters become available, before kickoff"
                        }
                        value={profile.game_roster_updates_enabled}
                        onChange={(newVal) => {
                            setProfile({
                                ...profile,
                                game_roster_updates_enabled: newVal
                            })
                        }}
                    />

                    <TogglableSettingCard
                        title="My Team Updates"
                        description={
                            "Receive updates on my team e.g player availability, points for that week etc"
                        }
                        value={profile.my_team_updates_enabled}
                        onChange={(newVal) => {
                            setProfile({
                                ...profile,
                                my_team_updates_enabled: newVal
                            })
                        }}
                    />

                    <TogglableSettingCard
                        title="News"
                        description={
                            "Get news updates from the world of rugby"
                        }
                        value={profile.news_updates_enabled}
                        onChange={(newVal) => {
                            setProfile({
                                ...profile,
                                news_updates_enabled: newVal
                            })
                        }}
                    />
                </div>
            )}
        </PageView>
    )
}

type SettingProp = {
    title?: string,
    description?: string,
    value?: boolean,
    onChange?: (newVal: boolean) => void
}

function TogglableSettingCard({ title, description, value, onChange }: SettingProp) {
    return (
        <div className="flex flex-row items-center gap-2 justify-between" >
            <div>
                <p>{title}</p>
                <SecondaryText className="text-xs text-wrap max-w-[95%]" >{description}</SecondaryText>
            </div>

            <div>
                <ToggleButton
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}

function LoadingSkeleton() {
    return (
        <PageView className="px-6 flex flex-col gap-4" >
            <div className="flex flex-row items-center gap-4" >
                <CircleButton
                >
                    <ArrowLeft />
                </CircleButton>

                <div>
                    <h1 className="font-bold text-lg" >Notification Preferences</h1>
                </div>
            </div>

            <div className="animate-pulse flex flex-col gap-6" >
                <div className="flex flex-row items-start w-full justify-between gap-2" >
                    <div className="flex flex-col gap-1 justify-between" >
                        <RoundedCard className="w-[200px] h-[30px] border-none" />
                        <RoundedCard className="w-[250px] h-[30px] border-none" />
                    </div>

                    <div>
                        <RoundedCard className="w-[70px] h-[30px] border-none" />
                    </div>
                </div>

                <div className="flex flex-row items-start w-full justify-between gap-2" >
                    <div className="flex flex-col gap-1 justify-between" >
                        <RoundedCard className="w-[200px] h-[30px] border-none" />
                        <RoundedCard className="w-[250px] h-[30px] border-none" />
                    </div>

                    <div>
                        <RoundedCard className="w-[70px] h-[30px] border-none" />
                    </div>
                </div>

                <div className="flex flex-row items-start w-full justify-between gap-2" >
                    <div className="flex flex-col gap-1 justify-between" >
                        <RoundedCard className="w-[200px] h-[30px] border-none" />
                        <RoundedCard className="w-[250px] h-[30px] border-none" />
                    </div>

                    <div>
                        <RoundedCard className="w-[70px] h-[30px] border-none" />
                    </div>
                </div>

                <div className="flex flex-row items-start w-full justify-between gap-2" >
                    <div className="flex flex-col gap-1 justify-between" >
                        <RoundedCard className="w-[200px] h-[30px] border-none" />
                        <RoundedCard className="w-[250px] h-[30px] border-none" />
                    </div>

                    <div>
                        <RoundedCard className="w-[70px] h-[30px] border-none" />
                    </div>
                </div>
            </div>
        </PageView>
    )
}