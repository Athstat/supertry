// import { Shield } from 'lucide-react'
import { twMerge } from 'tailwind-merge';
import { IFixture } from '../../types/games'
import { format } from 'date-fns';
import { useState } from 'react';
import DialogModal from '../shared/DialogModal';
import TeamLogo from '../team/TeamLogo';
import { useRouter } from '../../hooks/useRoter';
type Props = {
    fixture: IFixture,
    showCompetition?: boolean
}

export default function FixtureCard({ fixture, showCompetition }: Props) {


    const { team_score, kickoff_time, round, game_status, opposition_score } = fixture;

    const matchFinal = game_status === "completed" && team_score && opposition_score;

    const homeTeamWon = matchFinal ? team_score > opposition_score : false;
    const awayTeamWon = matchFinal ? team_score < opposition_score : false;

    const [showModal, setShowModal] = useState(false);
    const toogle = () => setShowModal(!showModal);


    return (
        <>

            <div
                onClick={toogle}
                className="p-4 flex flex-row text-white hover:bg-slate-50/50 gap-3 dark:hover:bg-dark-800 transition-colors"
            >

                <div className='flex-1 flex text-slate-700 dark:text-white flex-col items-end justify-center' >

                    <div className='flex flex-row gap-2 items-center w-full justify-start' >
                        <div className='flex flex-row gap-2 items-center w-full justify-start' >
                            <p className={twMerge(
                                'text-sm w-fit text-left',
                                awayTeamWon && ""
                            )} >{fixture.home_team}</p>
                        </div>

                        {fixture.team_score !== null && fixture.opposition_score !== null ? (
                            <div className={twMerge(
                                'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-sm',
                                homeTeamWon && "font-bold",
                            )}>
                                {fixture.team_score}
                            </div>
                        ) : null}

                    </div>
                </div>


                <div className='flex-1 text-slate-700 dark:text-slate-400 flex flex-col items-center text-center justify-center' >
                    {/* <p className='text-xs' >{fixture.venue}</p> */}
                    {showCompetition && <p className='text-xs' >{fixture.competition_name}{round && ", Round " + round}</p>}
                    {kickoff_time && <p className='text-xs' >{format(kickoff_time, "dd, MMM yyyy")}</p>}
                    {kickoff_time && <p className='text-sm font-semibold' >{format(kickoff_time, "h:mm a")}</p>}
                </div>


                <div className='flex-1 flex text-slate-700 dark:text-white flex-col items-end justify-center' >

                    <div className='flex flex-row gap-2 items-center w-full justify-start' >
                        {fixture.team_score !== null && fixture.opposition_score !== null ? (
                            <div className={twMerge(
                                'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-sm',
                                awayTeamWon && "font-bold",
                            )}>
                                {fixture.opposition_score}
                            </div>
                        ) : null}

                        <div className='flex flex-row gap-2 items-center w-full justify-end' >
                            <p className={twMerge(
                                'text-sm w-fit text-wrap text-right',
                                awayTeamWon && ""
                            )} >{fixture.away_team}</p>
                        </div>

                    </div>
                </div>



            </div>
            <FixtureCardModal
                fixture={fixture}
                showModal={showModal}
                onClose={toogle}
            />
        </>
    )
}

type ModalProps = {
    showModal: boolean,
    onClose: () => void,
    fixture: IFixture
}

function FixtureCardModal({ onClose, fixture, showModal }: ModalProps) {

    const title = `${fixture.home_team} vs ${fixture.away_team}`;
    const {push} = useRouter()

    const { team_score, kickoff_time, round, game_status, opposition_score } = fixture;

    const matchFinal = game_status === "completed" && team_score && opposition_score;

    const homeTeamWon = matchFinal ? team_score > opposition_score : false;
    const awayTeamWon = matchFinal ? team_score < opposition_score : false;

    const gameKickedOff = kickoff_time && (new Date(kickoff_time) < new Date());



    const goToFullMatchDetails = () => {
        push(`/fixtures/${fixture.game_id}`);
    }


    return (
        <DialogModal 
            onClose={onClose}
            open={showModal}
            title={title}
            className='text-black dark:text-white flex flex-col gap-3'
        >

            <div className='flex p-3 text-wrap text-center rounded-xl bg-slate-200 dark:bg-slate-700 flex-row items-center justify-center' >
                <p>{fixture.venue} 𐄁 {kickoff_time && format(kickoff_time, "dd MMMM yyyy")}</p>
            </div>

            <div className='flex flex-row items-center justify-center dark:text-white' >

                <div className='flex flex-1 flex-col items-center justify-center' >
                    <TeamLogo />
                    <p className='dark:text-white text-wrap text-center' >{fixture.home_team}</p>
                </div>

                <div className='flex flex-1 flex-row' >
                    { !gameKickedOff &&  <KickOffInformation fixture={fixture} />}
                    { gameKickedOff && <MatchResultsInformation fixture={fixture} />}
                </div>

                <div className='flex flex-1 flex-col items-center justify-center' >
                    <TeamLogo teamId={fixture.team_id} />
                    <p className='dark:text-white text-wrap text-center' >{fixture.away_team}</p>
                </div>
            </div>

            <div className='flex flex-row items-center justify-center p-3' >
                <button onClick={goToFullMatchDetails} className='underline text-blue-400 dark:text-blue-200 hover:text-blue-500' >View Full Match Details</button>
            </div>

        </DialogModal>
    )

}


function KickOffInformation({ fixture }: Props) {

    const { kickoff_time } = fixture;

    return (
            <div className='flex flex-1 text-nowrap flex-col dark:text-white text-center items-center justify-center' >
                {kickoff_time && <p className='font-medium' >{format(kickoff_time, "h:mm a")}</p>}
                {kickoff_time && <p className='dark:text-slate-300 text-slate-800' >{format(kickoff_time, "dd MMM yyyy")}</p>}
            </div>
    )
}

function MatchResultsInformation({ fixture }: Props) {

    const { kickoff_time, game_status } = fixture;


    return (
        <div className='flex  flex-1 w-full flex-col items-center justify-center' >
            
            <div>
                {game_status && <span className='text-sm text-slate-500 font-medium dark:text-slate-400' >{game_status  === "completed" && "Final"}</span>}    
            </div>
            
            <div className='flex flex-1 flex-row gap-2 items-center justify-center' >
                {/* Home Team Score */}
                <div className='dark:text-white flex-1 text-2xl font-medium flex items-center justify-center' >
                    <p>{fixture.team_score}</p>
                </div>

                <div className='flex flex-1 flex-col dark:text-white text-center items-center justify-center' >
                    <p>-</p>
                </div>

                {/* Away Team Score */}
                <div className='dark:text-white  text-wrap flex-1 text-2xl font-medium flex items-center justify-center' >
                    <p>{fixture.opposition_score}</p>
                </div>
            </div>

            <div>
                {kickoff_time && <span className='text-sm text-slate-500 dark:text-slate-400' >{format(kickoff_time, "h:mm a")}</span>}    
            </div>
        </div>
    )
}