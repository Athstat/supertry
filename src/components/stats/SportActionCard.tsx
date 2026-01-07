import { SportAction } from "../../types/sports_actions"

type Props = {
    sportAction: SportAction
}

/** Renders a sport action */
export default function SportActionCard({sportAction} : Props) {
  return (
    <div className="flex flex-row items-center justify-between" >
        <p>{sportAction.definition?.display_name}</p>
        <p>{sportAction.action_count}</p>
    </div>
  )
}
