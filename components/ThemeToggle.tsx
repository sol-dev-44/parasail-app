'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../app/theme-provider';
import { motion } from 'framer-motion';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative p-2 rounded-full border border-border-default hover:border-border-hover transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
            >
                {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-accent-cyan" />
                ) : (
                    <Sun className="w-5 h-5 text-accent-pink" />
                )}
            </motion.div>
        </motion.button>
    );
}
