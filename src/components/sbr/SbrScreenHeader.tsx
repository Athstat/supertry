import { MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

export default function SbrScreenHeader() {

    const navigate = useNavigate();
    const handleViewChat = () => {
        navigate("/sbr/chat");
    }

    return (
        <div className="flex flex-row items-center justify-between" >

            <div className="flex flex-row items-center gap-2" >
                <h1 className="text-xl font-bold lg:text-2xl" >School Boy Rugby</h1>
            </div>
            <button onClick={handleViewChat} className="h-fit hover:bg-slate-200 dark:hover:bg-slate-800/40 px-3 py-1 rounded-xl w-fit gap-1 flex flex-row items-center justify-end" >
                <MessageCircle
                    className="hover:text-primary-600 w-5 h-5 cursor-pointer"
                />
                Chat
            </button>
        </div>
    )
}
