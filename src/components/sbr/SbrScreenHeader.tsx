import { Shield } from 'lucide-react';
import SbrFeatureGamesCard from './fixtures/SbrFeatureGamesCard';

export default function SbrScreenHeader() {

    return (
        <div className="flex flex-col gap-3" >

            <div className="flex flex-row items-center gap-2" >
                <Shield />
                {/* <Swords /> */}
                <h1 className="text-xl font-bold lg:text-2xl" >School Boy Rugby</h1>
            </div>


            <SbrFeatureGamesCard />

        </div>
    )
}
