import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?: string
}

function Root({ children, className }: Props) {
    return (
        <div className={twMerge(
            'overflow-y-auto rounded-xl bg-slate-100 dark:bg-slate-800/40',
            className
        )}>
            <table>
                {children}
            </table>
        </div>
    )
}

type HeadProps = {
    children?: ReactNode
}

function Header({ children }: HeadProps) {
    return (
        <thead>
            <tr>
                {children}
            </tr>
        </thead>
    )
}

type TableHeaderColumnProps = {
    children?: ReactNode
}

function HeaderColumn({children} : TableHeaderColumnProps) {
    return (
        <th>{children}</th>
    )
}

type TableRowProps = {
    children?: ReactNode
}

function Row({children} : TableRowProps) {
    return (
        <tr>
            {children}
        </tr>
    )
}

export const Table = {
    Root,
    Header,
    HeaderColumn,
    Row
}
