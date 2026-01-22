import { Link } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { AppColours } from '../../../types/constants'
import ScrummyLogoHorizontal from '../../branding/scrummy_logo_horizontal'
import PrimaryButton from '../buttons/PrimaryButton'
import { useStoreLinks } from '../../../hooks/marketing/useStoreLinks'

/** Renders a download app header */
export default function DownloadAppHeader() {
    const { oneLinkUrl } = useStoreLinks();

    return (
        <header className={twMerge(
            "sticky top-0 border-b dark:border-slate-700 flex flex-row items-center justify-between z-50 bg-white/80 backdrop-blur-sm shadow-none mb-0 pb-0",
            AppColours.BACKGROUND
        )}>
            <div className="container mx-auto px-1 h-16 overflow-hidden flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="flex flex-row overflow-hidden items-start justify-start cursor-pointer"
                        tabIndex={0}
                        aria-label="Navigate to home"
                    >
                        <ScrummyLogoHorizontal className="" />
                    </div>
                </div>
            </div>

            <div className="pr-2" >
                <Link to={oneLinkUrl || ''} target={'blank'} >
                    <PrimaryButton className="text-nowrap" >Download App</PrimaryButton>
                </Link>
            </div>
        </header>
    )
}
