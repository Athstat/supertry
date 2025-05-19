import PageView from "./PageView";
import SBRFixtures from "../components/sbr/fixtures/SBRFixtures";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export default function SchoolBoyRugbyScreen() {

  const navigate = useNavigate();

  const handleViewChat = () => {
    navigate("/sbr/chat");
  }


  return (
    <PageView className="dark:text-white p-5 flex flex-col gap-3" >
      <div className="flex flex-row items-center justify-between" >

        <div className="flex flex-row items-center gap-2" >
          <h1 className="text-2xl font-bold lg:text-3xl" >School Boy Rugby</h1>
          {/* <SbrContextSwitcher /> */}
        </div>

        <button onClick={handleViewChat} className="h-fit hover:bg-slate-200 dark:hover:bg-slate-800/40 px-3 py-1 rounded-xl w-fit gap-1 flex flex-row items-center justify-end" >
          <MessageCircle
            className="hover:text-primary-600 w-5 h-5 cursor-pointer"
          />
          Chat
        </button>

      </div>

      <div>
        <SBRFixtures />
      </div>


    </PageView>
  )
}
