'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { removePassenger, updatePassengerWeight } from '@/store/slices/chuteSlice';
import { kgToLbs, lbsToKg } from '@/lib/unitConversions';

interface PassengerInputProps {
    id: string;
    weight: number;
    index: number;
    isMetric: boolean;
    canRemove: boolean;
}

export default function PassengerInput({
    id,
    weight,
    index,
    isMetric,
    canRemove,
}: PassengerInputProps) {
    const dispatch = useDispatch();

    const handleWeightChange = (value: string) => {
        const numValue = parseFloat(value) || 0;
        // Convert to lbs for storage if metric
        const weightInLbs = isMetric ? kgToLbs(numValue) : numValue;
        dispatch(updatePassengerWeight({ id, weight: weightInLbs }));
    };

    const handleRemove = () => {
        dispatch(removePassenger(id));
    };

    const displayWeight = isMetric ? Math.round(lbsToKg(weight)) : Math.round(weight);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="relative p-6 rounded-xl border border-border-default bg-bg-card"
        >
            {canRemove && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRemove}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-bg-secondary transition-colors"
                >
                    <X className="w-5 h-5 text-text-secondary" />
                </motion.button>
            )}

            <label className="block mb-3">
                <span className="text-sm font-semibold text-text-primary">
                    Passenger {index + 1}
                </span>
            </label>

            <div className="relative">
                <input
                    type="number"
                    value={displayWeight || ''}
                    onChange={(e) => handleWeightChange(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 pr-20 rounded-lg border border-border-default bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-pink transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 bg-bg-secondary rounded-md p-1">
                    <button
                        onClick={() => {
                            if (isMetric) {
                                dispatch({ type: 'chute/toggleUnits' });
                            }
                        }}
                        className={`px-2 py-1 text-xs font-semibold rounded transition-all ${!isMetric
                                ? 'bg-accent-pink text-white'
                                : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        lbs
                    </button>
                    <button
                        onClick={() => {
                            if (!isMetric) {
                                dispatch({ type: 'chute/toggleUnits' });
                            }
                        }}
                        className={`px-2 py-1 text-xs font-semibold rounded transition-all ${isMetric
                                ? 'bg-accent-pink text-white'
                                : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        kg
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
