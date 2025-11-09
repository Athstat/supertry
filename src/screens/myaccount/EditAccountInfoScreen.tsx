import { ArrowLeft } from "lucide-react";
import CircleButton from "../../components/shared/buttons/BackButton";
import PageView from "../PageView";
import { useAuth } from "../../contexts/AuthContext";
import { useMemo, useState } from "react";
import InputField from "../../components/shared/InputField";
import PrimaryButton from "../../components/shared/buttons/PrimaryButton";
import AccountInfoProgressCard from "../../components/profile/AccountInfoProgressCard";


/** Renders edit account info screen */
export default function EditAccountInfoScreen() {

  const { authUser } = useAuth();

  const [form, setForm] = useState<EditAccountInfoForm>({
    username: authUser?.username ?? "",
    firstName: authUser?.first_name,
    lastName: authUser?.last_name
  });

  const changesDetected = useMemo(() => {
    const originalHash = `${authUser?.username}---${authUser?.first_name}---${authUser?.last_name}`;
    const newHash = `${form.username}---${form?.firstName}---${form?.lastName}`;

    return newHash !== originalHash
  }, [authUser, form]);

  const userNameError = useMemo(() => {
    const { username } = form;

    if (username === "" || username === undefined) {
      return "Username is required"
    }

    if (username.length < 3) {
      return "Username must be atleast 3 characters long"
    }

    return undefined;
  }, [form.username]);

  return (
    <PageView className="px-6 flex flex-col gap-6" >
      <div className="flex flex-row items-center gap-2" >
        <CircleButton>
          <ArrowLeft className="" />
        </CircleButton>

        <div>
          <p className="text-xl font-bold" >Edit Account Profile</p>
        </div>
      </div>

      <AccountInfoProgressCard
        username={form.username}
        lastName={form.lastName}
        firstName={form.firstName}
      />

      <form className="flex flex-col gap-4" >
        <InputField
          placeholder="Username"
          value={form.username}
          label="Username*"
          onChange={(s) => {
            setForm({ ...form, username: s ?? "" })
          }}
          error={userNameError}
        />

        <InputField
          placeholder="First Name"
          value={form.firstName}
          label="First Name"
          onChange={(s) => {
            setForm({ ...form, firstName: s ?? "" })
          }}
        />

        <InputField
          placeholder="Last Name"
          value={form.lastName}
          label="Last Name"
          onChange={(s) => {
            setForm({ ...form, lastName: s ?? "" })
          }}
        />
      
        {changesDetected && <PrimaryButton>
          Save Changes
        </PrimaryButton>}
      </form>

    </PageView>
  )
}

type EditAccountInfoForm = {
  username: string,
  firstName?: string,
  lastName?: string
}