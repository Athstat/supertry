import { useNavigate } from 'react-router-dom';

export default function SchoolRugbyBanner() {
    const navigate = useNavigate();

    return (
        <div className="relative w-full overflow-hidden shadow-md">
            {/* Gradient Background */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(47deg, #FFC603 34%, #1196F5 100%)',
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center py-8 px-8">
                {/* Title */}
                <h2
                    className="text-center font-bold text-md leading-6 text-[#011E5C] w-[80%]"
                    style={{ fontFamily: 'Race Sport, sans-serif' }}
                >
                    SCHOOL RUGBY '26
                </h2>
                <p className="text-center -mt-2 text-sm text-gray-600 dark:text-gray-300">Games - Data - Players</p>

                {/* Button */}
                <p
                    onClick={() => navigate('/schools')}
                    className="font-semibold text-sm text-[#011E5C] underline mt-3 cursor-pointer"
                >
                    See What's Happening
                </p>
            </div>

            {/* Rugby player images */}
            {/* Left player image - Two players */}
            <div className="absolute left-0 bottom-0 w-40 h-44 pointer-events-none">
                <img
                    src="/images/dashboard/school-rugby-player-left.png"
                    alt="Rugby players"
                    className="w-full h-full object-contain translate-y-[75px]"
                />
            </div>
            {/* Right player image - Single player in purple/white */}
            <div className="absolute right-0 bottom-0 w-28 h-40 pointer-events-none">
                <img
                    src="/images/dashboard/school-rugby-player-right.png"
                    alt="Rugby player"
                    className="w-full h-full object-contain object-bottom scale-[70%] translate-y-[40px]"
                />
            </div>
        </div>
    );
}
