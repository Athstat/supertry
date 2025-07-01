import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import BlueGradientCard from "../components/shared/BlueGradientCard"
import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react"

type Props = {
    children?: ReactNode,
    className?: string
}

export default function PageView({ children, className }: Props) {


    return (
        <div className="w-full dark:text-white h-full flex flex-col items-center justify-start lg:py-8" >
            <div className={twMerge(
                "w-full lg:w-[50%]",
                className
            )} >
                {children}
            </div>
        </div>
    )
}

type TopicPageViewProps = Props & {
    title?: string,
    description?: string,
    statsCards?: { title: string, value: string | number }[]
}

export function TopicPageView({ children, title, description, statsCards, className }: TopicPageViewProps) {

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1)
    }

    return (
        <div>
            <BlueGradientCard className="rounded-none p-4 min-h-32 items-start justify-center flex flex-col gap-2" >
                <button
                    onClick={handleGoBack}
                    className="flex items-center text-primary-100 hover:text-white transition-colors"
                >
                    <ChevronLeft size={20} />
                    <span>
                        {"Go Back"}
                    </span>
                </button>
                <p className="text-xl font-extrabold" >{title}</p>

                {statsCards && <div className="grid grid-cols-2 w-full gap-2" >
                    {statsCards.map((card, index) => {
                        return (
                            <div key={index} className="bg-white/10 rounded-lg p-4 w-full">
                                <div className="text-sm text-primary-100">{card.title}</div>
                                <div className="text-xl font-bold">
                                    {card.value}
                                </div>
                            </div>
                        )
                    })}
                </div>}
            </BlueGradientCard>

            <PageView className={className} >
                {children}
            </PageView>
        </div>
    )
}