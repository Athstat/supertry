
import { IRosterItem } from '../../../types/games';
import { useState } from 'react';

type PlayerMarqueeRowProps = {
  players: IRosterItem[];
  direction?: 'left' | 'right';
  speed?: number; // seconds for one loop
  box?: boolean;
  size?: number;
};

function PlayerAvatarBox({ imageUrl, onError, size, box }: { imageUrl: string; onError: () => void; size: number; box: boolean }) {
  return (
    <div
      className={`flex items-center justify-center ${box ? 'bg-white shadow rounded-lg border border-gray-200' : ''}`}
      style={{ width: size, height: size }}
    >
      <img
        src={imageUrl || ''}
        alt="player"
        className="rounded-full object-cover border-2 border-blue-500"
        style={{ width: size - 8, height: size - 8 }}
        draggable={false}
        onError={onError}
      />
    </div>
  );
}

export default function PlayerMarqueeRow({ players, direction = 'left', speed = 150, box = false, size = 96 }: PlayerMarqueeRowProps) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const visiblePlayers = players.filter(p => !failed[p.athlete.tracking_id]);
  const playerList = [...visiblePlayers, ...visiblePlayers];
  const gap = 24; // px
  const itemWidth = size;
  const totalItems = playerList.length;
  const rowWidth = totalItems * (itemWidth + gap);
  const animClass = direction === 'left' ? 'pmarquee-left' : 'pmarquee-right';
  return (
    <div className="overflow-hidden w-full relative" style={{ height: size }}>
      <div
        className={`flex flex-row ${animClass}`}
        style={{
          width: rowWidth,
          gap: `${gap}px`,
          position: 'absolute',
          left: 0,
          animationDuration: `${speed}s`,
          willChange: 'transform',
        }}
      >
        {playerList.map((p, idx) => (
          <PlayerAvatarBox
            key={p.athlete.tracking_id + '-' + idx}
            imageUrl={p.athlete.image_url || ''}
            onError={() => setFailed(f => ({ ...f, [p.athlete.tracking_id]: true }))}
            size={size}
            box={box}
          />
        ))}
      </div>
      <style>{`
        .pmarquee-left {
          animation: pmarquee-left linear infinite;
        }
        .pmarquee-right {
          animation: pmarquee-right linear infinite;
        }
        @keyframes pmarquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pmarquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
