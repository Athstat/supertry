import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from "react"

type ImageUploadContextProps = {
    error?: string,
    aspect?: number,
    fileUrl?: string,
    minWidth?: number,
    minHeight?: number,
    isLoading?: boolean,
    croppedFile?: File

    setFile: (file: File | undefined) => void,
    setError?: Dispatch<SetStateAction<string | undefined>>,
    uploadFile?: () => void,
    setCroppedFile: (file: File) => void,
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

    const [fileUrl, setFileUrl] = useState<string | undefined>(initFileUrl);
    const [error, setError] = useState<string>();

    const [croppedFile, setCroppedFile] = useState<File>();

    const handleUpload = () => {

        if (onUploadFile && croppedFileRef.current) {
            onUploadFile(croppedFileRef.current)
        }
    }

    const handleConfirmCrop = (file: File) => {
        croppedFileRef.current = file;
        setCroppedFile(file);
    }

    const setFile = (file: File | undefined) => {
        if (file === undefined) {
            setFileUrl(undefined);
            return;
        }

        const src = URL.createObjectURL(file);
        setFileUrl(src);
    }

    useEffect(() => {
        
        return () => {   
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
            }
        }

    }, [fileUrl]);

    return (
        <ImageUploadContext.Provider
            value={{
                fileUrl, setFile,
                error, setError,
                uploadFile: handleUpload,
                isLoading,
                setCroppedFile: handleConfirmCrop,
                minHeight,
                minWidth,
                aspect,
                croppedFile
            }}
        >
            {children}
        </ImageUploadContext.Provider>
    )
}
