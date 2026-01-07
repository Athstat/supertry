import { AppTheme } from "./themes";

/** The Classic Theme for Scrummy */
export const appTheme1: AppTheme = {
    backgroundCN: 'bg-slate-50 dark:bg-dark-850',
    cardBackgroundCN: 'bg-white dark:bg-slate-800/60'
}

/** Prem Style Light Theme for Scrummy */
export const appTheme2: AppTheme = {
    backgroundCN: 'bg-slate-50 dark:bg-[#15202b]',
    cardBackgroundCN: 'bg-white dark:bg-slate-700/50 dark:hover:bg-slate-700/80'
}

export function getAppTheme() {

    const themeNumber = window.MOBILE_THEME_NUMBER || '2';

    console.log("Theme Number ", themeNumber);

    if (themeNumber === '1') {
        return appTheme1;
    }

    if (themeNumber === '2') {
        return appTheme2;
    }

    return appTheme1;
    
}