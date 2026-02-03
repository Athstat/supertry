import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css'
import ReactCrop, { centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop'
import PrimaryButton from '../../buttons/PrimaryButton';
type Props = {
    file: File,
    onConfirmCrop?: (file: File) => void,
    isLoading?: boolean,
    aspect?: number,
    minWidth?: number
    minHeight?: number
}

export default function ImageCropper({ file, onConfirmCrop, aspect = 1, minWidth = 100, minHeight = 100, isLoading }: Props) {

    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [crop, setCrop] = useState<PixelCrop>();
    const imageSrc = URL.createObjectURL(file);

    const handleConfirmCrop = async () => {
        const image = imageRef.current;
        const canvas = canvasRef.current;

        if (!image || !canvas || !crop || !onConfirmCrop) {
            return null;
        }

        const newFile = await createCroppedImage(
            image, canvas, crop, file
        );

        if (!newFile) {
            return null;
        }

        onConfirmCrop(newFile);
    }

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
        return () => {
            URL.revokeObjectURL(imageSrc)
        }
    }, [imageSrc]);

    return (
        <div className='flex flex-col gap-3' >

            <ReactCrop
                crop={crop}
                onChange={(crop) => setCrop(crop)}
                aspect={aspect}
                minWidth={minWidth}
                minHeight={minHeight}
            >
                <img ref={imageRef} src={imageSrc} onLoad={handleImageLoad} />
            </ReactCrop>

            <canvas style={{ display: "none" }} ref={canvasRef} />

            <PrimaryButton
                onClick={handleConfirmCrop}
                disabled={isLoading}
                isLoading={isLoading}
            >
                Crop & Save
            </PrimaryButton>
        </div>
    )
}

async function createCroppedImage(image: HTMLImageElement, canvas: HTMLCanvasElement, crop: PixelCrop, file: File): Promise<File | undefined> {

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

    const fileType = file.type;
    const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, fileType, 0.95);
    });

    const newFile = new File([blob as Blob], `${file.name}`, { type: fileType });
    return newFile || undefined;

}