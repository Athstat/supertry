import { twMerge } from "tailwind-merge";

type Props = {
  athlete: { image_url?: string },
  className?: string
}

export default function PlayerMugshot({ athlete, className }: Props) {

  const { image_url } = athlete;

  return (
    <img
      src={image_url}
      alt=""
      className={twMerge('overflow-clip w-16 h-16 rounded-full bg-slate-500 dark:bg-slate-600', className)}
    />
  )
}
