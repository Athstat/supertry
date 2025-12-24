import { Fragment } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";

type Props = {
    count?: number
}

export default function RugbyPitch({ count = 5 }: Props) {

    const arr = [];

    for (let x = 0; x < count; x++) {
        arr.push(x);
    }

    return (
        <div className="grid grid-cols-1 overflow-clip items-center bg-green-600">
            {arr.map((_, index) => {
                return <Fragment key={index}>
                    <div className="flex flex-1 border-b-4 border-white/0 h-20"></div>
                    <div className="flex flex-1 border-b-4 border-green-500/10 bg-green-700 h-20"></div>
                </Fragment>
            })}

        </div>
    )
}

type PitchProps = {
    className?: string,
    pitchClassName?: string,
    hideGoalPost?: boolean
}

/** Renders a 3 Dimensional Rugby Pitch by perspective like FPL */
export function RugbyPitch3D({className} : PitchProps) {
    return (
        <div className={twMerge(
            "relative max-h-[500px] lg:max-h-[600px] overflow-clip",
            className
        )} >

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


/** Renders a 3 Dimensional Rugby Pitch by perspective like FPL */
export function RugbyPitch3DRaster({className, pitchClassName, hideGoalPost} : PitchProps) {
    
    // const src = "/pitch/pitch_final_8.png";
    const src = hideGoalPost ? "/pitch/scrummy-pitch-11.png" : "/pitch/scrummy-pitch-12.png";
    
    return (
        <div className={twMerge(
            "min-h-[500px] md:max-h-[700px] lg:max-h-[900px] overflow-clip w-full flex flex-col items-center justify-center",
            className
        )} >

            <img src={src} className={twMerge(
                "min-w-[140%] max-w-[100px] drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)] shadow-black",
                "md:min-w-[670px] lg:min-w-[650px] lg:max-w-[200px] h-fit",
                pitchClassName
            )} />

        </div>
    );
}