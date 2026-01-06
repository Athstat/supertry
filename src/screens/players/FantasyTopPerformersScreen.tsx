import CircleButton from "../../components/ui/buttons/BackButton";
import PageView from "../PageView";
import { useNavigateBack } from "../../hooks/web/useNavigateBack";
import BottomSheetView from "../../components/ui/BottomSheetView";
import { useFantasySeasons } from "../../hooks/dashboard/useFantasySeasons";
import { useQueryState } from "../../hooks/useQueryState";
import { queryParamKeys } from "../../types/constants";
import { useFantasyPointsRankings } from "../../hooks/fantasy/useSportActionRanking";
import { ArrowLeft, ChevronDown, X } from "lucide-react";
import { FantasyPointsRankingTable, FantasyPointsRankingTableLoadingSkeleton } from "../../components/players/ranking/FantasyPointsRankingTable";
import SecondaryText from "../../components/shared/SecondaryText";
import { abbreviateSeasonName } from "../../components/players/compare/PlayerCompareSeasonPicker";
import { Activity, useState } from "react";
import RoundedCard from "../../components/shared/RoundedCard";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import { IProAthlete } from "../../types/athletes";
import PlayerProfileModal from "../../components/player/PlayerProfileModal";


/** Renders a screen that shows the fantasy top performers */
export default function FantasyTopPerformersScreen() {

  const { hardPop } = useNavigateBack();

  const { selectedSeason } = useFantasySeasons();
  const [roundNumber] = useQueryState<number>(queryParamKeys.ROUND_NUMBER_QUERY_KEY);

  const { rankings, isLoading } = useFantasyPointsRankings((selectedSeason?.id ?? ''), 100, {
    round_number: roundNumber
  });

  const [showRoundModal, setShowRoundModal] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();

  const toggleRoundModal = () => setShowRoundModal(prev => !prev);

  const handleBack = () => {
    hardPop('/dashboard');
  }

  const handlePlayerClick = (player: IProAthlete) => {
    setSelectedPlayer(player);
  }

  const handleClosePlayerModal = () => {
    setSelectedPlayer(undefined);
  }

  return (
    <PageView className="px-4 flex flex-col gap-4" >

      <div className="flex flex-row items-center gap-2 justify-between" >

        <div className="flex flex-row items-center gap-2" >
          <CircleButton onClick={handleBack}>
            <ArrowLeft />
          </CircleButton>
          <h1 className="font-semibold text-lg" >Back</h1>
        </div>

        <RoundedCard onClick={toggleRoundModal} className="p-2 px-4 cursor-pointer rounded-md text-sm flex flex-row items-center justify-between gap-2" >
          <p>{roundNumber ? `Week ${roundNumber}` : "Overall"}</p>
          <ChevronDown className="w-4 h-4" />
        </RoundedCard>

      </div>

      <RoundedCard className="p-4 dark:border-none">
        <h2 className="font-semibold text-lg" >{abbreviateSeasonName(selectedSeason?.name || "")} {roundNumber ? `Week ${roundNumber}` : "Overall"}</h2>
        <SecondaryText>Fantasy Top Performers</SecondaryText>
      </RoundedCard>

      {isLoading && <FantasyPointsRankingTableLoadingSkeleton />}

      {!isLoading && <FantasyPointsRankingTable
        players={rankings}
        onClick={handlePlayerClick}
      />}

      {selectedPlayer && <PlayerProfileModal
        player={selectedPlayer}
        onClose={handleClosePlayerModal}
        isOpen={Boolean(selectedPlayer)}
      />}

      <RoundSelectorSheet
        isOpen={showRoundModal}
        onClose={toggleRoundModal}
        currentRound={roundNumber || "overall"}
      />
    </PageView>
  )
}


type RoundSelectorSheetProps = {
  isOpen?: boolean,
  onClose?: () => void,
  currentRound?: string | number
}
/** Renders the bottom sheet view round selector */
function RoundSelectorSheet({ isOpen, onClose, currentRound }: RoundSelectorSheetProps) {

  const navigate = useNavigate();
  const { pastAndPresentRounds } = useFantasySeasons();

  const roundOptions = pastAndPresentRounds;

  const handleRoundClick = (round: number | string | undefined) => {
    if (round === "overall") {
      navigate("/players/fantasy-top-performers");
    } else {
      const queryParam = round ? `?${queryParamKeys.ROUND_NUMBER_QUERY_KEY}=${round}` : '';
      navigate(`/players/fantasy-top-performers${queryParam}`);
    }
    if (onClose) {
      onClose();
    }
  }

  return (

    <Activity mode={isOpen ? "visible" : "hidden"} >
      <BottomSheetView
        className="px-4 min-h-[500px] pb-8 p-4"
        hideHandle
      >
        <div className="flex flex-row items-center justify-between" >
          <p className="font-semibold " >Select Week {currentRound}</p>

          <div>
            <CircleButton onClick={onClose} >
              <X />
            </CircleButton>
          </div>
        </div>

        <div className="flex flex-col gap-2" >
          <RoundItem label="Overall" onClick={handleRoundClick} currentValue={currentRound} value={"overall"} />

          {roundOptions.map((s) => {
            return <RoundItem
              key={s.round_number}
              label={`Week ${s.round_number}`}
              value={s.round_number}
              currentValue={currentRound}
              onClick={handleRoundClick}
            />
          })}
        </div>

      </BottomSheetView>
    </Activity>
  )
}

type RoundItemProps = {
  label?: string,
  onClick?: (value?: string | number) => void,
  value?: string | number,
  currentValue?: string | number,
}

function RoundItem({ label, value, currentValue, onClick }: RoundItemProps) {

  const isCurrent = value?.toString() === currentValue?.toString();

  const handleOnClick = () => {
    if (onClick && value) {
      onClick(value);
    }
  }
  return (
    <RoundedCard onClick={handleOnClick} className={twMerge(
      "p-2 px-4 border-none bg-slate-200 cursor-pointer",
      isCurrent && "bg-blue-500 dark:bg-blue-500 text-white dark:text-white"
    )} >
      <p>{label}</p>
    </RoundedCard>
  )
}