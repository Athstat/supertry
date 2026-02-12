import { X } from "lucide-react"
import CircleButton from "../../buttons/BackButton"
import BottomSheetView from "../../modals/BottomSheetView"
import PrimaryButton from "../../buttons/PrimaryButton"
import ImageUploadProvider from "../../../../contexts/ui/ImageUploadContext"
import { useImageUpload } from "../../../../hooks/ui/useImageUpload"
import FileInput from "../FileInput"
import ImageCropper from "./ImageCropper"
import { ReactNode } from "react"

type Props = {
  title?: string,
  isOpen?: boolean,
  isLoading?: boolean
  aspect?: number,
  minHeight?: number,
  minWidth?: number,
  initFileUrl?: string,
  children?: ReactNode
  onClose?: () => void,
  onUpload?: (file: File) => void,
}

/** Renders a modal for uploading an image */
export default function ImageUploadModal({ isOpen, onClose, title, isLoading, onUpload, minHeight, minWidth, aspect, initFileUrl, children }: Props) {

  if (!isOpen) {
    return null;
  }

  return (
    <ImageUploadProvider
      onUploadFile={onUpload}
      isLoading={isLoading}
      minHeight={minHeight}
      minWidth={minWidth}
      aspect={aspect}
      initFileUrl={initFileUrl}
    >
      <BottomSheetView
        className="max-h-[90vh] min-h-[90vh] border-t border-slate-600 p-4 flex flex-col gap-6"
        hideHandle
        onClickOutside={onClose}
      >

        <Content 
          title={title}
          onClose={onClose}
        >
          {children}
        </Content>

      </BottomSheetView>
    </ImageUploadProvider>
  )
}

type ContentProps = {
  title?: string,
  onClose?: () => void,
  children?: ReactNode
}

function Content({ onClose, title, children }: ContentProps) {

  const { 
    uploadFile, isLoading, fileUrl, 
    setFile, aspect, minHeight, 
    minWidth, setCroppedFile
  } = useImageUpload();

  const showSave = Boolean(fileUrl);

  const handleSetFiles = (inputFiles: File[]) => {
    if (inputFiles.length > 0) {
      setFile(inputFiles[0]);
    }
  }

  return (
    <div className="flex flex-col gap-6" >
      <div className="flex flex-row items-center justify-between" >
        <div className="flex flex-row items-center gap-2" >

          <CircleButton
            onClick={onClose}
          >
            <X />
          </CircleButton>

          <p className="font-semibold text-lg" >{title}</p>
        </div>

        {showSave && <div>
          <PrimaryButton
            onClick={uploadFile}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Save
          </PrimaryButton>
        </div>}
      </div>

      <div>
        {children}
      </div>

      <div className="flex flex-col gap-4" >

        {!fileUrl && (
          <FileInput
            files={[]}
            setFiles={handleSetFiles}
          />
        )}

        {fileUrl && (
          <ImageCropper
            onConfirmCrop={setCroppedFile}
            aspect={aspect}
            minHeight={minHeight}
            minWidth={minWidth}
            imageUrl={fileUrl}
          />
        )}

        {fileUrl && (
          <PrimaryButton
            slate
            onClick={() => setFile(undefined)}
          >
            Select Different Image
          </PrimaryButton>
        )}

      </div>
    </div>
  )
}