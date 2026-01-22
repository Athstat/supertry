import { X, Share2, CopyIcon } from "lucide-react";
import CircleButton from "../ui/buttons/BackButton";
import BottomSheetView from "../ui/modals/BottomSheetView";
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups";
import { InfoCard } from "../ui/cards/StatCard";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import SecondaryText from "../ui/typography/SecondaryText";
import { Toast } from "../ui/Toast";
import { useState } from "react";
import { useShareLeagueLegacy } from "../../hooks/leagues/useShareLeague";


type Props = {
  onClose?: () => void,
  league?: FantasyLeagueGroup,
  isOpen?: boolean
}

/** Renders an invite friends modal */
export default function LeagueInviteModal({ onClose, league, isOpen }: Props) {

  const [errorMessage, setErrorMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const { handleShare: handleShareJoinLink } = useShareLeagueLegacy(league);
  // const { ref: qrRef, copyAsImage } = useCanvas(setErrorMessage, setSuccessMessage);

  const clearMessages = () => {
    setSuccessMessage(undefined);
    setErrorMessage(undefined);
  }

  const handleCopyJoinCode = async () => {
    if (league?.entry_code) {
      clearMessages();

      await navigator.clipboard.writeText(league.entry_code);
      setSuccessMessage('League join code coppied to your clipboard');
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <BottomSheetView
      hideHandle
      className="min-h-[30vh] max-h-[95vh] p-4 dark:border-t dark:border-l dark:border-r border-slate-700 flex flex-col"
      onClickOutside={onClose}
    >
      <div className="flex flex-row items-center gap-2 justify-between" >
        <p className="text-xl font-semibold" >Invite Friends</p>
        <CircleButton onClick={onClose} >
          <X />
        </CircleButton>
      </div>

      {/* <section className="flex mt-6 border-slate-200 dark:border-slate-600 pb-6 flex-col gap-4 items-center justify-center" >

        <div className="flex flex-row cursor-pointer hover:px-4 transition-all ease-in items-center gap-2 bg-blue-600 dark:bg-blue-600 text-white dark:text-white px-3 py-1 rounded-full" >
          <Trophy className="w-4 h-4" />
          <p className="font-semibold" >{league?.title}</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4" >
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
        </div>

      </section> */}


      <section className="flex flex-col gap-2 border-b border-slate-200 dark:border-slate-600 py-6">
        <SecondaryText className="text-lg" >Copy Join Code</SecondaryText>
        <div className="flex flex-row items-center gap-2" >
          <InfoCard
            value={league?.entry_code ?? '-'}
            className="w-[75%] p-2 px-4"
            valueClassName="text-lg"
          />

          <PrimaryButton onClick={handleCopyJoinCode} className="flex-1" >
            <CopyIcon />
          </PrimaryButton>
        </div>
      </section>

      <section className="flex flex-col gap-3 pt-6">
        <PrimaryButton onClick={handleShareJoinLink} className="flex-1 py-3 gap-3 flex flex-row items-center"  >
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
