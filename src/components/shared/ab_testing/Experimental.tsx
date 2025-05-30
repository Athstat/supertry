import { ReactNode } from "react"
import { getEnvironment } from "../../../utils/envUtils"

type Props = {
    children?: ReactNode
}
/** Only Renders its children in qa or development environments */
export default function Experimental({children} : Props) {

    const environment = getEnvironment();

    if (environment === "production") return;

    return (
        <div>
            {children}
        </div>
    )
}
