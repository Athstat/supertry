import { Users } from 'lucide-react'
import PageView from '../../screens/PageView'
import SchoolBoyRugbyChat from './SchoolBoyRugbyChat'
import { useRouter } from '../../hooks/useRoter'

export default function SbrChatTab() {

    const {back} = useRouter();

    return (
        <PageView className='flex flex-col gap-4 ' >

            <div onClick={back} className='flex cursor-pointer flex-row items-center gap-1 px-2' >
                <Users className=''  />
                <p className='text-lg font-bold' >Chat</p>
            </div>

            {/* <div className='flex flex-row items-center gap-2' >
                <MessageCircle />
                <h1 className='text-2xl font-bold' >SBR Chat</h1>
            </div> */}
            <SchoolBoyRugbyChat />
        </PageView>
    )
}
