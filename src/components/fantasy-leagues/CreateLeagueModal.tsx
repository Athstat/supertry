import { useState } from 'react';
import DialogModal from '../shared/DialogModal';
import InputField, { TextField } from '../shared/InputField';
import LeagueVisibilityInput from './ui/LeagueVisibilityInput';
import { useSupportedSeasons } from '../../hooks/useSupportedSeasons';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import { fantasyLeagueGroupsService } from '../../services/fantasy/fantasyLeagueGroupsService';
import { useNavigate } from 'react-router-dom';
import { ErrorState } from '../ui/ErrorState';
import TabView, { TabViewHeaderItem, TabViewPage } from '../shared/tabs/TabView';
import JoinLeagueByCode from './JoinLeagueByCode';
import SecondaryText from '../shared/SecondaryText';
import { useFantasyLeaguesScreen } from '../../hooks/fantasy/useFantasyLeaguesScreen';
import SeasonInput from './ui/SeasonInput';
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';

interface CreateLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeagueCreated: (league: FantasyLeagueGroup) => void;
}

export default function CreateLeagueModal({ isOpen, onClose }: CreateLeagueModalProps) {

  const tabs: TabViewHeaderItem[] = [
    {
      label: 'Create League',
      tabKey: 'create',
      className: 'flex-1'
    },

    {
      label: 'Join By Code',
      tabKey: 'join',
      className: 'flex-1'
    }
  ]

  return (
    <DialogModal
      title="Create/Join Fantasy League"
      className='min-h-[90vh]'
      hw='lg:max-w-[65vh]'
      onClose={onClose}
      open={isOpen}
    >
      <TabView tabHeaderItems={tabs} >
        <TabViewPage tabKey='create' >
          <CreateLeagueForm />
        </TabViewPage>

        <TabViewPage tabKey='join' className='flex dark:text-white flex-col gap-4' >
          <div className='flex flex-col' >
            <p className='font-bold text-xl' >Join League</p>
            <SecondaryText>
              Got a code from your crew? Pop it in here to get started.
            </SecondaryText>
          </div>
          <JoinLeagueByCode />
        </TabViewPage>
      </TabView>
    </DialogModal>
  );
}

function CreateLeagueForm() {
  const { isLoading, fantasySupportedSeasons: seasons } = useSupportedSeasons();

  const navigate = useNavigate();
  const [isSubmiting, setSubmiting] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const {selectedSeason} = useFantasyLeaguesScreen();

  const [form, setForm] = useState<CreateLeagueForm>({
    title: '',
    season_id: (selectedSeason ? selectedSeason?.id : undefined) ?? seasons.length > 0 ? seasons[0]?.id : 'c4c29ce1-8669-5f51-addc-cbed01ce9bd0',
    is_private: false,
    description: ''
  });

  const handleSubmitForm = async () => {
    setSubmiting(true);

    try {
      const res = await fantasyLeagueGroupsService.createGroup({
        ...form,
        season_id: selectedSeason?.id ?? form.season_id
      });
      if (res.data) {
        navigate(`/league/${res.data.id}`, {
          state: {
            is_new: true,
          },
        });
      } else {
        setError(res.error?.message);
      }
    } catch (err) {
      console.log('Error creating league ', err);
      setError("Something wen't wrong creating your league, please try again");
    }

    setSubmiting(false);
  };

  return (
    <div>
      {isLoading && (
        <div className="flex flex-col gap-2">
          <div className="w-full h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="w-full h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="w-full h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="w-full h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        </div>
      )}

      {!isLoading && (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmitForm();
          }}
          className="flex flex-col gap-4"
        >
          <InputField
            label="Title"
            placeholder="Give your league a nice title!"
            value={form.title}
            onChange={v =>
              setForm({
                ...form,
                title: v ?? '',
              })
            }
            required
          />

          <TextField
            label="Description"
            placeholder="What is your league about?"
            value={form.description}
            onChange={v =>
              setForm({
                ...form,
                description: v,
              })
            }
          />

          <SeasonInput
            value={selectedSeason}
            onChange={s =>
              setForm({
                ...form,
                season_id: s.id,
              })
            }
            options={selectedSeason ? [selectedSeason] : []}
          />

          <LeagueVisibilityInput
            value={form.is_private ? 'private' : 'public'}
            onChange={v =>
              setForm({
                ...form,
                is_private: v === 'private' ? true : false,
              })
            }
          />

          <PrimaryButton type={'submit'} isLoading={isSubmiting} disabled={isSubmiting}>
            Create
          </PrimaryButton>

          {error && <ErrorState error="Whoops" message={error} />}
        </form>
      )}
    </div>
  );
}

type CreateLeagueForm = {
  title: string;
  is_private: boolean;
  description?: string;
  season_id: string;
};
