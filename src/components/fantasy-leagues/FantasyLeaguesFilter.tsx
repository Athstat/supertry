import { FilterListOption, RadioListOption } from "../../types/ui";
import RadioList from "../ui/buttons/RadioList";
import FilterList from "../ui/forms/FilterList";
import BottomSheetView from "../ui/modals/BottomSheetView";

/** Renders a fantasy leagues filter bottom view sheet */
export default function FantasyLeaguesFilter() {

    const sortOptions: RadioListOption[] = [
        {
            label: 'League Size: (Hight to Low)',
            value: 'league_size'
        },

        {
            label: 'Alphabetical',
            value: 'alphabetical'
        }
    ]

    const filterOptions: FilterListOption[] = [
        {
            label: "Official SCRUMMY Leagues",
            value: "official"
        }, 

        {
            label: "Community Created",
            value: "user_created"
        }
    ]

    return (
        <BottomSheetView
            hideHandle
            className="p-6  min-h-[200px] max-h-[90vh] flex flex-col gap-4"
        >
            <section className="flex flex-col gap-2" >
                <div>
                    <p className="font-semibold text-lg" >Sort By</p>
                </div>

                <RadioList
                    options={sortOptions}
                    optionCN="text-base"
                />
            </section>

            <section className="flex flex-col mb-8 gap-2" >
                <div>
                    <p className="font-semibold text-lg" >Filter</p>
                </div>

                <FilterList 
                    options={filterOptions}
                />
            </section>
        </BottomSheetView>
    )
}
