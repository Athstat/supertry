import { twMerge } from "tailwind-merge"
import { FilterListOption } from "../../../types/ui"

type Props = {
    options: FilterListOption[],
    onChange?: (fieldName?: string) => void,
    className?: string
    value?: string
}

/** Filter List Component */
export default function FilterList({options, onChange, className, value}: Props) {

  return (
    <div className={twMerge(
        "flex flex-row items-center flex-wrap gap-2",
        className
    )} >
        {options.map((o, index) => {
            return <FilterListItem 
                option={o}
                key={`${index}-${o.value}`}
                isCurrent={value === o.value}
                onClick={onChange}
            />
        })}
    </div>
  )
}

type FilterListItemProps = {
    option: FilterListOption,
    onClick?: (field?: string) => void,
    isCurrent?: boolean
}

function FilterListItem({option, onClick, isCurrent} : FilterListItemProps) {
    const handleClick = () => {
        if (onClick) {

            if (isCurrent) {
                onClick(undefined);
            } else {
                onClick(option.value);
            }

        }
    }

    return (
        <div 
            onClick={handleClick} 
            className={twMerge(
                "border cursor-pointer dark:border-slate-700 rounded-full px-3 py-2 text-sm",
                isCurrent && 'bg-blue-500 dark:bg-blue-600 border-blue-500 dark:border-blue-500'
            )}
        >
            <p>{option.label}</p>
        </div>
    )
}