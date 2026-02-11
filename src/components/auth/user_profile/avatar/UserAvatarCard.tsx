import { User } from "lucide-react";
import { useState } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    imageUrl?: string,
    onClick?: () => void,
    className?: string,
    iconCN?: string
}

export default function UserAvatarCard({ imageUrl, className, onClick, iconCN }: Props) {

    const [error, setError] = useState<boolean>(false);

    if (error || !imageUrl) {
        return (
            <div
                className={twMerge(
                    "w-[100px] h-[100px] cursor-pointer bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center",
                    className
                )}

                onClick={onClick}
            >
                <User className={twMerge(
                    "w-12 h-12 text-primary-600 dark:text-primary-400",
                    iconCN
                )} />
            </div>
        )
    }

    return (
        <div

            className={twMerge(
                "w-[100px] h-[100px] border border-slate-200 dark:border-slate-700 overflow-clip rounded-full bg-slate-400/40 dark:bg-slate-600 cursor-pointer",
                className
            )}

            onClick={onClick}

            onError={() => setError(true)}
        >
            <img
                src={imageUrl}
            />
        </div>
    )
}
