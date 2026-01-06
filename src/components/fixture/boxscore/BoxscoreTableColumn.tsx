import { useRef, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
import { useTableSort } from "../../../hooks/tables/useTableSort";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useNodeCoordinates } from "../../../hooks/useNodeCoordinates";
import { BoxscoreHeader } from "../../../types/boxScore";
import SecondaryText from "../../ui/typography/SecondaryText";
import TooltipCard from "../../ui/cards/Tooltip";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { useBoxscoreTable } from "./BoxscoreTableProvider";

type TableColumnProps = {
    column: BoxscoreHeader,
    className?: string,
    sortIndex?: number
}
export function BoxscoreTableColumn({ column, className, sortIndex }: TableColumnProps) {

    const { sortDirection, sortIndex: currentIndex, toggleDirection, setSortDirection, setSortIndex } = useTableSort();
    const isCurrentIndex = sortIndex === currentIndex;

    const {secondaryColumns} = useBoxscoreTable();
    const isLastColumn = sortIndex === secondaryColumns.length - 1;

    const ref = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState<boolean>(false);
    const hasToolTip = Boolean(column.title);

    const { coordinates } = useNodeCoordinates(ref);

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

    const onEnterMouse = () => {
        setShow(true);
    }

    const onLeaveMouse = () => {
        setShow(false);
    }

    useClickOutside(ref, () => setShow(false));

    return (
        <Fragment>

            <div
                ref={ref}
                className={twMerge(
                    'px-3 py-2 cursor-pointer relative h-full min-w-[80px] flex flex-row gap-1 items-center justify-start',
                    isLastColumn && "min-w-[135px] flex-1",
                    className,
                )}

                onMouseEnter={onEnterMouse}
                onMouseLeave={onLeaveMouse}
                onClick={handleClickSort}
            >
                <SecondaryText className={
                    twMerge(
                        "font-bold text-xs uppercase tracking-wide",
                        isCurrentIndex && "text-black dark:text-white"
                    )
                }>{column.lable}</SecondaryText>
                <SortIcon
                    isAsc={sortDirection === "asc"}
                    isCurrent={isCurrentIndex}
                />
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

type SortIconProps = {
    onClick?: () => void,
    isAsc?: boolean,
    isCurrent?: boolean
}

function SortIcon({ isAsc, onClick, isCurrent }: SortIconProps) {
    return (
        <button onClick={onClick}>
            {isCurrent && isAsc && (
                <ArrowUp className={"w-4 h-4 text-slate-600 dark:text-slate-200"} />
            )}

            {isCurrent && !isAsc && (
                <ArrowDown className={"w-4 h-4 text-slate-600 dark:text-slate-200"} />
            )}

            {!isCurrent && (
                <ChevronsUpDown className={"w-4 h-4 text-slate-600 dark:text-slate-400"} />
            )}
        </button>
    )
}