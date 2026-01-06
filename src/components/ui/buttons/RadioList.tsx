import { twMerge } from "tailwind-merge"
import { RadioListOption } from "../../../types/ui"
import SecondaryText from "../typography/SecondaryText"

type Props = {
  options: RadioListOption[],
  title?: string,
  description?: string,
  disabled?: boolean,
  value?: string,
  onChange?: (newVal: string) => void,
  className?: string
}

/** Renders a Radio List Component */
export default function RadioList({ title, description, options, value, onChange, className }: Props) {
  return (
    <div className={twMerge(
      "flex flex-col gap-2",
      className
    )} >
      <div>
        <p>{title}</p>
        <SecondaryText className="text-xs" >{description}</SecondaryText>
      </div>

      <div className="flex flex-col gap-1" >
        {options.map((p, index) => {
          return <Option
            option={p}
            value={value}
            onChange={onChange}
            key={index}
          />
        })}
      </div>
    </div>
  )
}

type OptionProp = {
  option: RadioListOption,
  onChange?: (newVal: string) => void,
  value?: string
}

function Option({ option, value, onChange }: OptionProp) {

  const isCurrent = value === option.value;

  const handleClick = () => {
    if (onChange) {
      onChange(option.value);
    }
  }

  return (
    <div
      onClick={handleClick}
      className="flex flex-row items-center gap-1 cursor-pointer"
    >

      <div className={twMerge(
        "w-4 h-4 rounded-full flex flex-col p-[1.5px] items-center justify-center border dark:border-slate-400 border-slate-500",
        isCurrent && ""
      )} >
        {isCurrent && <div className={twMerge(
          "w-full h-full dark:bg-white bg-slate-500 rounded-full"
        )} >

        </div>}
      </div>

      <p className="text-xs" >{option.label}</p>

    </div>
  )
}