'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

interface ConnectWithMeSectionProps {
  onConnectClick: () => void;
}

export default function ConnectWithMeSection({ onConnectClick }: ConnectWithMeSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-16 sm:mt-20"
      data-connect-section
    >
      <div className="bg-black dark:bg-white rounded-2xl relative overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[-20%] left-[10%] w-[24rem] h-[24rem] rounded-full bg-blue-500/[0.1] blur-[90px]" />
          <div className="absolute bottom-[-25%] right-[12%] w-[20rem] h-[20rem] rounded-full bg-violet-500/[0.07] blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 0.5px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <div className="relative text-center px-6 sm:px-10 py-14 sm:py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
            }}
          >
            <motion.p
              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
              className="text-xs tracking-[0.2em] text-blue-400 dark:text-blue-600 uppercase mb-4 font-semibold"
            >
              Next Steps
            </motion.p>

            <motion.h2
              variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white dark:text-black mb-4 leading-[1.1] tracking-[-0.025em] font-hero"
            >
              Ready to put these{' '}
              <span className="font-accent italic font-normal text-blue-300 dark:text-blue-600">into action</span>?
            </motion.h2>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
              className="text-base md:text-lg text-gray-400 dark:text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed"
            >
              Get personalized guidance from an AI implementation expert.
              Free 30-minute consultation to create your action plan.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
            >
              <Button
                onClick={onConnectClick}
                className="px-8 py-3.5 text-base text-black dark:text-white font-semibold rounded-xl bg-white dark:bg-black border border-white/20 dark:border-black/20 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-300 shadow-lg shadow-white/10 dark:shadow-black/10 inline-flex items-center justify-center min-h-[48px] group/cta"
              >
                Schedule Free Consultation
                <ArrowRight className="w-4 h-4 ml-2 group-hover/cta:translate-x-0.5 transition-transform duration-200" />
              </Button>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-7"
            >
              {['No commitment', 'Tailored to you', '100+ implementations'].map((text) => (
                <div key={text} className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
