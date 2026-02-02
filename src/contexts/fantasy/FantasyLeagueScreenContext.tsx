import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"
import { FantasyLeagueViewMode } from "../../types/fantasyLeague";

type FantasyLeagueScreenContextProps = {
  showEditBannerModal: boolean,
  showEditLogoModal: boolean,
  setShowEditBannerModal: Dispatch<SetStateAction<boolean>>,
  setShowEditLogoModal: Dispatch<SetStateAction<boolean>>,
  viewMode: FantasyLeagueViewMode,
  setViewMode: Dispatch<SetStateAction<FantasyLeagueViewMode>>
}

export const FantasyLeagueScreenContext = createContext<FantasyLeagueScreenContextProps | null>(null);

type Props = {
  children?: ReactNode
}

/** Context Provider that provides UI State for the fantasy league screen, not to be consfused
 * with the fantasy league data provider that just provides data to consumer children
 */
export default function FantasyLeagueScreenProvider({ children }: Props) {

  const [viewMode, setViewMode] = useState<FantasyLeagueViewMode>("standings");

  const [showEditBannerModal, setShowEditBannerModal] = useState<boolean>(false);
  const [showEditLogoModal, setShowEditLogoModal] = useState<boolean>(true);
  

  return (
    <FantasyLeagueScreenContext.Provider
      value={{
        showEditBannerModal, showEditLogoModal,
        setShowEditBannerModal, setShowEditLogoModal,
        viewMode, setViewMode
      }}
    >
      {children}
    </FantasyLeagueScreenContext.Provider>
  )
}
