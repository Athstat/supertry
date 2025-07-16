import { AnimatePresence, motion } from "framer-motion"

type Props = {
    error?: string
}

export default function FormErrorText({ error }: Props) {

    const show = error !== undefined;

    return (
        <div>
            <AnimatePresence>
                {show && (
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="text-red-500 dark:text-red-400"
                    >
                        <p>{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
