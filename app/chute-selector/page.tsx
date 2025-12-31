'use client';

import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addPassenger, setWindSpeed, toggleUnits, resetChute } from '@/store/slices/chuteSlice';
import { getRecommendations } from '@/lib/chuteRecommendations';
import { mphToKph, kphToMph } from '@/lib/unitConversions';
import { calculateBarSetup } from '@/lib/barSetup';
import PassengerInput from '@/components/PassengerInput';
import ChuteRecommendationCard from '@/components/ChuteRecommendationCard';
import BarTypeSelector from '@/components/BarTypeSelector';
import BarSetupDisplay from '@/components/BarSetupDisplay';
import ChuteFilter from '@/components/ChuteFilter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Plus, RotateCcw, Wind, Users } from 'lucide-react';
import Link from 'next/link';

export default function ChuteSelector() {
    const dispatch = useDispatch();
    const { passengers, windSpeed, isMetric, selectedBarType, selectedChutes } = useSelector((state: RootState) => state.chute);

    const totalWeight = passengers.reduce((sum, p) => sum + p.weight, 0);
    const displayWindSpeed = isMetric ? Math.round(mphToKph(windSpeed)) : Math.round(windSpeed);

    const handleWindSpeedChange = (value: string) => {
        const numValue = parseFloat(value) || 0;
        const speedInMph = isMetric ? kphToMph(numValue) : numValue;
        dispatch(setWindSpeed(speedInMph));
    };

    const recommendations = getRecommendations(totalWeight, windSpeed, selectedChutes);

    // Calculate bar setup if bar type is selected
    const barSetup = selectedBarType
        ? calculateBarSetup(passengers.map(p => p.weight), selectedBarType)
        : null;

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Header */}
            <nav className="border-b border-border-default backdrop-blur-lg bg-bg-primary/80">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold gradient-miami-text hover:opacity-80 transition-opacity">
                        ← Parasail Bro
                    </Link>
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => dispatch(toggleUnits())}
                            className="px-4 py-2 rounded-full border border-accent-cyan text-accent-cyan font-semibold text-sm hover:bg-accent-cyan/10 transition-colors"
                        >
                            {isMetric ? 'Switch to Imperial' : 'Switch to Metric'}
                        </motion.button>
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-miami-text">
                        Chute Selector & Bar Setup
                    </h1>
                    <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                        Enter passenger weights, wind speed, and select your bar type
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        {/* Passengers */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 rounded-2xl border border-border-default bg-bg-card"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <Users className="w-6 h-6 text-accent-pink" />
                                <h2 className="text-2xl font-bold text-text-primary">Passengers</h2>
                            </div>

                            <div className="space-y-4">
                                {passengers.map((passenger, index) => (
                                    <PassengerInput
                                        key={passenger.id}
                                        id={passenger.id}
                                        weight={passenger.weight}
                                        index={index}
                                        isMetric={isMetric}
                                        canRemove={passengers.length > 1}
                                    />
                                ))}

                                {passengers.length < 3 && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => dispatch(addPassenger())}
                                        className="w-full py-4 rounded-xl border-2 border-dashed border-accent-pink text-accent-pink font-semibold flex items-center justify-center gap-2 hover:bg-accent-pink/10 transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add Passenger
                                    </motion.button>
                                )}
                            </div>

                            {totalWeight > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-6 p-4 rounded-lg bg-bg-secondary"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-secondary">Total Weight</span>
                                        <span className="text-2xl font-bold gradient-miami-text">
                                            {isMetric
                                                ? `${Math.round(totalWeight * 0.453592)} kg`
                                                : `${Math.round(totalWeight)} lbs`}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Wind Speed */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-6 rounded-2xl border border-border-default bg-bg-card"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <Wind className="w-6 h-6 text-accent-cyan" />
                                <h2 className="text-2xl font-bold text-text-primary">Wind Speed</h2>
                            </div>

                            <div className="relative">
                                <input
                                    type="number"
                                    value={displayWindSpeed || ''}
                                    onChange={(e) => handleWindSpeedChange(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-4 py-4 pr-24 rounded-lg border border-border-default bg-bg-primary text-text-primary text-xl focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 bg-bg-secondary rounded-md p-1">
                                    <button
                                        onClick={() => {
                                            if (isMetric) {
                                                dispatch(toggleUnits());
                                            }
                                        }}
                                        className={`px-3 py-1.5 text-sm font-semibold rounded transition-all ${!isMetric
                                            ? 'bg-accent-cyan text-white'
                                            : 'text-text-secondary hover:text-text-primary'
                                            }`}
                                    >
                                        mph
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!isMetric) {
                                                dispatch(toggleUnits());
                                            }
                                        }}
                                        className={`px-3 py-1.5 text-sm font-semibold rounded transition-all ${isMetric
                                            ? 'bg-accent-cyan text-white'
                                            : 'text-text-secondary hover:text-text-primary'
                                            }`}
                                    >
                                        kph
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Chute Filter */}
                        <ChuteFilter />

                        {/* Bar Type Selector */}
                        <BarTypeSelector />

                        {/* Bar Setup Display */}
                        {barSetup && <BarSetupDisplay setup={barSetup} isMetric={isMetric} />}

                        {/* Reset Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => dispatch(resetChute())}
                            className="w-full py-3 rounded-xl border border-border-default text-text-secondary font-semibold flex items-center justify-center gap-2 hover:bg-bg-secondary transition-colors"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Reset
                        </motion.button>
                    </div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        {/* Chute Recommendations */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h2 className="text-2xl font-bold text-text-primary mb-6">
                                Chute Recommendations
                            </h2>

                            {recommendations.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-12 rounded-2xl border border-border-default bg-bg-card text-center"
                                >
                                    <p className="text-text-secondary text-lg">
                                        {totalWeight === 0 || windSpeed === 0
                                            ? 'Enter passenger weights and wind speed to see recommendations'
                                            : 'No safe chute options for these conditions. Wind speed may be too high or weight out of range.'}
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    {recommendations.map((rec, index) => (
                                        <ChuteRecommendationCard
                                            key={`${rec.chute.size}-${rec.amZipperPosition}`}
                                            recommendation={rec}
                                            isMetric={isMetric}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
