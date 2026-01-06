import { useEffect, useState } from 'react';
import { useQueryValue } from '../../hooks/useQueryState';
import ScrummyLogoHorizontal from '../../components/branding/scrummy_logo_horizontal';
import SecondaryText from '../../components/ui/typography/SecondaryText';
import { useTheme } from '../../contexts/ThemeContext';

import { GooglePlayButton, AppStoreButton } from 'react-mobile-app-button';
import { APP_GOOGLE_PLAYSTORE_LINK, APP_IOS_APPSTORE_LINK } from '../../types/constants';
import { Copy, Lock } from 'lucide-react';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import { InfoCard } from '../../components/ui/cards/StatCard';
import { Toast } from '../../components/ui/Toast';
import { analytics } from '../../services/analytics/anayticsService';
import { logger } from '../../services/logger';

/** Renders Screen to help show the user's how to except invitations
 * for the app
 */
export default function InviteStepsScreen() {
  const userName = useQueryValue('user_name');
  const leagueName = useQueryValue('league_name');
  const joinCode = useQueryValue('join_code');

  const { theme } = useTheme();

  const [message, setMessage] = useState<string>();

  // Optional AppsFlyer OneLink support: if VITE_AF_ONELINK_BASE_URL is set,
  // we build a single OneLink URL that preserves UTMs and extra context.
  const oneLinkBase = import.meta.env.VITE_AF_ONELINK_BASE_URL;

  //console.log('oneLinkBase', oneLinkBase);

  const oneLinkUrl = (() => {
    if (!oneLinkBase) return null;
    try {
      const params = new URLSearchParams(window.location.search);
      const url = new URL(oneLinkBase);

      // Standard UTM mappings to AppsFlyer params
      url.searchParams.set('pid', params.get('utm_source') || 'website'); // media source
      const campaign = params.get('utm_campaign');
      if (campaign) url.searchParams.set('c', campaign);

      const channel = params.get('utm_medium');
      if (channel) url.searchParams.set('af_channel', channel);

      const term = params.get('utm_term');
      if (term) url.searchParams.set('af_sub1', term);

      const content = params.get('utm_content');
      if (content) url.searchParams.set('af_sub2', content);

      // Extra context for analytics/debug
      if (joinCode) url.searchParams.set('af_sub3', (joinCode ?? '').toUpperCase());
      if (leagueName) url.searchParams.set('af_sub4', leagueName as string);
      if (userName) url.searchParams.set('af_sub5', userName as string);

      return url.toString();
    } catch {
      return null;
    }
  })();

  //console.log('oneLinkUrl', oneLinkUrl);

  // Track landing with UTM context
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const utm = {
        utm_source: params.get('utm_source') || undefined,
        utm_medium: params.get('utm_medium') || undefined,
        utm_campaign: params.get('utm_campaign') || undefined,
        utm_id: params.get('utm_id') || undefined,
        utm_term: params.get('utm_term') || undefined,
        utm_content: params.get('utm_content') || undefined,
        has_one_link: !!oneLinkUrl,
        league_name: leagueName || undefined,
        user_name: userName || undefined,
        join_code: (joinCode ?? '').toUpperCase() || undefined,
      };
      analytics.track('[Marketing] Invite Steps Viewed', utm);
    } catch (e) {
      logger.error('Error ', e);
    }
  }, [oneLinkUrl, leagueName, userName, joinCode]);

  const handleCopyEntryCode = () => {
    if (joinCode) {
      navigator.clipboard.writeText(joinCode ?? '');
      setMessage('Entry code was copied to clip board');
    }
  };

  return (
    <div className="dark:bg-black dark:text-white w-[100%] lg:px-[30%] pb-20 h-[100vh] overflow-y-auto p-4 gap-4 flex flex-col items-center ">
      <div className="flex flex-row items-center justify-center h-20">
        <ScrummyLogoHorizontal />
      </div>

      <div className="flex flex-col items-center gap-4 justify-center">
        <h1 className="font-bold text-xl text-black dark:text-white">{leagueName}</h1>
        <SecondaryText className="text-center w-4/5 lg:w-[1/2] text-slate-700">
          Congrats! You have been invited by <strong>{userName}</strong> to join{' '}
          <strong>{leagueName}</strong>. Time to join the scrum!
        </SecondaryText>
      </div>

      <div className="flex flex-col gap-6 w-full p-4">
        <div className="flex flex-row w-full items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 items-center flex flex-col justify-center text-white">
            <p className="text-lg font-bold">1</p>
          </div>

          <div>
            <p className="text-lg font-semibold">Download SCRUMMY App</p>
          </div>
        </div>

        <div className="flex flex-col w-full gap-4">
          <GooglePlayButton
            url={oneLinkUrl ?? APP_GOOGLE_PLAYSTORE_LINK}
            theme={theme === 'dark' ? 'dark' : 'dark'}
            className="w-[300px] text-nowrap p-4"
            width={300}
            height={60}
          />

          <AppStoreButton
            url={oneLinkUrl ?? APP_IOS_APPSTORE_LINK}
            theme={theme === 'dark' ? 'dark' : 'dark'}
            width={300}
            height={60}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full p-4">
        <div className="flex flex-row w-full items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 items-center flex flex-col justify-center text-white">
            <p className="text-lg font-bold">2</p>
          </div>

          <div>
            <p className="text-lg font-semibold">Create Account</p>
          </div>
        </div>

        <div className="flex flex-col w-full gap-4">
          <p>Create your profile (or log in) and setup your own SCRUMMY profile.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full p-4">
        <div className="flex flex-row w-full items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 items-center flex flex-col justify-center text-white">
            <p className="text-lg font-bold">3</p>
          </div>

          <div>
            <p className="text-lg font-semibold">
              Use Join code <strong>{(joinCode ?? '').toUpperCase()}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full gap-4">
          <p>
            Heag to the Leagues Screen and tap on 'Join by code' and enter{' '}
            <strong>{(joinCode ?? '').toUpperCase()}</strong> to join <strong>{leagueName}</strong>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <InfoCard label="Entry Code" value={joinCode ?? '-'} icon={<Lock className="w-4 h-4" />} />

        <PrimaryButton onClick={handleCopyEntryCode}>
          <Copy />
          Copy Entry Code
        </PrimaryButton>

        <Toast
          isVisible={message !== undefined}
          onClose={() => setMessage(undefined)}
          message={message ?? ''}
          type="info"
        />
      </div>
    </div>
  );
}
