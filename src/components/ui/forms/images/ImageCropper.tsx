import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css'
import ReactCrop, { centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop'
import PrimaryButton from '../../buttons/PrimaryButton';
import { CropIcon } from 'lucide-react';

type Props = {
    file: File,
    setFile?: (file: File) => void,
    aspect?: number,
    minWidth?: number
    minHeight?: number
}

export default function ImageCropper({ file, setFile, aspect = 1, minWidth = 100, minHeight = 100 }: Props) {

    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [crop, setCrop] = useState<PixelCrop>();
    const imageSrc = URL.createObjectURL(file);

    const [isCropping, setIsCropping] = useState(true);
    const toggleIsCropping = () => setIsCropping(prev => !prev);

    const handleConfirmCrop = async () => {
        const image = imageRef.current;
        const canvas = canvasRef.current;

        if (!image || !canvas || !crop || !setFile) {
            return null;
        }

        const newFile = await createCroppedImage(
            image, canvas, crop, file
        );

        if (!newFile) {
            return null;
        }

        setIsCropping(false);
        setFile(newFile);
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

            <Controls
                isCropping={isCropping}
                onStartCrop={toggleIsCropping}
                onConfirmCrop={handleConfirmCrop}
            />

            {isCropping && <ReactCrop
                crop={crop}
                onChange={(crop) => setCrop(crop)}
                aspect={aspect}
                minWidth={minWidth}
                minHeight={minHeight}
            >
                <img ref={imageRef} src={imageSrc} onLoad={handleImageLoad} />
            </ReactCrop>}

            {!isCropping &&
                <img src={imageSrc} onLoad={handleImageLoad} />
            }

            <canvas style={{display: "none"}} ref={canvasRef} />

        </div>
    )
}

type ControlsProps = {
    onStartCrop?: () => void,
    isCropping?: boolean,
    onConfirmCrop?: () => void
}

function Controls({ isCropping, onStartCrop, onConfirmCrop }: ControlsProps) {

    const handleCrop = () => {
        if (!isCropping && onStartCrop) {
            onStartCrop();
            return;
        }

        if (isCropping && onConfirmCrop) {
            onConfirmCrop();
            return;
        }
    }

    return (
        <div className='flex flex-row items-center justify-between' >
            <div></div>

            <div>
                <PrimaryButton
                    slate
                    className='text-xs w-fit'
                    onClick={handleCrop}
                >
                    <CropIcon className='w-4 h-4' />
                    <p>{isCropping ? 'Apply Crop' : 'Crop Image'}</p>
                </PrimaryButton>
            </div>
        </div>
    )
}

async function createCroppedImage(image: HTMLImageElement, canvas: HTMLCanvasElement, crop: PixelCrop, file: File) : Promise<File | undefined> {
    
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

    const newFile = new File([blob as Blob], `${file.name}`, {type: fileType});
    return newFile || undefined;

}