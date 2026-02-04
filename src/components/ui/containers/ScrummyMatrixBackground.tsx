import { ReactNode } from "react"
import { twMerge } from "tailwind-merge";
import { AppColours } from "../../../types/constants";
import { useTheme } from "../../../contexts/app_state/ThemeContext";

type Props = {
    children?: ReactNode,
    className?: string
}

export default function ScrummyMatrixBackground({ children, className }: Props) {

    const { theme } = useTheme();
    const gridColor =
        theme === 'dark'
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.1)';

    return (
        <div className={twMerge(
            "relative min-h-screen w-full overflow-hidden bg-white dark:bg-dark-950",
            className, AppColours.BACKGROUND
        )}>
            <div className={twMerge(
                "absolute z-[10] top-0 left-0 w-full h-[40px] bg-gradient-to-b from-white to-transparent",
                AppColours.BACKGROUND_GRADIENT
            )} />

            {/* Very subtle grid pattern background */}
            <div className="absolute inset-0 opacity-30 dark:opacity-30">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `
                            linear-gradient(${gridColor} 1px, transparent 1px),
                            linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Fixed positioned floating elements exactly as shown in image */}


            {/* Content overlay */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    )
}
