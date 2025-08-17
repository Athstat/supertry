import { ReactNode, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
    children?: ReactNode;
    className?: string;
    speed?: number;
    retro?: boolean;
};

export default function MovingRugbyPitch({ 
    children, 
    className, 
    speed = 1, 
    retro = true 
}: Props) {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        let animationFrame: number;
        let lastTime = 0;

        const scroll = (currentTime: number) => {
            if (lastTime === 0) lastTime = currentTime;
            const deltaTime = currentTime - lastTime;
            
            // Smooth animation with configurable speed
            setOffset((prev) => (prev + (speed * deltaTime * 0.05)) % 1200);
            
            lastTime = currentTime;
            animationFrame = requestAnimationFrame(scroll);
        };

        animationFrame = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrame);
    }, [speed]);

    return (
        <div className={twMerge(
            "w-full h-[600px] overflow-hidden relative border-4",
            retro ? "border-amber-800" : "border-green-700",
            className
        )}>
            {/* Retro film grain overlay */}
            {retro && (
                <div className="absolute inset-0 z-30 pointer-events-none opacity-20 bg-gradient-radial from-transparent to-amber-900/10 mix-blend-multiply"></div>
            )}
            
            {/* Scrolling pitch with 4 sections for seamless loop */}
            <div
                className="flex flex-col absolute top-0 left-0 w-full"
                style={{ 
                    transform: `translateY(-${offset}px)`,
                    willChange: 'transform'
                }}
            >
                <PitchSection variant="light" retro={retro} />
                <PitchSection variant="dark" retro={retro} />
                <PitchSection variant="light" retro={retro} />
                <PitchSection variant="dark" retro={retro} />
            </div>

            {/* Children on top */}
            <div className="absolute top-0 left-0 w-full h-full  z-20">
                {children}
            </div>
        </div>
    );
}

const PitchSection = ({ variant, retro }: { variant: 'light' | 'dark'; retro: boolean }) => {
    // Retro color palette
    const grassColors = retro ? {
        light: {
            primary: '#4a7c59',
            secondary: '#3d6b4a',
            accent: '#5a8c69'
        },
        dark: {
            primary: '#3d6b4a',
            secondary: '#2f5a3a',
            accent: '#4a7c59'
        }
    } : {
        light: {
            primary: '#3a8a3a',
            secondary: '#2e7d2e',
            accent: '#46a046'
        },
        dark: {
            primary: '#2e7d2e',
            secondary: '#226622',
            accent: '#3a8a3a'
        }
    };

    const colors = grassColors[variant];
    const lineColor = retro ? '#f5f5dc' : '#ffffff';

    return (
        <div className="h-[600px] relative">
            {/* Base grass with alternating shades */}
            <div 
                className="absolute inset-0"
                style={{
                    background: `repeating-linear-gradient(
                        to bottom,
                        ${colors.primary} 0px,
                        ${colors.primary} 30px,
                        ${colors.secondary} 30px,
                        ${colors.secondary} 60px,
                        ${colors.accent} 60px,
                        ${colors.accent} 90px,
                        ${colors.secondary} 90px,
                        ${colors.secondary} 120px
                    )`
                }}
            />

            {/* Retro texture overlay */}
            {retro && (
                <div className="absolute inset-0 opacity-30 mix-blend-multiply bg-gradient-to-b from-transparent via-amber-900/5 to-transparent" />
            )}

            {/* Goal posts */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-16 z-10">
                <div className={`w-1 h-full mx-auto ${retro ? 'bg-amber-100' : 'bg-white'}`} />
                <div className={`absolute top-2 left-0 w-full h-1 ${retro ? 'bg-amber-100' : 'bg-white'}`} />
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-16 z-10">
                <div className={`w-1 h-full mx-auto ${retro ? 'bg-amber-100' : 'bg-white'}`} />
                <div className={`absolute bottom-2 left-0 w-full h-1 ${retro ? 'bg-amber-100' : 'bg-white'}`} />
            </div>

            {/* Try zones with corner flags */}
            <div 
                className="absolute top-0 w-full h-[10%] border-b-2"
                style={{ borderColor: lineColor }}
            >
                <div className="absolute top-0 left-2 w-1 h-8 bg-red-500" />
                <div className="absolute top-0 right-2 w-1 h-8 bg-red-500" />
            </div>
            <div 
                className="absolute bottom-0 w-full h-[10%] border-t-2"
                style={{ borderColor: lineColor }}
            >
                <div className="absolute bottom-0 left-2 w-1 h-8 bg-red-500" />
                <div className="absolute bottom-0 right-2 w-1 h-8 bg-red-500" />
            </div>

            {/* 5-meter lines (scrum lines) */}
            <div 
                className="absolute top-[15%] w-full border-t-2 opacity-80"
                style={{ borderColor: lineColor }}
            />
            <div 
                className="absolute top-[85%] w-full border-t-2 opacity-80"
                style={{ borderColor: lineColor }}
            />

            {/* 22-meter lines */}
            <div 
                className="absolute top-[22%] w-full border-t-2"
                style={{ borderColor: lineColor }}
            />
            <div 
                className="absolute top-[78%] w-full border-t-2"
                style={{ borderColor: lineColor }}
            />

            {/* 10-meter lines from halfway */}
            <div 
                className="absolute top-[40%] w-full border-t border-dashed opacity-60"
                style={{ borderColor: lineColor }}
            />
            <div 
                className="absolute top-[60%] w-full border-t border-dashed opacity-60"
                style={{ borderColor: lineColor }}
            />

            {/* Midline */}
            <div 
                className="absolute top-1/2 w-full border-t-4"
                style={{ borderColor: lineColor }}
            />

            {/* Touchlines */}
            <div 
                className="absolute top-0 left-0 w-full h-full border-l-2 border-r-2"
                style={{ borderColor: lineColor }}
            />

            {/* Vertical field divisions - creating the grid pattern */}
            {[16.67, 33.33, 50, 66.67, 83.33].map((position) => (
                <div 
                    key={position}
                    className="absolute top-0 h-full border-l border-dashed opacity-40"
                    style={{ 
                        left: `${position}%`,
                        borderColor: lineColor
                    }}
                />
            ))}

            {/* Hash marks for lineouts - small perpendicular marks on touchlines */}
            {[20, 30, 40, 50, 60, 70, 80].map((position) => (
                <div key={position}>
                    {/* Left touchline hash marks */}
                    <div 
                        className="absolute left-0 w-2 h-0.5"
                        style={{ 
                            top: `${position}%`,
                            backgroundColor: lineColor,
                            transform: 'translateX(-1px)'
                        }}
                    />
                    {/* Right touchline hash marks */}
                    <div 
                        className="absolute right-0 w-2 h-0.5"
                        style={{ 
                            top: `${position}%`,
                            backgroundColor: lineColor,
                            transform: 'translateX(1px)'
                        }}
                    />
                </div>
            ))}

            {/* Retro weathering effect on lines */}
            {retro && (
                <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-transparent via-amber-900/10 to-transparent" />
            )}
        </div>
    );
};
