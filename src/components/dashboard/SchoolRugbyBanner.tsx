import { useNavigate } from 'react-router-dom';

export default function SchoolRugbyBanner() {
    const navigate = useNavigate();

    return (
        <div className="relative w-full rounded-lg overflow-hidden shadow-md">
            {/* Gradient Background */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(47deg, #FFC603 34%, #1196F5 100%)',
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-3 py-6 px-8">
                {/* Title */}
                <h2
                    className="text-center font-bold text-base leading-6 text-[#011E5C]"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                    WHAT'S GOING ON IN SCHOOL RUGBY?
                </h2>

                {/* Button */}
                <button
                    onClick={() => navigate('/fixtures?sc=SBR')}
                    className="px-4 py-2 rounded-md bg-transparent font-semibold text-sm text-[#011E5C] uppercase shadow-md transition-colors hover:bg-white/10"
                >
                    View Fixtures
                </button>
            </div>

            {/* Rugby player images */}
            {/* Left player image */}
            <div className="absolute left-0 bottom-0 w-24 h-28 opacity-80 pointer-events-none">
                <img
                    src="/images/dashboard/rugby-player-left.png"
                    alt="Rugby player"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right player image */}
            <div className="absolute right-0 top-2 w-32 h-36 opacity-80 pointer-events-none">
                <img
                    src="/images/dashboard/rugby-player-right.png"
                    alt="Rugby player"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
