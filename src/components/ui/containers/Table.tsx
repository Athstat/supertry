 
import { CSSProperties, ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import RoundedCard from "../cards/RoundedCard"

type Props = {
    children?: ReactNode,
    className?: string,
    title?: string,
    style?: CSSProperties
}

function Root({ children, className, style, title }: Props) {
    return (
        <RoundedCard className={twMerge(
            'overflow-y-auto py-4 px-4 rounded-xl flex flex-col gap-3',
            className
        )}>

            {title && <div>
                <p className="font-semibold text-lg text-[#011E5C] dark:text-white" style={{ fontFamily: 'Oswald', }}>
                    {title}
                </p>
            </div>}
            
            <table className="w-full" style={style} >
                {children}
            </table>
        </RoundedCard>
    )
}

type HeadProps = {
    children?: ReactNode
}

function Header({ children }: HeadProps) {
    return (
        <thead className="w-full " >
            <tr className="w-full h-[40px] bg-[#011E5C] text-white text-sm" >
                {children}
            </tr>
        </thead>

    )
}

type TableHeaderColumnProps = {
    children?: ReactNode,
    className?: string,
}

function HeaderColumn({ children, className }: TableHeaderColumnProps) {
    return (
        <th
            className={twMerge(
                'font-medium py-3',
                className
            )}
        >{children}</th>
    )
}

type TableRowProps = {
    children?: ReactNode,
    className?: string,
    style?: CSSProperties
}

function Row({ children, className, style }: TableRowProps) {
    return (
        <tr
            style={style}
            className={className}
        >
            {children}
        </tr>
    )
}

type TDProps = {
    children?: ReactNode,
    style?: CSSProperties
}

function TableData({ children, style }: TDProps) {
    return (
        <td style={style} >
            {children}
        </td>
    )
}

type BodyProps = {
    children?: ReactNode
}

function Body({ children }: BodyProps) {
    return (
        <tbody className="" >
            {children}
        </tbody>
    )
}

export const Table = {
    Root,
    Header,
    HeaderColumn,
    Row,
    TableData,
    Body
}
