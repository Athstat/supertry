import { useCallback, useState } from "react"
import {useDropzone} from 'react-dropzone';
import SecondaryText from "../typography/SecondaryText";
import { ImagePlus } from "lucide-react";

type Props = {
    files: File[],
    setFiles: (files: File[]) => void
}


/** Renders a file input component */
export default function ImageFileInput({files, setFiles} : Props) {

    const onDrop = useCallback(<T extends File>(acceptedFiles: T[]) => {
        console.log("Accepted Files ", acceptedFiles);
        setFiles(acceptedFiles);
    }, []);
    
    const {
        getRootProps,
        getInputProps,
        isDragActive
    } = useDropzone({onDrop})

    return (
        <div className="flex flex-col gap-4" {...getRootProps()} >
            <input {...getInputProps()} />

            {isDragActive && files.length === 0 && (
                <DropzoneCardActive />
            )}

            {!isDragActive && files.length === 0 &&  (
                <DropzoneCard />
            )}

            {files.map((f, index) => {
                return <ImageFilePreview file={f} key={index + f.name} />
            })}
        </div>
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
    file: File
}

function ImageFilePreview({file} : FilePreviewProps) {
    
    const previewUrl = URL.createObjectURL(file);
    
    return (
        <div>
            <img 
                src={previewUrl}
                className="rounded-xl"
            />
        </div>
    )
}