import PageView from "./PageView";
import SBRFixtures from "../components/sbr/SBRFixtures";

export default function SchoolBoyRugbyScreen() {

  // const navigate = useNavigate();

  // const handleViewChat = () => {
  //   navigate("/sbr/chat"); 
  // }

  return (
    <PageView className="dark:text-white p-5 flex flex-col gap-3" >

      <div className="flex flex-row items-center justify-between" >

        <div className="flex flex-row items-center gap-2" >
          <h1 className="text-2xl font-bold lg:text-3xl" >School Boy Rugby</h1>
          {/* <SbrContextSwitcher /> */}
        </div>

        {/* <button onClick={handleViewChat} className="h-fit w-fit flex flex-row items-center justify-end" >
          <MessageCircle 
            className="hover:text-primary-600 cursor-pointer" 
          />
        </button> */}

      </div>

      <div>
        <SBRFixtures />
      </div>
    </PageView>
  )
}
