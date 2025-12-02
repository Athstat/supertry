import { twMerge } from "tailwind-merge";

type CaptainProps = {
    className?: string
}

export function CaptainsArmBand({className} : CaptainProps) {
    return (
        <div className={twMerge(
            "w-8 h-5 bg-black rounded-md flex items-center justify-center text-white dark:bg-white dark:text-black text-sm",
            className
        )} >
            <p >C</p>
        </div>
    )
}