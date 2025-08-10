import { useState } from 'react';
import DialogModal from '../shared/DialogModal';
import InputField, { TextField } from '../shared/InputField';
import LeagueVisibilityInput from './ui/LeagueVisibilityInput';
import { useSupportedSeasons } from '../../hooks/useSupportedSeasons';
import SeasonInput from './ui/SeasonInput';

interface CreateLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeagueCreated: (league: any) => void;
}

export default function CreateLeagueModal({ isOpen, onClose }: CreateLeagueModalProps) {

  const { isLoading, seasons } = useSupportedSeasons({
    wantedSeasonsId: [
      '695fa717-1448-5080-8f6f-64345a714b10',
      'b5cae2ff-d123-5f12-a771-5faa6d40e967'
    ]
  });

  const [form, setForm] = useState<CreateLeagueForm>({
    title: "",
    season_id: "695fa717-1448-5080-8f6f-64345a714b10",
    description: "",
    is_private: false
  });

  return (
    <DialogModal
      open={isOpen}
      onClose={onClose}
      title='Create Fantasy League'
    >

      {isLoading && (
        <div className='flex flex-col gap-2' >
          <div className='w-full h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse' />
          <div className='w-full h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse' />
          <div className='w-full h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse' />
          <div className='w-full h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse' />
        </div>

      )}

      {!isLoading && <form className='flex flex-col gap-4' >
        <InputField
          label='Title'
          placeholder='Give your league a nice title!'
          value={form.title}
          onChange={(v) => setForm({
            ...form,
            title: v ?? ""
          })}
        />

        <TextField
          label='Description'
          placeholder='What is your league about?'
          value={form.description}
          onChange={(v) => setForm({
            ...form,
            description: v
          })}
        />


        <SeasonInput 
          value={seasons.find((s) => s.id === form.season_id)}
          onChange={(s) => setForm({
            ...form,
            season_id: s.id
          })}

          options={seasons}
        />

        <LeagueVisibilityInput
          value={form.is_private ? 'private' : 'public'}
          onChange={(v) => setForm({
            ...form,
            is_private: v === 'private' ? true : false
          })}
        />

      </form>}

    </DialogModal>
  )
}


type CreateLeagueForm = {
  title: string,
  is_private: boolean,
  description?: string,
  season_id: string
}