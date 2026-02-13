import UserNotificationsSettings from '../../components/auth/user_profile/settings/UserNotificationsSettings';
import LicensingModal from '../../components/branding/licensing/LicensingModel';
import { authUserAtom, isGuestUserAtom } from '../../state/authUser.atoms';
import { ScopeProvider } from 'jotai-scope';
import AuthUserDataProvider from '../../components/auth/AuthUserDataProvider';
import { useAtomValue } from 'jotai';
import ClaimGuestAccountBox from '../../components/auth/guest/ClaimGuestAccountBox';
import DeleteAccountButton from '../../components/auth/DeleteAccountButton';
import Experimental from '../../components/ui/ab_testing/Experimental';
import QaNoticeCard from '../../components/auth/user_profile/settings/QaNoticeCard';
import { useNavigate } from 'react-router-dom';
import ProfileSettingCard from '../../components/auth/user_profile/settings/ProfileSettingCard';
import { UserCircle, Moon, Sun, HelpCircle, Share2 } from 'lucide-react';
import ScrummyGamePlayModal from '../../components/branding/help/ScrummyGamePlayModal';
import { useCallback, useState } from 'react';
import LogoutButton from '../../components/auth/login/LogoutButton';
import UserProfileHeader from '../../components/auth/user_profile/UserProfileHeader';
import { useTheme } from '../../contexts/app_state/ThemeContext';
import { useShareApp } from '../../hooks/marketing/useShareApp';
import { Toast } from '../../components/ui/Toast';

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
  const { handleShare } = useShareApp();
  const [showShareSuccess, setShowShareSuccess] = useState(false);
  const [showShareError, setShowShareError] = useState(false);

  const handleEditUserProfile = () => {
    navigate('/profile/account-info');
  }

  const handleOpenGameplayModal = () => {
    setIsGameplayModalOpen(true);
  }

  const handleCloseGameplayModal = () => {
    setIsGameplayModalOpen(false);
  }

  const handleShareApp = useCallback(async () => {
    setShowShareSuccess(false);
    setShowShareError(false);

    const result = await handleShare();

    if (result === 'shared') {
      setShowShareSuccess(true);
      return;
    }

    if (result === 'error') {
      setShowShareError(true);
    }
  }, [handleShare]);

  return (
    <main className="container mx-auto px-4 sm:px-6  max-w-3xl">
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
          icon={<UserCircle className='w-6 h-6' />}
          onClick={handleEditUserProfile}
          hideForGuestUsers
        />

        {authUser && !isGuestAccount && (
          <UserNotificationsSettings />
        )}

        <ProfileSettingCard
          title='Appearance'
          description={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          icon={theme === 'dark' ? <Sun className='w-6 h-6' /> : <Moon className='w-6 h-6' />}
          onClick={toggleTheme}
        />

        <ProfileSettingCard
          title='How to Play'
          description='Learn about Scrummy gameplay and fantasy points'
          icon={<HelpCircle className='w-6 h-6' />}
          onClick={handleOpenGameplayModal}
        />

        <QaNoticeCard />

        <LicensingModal />

        <ProfileSettingCard
          title='Share app'
          description='Share Scrummy with friends'
          icon={<Share2 className='w-6 h-6' />}
          onClick={handleShareApp}
        />

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

      <Toast
        message="Thank you for sharing the app!"
        type="success"
        isVisible={showShareSuccess}
        onClose={() => setShowShareSuccess(false)}
      />

      <Toast
        message="Unable to share. Please try again."
        type="error"
        isVisible={showShareError}
        onClose={() => setShowShareError(false)}
      />
    </main>
  )
}
