import { SyntheticEvent, useEffect, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css'
import ReactCrop, { makeAspectCrop, type Crop } from 'react-image-crop'

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

    const handleImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        const width = e.currentTarget.width;
        const height = e.currentTarget.height;

        const defaultCrop = makeAspectCrop({
            x: 0,
            y:0,
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
        <div>
            <ReactCrop
                crop={crop}
                onChange={(crop) => setCrop(crop)}
                aspect={aspect}
                minWidth={minWidth}
                minHeight={minHeight}
            >
                <img src={imageSrc} onLoad={handleImageLoad} />
            </ReactCrop>
        </div>
    )
}
