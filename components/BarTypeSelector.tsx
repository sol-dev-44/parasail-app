'use client';

import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setBarType } from '@/store/slices/chuteSlice';
import { BAR_DATA, BarType } from '@/lib/barData';
import { Anchor } from 'lucide-react';

export default function BarTypeSelector() {
    const dispatch = useDispatch();
    const selectedBarType = useSelector((state: RootState) => state.chute.selectedBarType);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl border border-border-default bg-bg-card"
        >
            <div className="flex items-center gap-2 mb-6">
                <Anchor className="w-6 h-6 text-accent-orange" />
                <h2 className="text-2xl font-bold text-text-primary">Bar Type</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {BAR_DATA.map((bar) => (
                    <motion.button
                        key={bar.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => dispatch(setBarType(bar.id))}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${selectedBarType === bar.id
                            ? 'border-accent-orange bg-accent-orange/10'
                            : 'border-border-default hover:border-border-hover'
                            }`}
                    >
                        <div className="font-semibold text-text-primary mb-1">
                            {bar.displayName}
                        </div>
                        <div className="text-xs text-text-secondary">
                            {bar.strapPositions.length} positions
                        </div>
                    </motion.button>
                ))}
            </div>

            {selectedBarType && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => dispatch(setBarType(null))}
                    className="w-full mt-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-secondary transition-colors"
                >
                    Clear Selection
                </motion.button>
            )}
        </motion.div>
    );
}
