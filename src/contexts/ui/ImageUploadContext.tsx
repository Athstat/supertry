import { createContext, Dispatch, ReactNode, SetStateAction, useRef, useState } from "react"

type ImageUploadContextProps = {
    file?: File,
    setFile: Dispatch<SetStateAction<File | undefined>>,
    error?: string,
    setError?: Dispatch<SetStateAction<string | undefined>>,
    uploadFile?: () => void,
    isLoading?: boolean,
    setCroppedFile: (file: File) => void,
}

export const ImageUploadContext = createContext<ImageUploadContextProps | null>(null);

type Props = {
    children?: ReactNode,
    initFile?: File,
    onUploadFile?: (file: File) => void,
    isLoading?: boolean
}

/** Provides context for image uploading */
export default function ImageUploadProvider({ children, initFile, onUploadFile, isLoading }: Props) {

    const croppedFileRef = useRef<File>(null);

    const [file, setFile] = useState<File | undefined>(initFile);
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
                setCroppedFile: handleConfirmCrop
            }}
        >
            {children}
        </ImageUploadContext.Provider>
    )
}
