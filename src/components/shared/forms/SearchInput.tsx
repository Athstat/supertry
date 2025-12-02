import { Search } from "lucide-react"
import InputField from "../InputField"
import { twMerge } from "tailwind-merge"


type Props = {
    value?: string,
    onChange?: (val?: string) => void,
    className?: string
}

/** Renders search input */
export default function SearchInput({value, onChange, className} : Props) {
  return (
    <>
        <InputField 
        
            className={twMerge(
              "w-full",
              className
            )}

            inputCn="outline-none focus:ring-0"
            placeholder="Search players..."
            icon={<Search />}
            value={value}
            onChange={onChange}
        />
    </>
  )
}
