import { Settings } from "lucide-react";
import { useState } from "react";
import InputField, { TextField } from "../../shared/InputField";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import SecondaryText from "../../shared/SecondaryText";
import LeagueVisibilityInput from "../../fantasy-leagues/ui/LeagueVisibilityInput";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import { useInView } from "react-intersection-observer";

export default function LeagueCommissionerTab() {

  const { league } = useFantasyLeagueGroup();
  const {ref, inView: isTopButtonInView} = useInView();

  const initialForm: EditLeagueForm = {
    title: league?.title ?? "",
    description: league?.description,
    is_private: league?.is_private ?? false
  }

  const originalHash = JSON.stringify(initialForm);

  const [form, setForm] = useState<EditLeagueForm>(initialForm);

  const changesDetected = originalHash !== JSON.stringify(form);

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
                <PrimaryButton>
                  Save
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>

        <div>
          <SecondaryText>Edit and customize your fantasy league.</SecondaryText>
        </div>

      </div>

      <form className="flex flex-col gap-4" >
        <InputField
          label="League Title"
          value={form.title}
          onChange={(v) => setForm({
            ...form,
            title: v ?? ""
          })}
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
          <PrimaryButton>
            Save Changes
          </PrimaryButton>
        )}
      </form>

    </div>
  )
}

type EditLeagueForm = {
  title: string,
  description?: string,
  is_private: boolean
}