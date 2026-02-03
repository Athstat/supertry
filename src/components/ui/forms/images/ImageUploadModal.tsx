type Props = {
  isOpen?: boolean,
  onClose?: () => void,
  title?: string,
  onUpload?: (file: File) => void
}

/** Renders a modal for uploading an image */
export default function ImageUploadModal({ isOpen, onClose, title, onUpload }: Props) {

  return (
    <div>

    </div>
  )
}

type HeaderProps = {
  onClose?: () => void,
  
}

function Header() {

}