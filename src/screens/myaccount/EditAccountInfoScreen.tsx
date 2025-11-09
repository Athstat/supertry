import { ArrowLeft } from "lucide-react";
import CircleButton from "../../components/shared/buttons/BackButton";
import PageView from "../PageView";


/** Renders edit account info screen */
export default function EditAccountInfoScreen() {
  return (
    <PageView className="px-6" >
      <div>
        <CircleButton>
          <ArrowLeft className="" />
        </CircleButton>
      </div>
      
    </PageView>
  )
}
