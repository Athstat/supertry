import React, { useState } from 'react'
import InputField from '../../shared/InputField';
import { Mail } from 'lucide-react';
import PrimaryButton from '../../shared/buttons/PrimaryButton';

export default function EmailPasswordLoginBox() {

    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();

    return (
        <div>
            <form className='flex flex-col gap-4' >
                <p className='text-white' >{email}</p>
                <InputField
                    value={email}
                    onChange={setEmail}
                    placeholder='Email'
                    icon={<Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />}
                />

                <PrimaryButton className='py-3' >
                    Continue with Email
                </PrimaryButton>
            </form>
        </div>
    )
}
