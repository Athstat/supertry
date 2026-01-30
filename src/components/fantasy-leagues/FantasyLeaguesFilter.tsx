import { FilterListOption, RadioListOption } from "../../types/ui";
import RadioList from "../ui/buttons/RadioList";
import FilterList from "../ui/forms/FilterList";
import BottomSheetView from "../ui/modals/BottomSheetView";

type Props = {
    isOpen?: boolean
    sortField?: string,
    filterField?: string,
    setSortField: (field?: string) => void,
    setFilterField: (field?: string) => void,
    onClose?: () => void
}

/** Renders a fantasy leagues filter bottom view sheet */
export default function FantasyLeaguesFilter({ sortField, setFilterField, setSortField, filterField, isOpen, onClose }: Props) {

    const sortOptions: RadioListOption[] = [
        {
            label: 'League Size',
            value: 'league_size'
        },

        {
            label: 'League Name',
            value: 'name'
        }
    ]

    const filterOptions: FilterListOption[] = [
        {
            label: "Official Leagues",
            value: "official"
        },

        {
            label: "Community Created",
            value: "user_created"
        }
    ]

    const handleChangeSortField = (val?: string) => {
        setSortField(val);

    }

    const handleChangeFilterField = (field?: string) => {
        setFilterField(field);
    }

    if (!isOpen) {
        return null;
    }

    return (
        <BottomSheetView
            hideHandle
            className="p-6  min-h-[200px] max-h-[90vh] flex flex-col gap-4"
            onClickOutside={onClose}
        >
            <section className="flex flex-col gap-2" >
                <div>
                    <p className="font-semibold text-lg" >Sort By</p>
                </div>

                <RadioList
                    options={sortOptions}
                    optionCN="text-base"
                    value={sortField}
                    onChange={handleChangeSortField}
                />
            </section>

            <section className="flex flex-col mb-8 gap-2" >
                <div>
                    <p className="font-semibold text-lg" >Filter</p>
                </div>

                <FilterList
                    options={filterOptions}
                    onChange={handleChangeFilterField}
                    value={filterField}
                />
            </section>
        </BottomSheetView>
    )
}
