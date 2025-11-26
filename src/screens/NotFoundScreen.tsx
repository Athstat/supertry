import { useNavigate } from "react-router-dom";
import PageView from "./PageView";
import { CloudRain } from "lucide-react";

/** Renders Not Found Screen */
export default function NotFoundScreen() {

    const navigate = useNavigate();

    const goToDashboard = () => {
        navigate("/dashboard");
    }

    return (
        <PageView className="w-full h-[85vh] flex flex-col gap-6 items-center justify-center" >
            
            <div>
                <CloudRain className="w-20 h-20" />
            </div>

            <div className="flex flex-col items-center justify-center" >
                <h1 className="font-bold text-5xl" >404</h1>
                <h1>Opps! Page was not found</h1>
            </div>

            <div>
                <button onClick={goToDashboard} className="dark:text-blue-400 underline text-blue-500" >Go to Dashboard</button>
            </div>
        </PageView>
    )
}
