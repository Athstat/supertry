import { Fragment, ReactNode } from "react"

type Props = {
    condition?: boolean,
    children?: ReactNode
}

export default function Conditionally({ condition, children }: Props) {

    if (!condition) {
        return;
    }

    return (
        <Fragment>
            {children}
        </Fragment>
    )
}
