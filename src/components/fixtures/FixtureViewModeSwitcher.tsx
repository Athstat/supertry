import { FixtureListViewMode } from "../../types/fixtures";
import SegmentedControl from "../ui/SegmentedControl";

type ViewModeSwitcherProps = {
  viewMode: FixtureListViewMode,
  onChange?: (mode: FixtureListViewMode) => void
}

/** Renders a fixture view mode switcher */
export function FixtureViewModeSwitcher({ viewMode, onChange }: ViewModeSwitcherProps) {

  const handleOnChange = (val?: string) => {
    if (val && onChange) {
      onChange(val as FixtureListViewMode);
    }
  }

  return (
    <SegmentedControl
      options={[
        { value: 'fixtures', label: 'Fixtures' },
        { value: 'pickem', label: "PICK'EM" },
      ]}
      value={viewMode}
      onChange={handleOnChange}
    />
  )
}

