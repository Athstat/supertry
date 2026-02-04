import { Search } from "lucide-react"
import InputField from "./InputField"
import { twMerge } from "tailwind-merge"


type Props = {
    value?: string,
    onChange?: (val?: string) => void,
    className?: string,
    placeholder?: string
}

/** Renders search input */
export default function SearchInput({value, onChange, className, placeholder = "Search players..."} : Props) {
  return (
    <>
        <InputField 
        
            className={twMerge(
              "w-full",
              className
            )}

            inputCn="rounded-[20px] px-6"
            placeholder={placeholder}
            icon={<Search className="mr-2" />}
            value={value}
            onChange={onChange}
        />
    </>
  )
}
