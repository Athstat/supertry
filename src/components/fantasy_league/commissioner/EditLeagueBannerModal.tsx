import { useCallback, useState } from "react";
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import { logger } from "../../../services/logger";
import SecondaryText from "../../ui/typography/SecondaryText";
import ImageUploadModal from "../../ui/forms/images/ImageUploadModal";
import ErrorCard from "../../ui/cards/ErrorCard";

type EditLeagueBannerProps = {
    isOpen?: boolean,
    onClose?: () => void
}

export function EditLeagueBannerModal({ isOpen, onClose }: EditLeagueBannerProps) {

    const [isUploading, setUploading] = useState(false);
    const [error, setError] = useState<string>();

    const { league, mutateLeague } = useFantasyLeagueGroup();

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose])

    const handleUpload = useCallback(async (banner: File) => {
        try {

            setError(undefined);
            setUploading(true);

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

    }, [league, mutateLeague, handleClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <>
            <ImageUploadModal
                isOpen={isOpen}
                title="Edit Banner"
                onClose={onClose}
                onUpload={handleUpload}
                aspect={16 / 7}
                minHeight={150}
                minWidth={undefined}
                isLoading={isUploading}
            >
                <>
                    <section className="text-xs" >
                        <p className="text-sm" >Banner image tips:</p>
                        <SecondaryText>- Use an image with a ration of 16:7 in resolution</SecondaryText>
                        <SecondaryText>- Avoid using images with any transparencies!</SecondaryText>
                        <SecondaryText>- Max image size is 5MB. For the best look, pick a banner that both matches your brand/identity and the colours and vibe of the app</SecondaryText>
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