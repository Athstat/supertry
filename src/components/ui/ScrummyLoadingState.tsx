
import { twMerge } from 'tailwind-merge';
import ScrummyLogo from '../branding/scrummy_logo';
import { AppColours } from '../../types/constants';

export default function ScrummyLoadingState() {

    return (
        <div
            className={twMerge(
                'bg-gradient-to-br ',
                '',
                'w-screen h-screen overflow-hidden flex flex-col items-center justify-center',
                AppColours.BACKGROUND
            )}
        >

            <ScrummyLogo
                className='animate-pulse w-52 h-52'
            />

        </div>
    )
}
