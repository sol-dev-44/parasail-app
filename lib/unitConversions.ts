// Unit conversion utilities

// Weight conversions
export const lbsToKg = (lbs: number): number => lbs * 0.453592;
export const kgToLbs = (kg: number): number => kg / 0.453592;

// Speed conversions
export const mphToKph = (mph: number): number => mph * 1.60934;
export const kphToMph = (kph: number): number => kph / 1.60934;

// Formatting helpers
export const formatWeight = (lbs: number, isMetric: boolean): string => {
    if (isMetric) {
        return `${Math.round(lbsToKg(lbs))} kg`;
    }
    return `${Math.round(lbs)} lbs`;
};

export const formatSpeed = (mph: number, isMetric: boolean): string => {
    if (isMetric) {
        return `${Math.round(mphToKph(mph))} kph`;
    }
    return `${Math.round(mph)} mph`;
};

export const formatWeightRange = (minLbs: number, maxLbs: number, isMetric: boolean): string => {
    return `${formatWeight(minLbs, isMetric)} - ${formatWeight(maxLbs, isMetric)}`;
};
