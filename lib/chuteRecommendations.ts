import { CHUTE_DATA, ChuteSpec } from './chuteData';

export interface ChuteRecommendation {
    chute: ChuteSpec;
    amZipperPosition: 'OPEN' | 'CLOSED';
    reason: string;
}

export const getRecommendations = (
    totalWeight: number,
    windSpeed: number,
    selectedChutes: number[] = [] // Array of chute sizes user owns
): ChuteRecommendation[] => {
    const recommendations: ChuteRecommendation[] = [];

    for (const chute of CHUTE_DATA) {
        // Skip if this chute is not in the user's selected chutes
        if (selectedChutes.length > 0 && !selectedChutes.includes(chute.size)) {
            continue;
        }
        // Check if weight is within range
        if (totalWeight < chute.minWeight || totalWeight > chute.maxWeight) {
            continue;
        }

        // Check wind speed with A/M closed
        if (windSpeed <= chute.maxWindClosed) {
            recommendations.push({
                chute,
                amZipperPosition: 'CLOSED',
                reason: `Wind speed ${windSpeed} mph is within safe range for A/M closed (max ${chute.maxWindClosed} mph)`,
            });
        }
        // Check wind speed with A/M open
        else if (windSpeed <= chute.maxWindOpen) {
            recommendations.push({
                chute,
                amZipperPosition: 'OPEN',
                reason: `Wind speed ${windSpeed} mph requires A/M open (max ${chute.maxWindOpen} mph)`,
            });
        }
        // Wind too high for this chute
    }

    // Sort recommendations to show most appropriate chutes first
    // Chutes in the middle of their range are better than those near min/max
    recommendations.sort((a, b) => {
        const scoreA = calculateChuteScore(a.chute, a.amZipperPosition, totalWeight, windSpeed);
        const scoreB = calculateChuteScore(b.chute, b.amZipperPosition, totalWeight, windSpeed);
        return scoreB - scoreA; // Higher score = better fit
    });

    return recommendations;
};

// Calculate how well a chute fits the conditions
// Higher score = better fit (not too close to limits)
function calculateChuteScore(
    chute: ChuteSpec,
    amPosition: 'OPEN' | 'CLOSED',
    weight: number,
    windSpeed: number
): number {
    // Calculate weight position in range (0 = at min, 1 = at max)
    const weightRange = chute.maxWeight - chute.minWeight;
    const weightPosition = (weight - chute.minWeight) / weightRange;

    // Calculate wind position in range (0 = calm, 1 = at max)
    const maxWind = amPosition === 'CLOSED' ? chute.maxWindClosed : chute.maxWindOpen;
    const windPosition = windSpeed / maxWind;

    // Ideal position is around 0.5 (middle of range)
    // Distance from ideal: 0 = perfect, 0.5 = at edge
    const weightDistanceFromIdeal = Math.abs(weightPosition - 0.5);
    const windDistanceFromIdeal = Math.abs(windPosition - 0.5);

    // Score: 1.0 = perfect (middle of range), 0.0 = at edge
    // Weight the weight factor more heavily (60%) than wind (40%)
    const weightScore = 1.0 - (weightDistanceFromIdeal * 2);
    const windScore = 1.0 - (windDistanceFromIdeal * 2);
    const totalScore = (weightScore * 0.6) + (windScore * 0.4);

    // Bonus for A/M closed (safer/preferred when possible)
    const amBonus = amPosition === 'CLOSED' ? 0.1 : 0;

    return totalScore + amBonus;
}
