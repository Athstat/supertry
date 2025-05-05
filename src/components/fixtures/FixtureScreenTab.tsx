import { useSectionNavigation } from '../../hooks/useSectionNavigation';
import { TabButton } from '../shared/TabButton'

export default function FixtureScreenTab() {

    const sections = [
        {
            label: "Overview",
            id: "overview"
        }
    ];

    const sectionIds = sections.map(s => s.id);

    const {currentSection: activeTab, scrollToSection} = useSectionNavigation(sectionIds);

    const handleTabClick = (id: string) => {
        scrollToSection(id);
    }

    return (
        <div className="bg-white dark:bg-dark-800 shadow-sm">
            <div className="container mx-auto">
                <div className="flex overflow-x-auto">
                    <TabButton
                        active={activeTab === "overview"}
                        onClick={() => handleTabClick("overview")}
                    >
                        Overview
                    </TabButton>
                    <TabButton
                        active={activeTab === "physical"}
                        onClick={() => handleTabClick("physical")}
                    >
                        Physical
                    </TabButton>
                    <TabButton
                        active={activeTab === "seasonAggregate"}
                        onClick={() => handleTabClick("seasonAggregate")}
                    >
                        Season Performance
                    </TabButton>
                    <TabButton
                        active={activeTab === "attack"}
                        onClick={() => handleTabClick("attack")}
                    >
                        Attack
                    </TabButton>
                    <TabButton
                        active={activeTab === "defense"}
                        onClick={() => handleTabClick("defense")}
                    >
                        Defense
                    </TabButton>
                    <TabButton
                        active={activeTab === "kicking"}
                        onClick={() => handleTabClick("kicking")}
                    >
                        Kicking
                    </TabButton>
                </div>
            </div>
        </div>
    )
}
