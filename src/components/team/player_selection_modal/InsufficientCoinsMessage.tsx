import { twMerge } from "tailwind-merge"

type Props = {
    className?: string
}

export default function InsufficientCoinsMessage({ className }: Props) {

    const message = `No players available within your current budget. Free up some coins and try again.`

    return (
        <div className={twMerge(
            "flex flex-col p-5 items-center justify-center",
            className
        )} >
            {message}
        </div>
    )
}
