import UserNotificationsSettings from '../components/auth/user_profile/settings/UserNotificationsSettings';
import LicensingModal from '../components/branding/licensing/LicensingModel';
import { authUserAtom, isGuestUserAtom } from '../state/authUser.atoms';
import { ScopeProvider } from 'jotai-scope';
import AuthUserDataProvider from '../components/auth/AuthUserDataProvider';
import { useAtomValue } from 'jotai';
import UserProfileHeader from '../components/auth/UserProfileHeader';
import ClaimGuestAccountBox from '../components/auth/guest/ClaimGuestAccountBox';
import LogoutButton from '../components/auth/LogoutButton';
import DeleteAccountButton from '../components/auth/DeleteAccountButton';
import Experimental from '../components/ui/ab_testing/Experimental';
import QaNoticeCard from '../components/auth/user_profile/settings/QaNoticeCard';
import { useNavigate } from 'react-router-dom';
import ProfileSettingCard from '../components/auth/user_profile/settings/ProfileSettingCard';
import { UserCircle, Moon, Sun, HelpCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ScrummyGamePlayModal from '../components/branding/help/ScrummyGamePlayModal';
import { useState } from 'react';

export function UserProfileScreen() {

  const atoms = [authUserAtom, isGuestUserAtom];

  return (
    <ScopeProvider atoms={atoms}>
      <AuthUserDataProvider>
        <Content />
      </AuthUserDataProvider>
    </ScopeProvider>
  );
}


function Content() {

  const authUser = useAtomValue(authUserAtom);
  const isGuestAccount = useAtomValue(isGuestUserAtom);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isGameplayModalOpen, setIsGameplayModalOpen] = useState(false);

  const handleEditUserProfile = () => {
    navigate('/profile/account-info');
  }

  const handleOpenGameplayModal = () => {
    setIsGameplayModalOpen(true);
  }

  const handleCloseGameplayModal = () => {
    setIsGameplayModalOpen(false);
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 max-w-3xl">
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">Profile</h1>
      </div>
      <div className="space-y-4">

        {authUser && (
          <UserProfileHeader
            user={authUser}
            isGuestAccount={isGuestAccount}
          />
        )}

        <Experimental>
          {/* {authUser && <EmailVerificationWarning authUser={authUser} />} */}
        </Experimental>

        {/* Complete Profile Card for Guest Users */}
        {isGuestAccount && <ClaimGuestAccountBox />}

        <ProfileSettingCard
          title='Account Info'
          description='Edit Username, First Name and Last Name'
          icon={<UserCircle />}
          onClick={handleEditUserProfile}
          hideForGuestUsers
        />

        {authUser && !isGuestAccount && (
          <UserNotificationsSettings />
        )}

        <ProfileSettingCard
          title='Appearance'
          description={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          icon={theme === 'dark' ? <Sun /> : <Moon />}
          onClick={toggleTheme}
        />

        <ProfileSettingCard
          title='How to Play'
          description='Learn about Scrummy gameplay and fantasy points'
          icon={<HelpCircle />}
          onClick={handleOpenGameplayModal}
        />

        <LicensingModal />

        <QaNoticeCard />

        {/* Logout Button */}
        <LogoutButton
          isGuestAccount={isGuestAccount}
        />

        <DeleteAccountButton
          isGuestAccount={isGuestAccount}
        />
      </div>

      <ScrummyGamePlayModal
        isOpen={isGameplayModalOpen}
        onClose={handleCloseGameplayModal}
      />
    </main>
  )
}
