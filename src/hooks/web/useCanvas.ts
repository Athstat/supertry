import { useRef, useState } from "react";
import { logger } from "../../services/logger";

export function useCanvas(setErrorMessage: (val?: string) => void, setSuccessMessage: (val?: string) => void) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [isCopying, setIsCopying] = useState(false);

    const copyAsImage = async () => {

        const canvas = ref.current;

        if (!canvas) {
            return;
        }

        canvas.toBlob(async (blob) => {

            setErrorMessage(undefined);
            setSuccessMessage(undefined);

            if (!blob) {
                return;
            }

            try {
                setIsCopying(true);

                await navigator.clipboard.write([
                    new ClipboardItem({
                        "image/png": blob,
                    })
                ]);

                setSuccessMessage("QR Code was copied to your clipboard")

            } catch (err) {
                logger.error('Failed to copy canvas ', err);
                setErrorMessage("Oops! Something wen't wrong copying the QR-code")
            } finally {
                setIsCopying(false);
            }

        });
    }

    const clearMessages = () => {
        setSuccessMessage(undefined);
        setErrorMessage(undefined);
    }

    return {
        ref,
        copyAsImage,
        isCopying,
        clearMessages
    }
}