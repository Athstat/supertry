import { useSectionNavigation } from "../../../hooks/useSectionNavigation";
import { TabButton } from "../../shared/TabButton";


export default function FixtureScreenTab() {

    const sections = [
        {
            label: "Overview",
            id: "overview"
        },

        {
            label: "Attacking",
            id: "attacking"
        },

        {
            label: "Defense",
            id: "defense"
        },

        {
            label: "Kicking",
            id: "kicking"
        },

        {
            label: "Descipline",
            id: "descipline"
        }
    ];

    const sectionIds = sections.map(s => s.id);

    const { currentSection: activeTab, scrollToSection } = useSectionNavigation(sectionIds);

    const handleTabClick = (id: string) => {
        scrollToSection(id);
    }

    return (
        <div className="bg-white dark:bg-dark-800/50 shadow-sm">
            <div className="container mx-auto">
                <div className="flex overflow-x-auto">

                    {sections.map((section, index) => {

                        return <TabButton
                            key={index}
                            active={activeTab === section.id}
                            onClick={() => handleTabClick(section.id)}
                        >
                            {section.label}
                        </TabButton>
                    })}

                </div>
            </div>
        </div>
    )
}
