import { Eye, EyeOff } from 'lucide-react'
import { ReactNode, useState } from 'react'
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
    required?: boolean,
    minLength?: number
}

export default function InputField({value, onChange, label, type, id, inputCn, labelCn, className, icon, placeholder, required, minLength} : Props) {

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
                        icon && "pr-12",
                        inputCn
                    )}
                    value={value}
                    onChange={e => handleInputChange(e.target.value)}
                    placeholder={placeholder}
                    defaultValue={""}
                    minLength={minLength}
                />
                {icon && (
                    <div className="absolute inset-y-0 right-0 flex text-slate-700 dark:text-slate-400  items-center pr-3">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    )
}

type PasswordInputProps = {
    value?: string,
    onChange?: (value?: string) => void,
    label?: string,
    placeholder?: string,
    id?: string,
    minLength?: number
}

export function PasswordInputField({value, onChange, placeholder, label, id, minLength} : PasswordInputProps) {

    const [showPassword, setShowPassword] = useState<boolean>(false); 

    const toggleVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <InputField 
            value={value}
            onChange={onChange}
            label={label ?? "Password"}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder ?? "Password"}
            required
            id={id}
            minLength={minLength}
            icon={
                <button
                    type="button"
                    onClick={toggleVisibility}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                    {!showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            }
        />
    )
}
