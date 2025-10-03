import PageView from './PageView';
import UpcomingFixturesSection from '../components/dashboard/UpcomingFixturesSection';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeaturedFantasyLeagueGroups from './FeaturedFantasyLeagueGroups';
import ClaimAccountNoticeCard from '../components/auth/guest/ClaimAccountNoticeCard';
import PrimaryButton from '../components/shared/buttons/PrimaryButton';
import RoundedCard from '../components/shared/RoundedCard';
import { GamePlayHelpButton } from '../components/branding/help/LearnScrummyNoticeCard';
import { useEffect, useState } from 'react';
import PushOptInModal from '../components/ui/PushOptInModal';
import {
  isBridgeAvailable,
  requestPushPermissions,
  getPushPermissionStatus,
} from '../utils/bridgeUtils';
import { authService } from '../services/authService';
import GameStoriesCarrousel from '../components/dashboard/stories/GameStoriesCarrousel';
import Experimental from '../components/shared/ab_testing/Experimental';

export function DashboardScreen() {
  const navigate = useNavigate();
  const [showPushModal, setShowPushModal] = useState(false);
  const [showSettingsNote, setShowSettingsNote] = useState(false);
  const [pushPermissionStatus, setPushPermissionStatus] = useState<
    'granted' | 'denied' | 'prompt' | 'unknown'
  >('unknown');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isBridgeAvailable()) return;
      try {
        const userInfo = await authService.getUserInfo();
        const kcId = userInfo?.kc_id;
        if (!kcId) return;

        const hasPushId = !!localStorage.getItem('onesignal_id');
        const dismissed = localStorage.getItem('push_optin_dismissed') === 'true';
        const firstSeenKey = `dashboard_seen_user_${kcId}`;
        const settingsNoteSeenKey = `push_settings_note_seen_user_${kcId}`;
        const hasSeenDash = localStorage.getItem(firstSeenKey) === 'true';

        if (!hasSeenDash) {
          localStorage.setItem(firstSeenKey, 'true');
          if (!hasPushId && !dismissed && !cancelled) {
            setShowPushModal(true);
          } else if (
            !hasPushId &&
            dismissed &&
            localStorage.getItem(settingsNoteSeenKey) !== 'true' &&
            !cancelled
          ) {
            setShowSettingsNote(true);
          }
        }
      } catch {
        // no-op
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Query push permission status on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!isBridgeAvailable()) return;
        const status = await getPushPermissionStatus();
        if (!cancelled) setPushPermissionStatus(status);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep settings note in sync with denied/granted status
  useEffect(() => {
    if (pushPermissionStatus === 'denied') {
      setShowSettingsNote(true);
    } else if (pushPermissionStatus === 'granted') {
      setShowSettingsNote(false);
    }
  }, [pushPermissionStatus]);

  const handleBannerClick = () => {
    navigate('/leagues');
  };

  return (
    <PageView className="flex flex-col space-y-4 p-4">

      <div className='flex flex-row items-center justify-between' >
        <div className="flex flex-row items-center gap-2">
          <Home />
          <p className="text-xl font-extrabold">Dashboard</p>
        </div>

        <div>
          <GamePlayHelpButton />
        </div>
      </div>

      <Experimental>
        <GameStoriesCarrousel />
      </Experimental>

      {/* <HeroImageBanner link={'/images/wwc_2025_banner.jpg'} onClick={handleBannerClick} /> */}

      {/* <FeaturedPlayersCarousel /> */}

      <ClaimAccountNoticeCard />

      {showSettingsNote && (
        <RoundedCard className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-yellow-800 dark:text-yellow-200">
              Enable push notifications
            </p>
            <p className="text-sm text-yellow-800/90 dark:text-yellow-300/90">
              Notifications are currently disabled. To receive match updates and alerts, enable push
              notifications for Scrummy in your phone settings.
            </p>
            <div className="flex justify-end">
              <PrimaryButton
                onClick={() => {
                  if (pushPermissionStatus === 'denied') {
                    // Permanent note: do not dismiss while OS-level notifications are disabled
                    return;
                  }
                  try {
                    const kcId = authService.getUserInfoSync()?.kc_id;
                    if (kcId) {
                      localStorage.setItem(`push_settings_note_seen_user_${kcId}`, 'true');
                    }
                  } catch {;}
                  setShowSettingsNote(false);
                }}
                className="px-4 py-2 rounded-lg"
              >
                OK
              </PrimaryButton>
            </div>
          </div>
        </RoundedCard>
      )}

      <FeaturedFantasyLeagueGroups />

      {/* <ActionList /> */}
      <UpcomingFixturesSection hidePastFixtures />
      {/* <ComparePlayersPanel /> */}
      {/* <MyWeekPanel /> */}
      {/* <MyTeamsSection /> */}

      <RoundedCard className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-lg">Dominate the SCRUMM</h1>
          <p>
            Leagues are live! 🎉 Create your own, join one, and challenge your friends. Invite your
            crew and see who really rules the game!
          </p>
        </div>

        <PrimaryButton onClick={handleBannerClick}>Take Me There</PrimaryButton>
      </RoundedCard>

      <PushOptInModal
        visible={showPushModal}
        onEnable={async () => {
          try {
            const granted = await requestPushPermissions();
            setPushPermissionStatus(granted ? 'granted' : 'denied');
            if (!granted) {
              try {
                const kcId = authService.getUserInfoSync()?.kc_id;
                if (kcId) {
                  const settingsNoteSeenKey = `push_settings_note_seen_user_${kcId}`;
                  if (localStorage.getItem(settingsNoteSeenKey) !== 'true') {
                    setShowSettingsNote(true);
                  }
                }
              } catch {;}
            }
          } catch {
            // swallow error and proceed to hide modal
            ;
          } finally {
            setShowPushModal(false);
          }
        }}
        onNotNow={() => {
          try {
            localStorage.setItem('push_optin_dismissed', 'true');
            const kcId = authService.getUserInfoSync()?.kc_id;
            if (kcId) {
              const settingsNoteSeenKey = `push_settings_note_seen_user_${kcId}`;
              if (localStorage.getItem(settingsNoteSeenKey) !== 'true') {
                setShowSettingsNote(true);
              }
            }
          } catch {;}
          setShowPushModal(false);
        }}
      />
    </PageView>
  );
}
