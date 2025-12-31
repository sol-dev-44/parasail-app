'use client';

import { motion } from 'framer-motion';
import { Wind, Gauge, Shield, Cloud, Waves } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: Wind,
      title: 'Real-Time Weather',
      description: "Is it windy? Is it too windy? We'll tell you. No more guessing if today's the day you become a kite.",
      gradient: 'from-accent-cyan to-accent-purple',
    },
    {
      icon: Gauge,
      title: 'Chute & Bar Setup',
      description: "Smart recommendations for chute size AND bar configuration. Enter weights, get instant setup instructions with strap positions and fulcrum settings.",
      gradient: 'from-accent-pink to-accent-orange',
    },
    {
      icon: Shield,
      title: 'Safety Management',
      description: "We'll let you know when conditions are sketchy. Because YOLO is fun to say, not fun to live.",
      gradient: 'from-accent-purple to-accent-pink',
    },
    {
      icon: Cloud,
      title: 'Weather Forecasting',
      description: 'See the future (weather-wise). Plan your days around not getting struck by lightning. Solid life choice.',
      gradient: 'from-accent-orange to-accent-cyan',
    },
  ];

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
            <a href="#features" className="text-text-secondary hover:text-accent-pink transition-colors">
              Features
            </a>
            <Link href="/chute-selector" className="text-text-secondary hover:text-accent-cyan transition-colors">
              Chute Selector
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
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
              className="text-7xl md:text-8xl font-bold mb-6 gradient-miami-text"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Parasailing

              Bro
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Your chill companion for parasailing adventures. We've got AI, weather stuff,
              and vibes. Mostly vibes.
            </motion.p>

            <motion.div
              className="flex gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/chute-selector">
                <motion.button
                  className="px-8 py-4 rounded-full gradient-miami text-white font-semibold text-lg shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(249, 76, 155, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </Link>
              <motion.button
                className="px-8 py-4 rounded-full border-2 border-accent-cyan text-accent-cyan font-semibold text-lg"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 184, 212, 0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-miami-text">
              Powerful Features
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Everything you need to run safe, efficient parasailing operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative p-8 rounded-2xl border border-border-default bg-bg-card hover:border-border-hover transition-all duration-300"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="px-4 py-2 rounded-full gradient-miami text-white text-sm font-bold shadow-lg">
                    Coming Soon
                  </div>
                </div>

                <div className="relative z-10">
                  <motion.div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-3 text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Feature Section */}
      <section id="tools" className="py-32 px-6 bg-bg-secondary">
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
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border-default">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Waves className="w-6 h-6 text-accent-cyan" />
            <span className="text-xl font-bold gradient-miami-text">Parasail Bro</span>
          </div>
          <p className="text-text-secondary">
            © 2025 Parasail Bro. Keeping it chill since 2025.
          </p>
        </div>
      </footer>
    </div>
  );
}
