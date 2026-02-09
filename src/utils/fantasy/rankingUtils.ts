export const getRankingBorderColor = (rank: number) => {
    switch (rank) {
        case 1: return '#1CA64F'; // Gold
        case 2: return '#EF4444'; // Silver
        case 3: return '#475569'; // Bronze
        case 4: return '#1CA64F'; // Purple
        case 5: return '#475569'; // Green
        // default: return '#1196F5'; // Blue
        default: return undefined
    }
};