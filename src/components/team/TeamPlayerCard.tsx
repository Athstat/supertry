import { Player } from "../../types/team";


type Props = {
    player: Player,
    onClick: () => void
}

export function TeamPlayerCard({player, onClick,}: Props) {
    return (
      <div
        onClick={onClick}
        className="group relative flex flex-col items-center transition-transform hover:scale-105 cursor-pointer"
      >
        <div className="w-16 h-16 rounded-full bg-white dark:bg-dark-800 flex items-center justify-center shadow-lg mb-1 overflow-hidden border-2 border-white/50">
          <img
            src={player.image}
            alt={player.name}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src =
                "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
            }}
          />
        </div>
        <span className="text-xs font-medium text-white group-hover:text-yellow-300 transition-colors">
          {player.name}
        </span>
        <span className="text-xs font-medium text-white group-hover:text-yellow-300 transition-colors">
          {player.position}
        </span>
        <span className="text-xs text-white/80 group-hover:text-yellow-300/80 transition-colors flex items-center">
          <svg
            className="w-3 h-3 mr-1 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.94 7.13a1 1 0 011.95-.26c.112.84.234 1.677.357 2.514.234-.705.469-1.412.704-2.119a1 1 0 011.857.737 1 1 0 01.027.063c.234.705.469 1.412.704 2.119.121-.84.242-1.678.351-2.516a1 1 0 011.954.262c-.16 1.192-.32 2.383-.48 3.575 0 .004-.003.005-.005.006l-.008.032-.006.025-.008.028-.008.03-.01.03a1 1 0 01-1.092.698.986.986 0 01-.599-.28l-.01-.008a.997.997 0 01-.29-.423c-.272-.818-.543-1.635-.815-2.453-.272.818-.544 1.635-.816 2.453a1 1 0 01-1.953-.331c-.156-1.167-.312-2.334-.468-3.502a1 1 0 01.744-1.114z" />
          </svg>
          {player.points}
        </span>
      </div>
    );
  }
  