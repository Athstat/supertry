import { twMerge } from 'tailwind-merge'

type Props = {
    url?: string
    alt?: string
}

export default function TeamLogo({ url, alt }: Props) {


    return (
        <div className={twMerge("w-14 h-14")} >
            {url && <img src={url} alt={alt ?? "team_logo"} />}
            {!url && <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center"></div>}
        </div>
    )
}
