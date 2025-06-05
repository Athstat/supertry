import { ReactNode } from "react"

type Props = {
    children?: ReactNode,
    leagueId: number
}

export default function LeagueDataProvider({children, leagueId} : Props) {

    
  
    return (
    <>
        {children}
    </>
  )
}
