import { format } from 'date-fns';
import { IFixture } from '../../types/games';
import SecondaryText from '../ui/typography/SecondaryText';
import TeamLogo from '../team/TeamLogo';
import { fixtureSummary, isGameLive, formatGameStatus } from '../../utils/fixtureUtils';
import { Fragment, useState } from 'react';
import { analytics } from '../../services/analytics/anayticsService';
import { FixtureCardModal } from './card/FixtureCard';
import { twMerge } from 'tailwind-merge';
import ProFixtureVotingBox from '../pickem/voting/ProFixtureVotingBox';

type Props = {
  fixture: IFixture;
  className?: string;
  hideVotingBox?: boolean;
};

export default function SmallFixtureCard({ fixture, className, hideVotingBox }: Props) {
  const { matchFinal, gameKickedOff } = fixtureSummary(fixture);
  const [showModal, setShowModal] = useState(false);

  const toggle = () => setShowModal(prev => !prev);

  const handleClick = () => {
    analytics.trackFixtureCardClicked(fixture);
    toggle();
  };

  return (
    <Fragment>
      <div
        onClick={handleClick}
        className={twMerge(
          'border dark:border-slate-700 cursor-pointer dark:bg-slate-800/20  rounded-xl p-6 flex flex-col gap-4',
          'hover:bg-white dark:hover:bg-slate-800/40',
          className
        )}
      >
        <div>
          <SecondaryText className="text-xs lg:text-sm">
            {fixture.competition_name} - Week #{fixture.round}
          </SecondaryText>
        </div>

        <div className="flex flex-row items-center gap-2 divide-x dark:divide-slate-700">
          <div className="flex flex-col gap-2 w-2/3">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-2">
                <TeamLogo
                  url={fixture.team?.image_url}
                  teamName={fixture.team?.athstat_name}
                  className="w-5 h-5"
                />
                <p className="text-xs lg:text-sm">{fixture.team?.athstat_name}</p>
              </div>

              <div>{gameKickedOff ? <p className="text-sm">{fixture.team_score}</p> : ''}</div>
            </div>

            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-2">
                <TeamLogo
                  url={fixture.opposition_team?.image_url}
                  teamName={fixture?.opposition_team?.athstat_name}
                  className="w-5 h-5"
                />
                <p className="text-xs lg:text-sm">{fixture?.opposition_team?.athstat_name}</p>
              </div>

              <div>
                {gameKickedOff ? <p className="text-sm">{fixture.opposition_score}</p> : ''}
              </div>
            </div>
          </div>

          <div className="flex text-[10px] lg:text-xs text-center flex-col w-1/3 p-2 items-center justify-center gap-1">
            {!matchFinal && fixture.kickoff_time && (
              <SecondaryText className="text-[10px] lg:text-xs">
                {format(fixture.kickoff_time, 'HH:mm')}
              </SecondaryText>
            )}
            {matchFinal && <SecondaryText className="text-[10px] lg:text-xs">Final</SecondaryText>}

            {isGameLive(fixture.game_status) && (
              <div className="flex flex-row items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 animate-pulse dark:bg-green-400 rounded-full" />
                <span className="text-[9px] lg:text-[10px] text-green-600 dark:text-green-400 font-bold">
                  {formatGameStatus(fixture.game_status)}
                </span>
              </div>
            )}

            {fixture.kickoff_time && (
              <SecondaryText className="text-[10px] lg:text-xs">
                {format(fixture.kickoff_time, 'EEE, dd MMM yyyy')}
              </SecondaryText>
            )}
          </div>
        </div>

        {!hideVotingBox && <ProFixtureVotingBox className="mt-0" fixture={fixture} />}
      </div>

      <FixtureCardModal fixture={fixture} onClose={toggle} showModal={showModal} />
    </Fragment>
  );
}
