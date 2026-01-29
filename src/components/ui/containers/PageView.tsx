import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import BlueGradientCard from "../cards/BlueGradientCard"
import { ChevronLeft } from "lucide-react"
import TransparentStatCard from "../cards/TransparentStatCard"
import { useNavigateBack } from "../../../hooks/web/useNavigateBack"
import { AppColours } from "../../../types/constants"

type Props = {
  children?: ReactNode;
  className?: string;
};

export default function PageView({ children, className }: Props) {
  return (
    <div

      className={twMerge(
        "w-full py-0 dark:text-white h-full flex flex-col items-center justify-start lg:py-8",
        AppColours.BACKGROUND
      )}

      style={{ fontFamily: 'Roboto' }}
    >
      <div className={twMerge('w-full lg:w-[50%]', className)}>{children}</div>
    </div>
  );
}
export type IStatCard = { title: string; value: string | number };

type TopicPageViewProps = Props & {
  title?: string;
  description?: string;
  statsCards?: IStatCard[];
};

export function TopicPageView({ children, title, statsCards, className }: TopicPageViewProps) {

  const { hardPop } = useNavigateBack();

  const handleGoBack = () => {
    hardPop("/dashboard");
  }

  return (
    <div>
      <BlueGradientCard className="rounded-none p-4 py-8 lg:py-10 min-h-32 items-center justify-center flex flex-col gap-2" >
        <div className="lg:w-1/2 w-full flex flex-col gap-4" >
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
                <TransparentStatCard
                  label={card.title}
                  value={card.value}
                  key={index}
                />
              )
            })}

          </div>}
        </div>
      </BlueGradientCard>

      <PageView className={className} >
        {children}
      </PageView>
    </div>
  );
}
