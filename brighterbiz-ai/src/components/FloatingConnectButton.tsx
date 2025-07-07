'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';

interface FloatingConnectButtonProps {
  onConnectClick: () => void;
}

export default function FloatingConnectButton({ onConnectClick }: FloatingConnectButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past 400px (roughly after seeing 1-2 recommendations)
      const scrolled = window.scrollY > 400;
      
      // Hide button when the main ConnectWithMe section is in view
      const connectSection = document.querySelector('[data-connect-section]');
      let isMainSectionVisible = false;
      
      if (connectSection) {
        const rect = connectSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Check if any part of the connect section is visible in viewport
        isMainSectionVisible = rect.top < windowHeight && rect.bottom > 0;
      }
      
      setIsVisible(scrolled && !isMainSectionVisible);
    };

    window.addEventListener('scroll', handleScroll);
    // Also check on initial load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    onConnectClick();
    setIsExpanded(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-40"
        >
          <div className="flex items-center">
            {/* Expanded Card */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="bg-white rounded-lg shadow-xl border border-gray-200 mr-3 overflow-hidden"
                >
                  <div className="p-4 max-w-xs">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        Need Implementation Help?
                      </h3>
                      <button
                        onClick={() => setIsExpanded(false)}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-xs mb-3">
                      Get personalized guidance from an AI expert. Free 30-minute consultation.
                    </p>
                    <Button
                      onClick={handleClick}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm py-2 px-3 rounded-lg"
                    >
                      Schedule Consultation
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group relative"
              title="Need help implementing these solutions?"
            >
              <Calendar className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 