import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserCircle, X } from 'lucide-react';
import { authService } from '../services/authService';
import ScrummyLogo from '../components/branding/scrummy_logo';
import RoundedCard from '../components/shared/RoundedCard';
import { ClaimGuestAccountReq } from '../types/auth';
import InputField, { PasswordInputField } from '../components/shared/InputField';
import PrimaryButton from '../components/shared/buttons/PrimaryButton';
import { useEmailUniqueValidator } from '../hooks/useEmailUniqueValidator';
import { authUserAtom, isGuestUserAtom } from '../state/authUser.atoms';
import { ScopeProvider } from 'jotai-scope';
import AuthUserDataProvider from '../components/auth/AuthUserDataProvider';
import NoContentCard from '../components/shared/NoContentMessage';
import { useAuth } from '../contexts/AuthContext';
import { requestPushPermissionsAfterLogin } from '../utils/bridgeUtils';
import SecondaryText from '../components/shared/SecondaryText';
import { ErrorMessage } from '../components/ui/ErrorState';
import { emailValidator } from '../utils/stringUtils';
import { validatePassword } from '../utils/authUtils';
import ScrummyMatrixBackground from '../components/shared/ScrummyMatrixBackground';
import FormStepIndicator from '../components/shared/forms/FormStepIndicator';
import { KeyRound } from 'lucide-react';
import { BadgeCheck } from 'lucide-react';

export function CompleteProfileScreen() {
  const atoms = [authUserAtom, isGuestUserAtom];

  return (
    <ScopeProvider atoms={atoms}>
      <AuthUserDataProvider>
        <ScreenContent />
      </AuthUserDataProvider>
    </ScopeProvider>
  );
}

function ScreenContent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });


  const [step, setStep] = useState<number>(1);

  const handleCancel = () => {
    navigate('/profile');
  }

  const handleGoNextStep = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    }
  }

  const handleGoPreviousStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  }

  if (!isGuestUserAtom) {
    return <NoContentCard className="Account has already been claimed" />;
  }

  return (
    <ScrummyMatrixBackground>

      <div className="flex dark:text-white flex-col gap-2 items-center min-h-screen p-6 overflow-y-auto">
        {/* Header */}

        <div className='flex flex-row w-full items-center justify-between' >
          <div></div>
          <div>
            <button onClick={handleCancel} className='w-10 h-10 cursor-pointer hover:bg-slate-200 hover:dark:bg-slate-700/80 flex flex-col items-center justify-center rounded-xl' >
              <X className='text-black dark:text-white' />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full">
          <ScrummyLogo className="w-32 h-32 lg:w-48 lg:h-48" />
          <p className='dark:text-white font-medium text-xl' >Claim your SCRUMMY Profile</p>
        </div>


        <div className='flex  flex-row items-center justify-center gap-2' >
          <FormStepIndicator
            label='Profile'
            icon={<User />}
            isCurrent={step === 1}
            isCompleted={step > 1}
          />

          <FormStepIndicator
            label='Password'
            icon={<KeyRound />}
            isCurrent={step === 2}
            isCompleted={step > 2}
          />

          <FormStepIndicator
            label='Confirm'
            icon={<BadgeCheck />}
            isCurrent={step === 3}
            isCompleted={step > 3}
          />
        </div>


        {/* Content */}
        {step === 1 && (
          <EmailUsernameStep
            onNextStep={handleGoNextStep}
            onPreviousStep={handleGoPreviousStep}
            form={formData}
            setForm={setFormData}
          />
        )}

        {step === 2 && (
          <CreatePasswordStep
            onNextStep={handleGoNextStep}
            onPreviousStep={handleGoPreviousStep}
            form={formData}
            setForm={setFormData}
          />
        )}

        {step === 3 && (
          <ConfirmationStep
            onNextStep={handleGoNextStep}
            onPreviousStep={handleGoPreviousStep}
            form={formData}
            setForm={setFormData}
          />
        )}

        {step > 1 && (
          <button onClick={handleGoPreviousStep} >
            <SecondaryText>Go  Back</SecondaryText>
          </button>
        )}
        { }

      </div>

    </ScrummyMatrixBackground>
  );
}

type ClaimAccountForm = {
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
}

type StepProps = {
  onNextStep?: () => void,
  form: ClaimAccountForm,
  onPreviousStep?: () => void,
  setForm: (form: ClaimAccountForm) => void
}

function EmailUsernameStep({ onNextStep, form, setForm }: StepProps) {

  const [error, setError] = useState<string>();
  const { isLoading: loadingEmailCheck, emailTaken } = useEmailUniqueValidator(form.email);
  const isFormComplete = !loadingEmailCheck && !emailTaken && Boolean(form.email) && Boolean(form.username);

  const handleNextStep = () => {
    if (form.username && form.email && onNextStep) {

      if (!emailValidator(form.email)) {
        setError(`Please enter a valid email, '${form.email}' is not a valid email.`);
        return;
      }

      onNextStep();
    }
  }

  return (
    <form
      className='flex flex-col gap-4 w-full'
      onSubmit={(e) => {
        e.preventDefault(); handleNextStep();
      }}
    >

      <div className='w-full flex flex-col mt-4 items-center justify-center' >
        <SecondaryText>Create a username for your account</SecondaryText>
      </div>

      <InputField
        className='w-full'
        label='Username'
        placeholder='What should we call you?'
        onChange={(v) => setForm({ ...form, username: v ?? '' })}
        value={form.username}
      />

      <div className='flex flex-col' >

        <InputField
          className='w-full'
          label='Email'
          placeholder='Email'
          onChange={(v) => setForm({ ...form, email: v ?? '' })}
          value={form.email}
          type='email'
        />

        {emailTaken && <ErrorMessage message='Email is registered with another account' />}
      </div>

      <PrimaryButton
        disabled={!isFormComplete}
      >
        Continue
      </PrimaryButton>

      {error && (
        <ErrorMessage message={error} />
      )}
    </form>
  )
}


function CreatePasswordStep({ form, setForm, onNextStep }: StepProps) {

  const [error, setError] = useState<string>();
  const isFormComplete = Boolean(form.confirmPassword) && Boolean(form.password) && form.password === form.confirmPassword;

  const handleNextStep = () => {
    if (form.password && form.confirmPassword && onNextStep) {

      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const [isPasswordValid, reason] = validatePassword(form.password);

      if (!isPasswordValid) {
        setError(reason);
        return;
      }

      onNextStep();
    }
  }

  return (
    <form
      className='flex flex-col gap-4 w-full'
      onSubmit={(e) => {
        e.preventDefault(); handleNextStep();
      }}
    >

      <div className='w-full flex flex-col mt-4 items-center justify-center' >
        <SecondaryText>Create a Password for your account</SecondaryText>
      </div>

      <PasswordInputField
        className='w-full'
        label='Password'
        placeholder='Password'
        onChange={(v) => setForm({ ...form, password: v ?? '' })}
        value={form.password}

      />

      <PasswordInputField
        className='w-full'
        label='Confirm Password'
        placeholder='Confirm Password'
        onChange={(v) => setForm({ ...form, confirmPassword: v ?? '' })}
        value={form.confirmPassword}
      />

      <PrimaryButton
        disabled={!isFormComplete}
      >
        Continue
      </PrimaryButton>

      {error && (
        <ErrorMessage
          message={error}
        />
      )}
    </form>
  )
}

function ConfirmationStep({ form}: StepProps) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { refreshAuthUser } = useAuth();

  const [errors, setErrors] = useState<any>();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('Validation failed');
      return;
    } else {
      console.log('Passed Validation');
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const data: ClaimGuestAccountReq = {
        email: form.email,
        password: form.password,
        username: form.username,
      };

      const { data: res, error } = await authService.claimGuestAccount(data);

      if (res) {
        await refreshAuthUser();
        requestPushPermissionsAfterLogin();
        navigate('/dashboard');
        return;
      }

      setErrors(error?.message);
    } catch (error: any) {
      console.error('Error claiming account:', error);
      let errorMessage = error.message || 'Failed to complete profile. Please try again.';

      if (errorMessage.includes('string did not match')) {
        errorMessage =
          'Your username contains invalid characters. Use only letters, numbers, and underscores.';
      }

      setSubmitError(errorMessage);
      setIsSubmitting(false);
    }
  };


  return (
    <form
      className='flex flex-col gap-6 w-full'
      onSubmit={handleSubmit}
    >

      <div className='w-full flex flex-col items-center justify-center' >
        <SecondaryText>Confirm Your Details</SecondaryText>
      </div>

      <RoundedCard className='p-4' >
        <div className='flex flex-row items-center gap-2' >

          <div>
            <UserCircle className='w-10 h-10' />
          </div>

          <div>
            <h1 className='text-2xl font-semibold' >{form.username}</h1>
            <SecondaryText>{form.email}</SecondaryText>
          </div>
        </div>
      </RoundedCard>

      <PrimaryButton
        disabled={isSubmitting}
        isLoading={isSubmitting}
        className='animate-glow py-4'
      >
        Claim Account 🔥
      </PrimaryButton>

      {(submitError) && (
        <ErrorMessage message={(submitError)} />
      )}
    </form>
  )
}