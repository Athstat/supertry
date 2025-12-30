import { ScopeProvider } from "jotai-scope"
import { ReactNode, useEffect } from "react"
import { browserHistoryAtoms } from "../../state/web/browserHistory.atoms"
import { useLocation } from "react-router-dom"
import { useSetAtom } from "jotai"

type Props = {
    children?: ReactNode
}

/** Renders a browser history stack provider */
export default function BrowserHistoryProvider({ children }: Props) {

    const atoms = [browserHistoryAtoms.historyStackAtom];

    return (
        <ScopeProvider
            atoms={atoms}
        >
            <InnerProvider>
                {children}
            </InnerProvider>
        </ScopeProvider>
    )
}


function InnerProvider({ children }: Props) {

    const setRouterStack = useSetAtom(browserHistoryAtoms.historyStackAtom);
    const {pathname, search} = useLocation();
    const pathAndSearch = pathname + search;

    useEffect(() => {
        if (pathAndSearch) {
            setRouterStack(stack => {
                stack.push(pathAndSearch);
                return stack;
            });
        }
    }, [pathAndSearch, setRouterStack]);

    return (
        <>{children}</>
    )
}