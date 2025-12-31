'use client';

import { motion } from 'framer-motion';
import { BarSetupResult } from '@/lib/barSetup';
import { lbsToKg } from '@/lib/unitConversions';
import { Users, Settings } from 'lucide-react';

interface BarSetupDisplayProps {
    setup: BarSetupResult;
    isMetric: boolean;
}

// Define colors for each passenger role
const PASSENGER_COLORS = {
    heavy: '#22c55e', // green
    middle: '#a855f7', // purple
    light: '#3b82f6', // blue
};

export default function BarSetupDisplay({ setup, isMetric }: BarSetupDisplayProps) {
    const { barSpec, assignments, weightDifference, fulcrumPosition } = setup;

    // Check if this bar has a fulcrum (not Doubleizer or Doubleizer SP)
    const hasFulcrum = barSpec.id !== 'doubleizer' && barSpec.id !== 'doubleizer-sp';

    // Sort assignments by role for consistent display
    const sortedAssignments = [...assignments].sort((a, b) => {
        const roleOrder = { heavy: 0, middle: 1, light: 2 };
        return roleOrder[a.role] - roleOrder[b.role];
    });

    const formatWeight = (lbs: number) => {
        if (isMetric) {
            return `${Math.round(lbsToKg(lbs))} kg`;
        }
        return `${Math.round(lbs)} lbs`;
    };

    const getRoleLabel = (role: string) => {
        if (role === 'heavy') return 'Heaviest';
        if (role === 'light') return 'Lightest';
        return 'Middle';
    };

    const getRoleColor = (role: string) => {
        if (role === 'heavy') return 'text-accent-orange';
        if (role === 'light') return 'text-accent-cyan';
        return 'text-accent-purple';
    };

    // Build a map of which passengers use which straps
    const strapUsage = new Map<string, number[]>();
    assignments.forEach(assignment => {
        const leftStrap = assignment.straps.leftStrap;
        const rightStrap = assignment.straps.rightStrap;

        if (!strapUsage.has(leftStrap)) {
            strapUsage.set(leftStrap, []);
        }
        strapUsage.get(leftStrap)!.push(assignment.passengerIndex);

        if (!strapUsage.has(rightStrap)) {
            strapUsage.set(rightStrap, []);
        }
        strapUsage.get(rightStrap)!.push(assignment.passengerIndex);
    });

    // Create a map of strap position to color based on passenger role
    const strapColors = new Map<string, string[]>();
    assignments.forEach(assignment => {
        const color = PASSENGER_COLORS[assignment.role];

        [assignment.straps.leftStrap, assignment.straps.rightStrap].forEach(strap => {
            if (!strapColors.has(strap)) {
                strapColors.set(strap, []);
            }
            if (!strapColors.get(strap)!.includes(color)) {
                strapColors.get(strap)!.push(color);
            }
        });
    });

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl border border-border-default bg-bg-card"
        >
            <div className="flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-accent-orange" />
                <h3 className="text-2xl font-bold text-text-primary">Bar Setup</h3>
            </div>

            {/* Fulcrum Position - only for Multiflyer bars */}
            {hasFulcrum && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-accent-orange/20 to-accent-pink/20 border border-accent-orange/30">
                    <div className="flex items-center gap-2 mb-2">
                        <Settings className="w-5 h-5 text-accent-orange" />
                        <div className="text-sm font-semibold text-text-secondary">Bar Position</div>
                    </div>
                    <div className="text-3xl font-bold gradient-miami-text">
                        Position {fulcrumPosition}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                        Set fulcrum to position {fulcrumPosition}
                    </div>
                </div>
            )}

            {/* Weight Difference */}
            <div className="mb-6 p-3 rounded-lg bg-bg-secondary">
                <div className="text-sm text-text-secondary">Weight Difference</div>
                <div className="text-lg font-bold text-text-primary">
                    {formatWeight(weightDifference)}
                </div>
            </div>

            {/* Visual Strap Diagram */}
            <div className="mb-6 p-4 rounded-xl bg-bg-secondary">
                <div className="text-sm font-semibold text-text-secondary mb-3 text-center">
                    Strap Positions
                </div>
                <div className="flex justify-center items-center gap-2 flex-wrap">
                    {barSpec.strapPositions.map((strap) => {
                        const colors = strapColors.get(strap) || [];
                        const isActive = colors.length > 0;
                        const isShared = colors.length > 1;

                        return (
                            <div
                                key={strap}
                                className="flex flex-col items-center"
                            >
                                <div
                                    className="w-12 h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all overflow-hidden relative"
                                    style={{
                                        opacity: isActive ? 1 : 0.3,
                                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                >
                                    {isShared ? (
                                        // 50/50 split for shared straps
                                        <>
                                            <div
                                                className="absolute inset-0"
                                                style={{
                                                    background: `linear-gradient(to right, ${colors[0]} 50%, ${colors[1]} 50%)`
                                                }}
                                            />
                                            <span className="relative z-10">{strap}</span>
                                        </>
                                    ) : (
                                        // Single color for non-shared straps
                                        <>
                                            <div
                                                className="absolute inset-0"
                                                style={{
                                                    backgroundColor: isActive ? colors[0] : '#374151'
                                                }}
                                            />
                                            <span className="relative z-10">{strap}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Passenger Strap Assignments */}
            <div className="space-y-3">
                <div className="text-sm font-semibold text-text-secondary mb-2">
                    Passenger Assignments
                </div>
                {sortedAssignments.map((assignment) => {
                    const passengerColor = PASSENGER_COLORS[assignment.role];

                    return (
                        <motion.div
                            key={assignment.passengerIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 rounded-lg bg-bg-secondary border border-border-default"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                    style={{ backgroundColor: passengerColor }}
                                >
                                    <span className="relative z-10">{assignment.passengerIndex + 1}</span>
                                </div>
                                <div>
                                    <div className={`text-sm font-semibold ${getRoleColor(assignment.role)}`}>
                                        {getRoleLabel(assignment.role)}
                                    </div>
                                    <div className="text-xs text-text-secondary">
                                        {formatWeight(assignment.weight)}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 rounded bg-bg-primary flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: passengerColor }} />
                                    <div className="flex-1">
                                        <div className="text-xs text-text-secondary">Left Strap</div>
                                        <div className="text-lg font-bold text-text-primary">
                                            {assignment.straps.leftStrap}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 rounded bg-bg-primary flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: passengerColor }} />
                                    <div className="flex-1">
                                        <div className="text-xs text-text-secondary">Right Strap</div>
                                        <div className="text-lg font-bold text-text-primary">
                                            {assignment.straps.rightStrap}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
