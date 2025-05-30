import { Fragment } from "react/jsx-runtime";

type Props = {
    count?: number
}

export default function RugbyPitch({ count = 5 }: Props) {

    const arr = [];

    for (let x = 0; x < count; x++) {
        arr.push(x);
    }

    return (
        <div className="grid grid-cols-1 overflow-clip items-center">
            {arr.map((_, index) => {
                return <Fragment key={index}>
                    <div className="flex flex-1 border-b-4 border-white/0 h-20"></div>
                    <div className="flex flex-1 border-b-4 border-white/10 bg-green-800 h-20"></div>
                </Fragment>
            })}

        </div>
    )
}