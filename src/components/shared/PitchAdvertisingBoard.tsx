// type Props = {
// };

import { ScrummyDarkModeLogoHorizontal } from "../branding/scrummy_logo_horizontal";
import BlueGradientCard from "./BlueGradientCard";

export default function PitchAdvertisingBoard() {
    return (
        <BlueGradientCard className="h-[50px] flex flex-row items-center justify-between rounded-none rounded-t-xl ml-[8%] mr-[8%] ">
            <div>
                <ScrummyDarkModeLogoHorizontal />
            </div>
            <div>
                <ScrummyDarkModeLogoHorizontal />
            </div>
        </BlueGradientCard>
    );
}
