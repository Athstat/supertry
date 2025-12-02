import { Users } from 'lucide-react'
import PageView from '../PageView'

export default function PlayersOverviewScreen() {
  return (
    <PageView className='px-6 flex flex-col gap-4' >
        <div>
            <div className='flex flex-row items-center gap-2' >
                <Users />
                <p className='text-lg font-bold' >Players</p>
            </div>
        </div>

        <div className='flex flex-row items-center gap-2 bg-red-500 w-full h-[40px] p-2' >
            <p>Search Bar</p>
        </div>
    </PageView>
  )
}
