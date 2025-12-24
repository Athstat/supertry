import { Users } from 'lucide-react';

export default function SbrChatTab() {

    return (
        <div className='flex flex-col gap-4 '>

            <div  className='flex flex-row items-center gap-1 px-2' >
                <Users className=''  />
                <p className='text-lg font-bold' >Chat</p>
            </div>

            {/* <div className='flex flex-row items-center gap-2' >
                <MessageCircle />
                <h1 className='text-2xl font-bold' >SBR Chat</h1>
            </div> */}
        </div>
    )
}
