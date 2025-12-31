import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BarType } from '@/lib/barData';

export interface Passenger {
    id: string;
    weight: number; // stored in lbs, converted for display
}

export interface ChuteState {
    passengers: Passenger[];
    windSpeed: number; // stored in mph, converted for display
    isMetric: boolean; // true for kg/kph, false for lbs/mph
    selectedBarType: BarType | null;
    selectedChutes: number[]; // Array of chute sizes user owns (e.g., [35, 39, 42])
}

const initialState: ChuteState = {
    passengers: [{ id: '1', weight: 0 }],
    windSpeed: 0,
    isMetric: false,
    selectedBarType: null,
    selectedChutes: [], // Empty by default - shows all chutes
};

const chuteSlice = createSlice({
    name: 'chute',
    initialState,
    reducers: {
        addPassenger: (state) => {
            if (state.passengers.length < 3) {
                const newId = String(state.passengers.length + 1);
                state.passengers.push({ id: newId, weight: 0 });
            }
        },
        removePassenger: (state, action: PayloadAction<string>) => {
            if (state.passengers.length > 1) {
                state.passengers = state.passengers.filter((p) => p.id !== action.payload);
            }
        },
        updatePassengerWeight: (state, action: PayloadAction<{ id: string; weight: number }>) => {
            const passenger = state.passengers.find((p) => p.id === action.payload.id);
            if (passenger) {
                passenger.weight = action.payload.weight;
            }
        },
        setWindSpeed: (state, action: PayloadAction<number>) => {
            state.windSpeed = action.payload;
        },
        toggleUnits: (state) => {
            state.isMetric = !state.isMetric;
        },
        setBarType: (state, action: PayloadAction<BarType | null>) => {
            state.selectedBarType = action.payload;
        },
        toggleChuteSelection: (state, action: PayloadAction<number>) => {
            const chuteSize = action.payload;
            const index = state.selectedChutes.indexOf(chuteSize);
            if (index > -1) {
                state.selectedChutes.splice(index, 1);
            } else {
                state.selectedChutes.push(chuteSize);
            }
        },
        resetChuteFilter: (state) => {
            state.selectedChutes = [];
        },
        resetChute: (state) => {
            state.passengers = [{ id: '1', weight: 0 }];
            state.windSpeed = 0;
            state.selectedBarType = null;
        },
    },
});

export const {
    addPassenger,
    removePassenger,
    updatePassengerWeight,
    setWindSpeed,
    toggleUnits,
    setBarType,
    toggleChuteSelection,
    resetChuteFilter,
    resetChute,
} = chuteSlice.actions;

export default chuteSlice.reducer;
