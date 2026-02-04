import SegmentedControl from "../ui/SegmentedControl"
import { FixtureListViewMode } from "../../types/games"
import TextHeading from "../ui/typography/TextHeading"
import IconCircle from "../ui/icons/IconCircle"
import FixtureCalendarIcon from "../ui/icons/FixtureCalendarIcon"

type Props = {
    viewMode: FixtureListViewMode,
    onChangeViewMode?: (mode: FixtureListViewMode) => void,
}

/** Renders the Header for the fixture screen */
export default function ProMatchCenterHeader({
    viewMode, onChangeViewMode
} : Props) {
    
    const handleChangeViewMode = (value: FixtureListViewMode | string) => {
        if (onChangeViewMode) {
            onChangeViewMode(value as FixtureListViewMode);
        }
    }
    
    return (
        <div className="px-4" >
            <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex flex-row items-center gap-2">
                    <IconCircle>
                        <FixtureCalendarIcon />
                    </IconCircle>
                    <TextHeading className="text-2xl">Fixtures (Pro)</TextHeading>
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
