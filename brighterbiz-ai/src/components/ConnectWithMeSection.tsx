'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface ConnectWithMeSectionProps {
  onConnectClick: () => void;
}

export default function ConnectWithMeSection({ onConnectClick }: ConnectWithMeSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-16 sm:mt-20 text-center"
      data-connect-section
    >
      <div className="bg-primary p-6 sm:p-10 rounded-xl shadow-md border border-primary hover:shadow-lg transition-all duration-200">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4"
        >
          Need Help Implementing These Solutions?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg"
        >
          Get personalized guidance from an AI implementation expert. Free 30-minute consultation to discuss your specific needs and create an action plan.
        </motion.p>

        {/* Trust Elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8"
        >
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">No commitment required</span>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Tailored to your business</span>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">100+ successful implementations</span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button
              onClick={onConnectClick}
              variant="primary"
              className="px-8 py-4 rounded-xl shadow-lg text-lg font-semibold w-full sm:w-auto min-w-[280px] transition-all duration-300 hover:shadow-xl"
            >
              <Calendar className="w-5 h-5 mr-3" />
              Schedule Free Consultation
            </Button>
          </motion.div>
        </motion.div>

        {/* Secondary Text */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-gray-500 text-sm mt-4"
        >
          Schedule a free consultation to turn these recommendations into reality
        </motion.p>
      </div>
    </motion.div>
  );
} 