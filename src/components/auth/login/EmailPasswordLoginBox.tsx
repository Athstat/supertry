import { useState } from 'react'
import InputField, { PasswordInputField } from '../../shared/InputField';
import { Info, Lock, Mail } from 'lucide-react';
import PrimaryButton from '../../shared/buttons/PrimaryButton';
import { authService } from '../../../services/authService';
import { ErrorMessage } from '../../ui/ErrorState';
import { useNavigate } from 'react-router-dom';
import WarningCard from '../../shared/WarningCard';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';

export default function EmailPasswordLoginBox() {

    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasPassword, setHasPassword] = useState<boolean>();
    const [message, setMessage] = useState<string>();
    const [needsPasswordReset, setNeedsPasswordReset] = useState<boolean>(false);

    const navigate = useNavigate();
    const {login} = useAuth();

    const checkPasswordStatus = async () => {

        if (email) {

            setIsLoading(true)
            setMessage(undefined)

            const { status, message } = await authService.getPasswordStatus(email);
            if (status) {
                setHasPassword(status.has_password);

                if (status.has_password === false) {
                    await authService.requestPasswordReset(email, true);
                    setNeedsPasswordReset(true);
                }

            } else {
                setMessage(message)
            }

            setIsLoading(false);
        }

    }

    const handleLogin = async () => {
        
        if (email && password) {
            
            setIsLoading(true)
            const { data: loginRes, message } = await login(email, password);

            if (loginRes) {
                navigate('/dashboard');
            } else {
                setMessage(message);
            }

            setIsLoading(false);

        } else {
            setMessage("Both email and password should be provided")
        }

    }

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
            }} className='flex flex-col gap-4' >

                <InputField
                    value={email}
                    onChange={setEmail}
                    placeholder='Email'
                    icon={<Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />}
                />

                {hasPassword && <PasswordInputField
                    value={password}
                    onChange={setPassword}
                    placeholder='Password'
                    // icon={<Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />}
                />}

                {!hasPassword && <PrimaryButton
                    disbabled={isLoading}
                    isLoading={isLoading}
                    onClick={checkPasswordStatus}
                    className='py-3'
                    type='button'
                >
                    Continue with Email
                </PrimaryButton>}

                {hasPassword && <PrimaryButton
                    disbabled={isLoading}
                    isLoading={isLoading}
                    onClick={handleLogin}
                    className='py-3'
                    type='submit'
                >
                    Sign In
                </PrimaryButton>}

                <ErrorMessage hideIfNoMessage message={message} />

                <AnimatePresence>
                    {needsPasswordReset && email && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <WarningCard className='py-2 gap-2'>
                                <div>
                                    <Info className='w-6 h-6' />
                                </div>

                                <p className='text-sm'>
                                    For security reasons, a password reset link has been sent to 
                                    your email, <strong> {email}</strong>. Please reset your password
                                    then login.
                                </p>
                            </WarningCard>
                        </motion.div>
                    )}
                </AnimatePresence>

            </form>
        </div>
    )
}
