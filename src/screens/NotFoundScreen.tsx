import { Link } from "react-router-dom";
import PageView from "../components/ui/containers/PageView";
import { CloudRain } from "lucide-react";

/** Renders Not Found Screen */
export default function NotFoundScreen() {

    return (
        <PageView className="w-full h-[85vh] flex flex-col gap-6 items-center justify-center" >
            
            <div>
                <CloudRain className="w-20 h-20" />
            </div>

            <div className="flex flex-col items-center justify-center" >
                <h1 className="font-bold text-5xl" >404</h1>
                <h1>Oops! Page was not found</h1>
            </div>

            <div>
                <Link  className="dark:text-blue-400 underline text-blue-500" to={"/dashboard"} >Go to Dashboard</Link>
            </div>
        </PageView>
    )
}
