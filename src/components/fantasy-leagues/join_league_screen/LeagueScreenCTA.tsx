import PrimaryButton from '../../shared/buttons/PrimaryButton'
import { Plus } from 'lucide-react'

export default function FantasyLeagueScreenCTA() {
  return (
    <div className='flex flex-row items-center justify-center gap-2' >
        <PrimaryButton>
            <Plus/>
            Create
        </PrimaryButton>
    </div>
  )
}
