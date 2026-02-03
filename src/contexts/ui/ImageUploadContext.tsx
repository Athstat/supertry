import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"

type ImageUploadContextProps = {
    file?: File,
    setFile: Dispatch<SetStateAction<File | undefined>>,
    error?: string,
    setError?: Dispatch<SetStateAction<string | undefined>>
}

export const ImageUploadContext = createContext<ImageUploadContextProps | null>(null);

type Props = {
    children?: ReactNode,
    initFile?: File
}

/** Provides context for image uploading */
export default function ImageUploadProvider({ children, initFile }: Props) {

    const [file, setFile] = useState<File | undefined>(initFile);
    const [error, setError] = useState<string>();

    return (
        <ImageUploadContext.Provider
            value={{file, setFile, error, setError}}
        >
            {children}
        </ImageUploadContext.Provider>
    )
}
