import { useCallback, useMemo } from 'react';
import { analytics } from '../../services/analytics/anayticsService';
import { APP_GOOGLE_PLAYSTORE_LINK, APP_IOS_APPSTORE_LINK } from '../../types/constants';
import { isMobileWebView } from '../../utils/bridgeUtils';

export type ShareOutcome = 'shared' | 'cancelled' | 'error';

const SHARE_MESSAGE_PREFIX = 'Download SCRUMMY rugby Fantasy App 🏉🔥';

function getShareLink() {
  const oneLinkBase = import.meta.env.VITE_AF_ONELINK_BASE_URL;

  if (oneLinkBase) {
    return { link: oneLinkBase, source: 'onelink' } as const;
  }

  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isIOS = /iPad|iPhone|iPod/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);

  if (isIOS) {
    return { link: APP_IOS_APPSTORE_LINK, source: 'appstore_ios' } as const;
  }

  if (isAndroid) {
    return { link: APP_GOOGLE_PLAYSTORE_LINK, source: 'appstore_android' } as const;
  }

  return { link: APP_GOOGLE_PLAYSTORE_LINK, source: 'appstore_android' } as const;
}

function trackShare(link: string, source: string) {
  analytics.track('App_Shared', {
    share_link: link,
    share_link_source: source,
  });
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function useShareApp() {
  const shareDetails = useMemo(() => getShareLink(), []);
  const shareMessage = useMemo(
    () => `${SHARE_MESSAGE_PREFIX}\n${shareDetails.link}`,
    [shareDetails.link]
  );

  const handleShare = useCallback(async (): Promise<ShareOutcome> => {
    const hasWindow = typeof window !== 'undefined';
    const hasNavigator = typeof navigator !== 'undefined';
    const isMobileShareAvailable =
      hasWindow && isMobileWebView() && Boolean(window.CAN_USE_MOBILE_SHARE_API);

    if (isMobileShareAvailable && window.ReactNativeWebView) {
      const jsonObj = { message: shareMessage };

      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'NATIVE_SHARE',
          payload: JSON.stringify(jsonObj),
        })
      );

      trackShare(shareDetails.link, shareDetails.source);
      return 'shared';
    }

    if (hasNavigator && navigator.share) {
      try {
        await navigator.share({ text: shareMessage });
        trackShare(shareDetails.link, shareDetails.source);
        return 'shared';
      } catch (error) {
        if ((error as DOMException)?.name === 'AbortError') {
          return 'cancelled';
        }
      }
    }

    const copied = await copyToClipboard(shareMessage);
    if (copied) {
      trackShare(shareDetails.link, shareDetails.source);
      return 'shared';
    }

    return 'error';
  }, [shareDetails.link, shareDetails.source, shareMessage]);

  return {
    handleShare,
    shareMessage,
    shareLink: shareDetails.link,
    shareLinkSource: shareDetails.source,
  };
}
