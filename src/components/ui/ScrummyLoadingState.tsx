
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../../contexts/ThemeContext'
import ScrummyLogo from '../branding/scrummy_logo';

export default function ScrummyLoadingState() {

    const {} = useTheme();

    return (
        <div
            className={twMerge(
                'bg-gradient-to-br from-white to-slate-200',
                'dark:from-dark-850 dark:to-dark-950',
                'w-screen h-screen overflow-hidden flex flex-col items-center justify-center'
            )}
        >

            <ScrummyLogo 
                className='animate-pulse w-52 h-52'
            />

        </div>
    )
}
