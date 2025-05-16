import { ArrowLeft } from 'lucide-react'
import PageView from '../../screens/PageView'
import SchoolBoyRugbyChat from './SchoolBoyRugbyChat'
import { useRouter } from '../../hooks/useRoter'

export default function SBRChatScreen() {

    const {back} = useRouter();

    return (
        <PageView className='py-1 flex flex-col gap-2 ' >

            <div onClick={back} className='flex cursor-pointer flex-row items-center gap-1 px-2' >
                <ArrowLeft className='w-4 h-4'  />
                <p>Go Back</p>
            </div>

            {/* <div className='flex flex-row items-center gap-2' >
                <MessageCircle />
                <h1 className='text-2xl font-bold' >SBR Chat</h1>
            </div> */}
            <SchoolBoyRugbyChat />
        </PageView>
    )
}
