import { useAtom } from "jotai";
import { tableSortDirectionAtom, tableSortIndexAtom } from "../../state/tables.atoms";

/** Uses SortableTableProvider hook to sort tables */
export function useTableSort() {
    const [sortIndex, setSortIndex] = useAtom(tableSortIndexAtom);
    const [sortDirection, setSortDirection] = useAtom(tableSortDirectionAtom);

    const toggleDirection = () => {
        setSortDirection(prev => {
            if (prev === "asc") {
                return "desc"
            }

            return "asc";
        });
    };

    return {
        sortIndex,
        setSortDirection,
        sortDirection,
        setSortIndex,
        toggleDirection
    }
}