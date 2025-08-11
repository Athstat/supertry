import { twMerge } from 'tailwind-merge';
import { IOnboardingTab } from '../../types/onboarding'
import SecondaryText from '../shared/SecondaryText';

type Props = {
    tab: IOnboardingTab,
    className?: string
}

export default function OnboardingTab({ tab, className }: Props) {

    const { imageUrl, title, description } = tab;

    return (
        <div className={twMerge(
            "w-full items-center flex flex-col gap-6 justify-center",
            className
        )} >

            <img
                src={imageUrl}
                className='rounded-2xl w-[90%] sm:w-[80%] md:w-[70%]'
            />


            <div className='flex flex-col gap-2 w-full items-center justify-center' >
                <h2 className='text-3xl font-extrabold' >{title}</h2>

                <SecondaryText className='text-center text-slate-700 dark:text-slate-400' >
                    {description}
                </SecondaryText>
            </div>

        </div>
    )
}
