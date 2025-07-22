import UserNotificationsSettings from '../components/settings/UserNotificationsSettings';
import LicensingModal from '../components/branding/licensing/LicensingModel';
import { authUserAtom, isGuestUserAtom } from '../state/authUser.atoms';
import { ScopeProvider } from 'jotai-scope';
import AuthUserDataProvider from '../components/auth/AuthUserDataProvider';
import { useAtomValue } from 'jotai';
import UserProfileHeader from '../components/auth/UserProfileHeader';
import ClaimGuestAccountBox from '../components/auth/ClaimGuestAccountBox';
import LogoutButton from '../components/auth/LogoutButton';
import DeleteAccountButton from '../components/auth/DeleteAccountButton';

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

        {/* Complete Profile Card for Guest Users */}
        {isGuestAccount && <ClaimGuestAccountBox />}

        {authUser && (
          <UserNotificationsSettings databaseUser={authUser} />
        )}

        <LicensingModal />

        {/* Logout Button */}
        <LogoutButton
          isGuestAccount={isGuestAccount}
        />

        <DeleteAccountButton
          isGuestAccount={isGuestAccount}
        />
      </div>
    </main>
  )
}