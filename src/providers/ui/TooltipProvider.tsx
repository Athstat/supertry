import { Fragment, ReactNode } from "react"
import { tooltipAtom } from "../../state/ui/tootip.atoms"
import { ScopeProvider } from "jotai-scope";
import TooltipModal from "../../components/ui/modals/TooltipModal";

type Props = {
    children?: ReactNode
}

/** Renders a tooltip provider */
export default function TooltipProvider({ children }: Props) {

    const atoms = [tooltipAtom];

    return (
        <ScopeProvider atoms={atoms} >
            <TooltipModal />
            <Fragment>
                {children}
            </Fragment>
        </ScopeProvider>
    )
}
