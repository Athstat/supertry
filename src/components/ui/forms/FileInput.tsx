import { useCallback, useEffect, useMemo, useState } from "react"
import { FileRejection, useDropzone } from 'react-dropzone';
import SecondaryText from "../typography/SecondaryText";
import { ImagePlus } from "lucide-react";
import { Toast } from "../Toast";
import { SIZE_5_MEGABYTES } from "../../../types/constants";

type Props = {
    files: File[],
    setFiles: (files: File[]) => void,
    previewSize?: number,
    accept?: Record<string, string[]>,
    maxSize?: number
}

const defaultAccept = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/webp': ['.webp']
}

/** Renders a file input component */
export default function ImageFileInput({ files, setFiles, previewSize, accept = defaultAccept, maxSize = SIZE_5_MEGABYTES }: Props) {

    const [error, setError] = useState<string>();

    const onDrop = useCallback(<T extends File>(acceptedFiles: T[]) => {
        setFiles(acceptedFiles);
        setError(undefined);
    }, [setFiles]);

    const handleRejectedFiles = (fileRejections: FileRejection[]) => {
        const firstRejection = fileRejections.at(0);
        if (!firstRejection) {
            return;
        }

        const firstError = firstRejection.errors.at(0);

        if (!firstError) {
            return;
        }

        setError(firstError.message);
    }

    const handleClearErrors = () => {
        setError(undefined);
    }

    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
        onDrop, useFsAccessApi: false,
        accept, maxSize, onDropRejected: handleRejectedFiles
    });

    return (
        <>
            <div className="flex flex-col gap-4" {...getRootProps()} >
                <input {...getInputProps()} />

                {isDragActive && files.length === 0 && (
                    <DropzoneCardActive />
                )}

                {!isDragActive && files.length === 0 && (
                    <DropzoneCard />
                )}

                {files.map((f, index) => {
                    return <ImageFilePreview size={previewSize} file={f} key={index + f.name} />
                })}
            </div>

            {error && (
                <Toast
                    message={error}
                    type="error"
                    onClose={handleClearErrors}
                    isVisible={Boolean(error)}
                />
            )}
        </>
    )
}

function DropzoneCard() {
    return (
        <div className="border-dotted cursor-pointer border-4 px-4 py-10 rounded-xl border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center" >
            <div className="flex flex-row items-center gap-2" >
                <ImagePlus className="w-10 h-10 text-slate-700 dark:text-slate-400" />
                <SecondaryText className="text-base" >Select or drag file</SecondaryText>
            </div>
        </div>
    )
}

function DropzoneCardActive() {
    return (
        <div className="border-dotted cursor-pointer border-4 px-4 py-10 rounded-xl border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center" >
            <div className="flex flex-row items-center gap-2" >
                <ImagePlus className="w-10 h-10 text-slate-700 dark:text-slate-400" />
                <SecondaryText className="text-base" >Drop files here</SecondaryText>
            </div>
        </div>
    )
}

type FilePreviewProps = {
    file: File,
    size?: number
}

function ImageFilePreview({ file, size }: FilePreviewProps) {

    const previewUrl = useMemo(() => {
        return URL.createObjectURL(file)
    }, [file]);

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(previewUrl)
        }
    }, [previewUrl]);

    return (
        <div className="flex flex-row items-center justify-center" >
            <img
                src={previewUrl}
                className="rounded-xl"
                width={size}
                height={size}
                alt="preview"
            />
        </div>
    )
}