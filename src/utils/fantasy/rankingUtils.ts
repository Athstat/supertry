export const getRankingBorderColor = (rank: number) => {
    switch (rank) {
        case 1: return '#FFD700'; // Gold
        case 2: return '#C0C0C0'; // Silver
        case 3: return '#CD7F32'; // Bronze
        case 4: return '#9333EA'; // Purple
        case 5: return '#10B981'; // Green
        // default: return '#1196F5'; // Blue
        default: return undefined
    }
};