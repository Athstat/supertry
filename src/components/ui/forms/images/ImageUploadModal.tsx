import { X } from "lucide-react"
import CircleButton from "../../buttons/BackButton"
import BottomSheetView from "../../modals/BottomSheetView"
import PrimaryButton from "../../buttons/PrimaryButton"
import ImageUploadProvider from "../../../../contexts/ui/ImageUploadContext"
import { useImageUpload } from "../../../../hooks/ui/useImageUpload"
import FileInput from "../FileInput"
import ImageCropper from "./ImageCropper"

type Props = {
  isOpen?: boolean,
  onClose?: () => void,
  title?: string,
  onUpload?: (file: File) => void,
  initFile?: File
}

/** Renders a modal for uploading an image */
export default function ImageUploadModal({ isOpen, onClose, title, initFile }: Props) {

  if (!isOpen) {
    return null;
  }

  return (
    <ImageUploadProvider initFile={initFile} >
      <BottomSheetView
        className="max-h-[90vh] min-h-[90vh] border-t border-slate-600 p-4 flex flex-col gap-6"
        hideHandle
        onClickOutside={onClose}
      >
        <Header onClose={onClose} title={title} showSave />
        <BodySection />
      </BottomSheetView>
    </ImageUploadProvider>
  )
}

type HeaderProps = {
  onClose?: () => void,
  title?: string,
  showSave?: boolean
}

function Header({ onClose, title, showSave = false }: HeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between" >
      <div className="flex flex-row items-center gap-2" >

        <CircleButton onClick={onClose} >
          <X />
        </CircleButton>

        <p className="font-semibold text-lg" >{title}</p>
      </div>

      {showSave && <div>
        <PrimaryButton>Save</PrimaryButton>
      </div>}
    </div>
  )
}

function BodySection() {

  const {file, setFile} = useImageUpload();  
  const inputFiles = file ? [file] : [];

  const handleSetFiles = (inputFiles: File[]) => {
    if (inputFiles.length > 0) {
      setFile(inputFiles[0]);
    }
  }

  const handleUploadNewFile = () => {
    setFile(undefined);
  }

  return (
    <div className="" >

      {!file && (
        <FileInput 
          files={inputFiles}
          setFiles={handleSetFiles}
        />
      )}

      {file && (
        <ImageCropper 
          file={file}
          setFile={setFile}
        />
      )}

      {file && (
        <PrimaryButton onClick={handleUploadNewFile} >
          Upload New Image
        </PrimaryButton>
      )}

    </div>
  )
}