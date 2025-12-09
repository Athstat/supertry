import { athleteNameSearchPredicate } from "../athleteUtils";

export type SearchMatch = {
    score: number;        // 0 - 100
    category: "exact" | "close";
    target: string;
};

type SearchNameOptions = {
    maxWordDistance?: number;   // typo tolerance per word (default 2)
    maxMissingWords?: number;   // missing tokens allowed (default 1)
}

function searchName(query: string, target: string, opts?: SearchNameOptions): SearchMatch | null {

    const {
        maxWordDistance = 2,
        maxMissingWords = 1,
    } = opts || {};

    const normalize = (s: string) =>
        s
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/'/g, "")
            .trim();

    const q = normalize(query).split(/\s+/);
    const t = normalize(target).split(/\s+/);

    let matchedWords = 0;
    let totalDistance = 0;

    for (const qWord of q) {
        // Find best match inside target tokens
        let bestDistance = Infinity;

        for (const tWord of t) {
            const d = levenshteinDistance(qWord, tWord);
            if (d < bestDistance) bestDistance = d;
        }

        // Count word match
        if (bestDistance <= maxWordDistance) {
            matchedWords++;
            totalDistance += bestDistance;
        }
    }

    const missing = q.length - matchedWords;
    if (missing > maxMissingWords) {
        return null; // too different
    }

    // Build a scoring system (simple but effective)
    const wordScore = matchedWords / q.length;
    const distancePenalty = Math.max(0, 1 - totalDistance / (q.length * maxWordDistance));

    const score = Math.round((wordScore * 0.7 + distancePenalty * 0.3) * 100);

    const category: "exact" | "close" =
        score > 85 && missing === 0 ? "exact" : "close";

    return { score, category, target };
}


function levenshteinDistance(a: string, b: string) {
    const dp = Array.from({ length: a.length + 1 }, () =>
        Array(b.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }

    return dp[a.length][b.length];
}

export class AthleteSearch {

    public static strictPredicate(query: string | undefined, athleteName: string, options?: SearchNameOptions) {

        if (!query) {
            return false;
        }

        const res = searchName(query, athleteName, options);

        if (res) {
            return res.score > 80;
        }

        return false;
    }

    public static weakPredicate(query: string | undefined, athleteName: string, options?: SearchNameOptions) {

        if (!query) {
            return false;
        }

        const res = searchName(query, athleteName, options);

        if (res) {
            return res.score > 50 && res.score < 80;
        }

        return false;
    }

    public static weakAndAllPredicate(query: string | undefined, athleteName: string, options?: SearchNameOptions) {

        if (!query) {
            return false;
        }

        const res = searchName(query, athleteName, options);

        if (res) {
            return res.score < 80;
        }

        return false;
    }

    public static standardPredicate(query: string | undefined, atheleteName: string) {
        return athleteNameSearchPredicate(atheleteName, query ?? "");
    }


}
