import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"

type ImageUploadContextProps = {
    file?: File,
    setFile: Dispatch<SetStateAction<File | undefined>>,
    error?: string,
    setError?: Dispatch<SetStateAction<string | undefined>>,
    uploadFile?: (file: File) => void,
    isLoading?: boolean
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

    const [file, setFile] = useState<File | undefined>(initFile);
    const [error, setError] = useState<string>();

    return (
        <ImageUploadContext.Provider
            value={{
                file, setFile,
                error, setError,
                uploadFile: onUploadFile, isLoading
            }}
        >
            {children}
        </ImageUploadContext.Provider>
    )
}
