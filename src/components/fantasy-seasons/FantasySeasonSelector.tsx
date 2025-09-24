import { twMerge } from "tailwind-merge";
import { useFantasyLeaguesScreen } from "../../hooks/fantasy/useFantasyLeaguesScreen"


export default function FantasySeasonSelector() {

    const { fantasySeasons, selectedSeason, setSelectedSeason, setSelectedFantasySeasonId } = useFantasyLeaguesScreen();



    return (
        <div>



            <div className="flex flex-row items-center flex-nowrap overflow-x-auto text-nowrap" >

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
                'font-semibold cursor-pointer border-b pb-2',
                isSelected && 'border-primary-500  text-primary-500',
                !isSelected && 'text-slate-500 dark:text-slate-400 border-transparent border-b- border-gray-700'
            )}
        >
            <p className="text-sm px-2" >{getShortName()}</p>
        </div>
    )
}