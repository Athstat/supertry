import PageView from './PageView';
import { Calendar } from 'lucide-react';
import ToggleSwitch from '../components/shared/buttons/ToggleSwitch';
import { useQueryState } from '../hooks/useQueryState';
import ProMatchCenter from '../components/match_center/ProMatchCenter';
import SbrMatchCenter from '../components/match_center/SbrMatchCenter';

export default function FixturesScreen() {

  const [fixtureContext, setFixtureContext] = useQueryState('sc', { init: 'Pros' })

  return (
    <PageView className="dark:text-white lg:w-[60%] p-4 md:p-6 flex flex-col gap-4">

      <div className='flex flex-row justify-between' >
        <div className='flex flex-row items-center gap-2' >
          <Calendar />
          <p className='font-bold text-xl' >Match Center</p>
        </div>

        <div>
          <ToggleSwitch
            option1='Pros'
            option2='Sbr'
            value={fixtureContext}
            onChange={setFixtureContext}
          />
        </div>
      </div>

      <div className="w-full mx-auto">
        {fixtureContext === "Pros" && <ProMatchCenter />}
        {fixtureContext === "Sbr" && <SbrMatchCenter />}
      </div>

    </PageView>
  );
}