import { Globe, Lock } from "lucide-react"
import SecondaryText from "../../shared/SecondaryText"
import { twMerge } from "tailwind-merge"
import { ReactNode } from "react"

type Visibility = "private" | "public"

type Props = {

    /** When true league is private */
    value: Visibility,
    onChange: (v: Visibility) => void,

}

export default function LeagueVisibilityInput({ value, onChange }: Props) {

    const options: OptionItem[] = [
        {
            label: "Public",
            description: `
                Anyone can join your league, you have no control 
                over who can enter and who can't enter but you 
                can dismiss players
            `,

            icon: <Globe className="w-4 h-4 text-slate-800 dark:text-slate-600" />,
            iconWhenSelected: <Globe className="w-4 h-4 text-primary-500" />,
            value: "public"

        },

        {
            label: "Invite Only",
            description: `
                Access to your league is is restricted. People can only join your league through invite
            `,

            icon: <Lock className="w-4 h-4 text-slate-800 dark:text-slate-600" />,
            iconWhenSelected: <Lock className="w-4 h-4 text-primary-500" />,
            value: "private"

        }
    ]

    return (
        <div className="flex flex-col gap-1" >
            <label>Visibility</label>

            <div className="flex flex-row items-start justify-start gap-2" >
                {options.map((option, index) => {

                    const isSelected = value === option.value;

                    const handleSelect = () => {
                        onChange(option.value);
                    }

                    return (
                        <div
                            key={index}
                            className={twMerge(
                                "flex flex-col gap-2 flex-1 p-3 border-2 w-full h-[200px] cursor-pointer border-slate-200 dark:border-slate-700 rounded-lg",
                                "flex flex-col gap-2 flex-1 p-3 border-2 w-full h-[200px] cursor-pointer border-slate-200 dark:border-slate-700 rounded-lg",
                                isSelected && "border-primary-500 dark:border-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/40 hover:dark:bg-primary-900/60",
                                !isSelected && "hover:bg-slate-100 hover:dark:bg-slate-800"
                            )}
                            onClick={handleSelect}
                        >


                            <div className="flex flex-row items-center gap-2 justify-between" >

                                <div className="flex flex-row items-center gap-2" >
                                    <> {isSelected ? option.iconWhenSelected : option.icon}</>
                                    <p className={twMerge(
                                        // isSelected && "text-blue-500 font-bold"
                                    )} >{option.label}</p>
                                </div>

                                <div className={twMerge(
                                    "w-5 h-5 rounded-full border border-slate-600 dark:border-slate-400",
                                    isSelected && "border-primary-500 dark:border-primary-600 p-[4px] flex flex-col items-center justify-center"
                                )} >
                                    {isSelected && <div className="bg-primary-500 dark:bg-primary-600 w-full h-full rounded-full" ></div>}
                                </div>
                            </div>

                            <SecondaryText className={twMerge(
                                // isSelected && 'text-blue-500'
                                
                            )} >{option.description}</SecondaryText>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


type OptionItem = {
    label: string,
    description: string

    icon: ReactNode
    iconWhenSelected: ReactNode,
    value: Visibility
}