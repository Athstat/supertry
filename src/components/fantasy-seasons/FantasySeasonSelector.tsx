import { twMerge } from "tailwind-merge";
import { useFantasyLeaguesScreen } from "../../hooks/fantasy/useFantasyLeaguesScreen"


export default function FantasySeasonSelector() {

    const { fantasySeasons, selectedSeason, setSelectedSeason, setSelectedFantasySeasonId } = useFantasyLeaguesScreen();



    return (
        <div>



            <div className="flex flex-row items-center no-scrollbar flex-nowrap overflow-x-auto text-nowrap gap-2" >

                <ListItem
                    isSelected={selectedSeason === undefined}
                    title={'Overview'}
                    onSelect={() => {
                        setSelectedFantasySeasonId('all')
                    }}
                    key={'all'}
                />

                {fantasySeasons.map((s) => {
                    return (
                        <ListItem
                            isSelected={s.id === selectedSeason?.id}
                            title={s.name}
                            onSelect={() => {
                                setSelectedSeason(s);
                            }}
                            key={s.id}
                        />
                    )
                })}
            </div>
        </div>
    )
}

type ItemProps = {
    isSelected?: boolean,
    title?: string,
    onSelect?: () => void;
}

function ListItem({ isSelected, title, onSelect }: ItemProps) {

    const getShortName = () => {
        if (title === 'Womens Rugby World Cup 2025') {
            return 'WWC 2025';
        }

        if (title === "United Rugby Championship 25/26") {
            return "URC 24/25";
        }

        return title;
    }

return (

        <div
            onClick={onSelect}
            className={twMerge(
                'font-semibold cursor-pointer border px-4 py-1.5 bg-slate-100 dark:bg-slate-800/40 rounded-2xl',
                isSelected && 'border-primary-400 bg-blue-500 dark:bg-blue-500 text-white',
                !isSelected && 'text-slate-700 dark:text-slate-400 border-slate-300 dark:border-gray-800'
            )}
        >
            <p className="text-sm" >{getShortName()}</p>
        </div>
    )
}