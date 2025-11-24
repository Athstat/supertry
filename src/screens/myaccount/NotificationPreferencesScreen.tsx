import { ArrowLeft } from "lucide-react";
import CircleButton from "../../components/shared/buttons/BackButton";
import PageView from "../PageView";
import { useNavigate } from "react-router-dom";
import SecondaryText from "../../components/shared/SecondaryText";
import ToggleButton from "../../components/shared/buttons/ToggleButton";
import RoundedCard from "../../components/shared/RoundedCard";
import { GoSync } from "react-icons/go";
import { Toast } from "../../components/ui/Toast";
import { ErrorState } from "../../components/ui/ErrorState";
import { useNotificationPreferences } from "../../hooks/notifications/useNotificationPreferences";
import { twMerge } from "tailwind-merge";
import RadioList from "../../components/shared/buttons/RadioList";
import { GameUpdatesPreference, gameUpdatesPreferenceRadioListOptions } from "../../types/notifications";
import { useEffect } from "react";


/** Renders the Notification Preferences Screen */
export default function NotificationPreferencesScreen() {

    const {
        error, clearError, isSaving,
        isProfileFetchFailed, isLoading,
        profile, setProfile, handleAutoSave
    } = useNotificationPreferences();

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/profile`);
    }

    useEffect(() => {
        return () => {
            console.log("saving changes post component unmount")
            handleAutoSave();
        }
    })

    if (isLoading) {
        return <LoadingSkeleton />
    }

    return (
        <PageView className="px-6 flex flex-col gap-4" >
            <div className="flex flex-row relative items-center gap-4" >
                <CircleButton
                    onClick={handleBack}
                >
                    <ArrowLeft />
                </CircleButton>

                <div>
                    <h1 className="font-bold text-lg" >Notification Preferences</h1>
                </div>

                {isSaving && <div className="absolute right-0" >
                    <GoSync className="dark:text-slate-400 animate-spin" />
                </div>}
            </div>

            {profile && (
                <div className="flex flex-col w-full gap-6" >
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

                    <div className="flex flex-col gap-2" >
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

                            isDisabled={!profile.receive_notifications_enabled}
                        />

                        {profile.game_updates_enabled && profile.receive_notifications_enabled && <RadioList
                            options={gameUpdatesPreferenceRadioListOptions}
                            value={profile.game_updates_preference}
                            disabled={!profile.receive_notifications_enabled}
                            onChange={(val) => {
                                setProfile({ ...profile, game_updates_preference: val as GameUpdatesPreference })
                            }}

                            description="Customise game update frequency"
                            className="pl-5"

                        />}
                    </div>

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

                        isDisabled={!profile.receive_notifications_enabled}
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

                        isDisabled={!profile.receive_notifications_enabled}
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

                        isDisabled={!profile.receive_notifications_enabled}
                    />

                    <TogglableSettingCard
                        title="Email"
                        description={
                            "Receive updates from SCRUMMY through your email"
                        }
                        value={profile.email_updates_enabled}
                        onChange={(newVal) => {
                            setProfile({
                                ...profile,
                                email_updates_enabled: newVal
                            })
                        }}

                        isDisabled={!profile.receive_notifications_enabled}
                    />
                </div>
            )}

            {isProfileFetchFailed && (
                <div>
                    <ErrorState
                        error="Whoops! Something wen't wrong"
                        message="We failed to retreive your notification preferences."
                    />
                </div>
            )}

            {error && (
                <Toast
                    message={error}
                    isVisible={Boolean(error)}
                    onClose={clearError}
                    type="error"
                />
            )}
        </PageView>
    )
}

type SettingProp = {
    title?: string,
    description?: string,
    value?: boolean,
    onChange?: (newVal: boolean) => void,
    isDisabled?: boolean
}

function TogglableSettingCard({ title, description, value, onChange, isDisabled = false }: SettingProp) {
    return (
        <div className={twMerge(
            "flex flex-row items-center gap-2 justify-between",
            isDisabled && "opacity-30"
        )} >
            <div>
                <p>{title}</p>
                <SecondaryText className="text-xs text-wrap max-w-[95%]" >{description}</SecondaryText>
            </div>

            <div>
                <ToggleButton
                    value={value}
                    onChange={onChange}
                    isDisable={isDisabled}
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