import { twMerge } from "tailwind-merge";
import RoundedCard from "../shared/RoundedCard";
import SecondaryText from "../shared/SecondaryText";
import { useDebounced } from "../../hooks/useDebounced";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
    username: string,
    firstName?: string,
    lastName?: string
}

/** Renders card to display account info progress */
export default function AccountInfoProgressCard({ username, firstName, lastName }: Props) {

    const profileItems = [username, firstName, lastName];

    const itemsCompleted = profileItems.reduce((sum, curr) => {
        if (Boolean(curr) && curr && curr?.length >= 3) {
            return sum + 1;
        }

        return sum;
    }, 0);

    const perc = Math.floor((itemsCompleted / profileItems.length) * 100);
    const percentageCompleted = useDebounced(perc, 1000)

    return (
        <RoundedCard className="p-4 bg-white dark:border-none flex flex-col gap-2" >

            <div
                className="flex flex-row bg-slate-200 dark:bg-slate-700 w-full h-[6px] rounded-xl overflow-clip"
            >
                <AnimatePresence>
                    <motion.div
                        className={twMerge(
                            "flex flex-row bg-blue-500 w-full h-[6] rounded-xl overflow-clip",
                            percentageCompleted === 100 && "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-700"
                        )}

                        initial={{
                            opacity: 0
                        }}
                        
                        animate={{
                            opacity: 1
                        }}

                        style={{
                            width: `${percentageCompleted}%`
                        }}
                    ></motion.div>
                </AnimatePresence>

            </div>

            <div>
                <AnimatePresence>
                    <motion.div
                        className="flex flex-row items-center gap-1"
                    >
                        <p className="font-semibold text-xl" >{percentageCompleted}% Complete</p>
                    </motion.div>
                </AnimatePresence>

                <SecondaryText>Complete your profile to fully express yourself on the SCRUM!</SecondaryText>
            </div>

        </RoundedCard>
    )
}
