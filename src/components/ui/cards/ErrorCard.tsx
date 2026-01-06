type Props = {
    title?: string
    message?: string,
    error?: string,
    hideIfNoMessage?: boolean,
    className?: string
}

/** Renders an error card */
export default function ErrorCard({message, title, error, hideIfNoMessage} : Props) {
  
  if (!message && hideIfNoMessage) {
    return null;
  }
  
  return (
    <div className='flex flex-col mt-4 h-full border border-red-300 dark:border-red-700/30 items-center justify-center gap-2 bg-red-200 dark:bg-red-900/30 p-3 rounded-xl' >
        {(title || error) && <p className="text-red-500 font-semibold" >{title || error}</p>}
        {message && <p className="text-red-500" >{message}</p>}
    </div>
  )
}
