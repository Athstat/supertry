import { ReactNode } from "react"
import { getEnvironment } from "../../../utils/envUtils"

type Props = {
    children?: ReactNode,
    placeholder?: ReactNode
}

/** Renders a component only when environment is stable */
export default function StableOnly({children, placeholder} : Props) {
  
    const env = getEnvironment();
    
    if (env !== "production") {
        return <>{placeholder}</>
    }
  
    return (
    <div>{children}</div>
  )
}
