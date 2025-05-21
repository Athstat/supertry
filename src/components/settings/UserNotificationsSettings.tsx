import { Bell, ChevronRight } from "lucide-react";
import { useAuthUser } from "../../hooks/useAuthUser"
import SettingsModal from "./SettingsModal";
import { useState } from "react";


export default function UserNotificationsSettings() {

    const user = useAuthUser();
    
    const [show, setShow] = useState(false);
    const toggle = () => setShow(!show);

    const handleClick = () => {
        toggle();
    }

    return (
        <div>
            <button onClick={handleClick} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800/40 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
                <div className="flex items-center gap-3">
                    <Bell size={20} className="text-gray-500" />
                    <span className="font-medium dark:text-gray-100">Notifications</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
            </button>

            <SettingsModal
                onClose={toggle}
                title="Notifications"
                icon={Bell}
                open={show}
            >

            </SettingsModal>
        </div>
    )
}
