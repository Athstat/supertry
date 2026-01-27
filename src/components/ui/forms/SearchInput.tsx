import { Search } from "lucide-react"
import InputField from "./InputField"
import { twMerge } from "tailwind-merge"


type Props = {
    value?: string,
    onChange?: (val?: string) => void,
    className?: string,
    placeholder?: string,
    inputCn?: string
}

/** Renders search input */
export default function SearchInput({value, onChange, className, placeholder = "Search players...", inputCn} : Props) {
  return (
    <>
        <InputField 
        
            className={twMerge(
              "w-full rounded-[20px] text-[#303133] dark:text-white",
              className
            )}

            inputCn={inputCn}
            placeholder={placeholder}
            icon={<Search className="w-[24px] h-[24px]" />}
            value={value}
            onChange={onChange}
        />
    </>
  )
}
