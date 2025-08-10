export type CreatorType = 'all' | 'scrummy' | 'user';
export type AccessType = 'all' | 'public' | 'invite';
export type DateOrder = 'recent' | 'oldest';

interface LeagueFilterState {
  creator: CreatorType;
  access: AccessType;
  date: DateOrder;
}

interface LeagueFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  value: LeagueFilterState;
  onChange: (val: LeagueFilterState) => void;
}

export default function LeagueFilterPanel({ isOpen, onClose, value, onChange }: LeagueFilterPanelProps) {
  if (!isOpen) return null;

  const set = (patch: Partial<LeagueFilterState>) => onChange({ ...value, ...patch });

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl p-4 sm:p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Close</button>
        </div>

        <div className="space-y-6">
          <section>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Creator Type</h4>
            <div className="flex gap-2 flex-wrap">
              {([
                { key: 'all', label: 'All' },
                { key: 'scrummy', label: 'Scrummy' },
                { key: 'user', label: 'User' },
              ] as const).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => set({ creator: opt.key })}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    value.creator === opt.key
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Access Type</h4>
            <div className="flex gap-2 flex-wrap">
              {([
                { key: 'all', label: 'All' },
                { key: 'public', label: 'Public' },
                { key: 'invite', label: 'Invite Only' },
              ] as const).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => set({ access: opt.key })}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    value.access === opt.key
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</h4>
            <div className="flex gap-2 flex-wrap">
              {([
                { key: 'recent', label: 'Recent' },
                { key: 'oldest', label: 'Oldest' },
              ] as const).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => set({ date: opt.key })}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    value.date === opt.key
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          <div className="pt-2">
            <button onClick={onClose} className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg">Apply Filters</button>
          </div>
        </div>
      </div>
    </div>
  );
}
