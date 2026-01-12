/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import RoundedCard from "./RoundedCard";

type Props = {
    title?: string,
    icon?: any,
    className?: string,
    children?: ReactNode
}

export default function TitledCard({title, icon, className, children} : Props) {
    
    const Icon = icon;

    return (
        <RoundedCard className=" rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 dark:text-gray-100">
                {icon && <Icon size={24} className="text-primary-500" />}
                {title}
            </h2>

            <div className={twMerge(
                className
            )} >
                {children}
            </div>
        </RoundedCard>
    )
}
