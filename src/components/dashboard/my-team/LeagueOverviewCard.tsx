import useSWR from 'swr'
import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups'
import { swrFetchKeys } from '../../../utils/swrKeys'
import FantasyLeagueGroupDataProvider from '../../fantasy-league/providers/FantasyLeagueGroupDataProvider'
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup'
import { useAuth } from '../../../contexts/AuthContext'
import { fantasyLeagueGroupsService } from '../../../services/fantasy/fantasyLeagueGroupsService'
import { leagueService } from '../../../services/leagueService'
import { LoadingState } from '../../ui/LoadingState'
import BlueGradientCard from '../../shared/BlueGradientCard'
import { ArrowRight, Lock, Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { isLeagueRoundLocked } from '../../../utils/leaguesUtils'
import RoundedCard from '../../shared/RoundedCard'
import { FantasyLeagueTeamWithAthletes } from '../../../types/fantasyLeague'
import SecondaryText from '../../shared/SecondaryText'
import PrimaryButton from '../../shared/buttons/PrimaryButton'
import { useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import PlayerMugshot from '../../shared/PlayerMugshot'
import { IProAthlete } from '../../../types/athletes'
import { twMerge } from 'tailwind-merge'
import PointsBreakdownModal from '../../fantasy-league/team-modal/points_breakdown/PointsBreakdownModal'
import JoinLeagueDeadlineCountdown from '../../fantasy-leagues/JoinLeagueDeadlineContdown'
import { useCountdown } from '../../../hooks/useCountdown'
import { epochDiff } from '../../../utils/dateUtils'

type Props = {
    league: FantasyLeagueGroup
}

/** Renders a league overview card */
export default function LeagueOverviewCard({ league }: Props) {

    return (
        <FantasyLeagueGroupDataProvider leagueId={league.id} >
            <Content league={league} />
        </FantasyLeagueGroupDataProvider>
    )

}

function Content({ league }: Props) {

    const { authUser } = useAuth();
    const { currentRound } = useFantasyLeagueGroup();

    const diff = epochDiff(currentRound?.join_deadline ?? new Date());

    const { days, hours, seconds, minutes } = useCountdown(diff);

    const key = swrFetchKeys.getUserFantasyLeagueRoundTeam(
        league.id,
        currentRound?.id ?? 0,
        authUser?.kc_id ?? 'fallback'
    )
    const { data: userTeam, isLoading: loadingUserTeam } = useSWR(key, () => leagueService.getUserRoundTeam(
        currentRound?.id ?? 0,
        authUser?.kc_id ?? ''
    ));

    const standingsKey = swrFetchKeys.getFantasyLeagueGroupStandings(league.id);
    const { data: standings, isLoading: loadingStandings } = useSWR(standingsKey, () => fantasyLeagueGroupsService.getGroupStandings(league.id));

    const navigate = useNavigate();

    const isLoading = loadingStandings || loadingUserTeam;

    if (isLoading) {
        <LoadingState />
    }

    const userStanding = useMemo(() => {
        if (standings) {
            return standings.find((s) => {
                return s.user_id === authUser?.kc_id;
            })
        }

        return undefined;
    }, [standings]);

    const locked = currentRound && isLeagueRoundLocked(currentRound);

    const goToLeague = () => {
        navigate(`/league/${league.id}`);
    }

    const timeBlocks = [
        { value: days, label: 'Days' },
        { value: hours, label: 'Hours' },
        { value: minutes, label: 'Minutes' },
        { value: seconds, label: 'Seconds' },
    ];

    const showCountDown = !(days === 0 && hours === 0 && minutes === 0 && seconds === 0);

    return (
        <div className='flex  flex-col gap-4' >

            <BlueGradientCard
                className='flex cursor-pointer flex-col p-6 gap-4 hover:from-blue-700 hover:dark:from-blue-700'
                onClick={goToLeague}
            >
                <div className='flex flex-row items-center justify-between' >
                    <div className='flex flex-row items-center gap-2' >
                        <Trophy className='w-6 h-6' />
                        <p className='font-bold text-lg' >{league.title}</p>
                    </div>
                </div>

                <div className='flex font-semibold flex-row items-center gap-2' >
                    {currentRound && <p className='bg-primary-50 px-2 py-0.5 rounded-xl text-blue-500' >
                        <p className='' >{currentRound.title}</p>
                    </p>}

                    <div className='bg-primary-50 px-2 py-0.5 rounded-xl text-blue-500' >
                        <p>Overall Rank #{userStanding?.rank}</p>
                    </div>

                    {locked && <div className='bg-primary-50 px-2 py-0.5 rounded-xl text-blue-500' >
                        <p>Points - {userTeam?.overall_score ?? 0}</p>
                    </div>}
                </div>

                <div>

                    { showCountDown && <div className='flex flex-col gap-2' >

                        <p className='font-medium text-lg' >{currentRound?.title } Deadline</p>
                        <div className="grid grid-cols-4 sm:flex sm:flex-row gap-2 sm:gap-4 items-center justify-start">
                            {timeBlocks.map(block => (
                                <div
                                    key={block.label}
                                    className="p-2 sm:p-3 md:min-w-[80px] items-center justify-center flex flex-col rounded-xl bg-slate-50/50 dark:bg-white/10 border border-slate-200 dark:border-white/10"
                                >
                                    <p className="font-bold text-lg sm:text-xl md:text-2xl">
                                        {block.value.toString().padStart(2, '0')}
                                    </p>
                                    <p className="text-[10px] sm:text-xs dark:text-primary-100">{block.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>}

                </div>
            </BlueGradientCard>

            {!locked && !userTeam && (
                <NotTeamCreated />
            )}

            {locked && !userTeam && (
                <NotTeamCreatedLeagueLocked />
            )}


            {userTeam && (
                <TeamOverview team={userTeam} />
            )}

        </div>
    )
}


function NotTeamCreated() {

    const navigate = useNavigate();
    const { currentRound } = useFantasyLeagueGroup();

    if (!currentRound) return;

    const goToCreateTeam = () => {
        navigate(`/league/${currentRound.fantasy_league_group_id}?journey=team-creation`)
    }

    return (
        <RoundedCard className='p-6 text-center h-[200px] gap-4 border-dotted border-4 flex flex-col items-center justify-center' >
            <SecondaryText className='text-base' >You haven't picked a team for {currentRound.title} yet. Don't miss out on the action</SecondaryText>

            <PrimaryButton onClick={goToCreateTeam} className='w-fit px-6 py-2' >
                Pick Team
            </PrimaryButton>

        </RoundedCard>
    )
}

function NotTeamCreatedLeagueLocked() {

    const navigate = useNavigate();
    const { currentRound } = useFantasyLeagueGroup();

    if (!currentRound) return;

    const goToCreateTeam = () => {
        navigate(`/league/${currentRound.fantasy_league_group_id}?journey=team-creation`)
    }

    return (
        <RoundedCard className='p-6 text-center h-[200px] gap-4 border-dotted border-4 flex flex-col items-center justify-center' >
            <SecondaryText className='text-base' >You can't pick a team because, round '{currentRound.title}', has been locked </SecondaryText>

            <PrimaryButton disabled={true} onClick={goToCreateTeam} className='w-fit px-6 py-2' >
                <p>Pick Team</p>
                <Lock className='w-4 h-4' />
            </PrimaryButton>

        </RoundedCard>
    )
}

type OverviewProps = {
    team: FantasyLeagueTeamWithAthletes
}

function TeamOverview({ team }: OverviewProps) {

    console.log('Where is this team from ', team);
    const { currentRound } = useFantasyLeagueGroup();
    const isLocked = currentRound && isLeagueRoundLocked(currentRound);

    const [showPointsModal, setShowPointsModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();

    const navigate = useNavigate();
    const goToMyTeam = () => {
        navigate(`/league/${currentRound?.fantasy_league_group_id}?journey=my-team`);
    }

    const handleClickPlayer = (a: IProAthlete) => {
        setSelectedPlayer(a);
        setShowPointsModal(true);
    }

    const handleClosePointsModal = () => {
        setShowPointsModal(false);
        setSelectedPlayer(undefined);
    }

    return (
        <RoundedCard className='p-4 flex flex-col' >
            <div className='flex  flex-row items-center justify-between' >

                <div className='flex flex-row items-center gap-2' >
                    <Shield className='w-4 h-4' />
                    <p className='font-bold' >My Team</p>
                </div>

                <div className='flex flex-row items-center gap-1 cursor-pointer text-blue-500 hover:text-blue-600 dark:hover:text-blue-400' onClick={goToMyTeam}>
                    View <ArrowRight className='w-4 h-4' />
                </div>
            </div>


            <div className='flex flex-row items-center overflow-x-auto no-scrollbar gap-4' >
                {team.athletes?.map((a) => {

                    const onClick = () => {
                        handleClickPlayer(a.athlete);
                    }

                    return (
                        <div
                            className={twMerge(
                                'flex flex-col px-4 w-[150px] h-[150px] rounded-xl',
                                'p-2 gap-2 items-center justify-center'
                            )}

                            onClick={onClick}
                        >
                            <PlayerMugshot
                                url={a.athlete.image_url}
                                className='w-20 h-20'
                                showPrBackground
                                playerPr={95}
                            />
                            <p className='text-xs' >{a.athlete.player_name}</p>
                            {isLocked && <p className='rounded-xl text-xs flex flex-row items-center justify-center w-[60px]text-white' >{a.score ?? '0'}</p>}
                        </div>
                    )
                })}
            </div>

            {showPointsModal && selectedPlayer && currentRound && (
                <PointsBreakdownModal
                    onClose={handleClosePointsModal}
                    isOpen={showPointsModal}
                    athlete={selectedPlayer}
                    team={team}
                    round={currentRound}
                />
            )}

        </RoundedCard>
    )
}