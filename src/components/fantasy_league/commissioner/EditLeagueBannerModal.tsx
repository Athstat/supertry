import { X } from "lucide-react";
import CircleButton from "../../ui/buttons/BackButton";
import BottomSheetView from "../../ui/modals/BottomSheetView";
import ImageFileInput from "../../ui/forms/FileInput";
import { useCallback, useState } from "react";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import { Upload } from "lucide-react";
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import { logger } from "../../../services/logger";
import { Toast } from "../../ui/Toast";

type EditLeagueBannerProps = {
    isOpen?: boolean,
    onClose?: () => void
}

export function EditLeagueBannerModal({ isOpen, onClose }: EditLeagueBannerProps) {

    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setUploading] = useState(false);
    const [error, setError] = useState<string>();

    const {league, mutateLeague} = useFantasyLeagueGroup();

    const handleClose = useCallback(() => {
        if (onClose) {
            setFiles([]);
            onClose();
        }
    }, [onClose])

    const handleUpload = useCallback(async () => {
        try {

            setError(undefined);

            if (files.length === 0 || !league?.id) {
                return;
            }
            
            setUploading(true);

            const banner = files[0];
            const updatedLeague = await fantasyLeagueGroupsService.updateBannerAndLogo(league?.id || '', banner);

            if (updatedLeague) {
                mutateLeague(updatedLeague);
                setUploading(false);
                handleClose();
                return;
            }

            setError("Something went wrong uploading banner");

        } catch (err) {
            logger.error("Error handling upload ", err);
            setError("Something went wrong uploading banner");
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
                <p className='font-semibold text-lg' >Edit Banner</p>

                <div>
                    <CircleButton onClick={handleClose}>
                        <X />
                    </CircleButton>
                </div>
            </div>

            <form>
                <ImageFileInput 
                    files={files}
                    setFiles={setFiles}
                />
            </form>

            <PrimaryButton 
                className="py-3 flex flex-row items-center gap-2"
                onClick={() => handleUpload()}
                isLoading={isUploading}
            >
                <p>Upload Banner</p>
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