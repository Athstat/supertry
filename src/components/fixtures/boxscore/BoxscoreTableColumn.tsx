import { useRef, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
import { useTableSort } from "../../../hooks/tables/useTableSort";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useNodeCoordinates } from "../../../hooks/useNodeCoordinates";
import { BoxscoreHeader } from "../../../types/boxScore";
import SecondaryText from "../../shared/SecondaryText";
import TooltipCard from "../../shared/Tooltip";

type TableColumnProps = {
    column: BoxscoreHeader,
    className?: string,
    sortIndex?: number
}
export function BoxscoreTableColumn({ column, className, sortIndex }: TableColumnProps) {

    const {sortDirection, sortIndex: currentIndex, toggleDirection, setSortDirection, setSortIndex} = useTableSort();
    const isCurrentIndex = sortIndex === currentIndex;
    
    const ref = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState<boolean>(false);
    const hasToolTip = Boolean(column.title);

    const { coordinates } = useNodeCoordinates(ref);
    
    const toggle = () => {
        setShow(prev => !prev);
    }

    const handleClickSort = () => {

        if (sortIndex === undefined || sortIndex === null) {
            return;
        }

        if (isCurrentIndex) {
            toggleDirection();
            return;
        }

        setSortIndex(sortIndex);
        setSortDirection("desc");
    }

    useClickOutside(ref, () => setShow(false));

    return (
        <Fragment>

            <div
                ref={ref}
                className={twMerge(
                    'px-3 py-2 cursor-pointer relative h-full flex flex-row items-center justify-start',
                    className,
                )}
            >
                <SecondaryText className="font-bold text-xs uppercase tracking-wide">{column.lable}</SecondaryText>
                
            </div>

            {hasToolTip && <TooltipCard
                title={column.title}
                text={column.tooltip}
                showTooltip={show}
                coordinates={coordinates}
            />}
        </Fragment>
    )
}