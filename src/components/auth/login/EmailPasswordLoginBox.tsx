import React, { useState } from 'react'
import InputField from '../../shared/InputField';
import { Lock, Mail } from 'lucide-react';
import PrimaryButton from '../../shared/buttons/PrimaryButton';
import { authService } from '../../../services/authService';
import { ErrorMessage, ErrorState } from '../../ui/ErrorState';
import { useAuth } from '../../../contexts/AuthContext';

export default function EmailPasswordLoginBox() {

    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasPassword, setHasPassword] = useState<boolean>();
    const [message, setMessage] = useState<string>();

    const {login} = useAuth();

    const checkPasswordStatus = async () => {

        if (email) {

            setIsLoading(true)
            setMessage(undefined)

            const { status, message } = await authService.getPasswordStatus(email);
            if (status) {
                setHasPassword(status.has_password);
                console.log(status.has_password);

            } else {
                setMessage(message)
            }

            setIsLoading(false);
        }

    }

    const handleLogin = async () => {
        if (email && password) {
            const {data: loginRes, message} = await authService.login(email, password);

            if (loginRes) {
                setMessage("Hello " + loginRes.user.first_name);
                return
            }

            setMessage(message);
            
        } else {
            setMessage("Both email and password should be provided")
        }
    }

    return (
        <div>
            <form onSubmit={(e) => {e.preventDefault}} className='flex flex-col gap-4' >

                <InputField
                    value={email}
                    onChange={setEmail}
                    placeholder='Email'
                    icon={<Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />}
                />

                {hasPassword && <InputField
                    value={password}
                    onChange={setPassword}
                    type='password'
                    placeholder='Password'
                    icon={<Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />}
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
            </form>
        </div>
    )
}
