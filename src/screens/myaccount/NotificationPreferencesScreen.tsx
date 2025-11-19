import { ArrowLeft } from "lucide-react";
import CircleButton from "../../components/shared/buttons/BackButton";
import PageView from "../PageView";
import { useNavigate } from "react-router-dom";


/** Renders the Notification Preferences Screen */
export default function NotificationPreferencesScreen() {

    const navigate = useNavigate();
    
    const handleBack = () => {
        navigate(`/profile`);
    }

    return (
        <PageView>
            <div className="flex flex-row items-center gap-2 px-4" >
                <CircleButton
                    onClick={handleBack}
                >
                    <ArrowLeft />
                </CircleButton>

                <div>
                    <h1 className="font-bold text-xl" >Notification Preferences</h1>
                </div>
            </div>
        </PageView>
    )
}
