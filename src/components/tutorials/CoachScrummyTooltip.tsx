import { TooltipRenderProps } from 'react-joyride';
import { twMerge } from 'tailwind-merge';
import { CREATE_TEAM_TUTORIAL_SELECTORS } from '../../tutorials/createTeamTutorial';

export default function CoachScrummyTooltip({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  isLastStep,
}: TooltipRenderProps) {
  const blockNextTargets = [
    CREATE_TEAM_TUTORIAL_SELECTORS.slot1Empty,
    CREATE_TEAM_TUTORIAL_SELECTORS.playerPickerFirstRow,
    CREATE_TEAM_TUTORIAL_SELECTORS.slot1Player,
    CREATE_TEAM_TUTORIAL_SELECTORS.playerActionSwap,
    CREATE_TEAM_TUTORIAL_SELECTORS.playerActionCaptain,
    CREATE_TEAM_TUTORIAL_SELECTORS.slot2Empty,
  ];
  const isNextBlocked = blockNextTargets.includes(String(step.target));
  const nextLabel = isLastStep ? 'Done' : continuous ? 'Next' : 'Ok';

  return (
    <div
      {...tooltipProps}
      className={twMerge(
        'bg-white dark:bg-dark-850 text-slate-900 dark:text-slate-100',
        'rounded-xl shadow-lg p-4 w-[280px] max-w-[90vw]'
      )}
    >
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Coach Scrummy
      </div>
      <div className="mt-2 text-sm">{step.content}</div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          {...closeProps}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400"
        >
          Skip
        </button>

        <div className="flex items-center gap-2">
          {index > 0 && (
            <button
              {...backProps}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Back
            </button>
          )}
          {isNextBlocked ? (
            <button
              className={twMerge(
                'text-xs px-3 py-2 w-fit rounded-xl font-medium',
                'bg-blue-600 text-white border border-primary-500',
                'opacity-40 cursor-not-allowed'
              )}
              disabled
            >
              Tap highlighted
            </button>
          ) : (
            <button
              {...primaryProps}
              className={twMerge(
                'text-xs px-3 py-2 w-fit rounded-xl font-medium',
                'bg-blue-600 text-white border border-primary-500',
                'hover:bg-blue-700',
                primaryProps.disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {nextLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
