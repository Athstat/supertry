
import TeamLogo from "../../team/TeamLogo";
import { IProTeam } from '../../../types/team';
import { IRosterItem } from '../../../types/games';
import PlayerMarqueeRow from './PlayerMarqueeRow';

type FaceoffSlideProps = {
  homeTeam?: IProTeam;
  awayTeam?: IProTeam;
  homePlayers: IRosterItem[];
  awayPlayers: IRosterItem[];
};

export default function FaceoffSlide({ homeTeam, awayTeam, homePlayers, awayPlayers }: FaceoffSlideProps) {
  // Marquee animation classes always run
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-row items-center justify-center gap-8 mb-8">
        <div className="flex flex-col items-center">
          <TeamLogo url={homeTeam?.image_url} />
          <span className="font-semibold mt-2">{homeTeam?.athstat_name}</span>
        </div>
        <span className="text-2xl font-bold">vs</span>
        <div className="flex flex-col items-center">
          <TeamLogo url={awayTeam?.image_url} />
          <span className="font-semibold mt-2">{awayTeam?.athstat_name}</span>
        </div>
      </div>
      {/* Animated player rows */}
      <div className="flex flex-col w-full max-w-2xl gap-2 items-center justify-center">
        <PlayerMarqueeRow players={homePlayers} direction="left" speed={80} box size={96} />
        <PlayerMarqueeRow players={awayPlayers} direction="right" speed={80} box size={96} />
      </div>
    </div>
  );
}
