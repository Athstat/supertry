import { useEffect, useState } from "react";

/** Hoook for creating a delay */
export function useDelay(milliseconds: number = 500) {
    
    const [isDelaying, setIsDelaying] = useState<boolean>(false);
    
    useEffect(() => {
        setIsDelaying(true);

        const timeout = setTimeout(() => {
            setIsDelaying(false)
        }, milliseconds);

        return () => {
            clearTimeout(timeout);
        }
    }, [milliseconds]);

    return {isDelaying, setIsDelaying}
}