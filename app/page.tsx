'use client';

import { motion } from 'framer-motion';
import { Wind, Gauge, Shield, Cloud, Waves, Brain } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border-default backdrop-blur-lg bg-bg-primary/80"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Waves className="w-8 h-8 text-accent-cyan" />
            <span className="text-2xl font-bold gradient-miami-text">
              Parasail Bro
            </span>
          </motion.div>

          <div className="flex items-center gap-6">

            <Link href="/chute-selector" className="text-text-secondary hover:text-accent-cyan transition-colors">
              Chute Selector
            </Link>
            <Link href="/parasail-rag" className="text-text-secondary hover:text-accent-purple transition-colors">
              Safety AI
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 rounded-full gradient-miami blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full gradient-sunset blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 gradient-miami-text"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Parasail Bro
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Smart tools for parasailing operators. Because winging it is only fun when you're actually flying.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6" >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-miami-text">
              Live Features
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Two powerful tools to optimize your parasailing operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Chute Selector */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative"
            >
              <Link href="/chute-selector">
                <div className="relative p-8 rounded-2xl border border-border-default bg-bg-card hover:border-border-hover transition-all duration-300 h-full cursor-pointer">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-pink to-accent-orange opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <motion.div
                      className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent-pink to-accent-orange flex items-center justify-center mb-6"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Gauge className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-3 text-text-primary">
                      Chute & Bar Setup
                    </h3>
                    <p className="text-text-secondary mb-4">
                      Smart recommendations for chute size AND bar configuration. Enter weights, get instant setup instructions with strap positions and fulcrum settings.
                    </p>
                    <div className="flex items-center gap-2 text-accent-pink font-semibold">
                      <span>Try it now</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Safety AI */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative"
            >
              <Link href="/parasail-rag">
                <div className="relative p-8 rounded-2xl border border-border-default bg-bg-card hover:border-border-hover transition-all duration-300 h-full cursor-pointer">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <motion.div
                      className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center mb-6"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Brain className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-3 text-text-primary">
                      AI Safety Assistant
                    </h3>
                    <p className="text-text-secondary mb-4">
                      Ask questions about parasailing safety rules, accident insights, equipment guidelines, weather protocols, and emergency procedures. Powered by RAG with official training materials.
                    </p>
                    <div className="flex items-center gap-2 text-accent-purple font-semibold">
                      <span>Ask questions</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <p className="text-text-secondary">
              More features coming soon: Real-time weather monitoring, safety management, and forecasting tools
            </p>
          </motion.div>
        </div>
      </section >

      {/* Live Feature Section */}
      < section id="tools" className="py-32 px-6 bg-bg-secondary" >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-12 rounded-3xl border border-border-default bg-bg-card overflow-hidden"
          >
            <div className="absolute inset-0 gradient-miami opacity-5" />

            <div className="relative z-10">
              <Gauge className="w-20 h-20 mx-auto mb-6 text-accent-pink" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-miami-text">
                Chute & Bar Setup Tool
              </h2>
              <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                Our intelligent chute and bar setup tool is LIVE! Input passenger weights and wind conditions,
                select your bar type, and get instant recommendations for chute size, A/M zipper position,
                bar fulcrum setting, and strap positions.
              </p>
              <Link href="/chute-selector">
                <motion.button
                  className="px-8 py-4 rounded-full gradient-miami text-white font-semibold text-lg shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(249, 76, 155, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try It Now
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section >

      {/* RAG Chat Feature Section */}
      < section className="py-32 px-6" >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-12 rounded-3xl border border-border-default bg-bg-card overflow-hidden"
          >
            <div className="absolute inset-0 gradient-sunset opacity-5" />

            <div className="relative z-10">
              <Brain className="w-20 h-20 mx-auto mb-6 text-accent-purple" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-miami-text">
                AI Safety Assistant
              </h2>
              <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                Ask questions about parasailing safety rules, accident insights, equipment guidelines,
                weather protocols, and emergency procedures. Powered by RAG (Retrieval-Augmented Generation)
                with official WSIA training materials and NTSB safety reports.
              </p>
              <Link href="/parasail-rag">
                <motion.button
                  className="px-8 py-4 rounded-full gradient-sunset text-white font-semibold text-lg shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(156, 39, 176, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ask Safety Questions
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section >

      {/* Footer */}
      < footer className="py-12 px-6 border-t border-border-default" >
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Waves className="w-6 h-6 text-accent-cyan" />
            <span className="text-xl font-bold gradient-miami-text">Parasail Bro</span>
          </div>
          <p className="text-text-secondary">
            © 2025 Parasail Bro. Keeping it chill since 2025.
          </p>
        </div>
      </footer >
    </div >
  );
}
