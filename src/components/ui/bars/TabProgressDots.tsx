import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

type Props = {
    items: unknown[],
    currIndex?: number,
    setIndex?: (newIndex: number) => void
}

/** Renders Progress Dots for Tab Movement */
export default function TabProgressDots({currIndex, items, setIndex} : Props) {
    
    const handleSetIndex = (index: number) => {
        
        if (setIndex) {
            setIndex(index);
        }
    }
    
    return (
        <div className="flex flex-row items-center gap-1 justify-center" >
            {items.map((_, index) => {

                const curr = index === currIndex;

                return (
                    <motion.div
                        key={index}
                        onClick={() => handleSetIndex(index)}
                        initial={{ width: curr ? 12 : 4 }}
                        className={twMerge(
                            "rounded-full h-3 bg-slate-300 dark:bg-slate-700",
                        )}

                        animate={{
                            width: curr ? 40 : 10,
                            transition: {
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                            },
                        }}
                    >

                    </motion.div>
                )
            })}
        </div>
    )
}
