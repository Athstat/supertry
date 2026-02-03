import { createContext, Dispatch, ReactNode, SetStateAction, useRef, useState } from "react"

type ImageUploadContextProps = {
    file?: File,
    setFile: Dispatch<SetStateAction<File | undefined>>,
    error?: string,
    setError?: Dispatch<SetStateAction<string | undefined>>,
    uploadFile?: () => void,
    isLoading?: boolean,
    setCroppedFile: (file: File) => void,
    aspect?: number,
    minHeight?: number,
    minWidth?: number,
    initFileUrl?: string
}

export const ImageUploadContext = createContext<ImageUploadContextProps | null>(null);

type Props = {
    children?: ReactNode,
    initFileUrl?: string
    onUploadFile?: (file: File) => void,
    isLoading?: boolean,
    aspect?: number,
    minHeight?: number,
    minWidth?: number
}

/** Provides context for image uploading */
export default function ImageUploadProvider({ children, onUploadFile, isLoading, aspect, minHeight, minWidth, initFileUrl }: Props) {

    const croppedFileRef = useRef<File>(null);

    const [file, setFile] = useState<File | undefined>();
    const [error, setError] = useState<string>();

    const handleUpload = () => {
        if (onUploadFile && croppedFileRef.current) {
            onUploadFile(croppedFileRef.current)
        }
    }

    const handleConfirmCrop = (file: File) => {
        croppedFileRef.current = file;
    }

    return (
        <ImageUploadContext.Provider
            value={{
                file, setFile,
                error, setError,
                uploadFile: handleUpload,
                isLoading,
                setCroppedFile: handleConfirmCrop,
                minHeight,
                minWidth,
                aspect,
                initFileUrl
            }}
        >
            {children}
        </ImageUploadContext.Provider>
    )
}
