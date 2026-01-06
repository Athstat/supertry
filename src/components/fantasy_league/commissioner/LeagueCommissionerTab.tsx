import { Settings } from "lucide-react";
import { useState } from "react";
import InputField, { TextField } from "../../ui/forms/InputField";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import SecondaryText from "../../ui/typography/SecondaryText";
import LeagueVisibilityInput from "../../fantasy-leagues/create_league_modal/LeagueVisibilityInput";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import { useInView } from "react-intersection-observer";
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService";
import { ErrorState } from "../../ui/ErrorState";

export default function LeagueCommissionerTab() {

  const { league, mutateLeague } = useFantasyLeagueGroup();
  const { ref, inView: isTopButtonInView } = useInView();

  const initialForm: EditLeagueForm = {
    title: league?.title ?? "",
    description: league?.description,
    is_private: league?.is_private ?? false
  }

  const originalHash = JSON.stringify(initialForm);
  const [form, setForm] = useState<EditLeagueForm>(initialForm);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const changesDetected = originalHash !== JSON.stringify(form);

  const handleSubmit = async () => {

    setIsLoading(true);
    try {
      const res = await fantasyLeagueGroupsService.editGroupInfo(league?.id ?? "", form);

      if (res.data) {
        mutateLeague(res.data);
        setError(undefined);
        setIsLoading(false);
        return;
      }

      if (res.error) {
        setError(res.error.message);
        setIsLoading(false);
      }

    } catch (err) {
      console.log("Error saving commissioner changes");
      setError("Something wen't wrong saving your league settings")
    }

    setIsLoading(false);
  }

  return (
    <div className="flex flex-col gap-4" >

      <div className="flex flex-col gap-1" >
        <div className="flex flex-row items-center justify-between gap-2" >
          <div className="flex flex-row items-center gap-2" >
            <Settings />
            <p className="font-bold text-xl" >Commissioner Settings</p>
          </div>

          <div>
            {changesDetected && (
              <div ref={ref} >
                <PrimaryButton
                  isLoading={isLoading}
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  Save
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>

        <div>
          <SecondaryText>Edit and customize your fantasy league.</SecondaryText>
        </div>

        {
          isTopButtonInView && error && (
            <div>
              <ErrorState
                error="Whoops"
                message={error}
              />
            </div>
          )
        }

      </div>

      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4" >
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

        {changesDetected && !isTopButtonInView && (
          <PrimaryButton
            isLoading={isLoading}
            disabled={isLoading}
            onClick={handleSubmit}
            className="mt-3"
          >
            Save Changes
          </PrimaryButton>
        )}

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

    </div>
  )
}

type EditLeagueForm = {
  title: string,
  description?: string,
  is_private: boolean
}