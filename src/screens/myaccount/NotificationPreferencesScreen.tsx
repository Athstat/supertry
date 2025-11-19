import { ArrowLeft } from "lucide-react";
import CircleButton from "../../components/shared/buttons/BackButton";
import PageView from "../PageView";
import { useNavigate } from "react-router-dom";
import SecondaryText from "../../components/shared/SecondaryText";
import ToggleButton from "../../components/shared/buttons/ToggleButton";


/** Renders the Notification Preferences Screen */
export default function NotificationPreferencesScreen() {

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/profile`);
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

            <div className="flex flex-col w-full gap-4" >
                <TogglableSettingCard
                    title="Receive Notifications"
                    description="Allow SCRUMMY to send notifications"
                />

                <TogglableSettingCard
                    title="Game Updates"
                    description="Receive updates e.g scores, tries when a game is live"
                    value={true}
                />

                <TogglableSettingCard
                    title="Roster Updates"
                    description={
                        "Receive updates when game rosters become available, before kickoff"
                    }
                    value={true}
                />

                <TogglableSettingCard
                    title="News"
                    description={
                        "Get news updates from the world of rugby"
                    }
                    value={false}
                />
            </div>
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