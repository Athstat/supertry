import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

type AdItem = {
    title?: string,
    description?: string,
    ctaButton?: string,
    ctaLinkButton?: string,
    imageUrl?: string,
    titleClassName?: string,
    descriptionClassName?: string,
}

export default function DashboardAdSection() {

    const navigate = useNavigate();

    const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);

    const adList = [sixNationsAd, sbrAd];
    const currentAd = adList.at(currentAdIndex);
    const maxIndex = adList.length - 1;

    const moveIndex = useCallback(() => {
        const nextIndex = currentAdIndex === maxIndex ?
            0 : currentAdIndex + 1;

        setCurrentAdIndex(nextIndex)
    }, [currentAdIndex, maxIndex]);

    useEffect(() => {
        const interval = setInterval(() => {
            moveIndex();
        }, 10000);

        return () => {
            clearInterval(interval);
        }
    }, [moveIndex]);

    if (!currentAd) {
        return null;
    }

    return (
        <div className="relative w-full shadow-md">

            <div className="w-full h-fit pointer-events-none">
                <img
                    src={currentAd.imageUrl}
                    alt="Rugby players"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* Content */}
            <div className="absolute z-10 w-full top-0 right-0 flex flex-col items-end justify-end p-6">
                {/* Title */}
                <h2
                    className={currentAd.titleClassName}
                    style={{ fontFamily: 'Race Sport, sans-serif' }}
                >
                    {currentAd.title}
                </h2>
                <p className={currentAd.descriptionClassName}>{currentAd.description}</p>

                {/* Button */}
                {currentAd.ctaLinkButton && <p
                    onClick={() => navigate('/schools')}
                    className="font-semibold text-sm text-[#011E5C] underline mt-8 cursor-pointer"
                >
                    See What's Happening
                </p>}

                {currentAd.ctaButton && (
                    <button
                        onClick={() => navigate('/leagues')}
                        className="px-3 py-3.5 mt-2 rounded-md bg-transparent border border-white dark:border-white font-semibold text-xs text-white dark:text-white uppercase shadow-md transition-colors hover:bg-[#011E5C] hover:text-white dark:hover:bg-white dark:hover:text-[#011E5C] whitespace-nowrap flex-shrink-0"
                    >
                        Play Now
                    </button>
                )}
            </div>


        </div>
    );
}


const sbrAd: AdItem = {
    title: "SCHOOL RUGBY '26",
    description: "Games - Data - Players",
    ctaLinkButton: "See What's Happening",
    imageUrl: '/images/dashboard/sbr_cta_bg_v4.png',
    titleClassName: 'text-end font-bold text-md leading-6 text-[#011E5C] w-[80%]',
    descriptionClassName: "text-end -mt-2 font-semibold text-sm text-gray-800"
}

const sixNationsAd: AdItem = {
    title: 'M6 NATIONS FANTASY',
    description: 'Win more than bragging rights!',
    ctaButton: 'Play Now',
    imageUrl: '/images/dashboard/6nations_ad.png',
    titleClassName: 'text-end font-bold lg:text-xl leading-6 text-white w-[80%]',
    descriptionClassName: "text-end text-xs lg:text-md font-semibold text-white"
}