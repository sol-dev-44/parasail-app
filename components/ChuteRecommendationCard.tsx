'use client';

import { motion } from 'framer-motion';
import { ChuteRecommendation } from '@/lib/chuteRecommendations';
import { formatWeightRange, formatSpeed } from '@/lib/unitConversions';

interface ChuteRecommendationCardProps {
    recommendation: ChuteRecommendation;
    isMetric: boolean;
    index: number;
}

export default function ChuteRecommendationCard({
    recommendation,
    isMetric,
    index,
}: ChuteRecommendationCardProps) {
    const { chute, amZipperPosition } = recommendation;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="p-6 rounded-xl border border-border-default bg-bg-card hover:border-accent-cyan transition-all"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-3xl font-bold gradient-miami-text">
                        {chute.size} ft
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">Chute Size</p>
                </div>
                <div className="text-right">
                    <div
                        className={`px-4 py-2 rounded-full text-sm font-bold ${amZipperPosition === 'OPEN'
                                ? 'bg-accent-orange/20 text-accent-orange'
                                : 'bg-accent-cyan/20 text-accent-cyan'
                            }`}
                    >
                        A/M {amZipperPosition}
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-t border-border-default">
                    <span className="text-text-secondary text-sm">Weight Range</span>
                    <span className="font-semibold text-text-primary">
                        {formatWeightRange(chute.minWeight, chute.maxWeight, isMetric)}
                    </span>
                </div>

                <div className="flex justify-between items-center py-2 border-t border-border-default">
                    <span className="text-text-secondary text-sm">Max Wind (A/M Closed)</span>
                    <span className="font-semibold text-text-primary">
                        {formatSpeed(chute.maxWindClosed, isMetric)}
                    </span>
                </div>

                <div className="flex justify-between items-center py-2 border-t border-border-default">
                    <span className="text-text-secondary text-sm">Max Wind (A/M Open)</span>
                    <span className="font-semibold text-text-primary">
                        {formatSpeed(chute.maxWindOpen, isMetric)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
