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
                    className="text-center font-bold text-base leading-6 text-[#011E5C] w-[80%]"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                    WHAT'S GOING ON IN SCHOOL RUGBY?
                </h2>

                {/* Button */}
                <p
                    onClick={() => navigate('/fixtures?sc=SBR')}
                    className="font-semibold text-sm text-[#011E5C] underline mt-3"
                >
                    View Fixtures
                </p>
            </div>

            {/* Rugby player images */}
            {/* Left player image */}
            <div className="absolute -left-2 bottom-0 w-32 h-36 pointer-events-none">
                <img
                    src="/images/dashboard/school-rugby-player-left.jpg"
                    alt="Rugby players"
                    className="w-full h-full object-cover object-center"
                />
            </div>
            {/* Right player image */}
            <div className="absolute right-0 bottom-0 w-28 h-36 pointer-events-none">
                <img
                    src="/images/dashboard/school-rugby-player-right.jpg"
                    alt="Rugby player"
                    className="w-full h-full object-cover object-top"
                />
            </div>
        </div>
    );
}
