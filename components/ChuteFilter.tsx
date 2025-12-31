'use client';

import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleChuteSelection, resetChuteFilter } from '@/store/slices/chuteSlice';
import { CHUTE_DATA } from '@/lib/chuteData';
import { Filter, RotateCcw } from 'lucide-react';

export default function ChuteFilter() {
    const dispatch = useDispatch();
    const selectedChutes = useSelector((state: RootState) => state.chute.selectedChutes);

    const hasSelection = selectedChutes.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-2xl border border-border-default bg-bg-card"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-accent-cyan" />
                    <h3 className="text-lg font-bold text-text-primary">My Chutes</h3>
                </div>
                {hasSelection && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => dispatch(resetChuteFilter())}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs text-text-secondary hover:text-accent-cyan transition-colors"
                    >
                        <RotateCcw className="w-3 h-3" />
                        Reset
                    </motion.button>
                )}
            </div>
            <p className="text-xs text-text-secondary mb-4">
                {hasSelection
                    ? 'Showing only selected chutes'
                    : 'Select chutes to filter (none selected = show all)'}
            </p>

            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {CHUTE_DATA.map((chute) => {
                    const isSelected = selectedChutes.includes(chute.size);
                    return (
                        <motion.button
                            key={chute.size}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => dispatch(toggleChuteSelection(chute.size))}
                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${isSelected
                                    ? 'bg-accent-cyan text-white'
                                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-primary'
                                }`}
                        >
                            {chute.size}
                        </motion.button>
                    );
                })}
            </div>

            <div className="mt-4 text-xs text-center">
                {hasSelection ? (
                    <span className="text-accent-cyan font-semibold">
                        {selectedChutes.length} chute{selectedChutes.length !== 1 ? 's' : ''} selected
                    </span>
                ) : (
                    <span className="text-text-secondary">
                        All chutes shown
                    </span>
                )}
            </div>
        </motion.div>
    );
}
