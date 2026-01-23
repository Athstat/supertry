import { ReactNode, useEffect, useState } from "react";
import ScrummyMatrixBackground from "../ui/containers/ScrummyMatrixBackground";
import { AnimatePresence, motion } from "framer-motion";
import TabProgressDots from "../ui/bars/TabProgressDots";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import { preload } from "react-dom";

type Props = {
    slides: ReactNode[],
    preloadImages?: string[]
}

/** Renders an onboarding slideshow */
export default function OnboardingSlideShow({slides, preloadImages = []} : Props) {

    const [currIndex, setCurrentIndex] = useState<number>(0);

    const isWelcomeComplete = currIndex > slides.length - 2;

    const handleNextSlide = () => {
        setCurrentIndex(prev => Math.min(prev + 1, slides.length - 1));
    }

    const handleJumpToIndex = (index: number) => {
        setCurrentIndex(index);
    }

    useEffect(() => {
        preloadImages.forEach((i) => {
            preload(i, {as: 'image' });
        })
    }, [preloadImages]);

    return (
        <ScrummyMatrixBackground>
            <div className="flex flex-col w-full p-2 lg:px-[30%] h-[100vh] overflow-y-hidden white">
                <div className="flex flex-col overflow-y-auto no-scrollbar">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currIndex}
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '-100%' }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="flex flex-col items-center justify-center p-4 dark:text-white"
                        >
                            {slides[currIndex]}
                        </motion.div>
                    </AnimatePresence>

                </div>
                <div className="flex flex-1  w-full p-4 justify-end flex-col gap-4 items-center">
                    {!isWelcomeComplete && (
                        <PrimaryButton
                            onClick={handleNextSlide}
                            className="rounded-3xl w-fit p-4 h-10 w-22 px-10 py-2"
                        >
                            {'Continue'}
                        </PrimaryButton>
                    )}

                    {/* Progress Dots */}
                    <TabProgressDots items={slides} currIndex={currIndex} setIndex={handleJumpToIndex} />
                </div>
            </div>
        </ScrummyMatrixBackground>
    )
}
