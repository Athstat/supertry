import { Shield, Swords } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SbrScreenHeader() {

    const navigate = useNavigate();
    const handleViewChat = () => {
        navigate("/sbr/chat");
    }

    return (
        <div className="flex flex-row items-center justify-between" >

            <div className="flex flex-row items-center gap-2" >
                <Shield />
                {/* <Swords /> */}
                <h1 className="text-xl font-bold lg:text-2xl" >School Boy Rugby</h1>
            </div>
        </div>
    )
}
