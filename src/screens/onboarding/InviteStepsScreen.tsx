import { useState } from 'react'
import { useQueryValue } from '../../hooks/useQueryState'
import PageView from '../PageView';
import ScrummyLogoHorizontal from '../../components/branding/scrummy_logo_horizontal';
import SecondaryText from '../../components/shared/SecondaryText';
import { useTheme } from '../../contexts/ThemeContext';

import { GooglePlayButton, AppStoreButton } from 'react-mobile-app-button';
import { APP_GOOGLE_PLAYSTORE_LINK, APP_IOS_APPSTORE_LINK } from '../../types/constants';
import { Copy, Lock } from 'lucide-react';
import PrimaryButton from '../../components/shared/buttons/PrimaryButton';
import { InfoCard } from '../../components/shared/StatCard';
import { Toast } from '../../components/ui/Toast';

/** Renders Screen to help show the user's how to except invitations
 * for the app
 */
export default function InviteStepsScreen() {

    const userName = useQueryValue('user_name');
    const leagueName = useQueryValue('league_name');
    const joinCode = useQueryValue('join_code');

    const { theme } = useTheme();

    const [message, setMessage] = useState<string>();

    const handleCopyEntryCode = () => {

        if (joinCode) {
            navigator.clipboard.writeText(joinCode ?? "");
            setMessage("Entry code was copied to clip board")
        }
    }

    return (
        <PageView className='dark:bg-black w-full h-[100vh] overflow-y-auto p-4 gap-4 flex flex-col items-center ' >

            <div className='flex flex-row items-center justify-center h-20' >
                <ScrummyLogoHorizontal />
            </div>

            <div className='flex flex-col items-center gap-4 justify-center' >
                <h1 className='font-bold text-xl text-black dark:text-white' >{leagueName}</h1>
                <SecondaryText className='text-center w-4/5 lg:w-[1/2] text-slate-700' >Congrats! You have been invited by <strong>{userName}</strong> to join <strong>{leagueName}</strong>. Time to join the scrum!</SecondaryText>
            </div>

            <div className='flex flex-col gap-6 w-full p-4' >

                <div className='flex flex-row w-full items-center gap-4' >
                    <div className='w-10 h-10 rounded-full bg-blue-500 items-center flex flex-col justify-center text-white' >
                        <p className='text-lg font-bold' >1</p>
                    </div>

                    <div>
                        <p className='text-lg font-semibold' >Download SCRUMMY App</p>
                    </div>

                </div>

                <div className='flex flex-col w-full gap-4' >
                    <GooglePlayButton
                        url={APP_GOOGLE_PLAYSTORE_LINK}
                        theme={theme === 'dark' ? 'dark' : 'dark'}
                        className='w-[300px] text-nowrap p-4'
                        width={300}
                        height={60}
                    />

                    <AppStoreButton
                        url={APP_IOS_APPSTORE_LINK}
                        theme={theme === 'dark' ? 'dark' : 'dark'}
                        width={300}
                        height={60}
                    />
                </div>
            </div>

            <div className='flex flex-col gap-6 w-full p-4' >

                <div className='flex flex-row w-full items-center gap-4' >
                    <div className='w-10 h-10 rounded-full bg-blue-500 items-center flex flex-col justify-center text-white' >
                        <p className='text-lg font-bold' >2</p>
                    </div>

                    <div>
                        <p className='text-lg font-semibold' >Create Account</p>
                    </div>

                </div>

                <div className='flex flex-col w-full gap-4' >
                    <p>Create your profile (or log in) and setup your own SCRUMMY profile.</p>
                </div>
            </div>

            <div className='flex flex-col gap-6 w-full p-4' >

                <div className='flex flex-row w-full items-center gap-4' >
                    <div className='w-10 h-10 rounded-full bg-blue-500 items-center flex flex-col justify-center text-white' >
                        <p className='text-lg font-bold' >3</p>
                    </div>

                    <div>
                        <p className='text-lg font-semibold' >Use Join code <strong>{(joinCode ?? '').toUpperCase()}</strong></p>
                    </div>

                </div>

                <div className='flex flex-col w-full gap-4' >
                    <p>Heag to the Leagues Screen and tap on 'Join by code' and enter <strong>{(joinCode ?? '').toUpperCase()}</strong> to join <strong>{leagueName}</strong></p>
                </div>
            </div>

            <div className='flex flex-col gap-4 w-full' >
                <InfoCard
                    label='Entry Code'
                    value={joinCode ?? "-"}
                    icon={<Lock className='w-4 h-4' />}
                />

                <PrimaryButton onClick={handleCopyEntryCode} >
                    <Copy />
                    Copy Entry Code
                </PrimaryButton>

                <Toast
                    isVisible={message !== undefined}
                    onClose={() => setMessage(undefined)}
                    message={message ?? ""}
                    type='info'
                />
            </div>

        </PageView>
    )
}
