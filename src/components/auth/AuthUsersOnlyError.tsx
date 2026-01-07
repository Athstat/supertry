import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../ui/buttons/PrimaryButton'
import SecondaryText from '../ui/typography/SecondaryText'

type Props = {
    message?: string
}

/** Renders a card that shows an message to the user that a feature 
 * is only accessible to registered auth users */
export default function AuthUsersOnlyError({message} : Props) {

    const navigate = useNavigate()

    const navigateToLogIn = () => {
        navigate("/signin")
    }

    return (
        <div className="flex flex-1 items-center justify-center p-4 flex-col gap-2" >
            <SecondaryText className="text-base" >{message ?? "This feature is only available for logged in users"}</SecondaryText>
            <PrimaryButton onClick={navigateToLogIn} className="w-1/2" >Login</PrimaryButton>
        </div>
    )
}
