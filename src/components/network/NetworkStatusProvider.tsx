import { ReactNode, useEffect, useState } from 'react'
import useSWR from 'swr';
import { pingServer } from '../../utils/backendUtils';
import ScrummyLoadingState from '../ui/ScrummyLoadingState';
import { twMerge } from 'tailwind-merge';
import { WifiOff } from 'lucide-react';
import ScrummyLogoHorizontal from '../branding/scrummy_logo_horizontal';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import { AppColours } from '../../types/constants';

type Props = {
    children?: ReactNode
}

export default function NetworkStatusProvider({children} : Props) {

    const {isOnline} = useNetworkStatus();
    const {reachable, isLoading} = useServerPing();

    const isConnected = isOnline && reachable;

    const handleAppReload = () => {

        if (window?.location?.reload) {
            window?.location?.reload();
        }
    }

    if (isLoading) {
        return <ScrummyLoadingState />
    }

    if (!isConnected) {
        return (
            <div className={twMerge(
                'flex lg:max-w-1/4 flex-1 items-center text-center gap-6 p-6 justify-start w-full flex-col h-screen overflow-hidden',
                AppColours.BACKGROUND
            )} >

                <div>
                    <ScrummyLogoHorizontal />
                </div>

                <WifiOff className='w-32 h-32 dark:text-white' />
                <h1 className='font-bold text-3xl dark:text-white' >Whopps!</h1>

                <div className='w-full flex flex-col items-center justify-center' >
                    <p className='lg:w-1/3 dark:text-white' >
                        You have have lost connection to the Scrum! Please check your internet connection and try again. 
                        If issue persists, wait a few minutes before trying again.
                    </p>
                </div>

                <div className='flex flex-col w-full lg:w-1/3 items-center justify-center' >
                    <PrimaryButton onClick={handleAppReload} className='w-full py-3' >Try Again</PrimaryButton>
                </div>
            </div>
        )
    }

  return (
    <>{children}</>
  )
}

export function useNetworkStatus( ) {
    const [isOnline, setOnline] = useState<boolean>(true);

    const handleOnline = () => {
        setOnline(true);
    }

    const handleOffline = () => {
        setOnline(false);
    }

    useEffect(() => {

        addEventListener("online", handleOnline);
        addEventListener("offline", handleOffline);

        return () => {
            removeEventListener('online', handleOnline);
            removeEventListener('offline', handleOffline);
        }

    }, []);


    return {
        isOnline
    }
} 

export function useServerPing() {

    const pingKey = '/server-ping';
    const {data: message, isLoading, error} = useSWR(pingKey, () => pingServer(), {
        revalidateOnFocus: true,
        revalidateOnMount: true,
        revalidateOnReconnect: true,
        revalidateIfStale: true,
        refreshInterval: 1000 * 60 * 60
    });

    const reachable = message !== undefined;

    return {
        message,
        isLoading,
        error,
        reachable
    }

}