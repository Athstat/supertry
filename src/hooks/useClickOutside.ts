import { useEffect } from "react";

/** Hook that returns a ref object and takes in a handler funcition
 * that is run when the user clicks outside the object where the ref
 * will be passed
 */

export function useClickOutside<T extends HTMLElement>(ref: React.RefObject<T>, handler?: () => void) {
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                if (handler) {
                    handler();
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [handler, ref]);
}