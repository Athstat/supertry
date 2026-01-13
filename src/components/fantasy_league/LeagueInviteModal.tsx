import { X, Share2, CopyIcon } from "lucide-react";
import CircleButton from "../ui/buttons/BackButton";
import BottomSheetView from "../ui/modals/BottomSheetView";
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups";
import { InfoCard } from "../ui/cards/StatCard";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import SecondaryText from "../ui/typography/SecondaryText";

import { useShareLeague } from "../../hooks/leagues/useShareLeague";
import { QRCodeCanvas } from 'qrcode.react';
import { useCanvas } from "../../hooks/web/useCanvas";
import { Toast } from "../ui/Toast";
import { useState } from "react";


type Props = {
  onClose?: () => void,
  league?: FantasyLeagueGroup,
  isOpen?: boolean
}

/** Renders an invite friends modal */
export default function LeagueInviteModal({ onClose, league, isOpen }: Props) {

  const [errorMessage, setErrorMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const { inviteLink } = useShareLeague(league);
  const { ref: qrRef, copyAsImage, clearMessages } = useCanvas(setErrorMessage, setSuccessMessage);

  

  if (!isOpen) {
    return null;
  }

  return (
    <BottomSheetView
      hideHandle
      className="min-h-[30vh] max-h-[90vh] p-4 dark:border-t dark:border-l dark:border-r border-slate-700 flex flex-col"
    >
      <div className="flex flex-row items-center gap-2 justify-between" >
        <p className="text-xl font-semibold" >Invite Friends</p>
        <CircleButton onClick={onClose} >
          <X />
        </CircleButton>
      </div>

      <section className="flex mt-6 border-b border-slate-200 dark:border-slate-600 pb-6 flex-col gap-4 items-center justify-center" >

        <SecondaryText className="max-w-[60%] text-center" >Copy this QR-code and share it with your friends to join the league</SecondaryText>

        <QRCodeCanvas
          ref={qrRef}
          value={inviteLink || ''}
          title={`You have been invited to join ${league?.title}`}
          level='L'
          bgColor="black"
          fgColor="white"
          className="rounded-xl"
          size={190}
        />

        <PrimaryButton onClick={copyAsImage} className="w-fit" >
          Copy QR-code
        </PrimaryButton>

      </section>


      <section className="flex flex-col gap-2 border-b border-slate-200 dark:border-slate-600 py-6">
        <SecondaryText className="text-lg" >Copy Join Code</SecondaryText>
        <div className="flex flex-row items-center gap-2" >
          <InfoCard
            value={league?.entry_code ?? '-'}
            className="w-[75%] p-2 px-4"
            valueClassName="text-lg"
          />

          <PrimaryButton className="flex-1" >
            <CopyIcon />
          </PrimaryButton>
        </div>
      </section>

      <section className="flex flex-col gap-3 p-6">
        <PrimaryButton className="flex-1 py-3 gap-3 flex flex-row items-center"  >
          <p>Share Join Link</p>
          <Share2 className="w-5 h-5" />
        </PrimaryButton>
      </section>

      <Toast
        isVisible={Boolean(successMessage)}
        message={successMessage || ''}
        onClose={clearMessages}
        type={'success'}
      />

      <Toast
        isVisible={Boolean(errorMessage)}
        message={errorMessage || ''}
        onClose={clearMessages}
        type={'error'}
      />

    </BottomSheetView>
  )
}
