import { SyntheticEvent, useEffect, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css'
import ReactCrop, { makeAspectCrop, type Crop } from 'react-image-crop'
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

    const [crop, setCrop] = useState<Crop>();
    const imageSrc = URL.createObjectURL(file);

    const [isCropping, setIsCropping] = useState(true);
    const toggleIsCropping = () => setIsCropping(prev => !prev);

    const handleConfirmCrop = () => {
        setIsCropping(false);
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

        setCrop(defaultCrop);
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
                <img src={imageSrc} onLoad={handleImageLoad} />
            </ReactCrop>}

            {!isCropping &&
                <img src={imageSrc} onLoad={handleImageLoad} />
            }

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