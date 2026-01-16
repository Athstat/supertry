import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { createEmptyArray } from '../../../utils/fixtureUtils';
import { twMerge } from 'tailwind-merge';

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

    const AD_INTERVAL = 1000 * 10;
    const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);

    const adList = [sixNationsAd, sbrAd];
    const adListLength = adList.length;

    const currentAd = adList.at(currentAdIndex);
    const maxIndex = adListLength - 1;

    const moveIndex = useCallback(() => {
        const nextIndex = currentAdIndex === maxIndex ?
            0 : currentAdIndex + 1;

        setCurrentAdIndex(nextIndex)
    }, [currentAdIndex, maxIndex]);

    useEffect(() => {
        const interval = setInterval(() => {
            moveIndex();
        }, AD_INTERVAL);

        return () => {
            clearInterval(interval);
        }
    }, [AD_INTERVAL, moveIndex]);

    const handleChangeIndex = (newIndex: number) => {
        setCurrentAdIndex(newIndex);
    }

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
                        className="px-3 py-3 mt-2 rounded-md bg-transparent border border-white dark:border-white font-semibold text-xs text-white dark:text-white uppercase shadow-md transition-colors hover:bg-white hover:text-[#D94204E5] dark:hover:bg-white dark:hover:text-[#011E5C] whitespace-nowrap flex-shrink-0"
                    >
                        Play Now
                    </button>
                )}
            </div>

            <SliderIndicator
                length={adListLength}
                currentIndex={currentAdIndex}
                onClick={handleChangeIndex}
            />


        </div>
    );
}

type SliderIndicatorProps = {
    length: number,
    currentIndex?: number,
    onClick?: (newIndex: number) => void
}

function SliderIndicator({ length, currentIndex, onClick }: SliderIndicatorProps) {

    const items = createEmptyArray(length, 0);


    return (
        <div className='absolute flex flex-row items-center justify-center gap-1 bottom-0 left-0 w-full h-[20px]' >
            {items.map((_, index) => {

                const handleClick = () => {
                    if (onClick) {
                        onClick(index);
                    }
                }

                return (
                    <div
                        key={index}
                        onClick={handleClick}

                        className={twMerge(
                            'bg-[#011E5C] opacity-30 cursor-pointer w-2 h-2 rounded-full',
                            currentIndex === index && 'bg-[#011E5C] opacity-100'
                        )}
                    >

                    </div>
                )
            })}
        </div>
    )
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