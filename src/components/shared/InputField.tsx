import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
    value?: string,
    onChange?: (newVal?: string) => void,
    label?: string,
    type?: string,
    id?: string,
    inputCn?: string,
    labelCn?: string,
    className?: string,
    icon?: ReactNode,
    placeholder?: string,
    required?: boolean
}

export default function InputField({value, onChange, label, type, id, inputCn, labelCn, className, icon, placeholder, required} : Props) {

    const handleInputChange = (newVal?: string) => {
        if (onChange) {
            onChange(newVal)
        }
    }

    return (
        <div className={twMerge(className)} >
            {label && <label
                htmlFor={id}
                className={twMerge(
                    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                    labelCn
                )}
            >
                {label}

            </label>}

            <div className="relative">
                <input
                    id={id}
                    type={type}
                    required={required}
                    className={twMerge(
                        "w-full px-4 py-3 bg-white dark:bg-dark-800/40 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100",
                        inputCn
                    )}
                    value={value}
                    onChange={e => handleInputChange(e.target.value)}
                    placeholder={placeholder}
                />
                {icon}
            </div>
        </div>
    )
}
