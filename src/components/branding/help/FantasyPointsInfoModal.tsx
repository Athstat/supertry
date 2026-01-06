import DialogModal from "../../ui/modals/DialogModal";
import FantasyPointsBreakdown from "./FantasyPointsBreakdown";

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function FantasyPointsInfoModal({ isOpen, onClose }: Props) {
  return (
    <DialogModal
      open={isOpen}
      onClose={onClose}
      title="Fantasy Points Breakdown"
      hw="w-[95%] md:w-[85%] lg:w-[70%] lg:max-w-[65vh] lg:min-w-[65vh]"
      outerCon="no-scrollbar"
      className="w-full h-full mb-10"
    >
      <FantasyPointsBreakdown />
    </DialogModal>
  );
}
