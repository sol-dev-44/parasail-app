// Chute data from Custom Chutes Wind and Size Chart
export interface ChuteSpec {
    size: number; // in feet
    maxWindClosed: number; // mph when A/M closed
    maxWindOpen: number; // mph when A/M open
    minWeight: number; // lbs
    maxWeight: number; // lbs
}

export const CHUTE_DATA: ChuteSpec[] = [
    { size: 21, maxWindClosed: 28, maxWindOpen: 29, minWeight: 75, maxWeight: 200 },
    { size: 23, maxWindClosed: 28, maxWindOpen: 29, minWeight: 80, maxWeight: 250 },
    { size: 25, maxWindClosed: 25, maxWindOpen: 26, minWeight: 80, maxWeight: 280 },
    { size: 27, maxWindClosed: 26, maxWindOpen: 26, minWeight: 90, maxWeight: 380 },
    { size: 27.5, maxWindClosed: 26, maxWindOpen: 27, minWeight: 100, maxWeight: 380 },
    { size: 29, maxWindClosed: 24, maxWindOpen: 25, minWeight: 90, maxWeight: 390 },
    { size: 29.5, maxWindClosed: 25, maxWindOpen: 26, minWeight: 100, maxWeight: 390 },
    { size: 31, maxWindClosed: 23, maxWindOpen: 24, minWeight: 110, maxWeight: 400 },
    { size: 31.5, maxWindClosed: 25, maxWindOpen: 26, minWeight: 120, maxWeight: 400 },
    { size: 32, maxWindClosed: 18, maxWindOpen: 19, minWeight: 110, maxWeight: 400 },
    { size: 33, maxWindClosed: 20, maxWindOpen: 22, minWeight: 115, maxWeight: 450 },
    { size: 33.5, maxWindClosed: 22, maxWindOpen: 24, minWeight: 125, maxWeight: 450 },
    { size: 34, maxWindClosed: 18, maxWindOpen: 19, minWeight: 115, maxWeight: 450 },
    { size: 34.5, maxWindClosed: 20, maxWindOpen: 22, minWeight: 125, maxWeight: 450 },
    { size: 35, maxWindClosed: 16, maxWindOpen: 17, minWeight: 115, maxWeight: 500 },
    { size: 35.5, maxWindClosed: 18, maxWindOpen: 20, minWeight: 135, maxWeight: 500 },
    { size: 36, maxWindClosed: 15, maxWindOpen: 16, minWeight: 120, maxWeight: 500 },
    { size: 37, maxWindClosed: 14, maxWindOpen: 16, minWeight: 120, maxWeight: 525 },
    { size: 37.5, maxWindClosed: 16, maxWindOpen: 18, minWeight: 140, maxWeight: 525 },
    { size: 38, maxWindClosed: 12, maxWindOpen: 13, minWeight: 140, maxWeight: 525 },
    { size: 39, maxWindClosed: 12, maxWindOpen: 14, minWeight: 150, maxWeight: 560 },
    { size: 40.5, maxWindClosed: 12, maxWindOpen: 14, minWeight: 160, maxWeight: 580 },
    { size: 42, maxWindClosed: 12, maxWindOpen: 14, minWeight: 180, maxWeight: 600 },
    { size: 46, maxWindClosed: 10, maxWindOpen: 12, minWeight: 200, maxWeight: 650 },
    { size: 52, maxWindClosed: 10, maxWindOpen: 11, minWeight: 225, maxWeight: 700 },
];
