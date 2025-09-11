
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../../contexts/ThemeContext'
import ScrummyLogo from '../branding/scrummy_logo';
import ScrummyMatrixBackground from '../shared/ScrummyMatrixBackground';

export default function ScrummyLoadingState() {

    const { } = useTheme();

    return (
        <ScrummyMatrixBackground>
            <div
                className={twMerge(
                    'bg-gradient-to-br ',
                    '',
                    'w-screen h-screen overflow-hidden flex flex-col items-center justify-center'
                )}
            >

                <ScrummyLogo
                    className='animate-pulse w-52 h-52'
                />

            </div>
        </ScrummyMatrixBackground>
    )
}
