import { useState, useCallback } from "react";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService";
import { logger } from "../../../services/logger";
import ImageUploadModal from "../../ui/forms/images/ImageUploadModal";

type Props = {
    isOpen?: boolean,
    onClose?: () => void
}

export default function EditLeagueLogoModal({ isOpen, onClose }: Props) {

    const [isUploading, setUploading] = useState(false);
    const [, setError] = useState<string>();

    const { league, mutateLeague } = useFantasyLeagueGroup();

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
            setError(undefined);
        }
    }, [onClose]);

    const handleUpload = useCallback(async (logo: File) => {
        try {

            setError(undefined);
            setUploading(true);

            const updatedLeague = await fantasyLeagueGroupsService.updateBannerAndLogo(league?.id || '', undefined, logo);

            if (updatedLeague) {
                mutateLeague(updatedLeague);
                setUploading(false);
                handleClose();
                return;
            }

            setError("Something went wrong uploading the logo")

        } catch (err) {
            logger.error("Error handling upload ", err);
            setError("Something went wrong uploading logo");
        } finally {
            setUploading(false);
        }

    }, [league, mutateLeague, handleClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <ImageUploadModal
            title="Edit Logo"
            isOpen={isOpen}
            onClose={onClose}
            onUpload={handleUpload}
            isLoading={isUploading}
        />
    )
}
