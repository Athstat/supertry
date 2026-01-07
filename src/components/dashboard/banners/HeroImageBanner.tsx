import { useState } from "react";

type BannerProps = {
  link?: string,
  onClick?: () => void
}

export default function HeroImageBanner({ link = "/images/africa_banner.jpg", onClick }: BannerProps) {

  const [error, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  if (error) return;

  return (
    <div className="w-full overflow-clip bg-white dark:border-slate-800 rounded-xl relative">

      {isLoading && (
        <div className="w-full h-32 overflow-clip bg-slate-white dark:bg-slate-800/60 animate-pulse dark:border-slate-800 rounded-xl relative">
        </div>
      )}

      {!error && <img
        src={link}
        alt="Africa Cup Banner"
        className="w-full h-full object-center cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out"
        onAbort={() => setLoading(false)}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        loading={'lazy'}
        onClick={onClick}
      />}
      {/* <div className="absolute bottom-0 left-0 w-full bg-gradient-to-tpx-6 py-4 flex flex-col items-start">
        <h3
          className="text-white text-lg font-bold drop-shadow-xl mb-2"
          style={{
            textShadow:
              '0 4px 24px #000, 0 2px 8px #000, 0 1px 0 #000, 2px 2px 8px #000, -2px 2px 8px #000'
          }}
        >
        </h3>
      </div> */}
    </div>
  )
}