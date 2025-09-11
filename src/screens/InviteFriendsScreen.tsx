import { Copy } from "lucide-react";
import ScrummyLogo from "../components/branding/scrummy_logo";
import { useAuthUser } from "../hooks/useAuthUser";
import { analytics } from "../services/analytics/anayticsService";

export default function InviteFriendsScreen() {

    const user = useAuthUser();

    const baseUrl = "https://fantasy-rugby.netlify.app";
    const referBase64 = btoa(user?.kc_id ?? "");
    const searchParams = `?rfr=${referBase64.split('').reverse().join('')}`;

    const inviteLink = baseUrl + searchParams;

    const handleClickInvite = () => {
        navigator.clipboard.writeText(inviteLink);
        analytics.trackFriendInvitesSent("Link");
        alert("Invite Link Copied");
    }

  return (
    <div className="flex dark:text-white flex-col items-center h-full justify-center" >
        <div>
            <ScrummyLogo className="w-44 h-44" />
        </div>

        <div className="flex w-full lg:w-1/2 px-10 flex-col items-center justify-center gap-3" >
            <h1 className="text-lg font-bold">Rugby Is Better With Friends!</h1>
            
            <p className="text-slate-700 text-center dark:text-slate-400" >

                {`Build your dream team. Beat your mates.
                SCRUMMY is the ultimate rugby fantasy experience — and it’s even better with friends.
                Invite your crew, compete in leagues, track real-time rankings, and see who’s got the sharpest rugby mind.`}

            </p>
            
            <button onClick={handleClickInvite} className="bg-blue-600 text-medium flex flex-row items-center justify-center gap-2 text-white px-5 py-2 rounded-xl" >
                Invite Link
                <Copy className="w-4 h-4" />
            </button>
        </div>
    </div>
  )
}
