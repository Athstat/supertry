import { Bell, ChevronRight, LoaderCircle } from "lucide-react";
import SettingsModal from "./SettingsModal";
import { useEffect, useState } from "react";
import { GameUpdatesPreference, gameUpdatesPreferenceOptions } from "../../types/notifications";
import { formatPosition } from "../../utils/athleteUtils";
import { DatabaseUser } from "../../types/auth";
import { notificationService } from "../../services/notificationsService";
import { mutate } from "swr";

type Props = {
    databaseUser: DatabaseUser
}

export default function UserNotificationsSettings({ databaseUser }: Props) {

    const [show, setShow] = useState(false);
    const toggle = () => setShow(!show);

    const handleClick = () => {
        toggle();
    }

    return (
        <div>
            <button onClick={handleClick} className="w-full bg-white dark:bg-dark-800 rounded-lg shadow-sm overflow-hidden px-6 py-4 flex items-center space-x-3 transition-colors disabled:opacity-50">
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
                className="overflow-hidden"
            >
                <div className="w-full h-[100%] overflow-hidden flex flex-col" >
                    <div className="w-full h-[80%] overflow-y-auto flex flex-col gap-1" >

                        <GameUpdatesSection
                            user={databaseUser}
                        />

                    </div>

                    {/* <div className=" w-full h-[20%] pb-5 flex flex-row items-start gap-2" >
                        <button onClick={toggle} className="bg-blue-500 px-4 py-1 text-md text-white rounded-xl" >
                            Done
                        </button>
                    </div> */}
                </div>
            </SettingsModal>
        </div>
    )
}

type GameUpdatesProps = {
    user: DatabaseUser
}

function GameUpdatesSection({ user }: GameUpdatesProps) {

    const [selection, setSelection] = useState<GameUpdatesPreference>(user.game_updates_preference ?? "key-updates")
    const [options, setOptions] = useState<GameUpdatesPreference[]>([]);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    useEffect(() => {

        const options = [selection];

        gameUpdatesPreferenceOptions.forEach((op) => {
            if (op !== selection) {
                options.push(op);
            }
        });

        setOptions(options);
    }, []);

    useEffect(() => {


        const timeout = setTimeout(async () => {
            try {

                if (selection === user.game_updates_preference) {
                    return;
                }

                setIsSaving(true);
                await notificationService.updateGameUpdatesPreferences(selection);
                await mutate(() => true);

            } finally {
                setIsSaving(false);
            }
        }, 50);

        return () => clearTimeout(timeout);
    }, [selection]);

    return (
        <div className="flex flex-col gap-2" >
            <p className="font-semibold dark:text-white ">Game Updates</p>
            <p className="text-slate-500 text-sm dark:text-slate-400" >Choose the type of notifications you want to get for game updates</p>

            <select
                onChange={(e) => setSelection(e.target.value as GameUpdatesPreference)}
                className="bg-slate-100 border border-slate-200 p-2 mt-2 rounded-xl dark:bg-slate-800/40 dark:text-white outline-none dark:border-slate-700"
                name="game_updates_preference"
            >
                {options.map((p) => {
                    return <option value={p} >{formatPosition(p)}</option>
                })}

            </select>

            {isSaving && <div className="flex flex-row items-center text-slate-400 dark:text-slate-400 text-xs gap-1" >
                <LoaderCircle className="animate-spin w-3 h-3 " />
                <p>Saving</p>
            </div>}
        </div>
    )
}