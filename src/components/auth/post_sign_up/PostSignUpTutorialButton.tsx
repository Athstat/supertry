import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";


export default function PostSignUpTutorialButton() {

    const handleWatchTutorial = () => {
        // does nothing right now
    }

    return;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        delay: 0,
                    },
                },
            }}
            className="bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
            whileHover={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 },
            }}
            onClick={handleWatchTutorial}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-3">
                        <ChevronRight
                            size={20}
                            className="text-blue-600 dark:text-blue-400"
                        />
                    </div>
                    <h3 className="font-semibold text-lg dark:text-white">
                        Watch Tutorial
                    </h3>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
            </div>
        </motion.div>
    )
}
