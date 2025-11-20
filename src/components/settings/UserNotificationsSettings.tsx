import { Bell } from 'lucide-react';
import ProfileSettingCard from './ProfileSettingCard';
import { useNavigate } from 'react-router-dom';


export default function UserNotificationsSettings() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/profile/notification-preferences")
  };

  return (
    <div>
      <ProfileSettingCard
        title='Notifications'
        description='Edit notification preferences'
        icon={<Bell />}
        onClick={handleClick}
      />


      {/* <DialogModal
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
      </DialogModal> */}
    </div>
  );
}