import 'react-image-crop/dist/ReactCrop.css'
import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop'

type Props = {
    imageUrl: string,
    aspect?: number,
    minWidth?: number
    minHeight?: number
    onConfirmCrop?: (file: File) => void,
}

export default function ImageCropper({ imageUrl, onConfirmCrop, aspect = 1, minWidth = 500, minHeight = 500 }: Props) {

    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [crop, setCrop] = useState<PixelCrop>();

    const handleConfirmCrop = useCallback(async (crop: PixelCrop) => {
        const image = imageRef.current;
        const canvas = canvasRef.current;

        if (!image || !canvas || !crop || !onConfirmCrop) {
            return null;
        }

        const newFile = await createCroppedImage(
            image, canvas, crop
        );

        if (!newFile) {
            return null;
        }

        onConfirmCrop(newFile);
    }, [onConfirmCrop]);

    const handleImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        const width = e.currentTarget.width;
        const height = e.currentTarget.height;

        const defaultCrop = makeAspectCrop({
            x: 0,
            y: 0,
            unit: 'px',
            width: minWidth,
            height: minHeight
        }, aspect, width, height);

        const centeredCrop = centerCrop(defaultCrop, width, height)
        setCrop(centeredCrop);
    }

    useEffect(() => {

        if (!crop) {
            return;
        }

        const timeout = setTimeout(() => {
            handleConfirmCrop(crop);
        }, 500);

        return () => {
            clearTimeout(timeout);
        }

    }, [crop, handleConfirmCrop]);

    return (
        <div className='flex flex-col gap-3 items-center justify-center' >

            <ReactCrop
                crop={crop}
                onChange={(crop) => setCrop(crop)}
                aspect={aspect}
                minWidth={minWidth}
                minHeight={minHeight}
            >

                <img
                    ref={imageRef}
                    src={imageUrl}
                    onLoad={handleImageLoad}
                    key={imageUrl}
                />

            </ReactCrop>

            <canvas style={{ display: "none" }} ref={canvasRef} />
        </div>
    )
}

async function createCroppedImage(image: HTMLImageElement, canvas: HTMLCanvasElement, crop: PixelCrop): Promise<File | undefined> {

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        return undefined;
    }

    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";
    ctx.save();

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    ctx.translate(-cropX, cropY);
    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
    );

    ctx.restore();
    
    const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/webp", 0.95);
    });
    
    const fileType = (blob as Blob).type;
    const fileName = `image_${new Date().valueOf()}.${fileType.split('/').at(1)}`;

    const newFile = new File([blob as Blob], `${fileName}`, { type: fileType });
    return newFile || undefined;

}