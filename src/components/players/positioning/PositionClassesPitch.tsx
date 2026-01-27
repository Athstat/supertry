import { BicepsFlexed, TrendingUpDown, Shield, WandSparkles, FastForward } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PositionClass } from "../../../types/athletes";
import RoundedCard from "../../ui/cards/RoundedCard";
import TextHeading from "../../ui/typography/TextHeading";
import PositionCard from "./PositionCard";

export function PositionClassesPitch() {
  const navigate = useNavigate();

  const handlePositionCardClick = (positionClass: PositionClass) => {
    navigate(`/players/position-class/${positionClass}`);
  }

  return (
    <RoundedCard className='py-4 px-6 flex flex-col gap-4' >
      <div>
        <TextHeading className='font-bold' blue >By Position</TextHeading>
      </div>

      <div className='grid grid-cols-2 gap-4' >
        <PositionCard
          positionClass='front-row'
          title='Front Row'
          showViewMoreButton
          onClick={handlePositionCardClick}
          icon={<BicepsFlexed className='w-20 h-20 text-yellow-500' />}
        />

        <PositionCard
          positionClass='second-row'
          title='Second Row'
          showViewMoreButton
          onClick={handlePositionCardClick}
          icon={<TrendingUpDown className='w-20 h-20 text-yellow-500' />}
        />

        <PositionCard
          positionClass='back-row'
          title='Back Row'
          showViewMoreButton
          onClick={handlePositionCardClick}
          icon={<Shield className='w-20 h-20 text-red-500' />}
        />

        <PositionCard
          positionClass='half-back'
          title='Half Backs'
          showViewMoreButton
          onClick={handlePositionCardClick}
          icon={<WandSparkles className='w-20 h-20 text-green-500' />}
        />

        <PositionCard
          positionClass='back'
          title='Backs'
          showViewMoreButton
          onClick={handlePositionCardClick}
          icon={<FastForward className='w-20 h-20 text-blue-500' />}
        />
      </div>
    </RoundedCard>
  )
}