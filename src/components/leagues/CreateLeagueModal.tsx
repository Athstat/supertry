import { useState } from 'react';
import DialogModal from '../shared/DialogModal';
import InputField, { TextField } from '../shared/InputField';

interface CreateLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeagueCreated: (league: any) => void;
}

export default function CreateLeagueModal({ isOpen, onClose }: CreateLeagueModalProps) {
  
  const [form, setForm] = useState<CreateLeagueForm>({
    title: "",
    season_id: "",
    description: "",
    is_private: false
  });
  
  return (
    <DialogModal
      open={isOpen}
      onClose={onClose}
      title='Create Fantasy League'
    > 

      <form className='flex flex-col gap-4' >
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


      </form>

    </DialogModal>
  )
}


type CreateLeagueForm = {
  title: string,
  is_private: boolean,
  description?: string,
  season_id: string
}