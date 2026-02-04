import SegmentedControl from "../ui/SegmentedControl"
import { FixtureListViewMode } from "../../types/games"
import TextHeading from "../ui/typography/TextHeading"
import IconCircle from "../ui/icons/IconCircle"
import FixtureCalendarIcon from "../ui/icons/FixtureCalendarIcon"
import { twMerge } from "tailwind-merge"

type Props = {
    viewMode: FixtureListViewMode,
    onChangeViewMode?: (mode: FixtureListViewMode) => void,
    className?: string
}

/** Renders the Header for the fixture screen */
export default function ProMatchCenterHeader({
    viewMode, onChangeViewMode, className
} : Props) {
    
    const handleChangeViewMode = (value: FixtureListViewMode | string) => {
        if (onChangeViewMode) {
            onChangeViewMode(value as FixtureListViewMode);
        }
    }
    
    return (
        <div className={twMerge(
            className
        )} >
            <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2">
                    <IconCircle>
                        <FixtureCalendarIcon />
                    </IconCircle>
                    <TextHeading className="text-xl">Fixtures (Pro)</TextHeading>
                </div>

                <SegmentedControl
                    options={[
                        { value: 'fixtures', label: 'Fixtures' },
                        { value: 'pickem', label: "PICK'EM" },
                    ]}
                    value={viewMode}
                    onChange={handleChangeViewMode}
                />
            </div>

        </div>
    )
}
