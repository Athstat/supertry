import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PostSignUpDashboardButton() {

    const navigate = useNavigate();

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
                        delay: 0.3,
                    },
                },
            }}
            className="bg-white dark:bg-dark-800/50 border border-gray-300 dark:border-slate-700 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
            whileHover={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 },
            }}
            onClick={() => navigate("/dashboard")}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full mr-3">
                        <ChevronRight
                            size={20}
                            className="text-green-600 dark:text-green-400"
                        />
                    </div>
                    <h3 className="font-semibold dark:text-white">
                        Go to Dashboard
                    </h3>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
            </div>
        </motion.div>
    )
}
