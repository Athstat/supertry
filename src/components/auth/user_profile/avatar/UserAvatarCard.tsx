import { twMerge } from "tailwind-merge"

type Props = {
    imageUrl?: string,
    onClick?: () => void,
    className?: string
}

export default function UserAvatarCard({imageUrl, className} : Props) {

  return (
    <div className={twMerge(
        "w-[100px] h-[100px] overflow-clip rounded-full bg-red-500/40 cursor-pointer",
        className
    )} >
        <img 
            src={imageUrl}
        />
    </div>
  )
}
