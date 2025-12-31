import { BAR_DATA, BarType, BarSpec, BarPosition, StrapAssignment } from './barData';

export interface PassengerStrapAssignment {
    passengerIndex: number; // 0, 1, or 2
    weight: number;
    role: 'heavy' | 'light' | 'middle';
    straps: StrapAssignment; // left and right strap positions
}

export interface BarSetupResult {
    barType: BarType;
    barSpec: BarSpec;
    assignments: PassengerStrapAssignment[];
    fulcrumPosition: number; // The bar position/fulcrum setting
    weightDifference: number;
    setupRule: BarPosition;
}

/**
 * Calculate bar setup for given passengers and bar type
 */
export const calculateBarSetup = (
    passengerWeights: number[], // Array of weights in lbs
    barType: BarType
): BarSetupResult | null => {
    const barSpec = BAR_DATA.find(bar => bar.id === barType);
    if (!barSpec) return null;

    const numPassengers = passengerWeights.filter(w => w > 0).length;

    if (numPassengers === 2) {
        return calculateDoubleSetup(passengerWeights, barSpec);
    } else if (numPassengers === 3) {
        return calculateTripleSetup(passengerWeights, barSpec);
    }

    return null;
};

/**
 * Calculate setup for 2 passengers
 */
function calculateDoubleSetup(
    passengerWeights: number[],
    barSpec: BarSpec
): BarSetupResult | null {
    const weights = passengerWeights.filter(w => w > 0);
    if (weights.length !== 2) return null;

    // Determine heavy and light passenger
    const weight1 = weights[0];
    const weight2 = weights[1];
    const heavyIndex = weight1 >= weight2 ? 0 : 1;
    const lightIndex = weight1 >= weight2 ? 1 : 0;
    const heavyWeight = Math.max(weight1, weight2);
    const lightWeight = Math.min(weight1, weight2);

    const weightDiff = Math.abs(heavyWeight - lightWeight);

    // Find matching setup rule
    const setupRule = barSpec.doublesSetup.find(
        rule => weightDiff >= rule.minDiff && weightDiff <= rule.maxDiff
    );

    if (!setupRule) return null;

    const assignments: PassengerStrapAssignment[] = [
        {
            passengerIndex: heavyIndex,
            weight: heavyWeight,
            role: 'heavy',
            straps: setupRule.heavyStraps,
        },
        {
            passengerIndex: lightIndex,
            weight: lightWeight,
            role: 'light',
            straps: setupRule.lightStraps,
        },
    ];

    return {
        barType: barSpec.id,
        barSpec,
        assignments,
        fulcrumPosition: setupRule.position,
        weightDifference: weightDiff,
        setupRule,
    };
}

/**
 * Calculate setup for 3 passengers
 * Algorithm: Find 2 closest in weight (go on outside), furthest goes in middle
 */
function calculateTripleSetup(
    passengerWeights: number[],
    barSpec: BarSpec
): BarSetupResult | null {
    const weights = passengerWeights.filter(w => w > 0);
    if (weights.length !== 3) return null;
    if (!barSpec.triplesSetup) return null;

    // Create array with indices
    const weightedPassengers = weights.map((weight, index) => ({ weight, index }));

    // Sort by weight
    weightedPassengers.sort((a, b) => b.weight - a.weight);

    const heaviest = weightedPassengers[0];
    const middle = weightedPassengers[1];
    const lightest = weightedPassengers[2];

    // Calculate differences
    const diff1 = heaviest.weight - middle.weight;
    const diff2 = middle.weight - lightest.weight;

    // Find the 2 closest passengers
    let outsideHeavy, outsideLight, middlePerson;

    if (diff1 <= diff2) {
        // Heaviest and middle are closest
        outsideHeavy = heaviest;
        outsideLight = middle;
        middlePerson = lightest;
    } else {
        // Middle and lightest are closest
        outsideHeavy = middle;
        outsideLight = lightest;
        middlePerson = heaviest;
    }

    // Weight difference for lookup is between the two on the outside
    const weightDiff = Math.abs(outsideHeavy.weight - outsideLight.weight);

    // Find matching setup rule
    const setupRule = barSpec.triplesSetup.find(
        rule => weightDiff >= rule.minDiff && weightDiff <= rule.maxDiff
    );

    if (!setupRule || !setupRule.middleStraps) return null;

    const assignments: PassengerStrapAssignment[] = [
        {
            passengerIndex: outsideHeavy.index,
            weight: outsideHeavy.weight,
            role: 'heavy',
            straps: setupRule.heavyStraps,
        },
        {
            passengerIndex: middlePerson.index,
            weight: middlePerson.weight,
            role: 'middle',
            straps: setupRule.middleStraps,
        },
        {
            passengerIndex: outsideLight.index,
            weight: outsideLight.weight,
            role: 'light',
            straps: setupRule.lightStraps,
        },
    ];

    return {
        barType: barSpec.id,
        barSpec,
        assignments,
        fulcrumPosition: setupRule.position,
        weightDifference: weightDiff,
        setupRule,
    };
}
