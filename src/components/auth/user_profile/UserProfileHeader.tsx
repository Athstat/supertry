import { motion } from "framer-motion"
import { DjangoAuthUser } from "../../../types/auth"
import { useState } from "react"
import AvatarPicker from "./avatar/AvatarPicker"
import { DefaultImage } from "../../../types/ui"
import UserAvatarCard from "./avatar/UserAvatarCard"
import { useEditAccountInfo } from "../../../hooks/auth/useEditAccountInfo"
import { Toast } from "../../ui/Toast"

type Props = {
    user: DjangoAuthUser,
    isGuestAccount?: boolean
}

export default function UserProfileHeader({ user, isGuestAccount }: Props) {

    const {handleSaveChanges, setForm, form, isLoading, error, setError} = useEditAccountInfo();

    const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(true);
    const toggleAvatarPickerModal = () => setShowAvatarPicker(prev => !prev);

    const handleChangeAvatar = (defaultImage: DefaultImage) => {
        setForm((prev) => {
            return {...prev, avatarUrl: defaultImage.image}
        });
    }

    const handleConfirm = async () => {
        await handleSaveChanges();
        toggleAvatarPickerModal();
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
        >
            <div className="flex items-center space-x-4">
               
                <UserAvatarCard 
                    className="w-[65px] h-[65px]"
                    iconCN="w-10 h-10"
                    imageUrl={user.avatar_url}
                    onClick={toggleAvatarPickerModal}
                />

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
                value={form.avatarUrl}
                onChange={handleChangeAvatar}
                isSaving={isLoading}
                onConfirm={handleConfirm}
            />

            {error && (
                <Toast 
                    isVisible={Boolean(error)}
                    type="error"
                    message={error}
                    onClose={() => setError(undefined)}
                />
            )}
        </motion.div>
    )
}
