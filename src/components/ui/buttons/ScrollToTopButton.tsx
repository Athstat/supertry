import { ArrowUp } from "lucide-react";
import { useInView } from "react-intersection-observer";
import PrimaryButton from "./PrimaryButton";
import { twMerge } from "tailwind-merge";

type Props = {
    className?: string
}

/** Renders button to scroll back to the top of a screen */
export default function ScrollToTopButton({className} : Props) {

    const { ref: topPageRef, inView: isTopPageRefVisible } = useInView();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div>

            <div ref={topPageRef} ></div>

            {!isTopPageRefVisible && (
                <PrimaryButton
                    className={twMerge(
                        "fixed bottom-20 right-0 rounded-full w-11 h-11 shadow-md mx-4",
                        className
                    )}
                    onClick={scrollToTop}
                >
                    <ArrowUp />
                </PrimaryButton>
            )}
        </div>
    )
}
