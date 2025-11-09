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

/** Renders a 3 Dimensional Rugby Pitch by perspective like FPL */
export function RugbyPitch3D() {
    return (
        <div className="relative max-h-[500px] lg:max-h-[600px] overflow-clip" >

            {/* <PitchAdvertisingBoard /> */}

            <div className="relative w-full overflow-clip rounded-xl"
                style={{ aspectRatio: '1/1.5' }}>

                {/* Advertising Board */}
                {/* <PitchAdvertisingBoard /> */}

                {/* Pitch with perspective - matches FPL style */}


                <div
                    className="absolute overflow-clip inset-0 bg-gradient-to-b from-green-700 via-green-600 to-green-500 rounded-xl"
                    style={{
                        clipPath: 'polygon(8% 0%, 92% 0%, 100% 10%, 100% 100%, 0% 100%, 0% 10%)',
                    }}
                >
                    {/* Striped grass effect - larger stripes like FPL */}
                    <div className="absolute inset-0">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className={`absolute w-full ${i % 2 === 0 ? 'bg-green-700/25' : 'bg-green-500/25'}`}
                                style={{
                                    top: `${(i * 100) / 15}%`,
                                    height: `${100 / 15}%`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Subtle shadow for depth */}
                <div
                    className="absolute inset-0 pointer-events-none rounded-xl"
                    style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.15) 100%)',
                        clipPath: 'polygon(8% 0%, 92% 0%, 100% 10%, 100% 100%, 0% 100%, 0% 10%)'
                    }}
                />
            </div>

        </div>
    );
}
