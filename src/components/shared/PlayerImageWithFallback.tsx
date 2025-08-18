import { useEffect, useState } from 'react';
import { ScrummyDarkModeLogo } from '../branding/scrummy_logo';

type Props = {
  primarySrc?: string | null;
  teamId?: string | null;
  alt?: string;
  // Applied to the <img> when using the primary image
  primaryImgClassName?: string;
  // Wrapper <div> when using team fallback
  teamWrapperClassName?: string;
  // Applied to the <img> when using team fallback
  teamImgClassName?: string;
  // Wrapper <div> when showing Scrummy fallback
  scrummyWrapperClassName?: string;
  // Applied to the Scrummy logo
  scrummyClassName?: string;
};

/**
 * Displays an image with a fallback chain:
 * 1) primarySrc (player image)
 * 2) team logo derived from teamId
 * 3) Scrummy logo
 */
export default function PlayerImageWithFallback({
  primarySrc,
  teamId,
  alt = '',
  primaryImgClassName,
  teamWrapperClassName,
  teamImgClassName,
  scrummyWrapperClassName,
  scrummyClassName,
}: Props) {
  const primaryImageUrl = primarySrc ?? null;
  const teamFallbackUrl = teamId
    ? `https://athstat-landing-assets-migrated.s3.us-east-1.amazonaws.com/logos/${teamId}-ph-removebg-preview.png`
    : null;

  const [src, setSrc] = useState<string | null>(primaryImageUrl ?? teamFallbackUrl);

  useEffect(() => {
    setSrc(primaryImageUrl ?? teamFallbackUrl ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryImageUrl, teamFallbackUrl]);

  const handleError = () => {
    if (src && primaryImageUrl && src === primaryImageUrl) {
      if (teamFallbackUrl) setSrc(teamFallbackUrl);
      else setSrc(null);
    } else if (src && teamFallbackUrl && src === teamFallbackUrl) {
      setSrc(null);
    } else {
      setSrc(null);
    }
  };

  if (src && teamFallbackUrl && src === teamFallbackUrl) {
    return (
      <div className={teamWrapperClassName}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={src} alt={alt} onError={handleError} className={teamImgClassName} />
      </div>
    );
  }

  if (src) {
    return (
      // eslint-disable-next-line jsx-a11y/alt-text
      <img src={src} alt={alt} onError={handleError} className={primaryImgClassName} />
    );
  }

  return (
    <div className={scrummyWrapperClassName}>
      <ScrummyDarkModeLogo className={scrummyClassName} />
    </div>
  );
}
