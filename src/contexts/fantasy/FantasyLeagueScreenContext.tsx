import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react"
import { FantasyLeagueViewMode } from "../../types/fantasyLeague";

type FantasyLeagueScreenContextProps = {
  showEditBanner: boolean,
  showEditLogo: boolean,
  showEditInfo: boolean,
  setShowEditBanner: Dispatch<SetStateAction<boolean>>,
  setShowEditLogo: Dispatch<SetStateAction<boolean>>,
  setShowEditInfo: Dispatch<SetStateAction<boolean>>,
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
  const [showEditInfo, setShowEditInfo] = useState<boolean>(false);

  const [showEditBanner, setShowEditBanner] = useState<boolean>(false);
  const [showEditLogo, setShowEditLogo] = useState<boolean>(false);
  

  return (
    <FantasyLeagueScreenContext.Provider
      value={{
        showEditBanner, showEditLogo,
        setShowEditBanner, setShowEditLogo,
        viewMode, setViewMode, showEditInfo, setShowEditInfo
      }}
    >
      {children}
    </FantasyLeagueScreenContext.Provider>
  )
}
