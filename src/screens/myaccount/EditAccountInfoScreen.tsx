import { ArrowLeft } from "lucide-react";
import CircleButton from "../../components/ui/buttons/BackButton";
import PageView from "../../components/ui/containers/PageView";
import InputField from "../../components/ui/forms/InputField";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import AccountInfoProgressCard from "../../components/auth/user_profile/AccountInfoProgressCard";
import { Toast } from "../../components/ui/Toast";
import { useNavigate } from "react-router-dom";
import { useEditAccountInfo } from "../../hooks/auth/useEditAccountInfo";


/** Renders edit account info screen */
export default function EditAccountInfoScreen() {

  const navigate = useNavigate();
  
  const {
    handleSaveChanges, isLoading, error,
    form, setForm, userNameError, changesDetected,
    successMessage, setError, setSuccessMessage
  } = useEditAccountInfo();

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