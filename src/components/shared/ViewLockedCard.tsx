import {Lock} from "lucide-react";

type Props = {
    message: string
}

/** Renders a card used to signal to the user that a certain view is locked */
export function LockedViewCard({message} : Props) {

  return (
    <div className="w-full h-full flex flex-col items-center text-center gap-4 justify-center text-slate-700 dark:text-slate-400 px-5" >
      <Lock className="w-14 h-14" />
      <p className="font text-md text-center w-2/3 text-sm lg:text-base" >{message}</p>
    </div>
  )
}