import { Pencil, X } from "lucide-react";
import { useState } from "react";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService";
import { logger } from "../../../services/logger";
import { FantasyLeagueGroup } from "../../../types/fantasyLeagueGroups";
import LeagueVisibilityInput from "../../fantasy-leagues/create_league_modal/LeagueVisibilityInput";
import CircleButton from "../../ui/buttons/BackButton";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import { ErrorState } from "../../ui/ErrorState";
import InputField, { TextField } from "../../ui/forms/InputField";
import BottomSheetView from "../../ui/modals/BottomSheetView";
import { useInView } from "react-intersection-observer";

type EditInfoProps = {
    isOpen?: boolean,
    onClose?: () => void,
    refresh?: () => void,
    league?: FantasyLeagueGroup
}

export function EditLeagueInfoModal({ isOpen, onClose }: EditInfoProps) {

    const { league, mutateLeague } = useFantasyLeagueGroup();
    const { inView: isTopButtonInView } = useInView();

    const initialForm: EditLeagueForm = {
        title: league?.title ?? "",
        description: league?.description,
        is_private: league?.is_private ?? false
    }

    const [form, setForm] = useState<EditLeagueForm>(initialForm);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const handleCancel = () => {
        setForm(initialForm);

        if (onClose) {
            onClose();
        }
    }

    const handleSubmit = async () => {

        setIsLoading(true);
        try {
            const res = await fantasyLeagueGroupsService.editGroupInfo(league?.id ?? "", form);

            if (res.data) {
                mutateLeague(res.data);

                if (onClose) {
                    onClose();
                }

                setError(undefined);
                setIsLoading(false);
                return;
            }

            if (res.error) {
                setError(res.error.message);
                setIsLoading(false);
            }

        } catch (err) {
            logger.error("Error saving commissioner changes ", err);
            setError("Something wen't wrong saving your league settings");
        }

        setIsLoading(false);
    }


    if (!isOpen) {
        return null;
    }

    return (
        <BottomSheetView
            className='max-h-[90vh] p-4 '
            hideHandle
        >
            <div className='flex flex-row items-center justify-between gap-2' >
                <div className='flex flex-row items-center gap-2' >
                    <Pencil />
                    <p>Edit League Info</p>
                </div>

                <CircleButton onClick={onClose} >
                    <X />
                </CircleButton>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 py-4" >
                <InputField
                    label="League Title"
                    value={form.title}
                    onChange={(v) => setForm({
                        ...form,
                        title: v ?? ""
                    })}
                    required
                />

                <TextField
                    label="Description"
                    value={form.description}
                    onChange={(v) => setForm({
                        ...form,
                        description: v
                    })}
                />

                <LeagueVisibilityInput
                    value={form.is_private ? "private" : "public"}
                    onChange={(v) => setForm({
                        ...form,
                        is_private: v === "private" ? true : false
                    })}
                />

                <PrimaryButton
                    isLoading={isLoading}
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className="py-3"
                >
                    Save Changes
                </PrimaryButton>

                <PrimaryButton
                    disabled={isLoading}
                    onClick={handleCancel}
                    className="py-3"
                    slate
                >
                    Cancel
                </PrimaryButton>

                {
                    !isTopButtonInView && error && (
                        <div>
                            <ErrorState
                                error="Whoops"
                                message={error}
                            />
                        </div>
                    )
                }
            </form>
        </BottomSheetView>
    )
}


type EditLeagueForm = {
    title: string,
    description?: string,
    is_private: boolean
}