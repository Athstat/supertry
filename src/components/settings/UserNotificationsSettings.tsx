import { Bell, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GameUpdatesPreference, gameUpdatesPreferenceOptions } from '../../types/notifications';
import { formatPosition } from '../../utils/athleteUtils';
import { DjangoAuthUser } from '../../types/auth';
import { notificationService } from '../../services/notificationsService';
import DialogModal from '../shared/DialogModal';
import { authService } from '../../services/authService';
import { ErrorState } from '../ui/ErrorState';
import { analytics } from '../../services/analytics/anayticsService';
import { useAuth } from '../../contexts/AuthContext';
import ProfileSettingCard from './ProfileSettingCard';

type Props = {
  databaseUser: DjangoAuthUser;
};

export default function UserNotificationsSettings({ databaseUser }: Props) {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);

  const handleClick = () => {
    toggle();
  };

  return (
    <div>
      <ProfileSettingCard
        title='Notifications'
        description='Edit notification preferences'
        icon={<Bell />}
        onClick={handleClick}
      />


      <DialogModal
        onClose={toggle}
        title="Notifications"
        open={show}
        className="overflow-hidden"
        hw='min-h-[350px]'
      >
        <div className="w-full h-[100%] overflow-hidden flex flex-col">
          <div className="w-full h-[100%] overflow-y-auto flex flex-col gap-1">
            <GameUpdatesSection user={databaseUser} />
          </div>
        </div>
      </DialogModal>
    </div>
  );
}

type GameUpdatesProps = {
  user: DjangoAuthUser;
};

function GameUpdatesSection({ user }: GameUpdatesProps) {

  const { refreshAuthUser } = useAuth();

  const [selection, setSelection] = useState<GameUpdatesPreference>(
    user.game_updates_preference ?? 'key-updates'
  );
  const [options, setOptions] = useState<GameUpdatesPreference[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>()

  useEffect(() => {
    const options = [selection];

    gameUpdatesPreferenceOptions.forEach(op => {
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
        authService.updateUserInfo()
        const newUserInfo = await refreshAuthUser();

        analytics.trackChangedNotificationPreference(
          user.game_updates_preference ?? 'key-updates',
          selection
        );

        setSelection(newUserInfo?.game_updates_preference ?? selection);

      } catch (err) {
        setError("Something wen't wrong");
        console.log("Error updating notification preferences ", err)
      } finally {
        setIsSaving(false);
      }

    }, 50);

    return () => clearTimeout(timeout);
  }, [selection]);

  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold dark:text-white ">Game Updates</p>
      <p className="text-slate-500 text-sm dark:text-slate-400">
        Choose the type of notifications you want to get for game updates
      </p>

      <select
        onChange={e => setSelection(e.target.value as GameUpdatesPreference)}
        className="bg-slate-100 border border-slate-200 p-2 mt-2 rounded-xl dark:bg-slate-800/40 dark:text-white outline-none dark:border-slate-700"
        name="game_updates_preference"
      >
        {options.map(p => {
          return <option key={p} value={p}>{formatPosition(p)}</option>;
        })}
      </select>

      {isSaving && (
        <div className="flex flex-row items-center text-slate-400 dark:text-slate-400 text-xs gap-1">
          <LoaderCircle className="animate-spin w-3 h-3 " />
          <p>Saving</p>
        </div>
      )}

      {error && <ErrorState error={error} />}
    </div>
  );
}
