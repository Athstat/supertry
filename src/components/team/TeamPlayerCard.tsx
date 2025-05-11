import { twMerge } from "tailwind-merge";
import { Player } from "../../types/team";
import { useFetch } from "../../hooks/useAsync";
import { athleteService } from "../../services/athleteService";
import { useState } from "react";


type Props = {
  player: Player,
  onClick: () => void,
  className?: string
}

export function TeamPlayerCard({ player, onClick, className }: Props) {

  const [imageError, setIamgeError] = useState<string>();
  const { data: playerInfo, isLoading, error } = useFetch("athletes", player.id, athleteService.getRugbyAthleteById);

  if (isLoading) return (
    <div
      className={twMerge(
        "group relative  bg-slate-800 animate-pulse rounded-lg flex flex-col transition-transform hover:scale-105 overflow-clip cursor-pointer",
        className
      )}
    >

    </div>
  )

  console.log(error);

  if (!playerInfo) return <></>

  return (
    <div
      onClick={onClick}
      className={twMerge(
        "group relative  bg-red-300 rounded-lg flex flex-col transition-transform hover:scale-105 overflow-clip cursor-pointer",
        className
      )}
    >

      {/* Header */}
      <div className="flex flex-[3] overflow-hidden p-3" >
        <div >
          {player.image && !imageError && <img
            src={player.image}
            onError={() => setIamgeError("Image failed to load")}
          />}
        </div>
      </div>

      {/* Player details */}
      <div className="flex flex-[2] bg-blue-500" >

      </div>

    </div>
  );
}
