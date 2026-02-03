import { useState, useCallback } from "react";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService";
import { logger } from "../../../services/logger";
import ImageUploadModal from "../../ui/forms/images/ImageUploadModal";
import ErrorCard from "../../ui/cards/ErrorCard";
import SecondaryText from "../../ui/typography/SecondaryText";

type Props = {
    isOpen?: boolean,
    onClose?: () => void
}

export default function EditLeagueLogoModal({ isOpen, onClose }: Props) {

    const [isUploading, setUploading] = useState(false);
    const [error, setError] = useState<string>();

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

                console.log("It Worked!", updatedLeague);

                mutateLeague(updatedLeague);
                setUploading(false);
                handleClose();
                return;
            }

            setError("Something went wrong uploading the logo");

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
        <>
            <ImageUploadModal
                title="Edit Logo"
                isOpen={isOpen}
                onClose={onClose}
                onUpload={handleUpload}
                isLoading={isUploading}
                minHeight={200}
            >

                <>

                    <section className="text-xs" >
                        <p className="text-sm" >Logo image tips:</p>
                        <SecondaryText>- Use a sqaure image</SecondaryText>
                        <SecondaryText>- Max image size is 5MB. For the best look, pick an image that can be framed inside a circle, like a profile picture</SecondaryText>
                    </section>

                    {error && <ErrorCard
                        error="Failed to Upload Image"
                        message={error}
                        className="items-start justify-start"
                    />}

                </>
            </ImageUploadModal>

        </>
    )
}
