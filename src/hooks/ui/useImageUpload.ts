import { useContext } from "react";
import { ImageUploadContext } from "../../contexts/ui/ImageUploadContext";

/** Hook for accessing the image upload context */
export function useImageUpload() {
    const context = useContext(ImageUploadContext);

    if (context === null) {
        throw new Error("useImageUpload() was used outside the ImageUploadProvider");
    }

    return {...context}
}