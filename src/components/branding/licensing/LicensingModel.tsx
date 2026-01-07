import { ChevronRight, Newspaper } from "lucide-react"
import { useState } from "react"
import SecondaryText from "../../ui/typography/SecondaryText";
import ScrummyLogo from "../scrummy_logo";
import DialogModal from "../../ui/modals/DialogModal";

export default function LicensingModal() {

    const [show, setShow] = useState(false);
    const toggle = () => setShow((prev) => !prev);
    const year = (new Date()).getFullYear();


    const handleClick = () => {
       toggle(); 
    }  

    return (
        <div>
            <button
                onClick={handleClick}
                className="w-full bg-white dark:bg-dark-800/60 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden px-6 py-4 flex items-center space-x-3 transition-colors disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-dark-800/40"
            >
                <div className="flex items-center gap-3">
                    <Newspaper size={20} className="text-gray-500" />
                    <span className="font-medium dark:text-gray-100">Licensing</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
            </button>

            <DialogModal
                open={show}
                onClose={toggle}
                title="Licensing"
                className="flex flex-col gap-2"
            >
                <div className="flex flex-row items-center justify-center" >
                    <ScrummyLogo className="w-32 h-32" />
                </div>
                <SecondaryText className="text-center" >
                     All images, photographs, graphics, videos, and likenesses displayed on the scrummy website or scrummy app are either the property of ATHSTAT, Inc. (d/b/a SCRUMMY), used under valid licenses, or displayed with the express permission of the rights holders. ATHSTAT, Inc. (d/b/a SCRUMMY) affirms that it has obtained all necessary rights, licenses, consents, and permissions to lawfully use and display such content on this website. Any unauthorized reproduction, distribution, or other use of content is strictly prohibited and may violate copyright and other applicable laws.
                </SecondaryText>

                <div className="flex flex-row mt-4 items-center justify-center gap-2" >
                    <SecondaryText className="font-bold" >&copy; SCRUMMY App {year}</SecondaryText>
                </div>

            </DialogModal>
        </div>
    )
}
