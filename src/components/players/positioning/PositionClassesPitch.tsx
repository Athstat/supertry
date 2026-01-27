import { useNavigate } from "react-router-dom";
import { PositionClass } from "../../../types/athletes";
import RoundedCard from "../../ui/cards/RoundedCard";
import TextHeading from "../../ui/typography/TextHeading";
import { twMerge } from "tailwind-merge";

export function PositionClassesPitch() {
    const navigate = useNavigate();

    const handlePositionCardClick = (positionClass: PositionClass) => {
        navigate(`/players/position-class/${positionClass}`);
    }

    return (
        <RoundedCard className='py-4 px-6 flex flex-col gap-4' >
            <div>
                <TextHeading className='font-medium text-xl' blue >By Position</TextHeading>
            </div>

            <div className="flex flex-col items-center justify-center w-full" >
                <div className="w-fit relative" >
                    <Pitch />
                    <PitchPositionCard 
                        lable="Front Row"
                        className="top-16 left-5" 
                        positionClass="front-row"
                        onClick={handlePositionCardClick}
                    />

                    <PitchPositionCard 
                        lable="Second Row"
                        className="top-24 right-6"
                        positionClass="second-row"
                        onClick={handlePositionCardClick} 
                    />

                    <PitchPositionCard 
                        lable="Back Row"
                        className="top-36 left-[26%]" 
                        positionClass="back-row"
                        onClick={handlePositionCardClick}
                    />

                    <PitchPositionCard 
                        lable="Half Back"
                        className="top-56 left-[20%]" 
                        positionClass="half-back"
                        onClick={handlePositionCardClick}
                    />

                    
                    <PitchPositionCard 
                        lable="Backs"
                        className="top-[16rem] right-6" 
                        positionClass="back"
                        onClick={handlePositionCardClick}
                    />
                </div>
            </div>

        </RoundedCard>
    )
}

function Pitch() {
    return (
        <svg width="363" height="394" viewBox="0 0 363 394" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_3311_2)">
                <path d="M358.286 0H4.71429V384.563H358.286V0Z" fill="#1C961B" />
                <path d="M356.518 1.76947H6.48218V382.793H356.518V1.76947Z" stroke="#FEFEFE" stroke-width="3" />
            </g>
            <path d="M170.803 367.065H168.536V338.1H170.803V367.065Z" fill="#FEFEFE" />
            <path d="M193.732 367.017H191.465V338.052H193.732V367.017Z" fill="#FEFEFE" />
            <path d="M192.434 353.755V355.938H169.834V353.755H192.434Z" fill="#FEFEFE" />
            <defs>
                <filter id="filter0_d_3311_2" x="0.714294" y="0" width="361.571" height="392.563" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3311_2" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3311_2" result="shape" />
                </filter>
            </defs>
        </svg>
    )
}

type PitchPositionCardProps = {
    lable?: string,
    className?: string,
    positionClass?: PositionClass,
    onClick?: (pos: PositionClass) => void,
}

/** Renders a pitch position card */
function PitchPositionCard({ lable, className, onClick, positionClass }: PitchPositionCardProps) {

    const handleClick = () => {
        if (onClick && positionClass) {
            onClick(positionClass as PositionClass)
        }
    }

    return (
        <div

            className={twMerge(
                "absolute shadow-lg shadow-black/20 bg-[#F0F3F7E5] w-[110px] transition-all ease-linear hover:w-[120px] cursor-pointer h-[36px]  flex flex-col items-center justify-center rounded-md",
                className
            )}
            onClick={handleClick}
        >
            <p>{lable}</p>
        </div>

    )
}