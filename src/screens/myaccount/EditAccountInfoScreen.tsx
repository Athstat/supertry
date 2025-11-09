import { ArrowLeft } from "lucide-react";
import CircleButton from "../../components/shared/buttons/BackButton";
import PageView from "../PageView";
import { useAuth } from "../../contexts/AuthContext";
import { useCallback, useMemo, useState } from "react";
import InputField from "../../components/shared/InputField";
import PrimaryButton from "../../components/shared/buttons/PrimaryButton";
import AccountInfoProgressCard from "../../components/profile/AccountInfoProgressCard";
import { userService } from "../../services/userService";
import { Toast } from "../../components/ui/Toast";
import { useNavigate } from "react-router-dom";


/** Renders edit account info screen */
export default function EditAccountInfoScreen() {

  const { authUser, refreshAuthUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<EditAccountInfoForm>({
    username: authUser?.username ?? "",
    firstName: authUser?.first_name,
    lastName: authUser?.last_name
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

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

  const handleSaveChanges = useCallback(async () => {

    if (userNameError) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage(undefined);
    setError(undefined);

    try {

      const res = await userService.updateUserProfile({
        username: form.username ?? "",
        first_name: form.firstName ?? " ",
        last_name: form.lastName ?? " "
      });

      if (res) {
        setSuccessMessage("Profile Updated Successfully");
        await refreshAuthUser(res);
      } else {
        setError("Whoops! Something wen't wrong, please try again");
      }

    } catch (err) {
      setError("Something wen't wrong updating your user profile");
    }

    setIsLoading(false);
  }, [form, setIsLoading, setSuccessMessage, setError, userNameError]);

  const handleBack = () => {
    navigate('/profile');
  }

  return (
    <PageView className="px-6 flex flex-col gap-6" >
      <div className="flex flex-row items-center gap-2" >
        <CircleButton
          onClick={handleBack}
        >
          <ArrowLeft className="" />
        </CircleButton>

        <div>
          <p className="text-xl font-bold" >Edit Your Profile</p>
        </div>
      </div>

      <AccountInfoProgressCard
        username={form.username}
        lastName={form.lastName}
        firstName={form.firstName}
      />

      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault} >
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

        {changesDetected && <PrimaryButton
          onClick={handleSaveChanges}
          isLoading={isLoading}
          type="button"
        >
          Save Changes
        </PrimaryButton>}
      </form>

      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(undefined)}
          isVisible={Boolean(error)}
        />
      )}

      {successMessage && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => setSuccessMessage(undefined)}
          isVisible={Boolean(successMessage)}
        />
      )}

    </PageView>
  )
}

type EditAccountInfoForm = {
  username: string,
  firstName?: string,
  lastName?: string
}