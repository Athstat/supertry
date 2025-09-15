import React from 'react';
import PrimaryButton from '../shared/buttons/PrimaryButton';

type Props = {
  visible: boolean;
  onEnable: () => void | Promise<void>;
  onNotNow: () => void;
};

export default function PushOptInModal({ visible, onEnable, onNotNow }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[80]">
      <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Your team is ready!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Turn on push notifications so you’ll be the first to know when match results are in and
            see how your team performed.
          </p>
          <div className="flex flex-col gap-2">
            <PrimaryButton className="w-full rounded-lg py-2" onClick={onEnable}>
              Enable
            </PrimaryButton>
            <PrimaryButton
              className="w-full rounded-lg py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              onClick={onNotNow}
            >
              Not Now
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
