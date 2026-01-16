import { X, Upload } from "lucide-react";
import { useState, useCallback } from "react";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService";
import { logger } from "../../../services/logger";
import CircleButton from "../../ui/buttons/BackButton";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import ImageFileInput from "../../ui/forms/FileInput";
import BottomSheetView from "../../ui/modals/BottomSheetView";
import { Toast } from "../../ui/Toast";

type Props = {
    isOpen?: boolean,
    onClose?: () => void
}

export default function EditLeagueLogoModal({ isOpen, onClose }: Props) {
const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setUploading] = useState(false);
    const [error, setError] = useState<string>();

    const {league, mutateLeague} = useFantasyLeagueGroup();

    const handleClose = useCallback(() => {
        if (onClose) {
            setFiles([]);
            onClose();
        }
    }, [onClose]);

    const handleUpload = useCallback(async () => {
        try {

            
            if (files.length === 0 || !league?.id) {
                return;
            }
            
            setUploading(true);

            const logo = files[0];
            const updatedLeague = await fantasyLeagueGroupsService.updateBannerAndLogo(league?.id || '', undefined, logo);

            if (updatedLeague) {
                mutateLeague(updatedLeague);
                setUploading(false);
                handleClose();
                return;
            }

        } catch (err) {
            logger.error("Error handling upload ", err);
            setError("Something wen't wrong uploading banner");
        } finally {
            setUploading(false);
        }

    }, [files, league, mutateLeague, handleClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <BottomSheetView
            hideHandle
            className='max-h-[80vh] p-4 min-h-[40vh] flex flex-col gap-2'
        >
            <div className='flex flex-row items-center gap-2 justify-between' >
                <p className='font-semibold text-lg' >Edit Logo</p>

                <div>
                    <CircleButton onClick={handleClose}>
                        <X />
                    </CircleButton>
                </div>
            </div>

            <form className="py-4" >
                <ImageFileInput 
                    files={files}
                    setFiles={setFiles}
                    previewSize={100}
                />
            </form>

            <PrimaryButton 
                className="py-3 flex flex-row items-center gap-2"
                onClick={() => handleUpload()}
                isLoading={isUploading}
            >
                <p>Upload Logo</p>
                <Upload />
            </PrimaryButton>

            {error && (
                <Toast 
                    message={error}
                    isVisible={true}
                    type="error"
                    onClose={() => setError(undefined)}
                />
            )}

        </BottomSheetView>
    )
}
