type Props = {
    homeVotes: number,
    awayVotes: number
}

export default function VotingProgressBar({ homeVotes, awayVotes }: Props) {
    const total = homeVotes + awayVotes;
    const homePerc = calculatePerc(homeVotes, total);
    const awayPerc = calculatePerc(awayVotes, total);

    const homeBoxes = createEmptyArray(homePerc, 0);
    const awayBoxes = createEmptyArray(awayPerc, 0);

    if (total === 0) return;

    return (
        <div className="w-full flex flex-col gap-2">
            <div className="flex flex-row rounded-xl overflow-hidden w-full">
                {homeBoxes.map((_, index) => (
                    <div key={index} className="w-[1%] relative h-5 dark:bg-slate-800 bg-slate-900" />
                ))}

                {awayBoxes.map((_, index) => (
                    <div key={index} className="w-[1%] relative h-5 bg-primary-700 " />
                ))}
            </div>

            <div className="w-full flex px-2 flex-row text-sm text-gray-600 dark:text-gray-300">
                <div className="flex-1 items-center justify-start">
                    <p>{homeVotes} Vote{homeVotes > 1 ? "s" : ""}</p>
                </div>

                <div className="flex-1 flex items-center justify-end">
                    <p>{awayVotes} Vote{awayVotes > 1 ? "s" : ""}</p>
                </div>
            </div>
        </div>
    )
}

function calculatePerc(val: number, total: number) {

    if (val === 0 || total === 0) return 0;
    return Math.floor((val / total) * 100);
}

function createEmptyArray<T>(size: number, initVal: T): T[] {
    const arr: T[] = [];

    for (let x = 0; x < size; x++) {
        arr.push(initVal);
    }

    return arr;
}