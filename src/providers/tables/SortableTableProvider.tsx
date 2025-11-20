import { ScopeProvider } from "jotai-scope"
import { tableSortDirectionAtom, tableSortIndexAtom } from "../../state/tables.atoms"
import { ReactNode } from "react"

type Props = {
    children?: ReactNode
}

/** Provides functionality for table sorting */
export default function SortableTableProvider({children} : Props) {

    const atoms = [
        tableSortDirectionAtom,
        tableSortIndexAtom
    ]

    return (
        <ScopeProvider
            atoms={atoms}
        > 
            {children}
        </ScopeProvider>
    )
}
