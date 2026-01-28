export const getRankingBorderColor = (rank: number) => {
    switch (rank) {
        case 1: return '#1CA64F'; // Green
        case 2: return '#EF4444'; // Red
        case 3: return '#475569'; // Grey
        case 4: return '#1CA64F'; // Green
        case 5: return '#475569'; // Grey
        default: return undefined
    }
};