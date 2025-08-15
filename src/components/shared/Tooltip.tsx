import { Fragment } from 'react'
import SecondaryText from './SecondaryText';

type Props = {
    title?: string
    text?: string,
    showTooltip?: boolean,
    coordinates?: {x: number, y: number}
}

export default function TooltipCard({ text, title, showTooltip, coordinates = {x: 0, y: 0} }: Props) {

    return (
        <Fragment>
            {showTooltip && (
                <div
                    className="fixed z-[9999] pointer-events-none"
                    style={{
                        transform: 'translate(-50%, -100%)',
                        left: coordinates.x,
                        top: coordinates.y,
                    }}
                >
                    <div className="bg-white dark:bg-slate-900 text-slate-700 dark:text-white px-3 py-2 rounded-lg shadow-xl border border-slate-400 dark:border-slate-600 whitespace-nowrap">
                        <div className="text-sm font-bold text-center">{title}</div>
                        <SecondaryText className="text-xs text-center mt-1 max-w-[200px] whitespace-normal">{text}</SecondaryText>
                        {/* Tooltip Arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                            <div className="border-4 border-transparent border-t-slate-800 dark:border-t-slate-900"></div>
                        </div>
                    </div>
                </div>
            )}
        </Fragment >
    )
}
