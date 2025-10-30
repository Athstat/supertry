import { ScopeProvider } from "jotai-scope"
import { navigationBarsAtoms } from "../../state/navigation/navigationBars.atoms"
import { ReactNode } from "react"

type Props = {
    children?: ReactNode
}

/** Provides navigation bar atoms to downtream children */
export default function NavigationBarsProvider({children} : Props) {

    const atoms = [
        navigationBarsAtoms.bottomBarViewModeAtom,
        navigationBarsAtoms.topBarViewModeAtom,
    ]

    return (
        <ScopeProvider atoms={atoms} >
            {children}
        </ScopeProvider>
    )
}
