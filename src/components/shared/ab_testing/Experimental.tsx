import { ReactNode } from "react"
import { getEnvironment } from "../../../utils/envUtils"

type Props = {
    children?: ReactNode,
    placeholder?: ReactNode
}
/** Only Renders its children in qa or development environments */
export default function Experimental({children, placeholder} : Props) {

    const environment = getEnvironment();

    if (environment === "production") {
        return <>{placeholder}</>
    };

    return (
        <>
            {children}
        </>
    )
}
