import { useAtomValue } from "jotai";
import { TeamFormation } from "../team/TeamFormation";
import TeamSubstituteCard from "./TeamSubstituteCard";
import { fantasyTeamAthletesAtom } from "../../state/myTeam.atoms";
import { useMyTeamScreenActions } from "./MyTeamActions";

interface ViewPitchContentProps {
}

/** Renders Team Pitch view */
export const MyTeamPitchView: React.FC<ViewPitchContentProps> = ({}) => {
  
  const {handlePlayerClick} = useMyTeamScreenActions();
  const players = useAtomValue(fantasyTeamAthletesAtom);

  return (
    <>
      <div>
        
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Team Formation
        </h2>

        <TeamFormation
          players={players.filter((player) => player.is_starting)}
          onPlayerClick={handlePlayerClick}
        />
      </div>

      {/* Super Substitute */}
      {players.some((player) => !player.is_starting) && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
            <span>Super Substitute</span>
            <span className="ml-2 text-orange-500 text-sm bg-orange-100 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
              Special
            </span>
          </h2>
          <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4 border-2 border-orange-200 dark:border-orange-800/30 max-w-md">
            {players
              .filter((player) => !player.is_starting)
              .map((player) => (
                <TeamSubstituteCard 
                  player={player}
                  handlePlayerClick={handlePlayerClick}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
};
