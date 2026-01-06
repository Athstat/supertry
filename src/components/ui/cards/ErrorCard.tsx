type Props = {
    title?: string
    message?: string
}

/** Renders an error card */
export default function ErrorCard({message, title} : Props) {
  return (
    <div className='flex flex-col gap-2 items-center justify-center min-h-[100px] rounded-xl' >
        <p className="text-red-500 font-semibold" >{title}</p>
        <p className="text-red-500" >{message}</p>
    </div>
  )
}
