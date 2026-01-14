import { useRef, useState } from "react";

export function useCanvas(setErrorMessage: (val?: string) => void, setSuccessMessage: (val?: string) => void) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [isCopying, setIsCopying] = useState(false);

    const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) reject(new Error("Failed to create blob"));
                else resolve(blob);
            }, "image/png");
        });
    };

    const copyAsImage = async () => {
        const canvas = ref.current;
        if (!canvas) return;

        setErrorMessage(undefined);
        setSuccessMessage(undefined);

        try {
            setIsCopying(true);

            const blob = await canvasToBlob(canvas);

            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
            ]);

            setSuccessMessage("QR-code was copied to your clipboard");
        } catch (err) {
            console.error("Failed to copy canvas", err);
            setErrorMessage("Oops! Something went wrong copying the QR-code");
        } finally {
            setIsCopying(false);
        }
    };

    return {
        ref,
        copyAsImage,
        isCopying
    }
}