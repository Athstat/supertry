import { User } from "lucide-react"
import { motion } from "framer-motion"
import { DjangoAuthUser } from "../../../types/auth"
import { useState } from "react"
import AvatarPicker from "./avatar/AvatarPicker"
import { DefaultImage } from "../../../types/ui"

type Props = {
    user: DjangoAuthUser,
    isGuestAccount?: boolean
}

export default function UserProfileHeader({ user, isGuestAccount }: Props) {

    const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(true);
    const toggleAvatarPickerModal = () => setShowAvatarPicker(prev => !prev);

    const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(user.avatar_url);

    const handleChangeAvatar = (defaultImage: DefaultImage) => {
        setUserAvatarUrl(defaultImage.image);
    }

    console.log("User Avatar ", userAvatarUrl);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
        >
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user?.username || user?.first_name || 'Guest User'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isGuestAccount ? 'Guest Account' : user?.email}
                    </p>
                </div>
            </div>

            <AvatarPicker 
                isOpen={showAvatarPicker}
                onClose={toggleAvatarPickerModal}
                value={userAvatarUrl}
                onChange={handleChangeAvatar}
            />
        </motion.div>
    )
}
