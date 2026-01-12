 
import { createContext, ReactNode, useContext } from "react"

type SbrContextProps = {
    currentRound: number
}

const SbrContext = createContext<SbrContextProps | undefined>(undefined);

type Props = {
    currentRound: number,
    children?: ReactNode
}

/** Returns the School Boy Rugby Context */
export function useSbrContext() {
    const context = useContext(SbrContext);

    if (context === undefined) {
        throw new Error("Sbr Context can only be used with in the Sbr Provider");
    }

    return context;
}

/** School Boy Rugby Provider */
export default function SbrProvider({currentRound, children} : Props) {

    return (
        <SbrContext.Provider value={{currentRound}} >
            {children}
        </SbrContext.Provider>
    )
}
