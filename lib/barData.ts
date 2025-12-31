// Bar setup data and types

export type BarType = 'doubleizer' | 'doubleizer-sp' | 'multiflyer' | 'multiflyer-adv';

export interface StrapAssignment {
    leftStrap: string;  // e.g., "A", "B", "C"
    rightStrap: string; // e.g., "1", "2", "3"
}

export interface BarPosition {
    position: number; // Fulcrum position number (0-6)
    minDiff: number; // Min weight difference in lbs
    maxDiff: number; // Max weight difference in lbs
    heavyStraps: StrapAssignment; // Strap positions for heavier person
    lightStraps: StrapAssignment; // Strap positions for lighter person
    middleStraps?: StrapAssignment; // For triples only
}

export interface BarSpec {
    id: BarType;
    name: string;
    displayName: string;
    strapPositions: string[]; // All available strap positions (letters)
    positionColors: { [key: string]: string }; // Color for each strap position
    doublesSetup: BarPosition[];
    triplesSetup?: BarPosition[];
    imagePath: string;
}

export const BAR_DATA: BarSpec[] = [
    {
        id: 'doubleizer',
        name: 'Doubleizer',
        displayName: 'Doubleizer',
        strapPositions: ['A', 'B', 'C', 'D', 'E', 'F'],
        positionColors: {
            'A': '#22c55e', // green
            'B': '#3b82f6', // blue
            'C': '#22c55e', // green
            'D': '#3b82f6', // blue
            'E': '#ef4444', // red
            'F': '#ef4444', // red
        },
        doublesSetup: [
            { position: 0, minDiff: 0, maxDiff: 11, heavyStraps: { leftStrap: 'A', rightStrap: 'C' }, lightStraps: { leftStrap: 'F', rightStrap: 'E' } },
            { position: 1, minDiff: 12, maxDiff: 40, heavyStraps: { leftStrap: 'B', rightStrap: 'D' }, lightStraps: { leftStrap: 'F', rightStrap: 'D' } },
            { position: 2, minDiff: 41, maxDiff: 60, heavyStraps: { leftStrap: 'B', rightStrap: 'D' }, lightStraps: { leftStrap: 'F', rightStrap: 'E' } },
            { position: 3, minDiff: 61, maxDiff: 110, heavyStraps: { leftStrap: 'B', rightStrap: 'E' }, lightStraps: { leftStrap: 'F', rightStrap: 'E' } },
        ],
        imagePath: '/bar-images/doubleizer.png',
    },
    {
        id: 'doubleizer-sp',
        name: 'Doubleizer SP',
        displayName: 'Doubleizer SP',
        strapPositions: ['A', 'B', 'C', 'D'],
        positionColors: {
            'A': '#22c55e', // green
            'B': '#22c55e', // green
            'C': '#ef4444', // red
            'D': '#ef4444', // red
        },
        doublesSetup: [
            { position: 0, minDiff: 0, maxDiff: 10, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, lightStraps: { leftStrap: 'C', rightStrap: 'D' } },
            { position: 1, minDiff: 11, maxDiff: 35, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, lightStraps: { leftStrap: 'C', rightStrap: 'D' } },
            { position: 2, minDiff: 36, maxDiff: 60, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, lightStraps: { leftStrap: 'C', rightStrap: 'D' } },
            { position: 3, minDiff: 61, maxDiff: 85, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, lightStraps: { leftStrap: 'C', rightStrap: 'D' } },
            { position: 4, minDiff: 86, maxDiff: 110, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, lightStraps: { leftStrap: 'C', rightStrap: 'D' } },
            { position: 5, minDiff: 111, maxDiff: 135, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, lightStraps: { leftStrap: 'C', rightStrap: 'D' } },
        ],
        imagePath: '/bar-images/doubleizer-sp.png',
    },
    {
        id: 'multiflyer',
        name: 'Multiflyer',
        displayName: 'Multiflyer',
        strapPositions: ['A', 'B', 'C', 'D', 'E', 'F'],
        positionColors: {
            'A': '#000000', // black
            'B': '#000000', // black
            'C': '#ef4444', // red
            'D': '#ef4444', // red
            'E': '#000000', // black
            'F': '#000000', // black
        },
        doublesSetup: [
            { position: 0, minDiff: 0, maxDiff: 7, heavyStraps: { leftStrap: 'A', rightStrap: 'C' }, lightStraps: { leftStrap: 'D', rightStrap: 'F' } },
            { position: 1, minDiff: 8, maxDiff: 22, heavyStraps: { leftStrap: 'A', rightStrap: 'C' }, lightStraps: { leftStrap: 'D', rightStrap: 'F' } },
            { position: 2, minDiff: 23, maxDiff: 37, heavyStraps: { leftStrap: 'A', rightStrap: 'C' }, lightStraps: { leftStrap: 'D', rightStrap: 'F' } },
            { position: 3, minDiff: 38, maxDiff: 52, heavyStraps: { leftStrap: 'A', rightStrap: 'C' }, lightStraps: { leftStrap: 'D', rightStrap: 'F' } },
            { position: 4, minDiff: 53, maxDiff: 67, heavyStraps: { leftStrap: 'A', rightStrap: 'C' }, lightStraps: { leftStrap: 'D', rightStrap: 'F' } },
            { position: 5, minDiff: 68, maxDiff: 82, heavyStraps: { leftStrap: 'A', rightStrap: 'C' }, lightStraps: { leftStrap: 'D', rightStrap: 'F' } },
            { position: 0, minDiff: 83, maxDiff: 97, heavyStraps: { leftStrap: 'A', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 1, minDiff: 98, maxDiff: 112, heavyStraps: { leftStrap: 'A', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 2, minDiff: 113, maxDiff: 127, heavyStraps: { leftStrap: 'A', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 3, minDiff: 128, maxDiff: 142, heavyStraps: { leftStrap: 'A', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 4, minDiff: 143, maxDiff: 157, heavyStraps: { leftStrap: 'A', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 5, minDiff: 158, maxDiff: 172, heavyStraps: { leftStrap: 'A', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
        ],
        triplesSetup: [
            { position: 0, minDiff: 0, maxDiff: 7, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, middleStraps: { leftStrap: 'C', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 1, minDiff: 8, maxDiff: 22, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, middleStraps: { leftStrap: 'C', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 2, minDiff: 23, maxDiff: 37, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, middleStraps: { leftStrap: 'C', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 3, minDiff: 38, maxDiff: 52, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, middleStraps: { leftStrap: 'C', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 4, minDiff: 53, maxDiff: 67, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, middleStraps: { leftStrap: 'C', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 5, minDiff: 68, maxDiff: 82, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, middleStraps: { leftStrap: 'C', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
        ],
        imagePath: '/bar-images/multiflyer.png',
    },
    {
        id: 'multiflyer-adv',
        name: 'Multiflyer ADV',
        displayName: 'Multiflyer ADV',
        strapPositions: ['A', 'B', 'C', 'D', 'E', 'F'],
        positionColors: {
            'A': '#22c55e', // green
            'B': '#22c55e', // green
            'C': '#3b82f6', // blue
            'D': '#3b82f6', // blue
            'E': '#ef4444', // red
            'F': '#ef4444', // red
        },
        doublesSetup: [
            { position: 0, minDiff: 0, maxDiff: 10, heavyStraps: { leftStrap: 'A', rightStrap: 'C' }, lightStraps: { leftStrap: 'D', rightStrap: 'F' } },
            { position: 1, minDiff: 11, maxDiff: 30, heavyStraps: { leftStrap: 'A', rightStrap: 'C' }, lightStraps: { leftStrap: 'D', rightStrap: 'F' } },
            { position: 2, minDiff: 31, maxDiff: 50, heavyStraps: { leftStrap: 'A', rightStrap: 'C' }, lightStraps: { leftStrap: 'D', rightStrap: 'F' } },
            { position: 3, minDiff: 51, maxDiff: 70, heavyStraps: { leftStrap: 'A', rightStrap: 'C' }, lightStraps: { leftStrap: 'D', rightStrap: 'F' } },
            { position: 4, minDiff: 71, maxDiff: 90, heavyStraps: { leftStrap: 'A', rightStrap: 'C' }, lightStraps: { leftStrap: 'D', rightStrap: 'F' } },
            { position: 5, minDiff: 91, maxDiff: 110, heavyStraps: { leftStrap: 'A', rightStrap: 'C' }, lightStraps: { leftStrap: 'D', rightStrap: 'F' } },
            { position: 0, minDiff: 111, maxDiff: 130, heavyStraps: { leftStrap: 'A', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 1, minDiff: 131, maxDiff: 150, heavyStraps: { leftStrap: 'A', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 2, minDiff: 151, maxDiff: 170, heavyStraps: { leftStrap: 'A', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 3, minDiff: 171, maxDiff: 190, heavyStraps: { leftStrap: 'A', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 4, minDiff: 191, maxDiff: 210, heavyStraps: { leftStrap: 'A', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 5, minDiff: 211, maxDiff: 230, heavyStraps: { leftStrap: 'A', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
        ],
        triplesSetup: [
            { position: 0, minDiff: 0, maxDiff: 10, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, middleStraps: { leftStrap: 'C', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 1, minDiff: 11, maxDiff: 30, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, middleStraps: { leftStrap: 'C', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 2, minDiff: 31, maxDiff: 50, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, middleStraps: { leftStrap: 'C', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 3, minDiff: 51, maxDiff: 70, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, middleStraps: { leftStrap: 'C', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 4, minDiff: 71, maxDiff: 90, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, middleStraps: { leftStrap: 'C', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
            { position: 5, minDiff: 91, maxDiff: 110, heavyStraps: { leftStrap: 'A', rightStrap: 'B' }, middleStraps: { leftStrap: 'C', rightStrap: 'D' }, lightStraps: { leftStrap: 'E', rightStrap: 'F' } },
        ],
        imagePath: '/bar-images/multiflyer-adv.png',
    },
];

export const getBarByType = (barType: BarType): BarSpec | undefined => {
    return BAR_DATA.find(bar => bar.id === barType);
};
