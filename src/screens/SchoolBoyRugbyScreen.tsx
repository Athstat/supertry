import { useNavigate } from "react-router-dom";
import PageView from "./PageView";
import { MdSportsRugby } from "react-icons/md";
import { MessageCircle } from "lucide-react";

export default function SchoolBoyRugbyScreen() {

  const navigate = useNavigate();

  const handleViewChat = () => {
    navigate("/sbr/chat");
  }

  return (
    <PageView className="dark:text-white p-5" >

      <div className="flex flex-row items-center justify-between" >

        <div className="flex flex-row items-center gap-2" >
          <h1 className="text-2xl font-bold lg:text-3xl" >SBR</h1>
        </div>

        <button onClick={handleViewChat} className="h-fit w-fit flex flex-row items-center justify-end" >
          <MessageCircle 
            className="hover:text-primary-600 cursor-pointer" 
          />
        </button>

      </div>
    </PageView>
  )
}
