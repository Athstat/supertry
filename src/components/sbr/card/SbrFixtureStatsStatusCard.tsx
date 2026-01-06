import useSWR from 'swr'
import { ISbrFixture } from '../../../types/sbr'
import WarningCard from '../../ui/cards/WarningCard'
import { Sparkles } from 'lucide-react'
import { sbrFixtureService } from '../../../services/sbr/sbrFixtureService'

type Props = {
    fixture: ISbrFixture
}

export default function SbrFixtureStatsStatusCard({fixture} : Props) {

    const key = `sbr-fixture-stats-status/${fixture.fixture_id}`
    const {data: status} = useSWR(key, () => sbrFixtureService.getFixtureStatsStatus(fixture.fixture_id));

    if (!status) return;

    const hasStats = status.has_boxscore || status.has_timeline;

    if (!hasStats) return;

    return (
        <div>
                <WarningCard className="flex flex-row items-center justify-center" >
                    <Sparkles className="w-4 h-4" />
                    <p className="text-xs" >Stats are available for this game</p>
                </WarningCard>
        </div>
    )
}
