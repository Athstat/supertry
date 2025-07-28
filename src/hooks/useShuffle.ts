

import { useCallback, useState } from "react";

type DeterministicOptions = {
    /** Shuffle window in which the same result is produced, in millis */
    shuffleWindow?: number
}

/** Shuffle hook that shuffles an array deterministically
 * using an interval of five hours so that shuffle
 * always returns the correct result at the end
 */

export function useDeterministicShuffle<T>(arr: T[], options?: DeterministicOptions) {
    const [manualShuffleSeed, setManualShuffleSeed] = useState<number>();

    function seededRandom(seed: number) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function seededShuffle<T>(array: T[], seed: number): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(seed + i) * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    const now = Date.now();
    const DEFAULT_WINDOW = 1000 * 60 * 60 * 5;
    const fiveHourWindow = Math.floor(now / (options?.shuffleWindow ?? DEFAULT_WINDOW));
    const effectiveSeed = manualShuffleSeed !== undefined ? manualShuffleSeed : fiveHourWindow;

    const shuffledArr = seededShuffle(arr, effectiveSeed);

    const triggerShuffle = () => {
        setManualShuffleSeed(Date.now()); // Optionally: use Math.floor(Date.now() / 1000) for more stable results
    };

    return {
        shuffledArr,
        triggerShuffle
    };
}

export function useShuffle<T>(arr: T[]) {
    const [shuffledArr, setShuffledArr] = useState<T[]>(() => shuffle([...arr]));

    function shuffle(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    const triggerShuffle = useCallback(() => {
        setShuffledArr(shuffle([...arr]));
    }, [arr]);

    return {
        shuffledArr,
        triggerShuffle
    };
}