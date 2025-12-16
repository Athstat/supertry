import { useNavigate } from 'react-router-dom';

export default function SchoolRugbyBanner() {
    const navigate = useNavigate();

    return (
        <div className="relative w-full overflow-hidden shadow-md">

            <div className="w-full h-fit pointer-events-none">
                <img
                    src="/images/dashboard/sbr_cta_bg_v4.png"
                    alt="Rugby players"
                    className="w-full h-full"
                />
            </div>

            {/* Content */}
            <div className="absolute z-10 w-full top-0 right-0 flex flex-col items-end justify-end p-6">
                {/* Title */}
                <h2
                    className="text-end font-bold text-md leading-6 text-[#011E5C] w-[80%]"
                    style={{ fontFamily: 'Race Sport, sans-serif' }}
                >
                    SCHOOL RUGBY '26
                </h2>
                <p className="text-end -mt-2 font-semibold text-sm text-gray-800">Games - Data - Players</p>

                {/* Button */}
                <p
                    onClick={() => navigate('/schools')}
                    className="font-semibold text-sm text-[#011E5C] underline mt-8 cursor-pointer"
                >
                    See What's Happening
                </p>
            </div>


        </div>
    );
}
